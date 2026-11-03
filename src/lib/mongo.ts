import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "MONGODB_URI is not set. Add it to your environment variables.",
  );
}

// Reuse one MongoClient per process: avoids a new connection pool on every
// hot reload in development and on every cold module load on Vercel.
const globalForMongo = globalThis as typeof globalThis & {
  bookhollowMongoClient?: MongoClient;
};

export const mongoClient =
  globalForMongo.bookhollowMongoClient ?? new MongoClient(uri);

globalForMongo.bookhollowMongoClient = mongoClient;

export const db = mongoClient.db(process.env.MONGODB_DB ?? "library");