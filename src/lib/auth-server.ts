import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { db, mongoClient } from "@/lib/mongo";

const googleClientId =
  process.env.GOOGLE_CLIENT_ID ?? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// Keep in sync with src/lib/password.ts (MIN_PASSWORD_LENGTH).
const MIN_PASSWORD_LENGTH = 6;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const socialProviders =
  googleClientId && googleClientSecret
    ? {
        google: {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        },
      }
    : undefined;

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client: mongoClient }),
  emailAndPassword: {
    enabled: true,
    // Match the client-side rule; Better Auth otherwise defaults to 8.
    // Uppercase/lowercase are enforced by the register form only.
    minPasswordLength: MIN_PASSWORD_LENGTH,
  },
  ...(socialProviders ? { socialProviders } : {}),
  session: {
    // Keep readers signed in for a week, refreshing once a day.
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  user: {
    changeEmail: {
      enabled: true,
      // No email-verification service is configured, so allow direct changes
      // from the profile page. (Verified/OAuth accounts still can't change.)
      updateEmailWithoutVerification: true,
    },
  },
  plugins: [jwt()],
});