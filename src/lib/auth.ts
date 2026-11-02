"use client";

import { useSyncExternalStore } from "react";
import { authClient } from "@/lib/auth-client";
  import { jwt } from "better-auth/plugins";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthState = {
  user: CurrentUser | null;
  /** True until Better Auth has resolved the session on the client. */
  isPending: boolean;
};

/**
 * Session facade over Better Auth.
 *
 * Components keep reading the signed-in reader through `useCurrentUser()` so
 * the provider stays swappable. The actual session lives in an httpOnly cookie
 * issued by `src/app/api/auth/[...all]`; `authClient.useSession()` reads it and
 * updates automatically after sign-in / sign-out.
 */
export function useAuth(): AuthState {
  const { data, isPending } = authClient.useSession();

  return {
    user: data?.user
      ? {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
        }
      : null,
    isPending,
  };
}

export function useCurrentUser(): CurrentUser | null {
  return useAuth().user;
}

// `useSyncExternalStore` gives us an SSR-safe "mounted" flag without calling
// setState inside an effect (which React's lint rules discourage).
const subscribeNoop = () => () => {};

export function useMounted(): boolean {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}
