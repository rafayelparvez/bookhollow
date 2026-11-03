"use client";

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

/**
 * Browser-side Better Auth client. Session cookies are httpOnly and managed by
 * the API route in `src/app/api/auth/[...all]`, so components read state
 * through `useSession()` (wrapped by `useAuth()` in `src/lib/auth.ts`).
 *
 * No `baseURL` on purpose: the auth API lives in this same Next.js app, so the
 * client calls its own origin. (The Express API is a separate server and does
 * not serve /api/auth.)
 *
 * `jwtClient()` adds `authClient.token()`, which returns a JWT that the
 * Express API verifies on protected routes.
 */
export const authClient = createAuthClient({
  plugins: [jwtClient()],
});