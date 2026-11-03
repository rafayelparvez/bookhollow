// Temporary diagnostic: compares the two MongoDB URIs (frontend .env.local vs
// backend .env) to see which one actually holds the `books` data.
import { MongoClient } from "mongodb";
import { readFileSync } from "node:fs";

function parse(file) {
  const out = {};
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
    if (m) out[m[1]] = m[2];
  }
  return out;
}

const fe = parse("C:/projects/Assignments/bookhollow/.env.local");
const be = parse("C:/projects/Assignments/bookhollow - server/.env");

const hostOf = (uri) => {
  try {
    return new URL(uri).host;
  } catch {
    return "n/a";
  }
};

console.log("frontend MONGODB_DB :", fe.MONGODB_DB ?? "(unset -> library)");
console.log("backend  MONGODB_DB :", be.MONGODB_DB ?? "(unset -> library)");
console.log("same cluster?       :", hostOf(fe.MONGODB_URI) === hostOf(be.MONGODB_URI));
console.log("cluster host        :", hostOf(fe.MONGODB_URI));

for (const [label, env] of [
  ["frontend", fe],
  ["backend ", be],
]) {
  try {
    const c = new MongoClient(env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    await c.connect();
    const db = c.db(env.MONGODB_DB ?? "library");
    const cols = (await db.listCollections().toArray()).map((x) => x.name);
    const books = await db.collection("books").countDocuments();
    const users = await db.collection("user").countDocuments();
    console.log(
      `${label}: db="${db.databaseName}" collections=[${cols.join(", ")}] books=${books} users=${users}`,
    );
    await c.close();
  } catch (e) {
    console.log(`${label}: ERROR ${e.message}`);
  }
}
