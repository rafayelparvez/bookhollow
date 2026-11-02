import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
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

const client = globalForMongo.bookhollowMongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.bookhollowMongoClient = client;
}

const db = client.db(process.env.MONGODB_DB ?? "library");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    // Keep readers signed in for a week, refreshing once a day.
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
});
