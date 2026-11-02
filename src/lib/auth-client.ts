"use client";

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

/**
 * Browser-side Better Auth client. Session cookies are httpOnly and managed by
 * the API route in `src/app/api/auth/[...all]`, so components read state
 * through `useSession()` (wrapped by `useAuth()` in `src/lib/auth.ts`).
 *
 * `jwtClient()` adds `authClient.token()`, which returns a JWT that the
 * Express API verifies on protected routes.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [jwtClient()],
});