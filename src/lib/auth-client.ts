"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Browser-side Better Auth client. Session cookies are httpOnly and managed by
 * the API route in `src/app/api/auth/[...all]`, so components read state
 * through `useSession()` (wrapped by `useAuth()` in `src/lib/auth.ts`).
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});
