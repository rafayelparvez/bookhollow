import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env.local");

function readEnv(filePath) {
  const entries = {};

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;

    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    entries[match[1]] = value;
  }

  return entries;
}

const env = readEnv(envPath);

if (!env.MONGODB_URI) {
  throw new Error(`MONGODB_URI is missing from ${envPath}`);
}

const client = new MongoClient(env.MONGODB_URI);

try {
  await client.connect();
  const db = client.db(env.MONGODB_DB || "library");

  // Delete child records first so no session or account outlives its user.
  for (const name of ["session", "account", "verification", "user"]) {
    const collection = db.collection(name);
    const exists = await db
      .listCollections({ name }, { nameOnly: true })
      .hasNext();

    if (!exists) {
      console.log(`${name}: collection not found, skipped`);
      continue;
    }

    const result = await collection.deleteMany({});
    console.log(`${name}: deleted ${result.deletedCount} document(s)`);
  }
} finally {
  await client.close();
}
