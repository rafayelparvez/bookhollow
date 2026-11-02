import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "MONGODB_URI is not set. Add it to .env.local before starting the app.",
  );
}

// Next.js re-evaluates server modules on hot reload, so reuse one MongoClient
// per process instead of opening a new connection pool on every reload.
const globalForMongo = globalThis as typeof globalThis & {
  bookhollowMongoClient?: MongoClient;
};

export const mongoClient =
  globalForMongo.bookhollowMongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.bookhollowMongoClient = mongoClient;
}

export const db = mongoClient.db(process.env.MONGODB_DB ?? "library");
