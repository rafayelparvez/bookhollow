"use client";

import { useSyncExternalStore } from "react";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
};

/**
 * Authentication seam.
 *
 * BookHollow does not ship an auth provider yet, so the signed-in profile is
 * read from the browser storage a login flow would populate (`bookhollow:user`,
 * falling back to `user` / `authUser`) and a demo profile keeps the app usable
 * in development.
 *
 * When real auth lands, swap the body of `useCurrentUser` for the provider's
 * hook (e.g. better-auth's `useSession()`) and drop `DEMO_USER`. Nothing else in
 * the app needs to change — every consumer only depends on `useCurrentUser()`.
 */
const STORAGE_KEYS = ["bookhollow:user", "user", "authUser"] as const;

const DEMO_USER: CurrentUser = {
  id: "demo-user",
  name: "Forhad Hossen",
  email: "forhadhossen457876@gmail.com",
};

function asString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return null;
}

function toUser(value: unknown): CurrentUser | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const id = asString(
    record.id ?? record._id ?? record.userId ?? record.user_id,
  );
  const email = asString(
    record.email ?? record.userEmail ?? record.user_email,
  );
  const name = asString(
    record.name ?? record.userName ?? record.user_name ?? record.fullName,
  );

  if (!id || !email) return null;

  return { id, name: name ?? email, email };
}

function readRawUser(): string | null {
  try {
    for (const key of STORAGE_KEYS) {
      const raw = window.localStorage.getItem(key);
      if (raw) return raw;
    }
  } catch {
    // Storage can be unavailable (private mode, blocked cookies).
  }

  return null;
}

// `useSyncExternalStore` requires a referentially stable snapshot, so the parsed
// user is cached against the raw storage value.
let cachedRaw: string | null = null;
let cachedUser: CurrentUser | null = null;
let hasReadStorage = false;

function parseUser(raw: string): CurrentUser | null {
  try {
    return toUser(JSON.parse(raw));
  } catch {
    return null;
  }
}

function getSnapshot(): CurrentUser | null {
  const raw = readRawUser();

  if (!hasReadStorage || raw !== cachedRaw) {
    hasReadStorage = true;
    cachedRaw = raw;
    cachedUser = raw ? parseUser(raw) : null;
  }

  return cachedUser;
}

function getServerSnapshot(): CurrentUser | null {
  return null;
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

export function useCurrentUser(): CurrentUser {
  const storedUser = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return storedUser ?? DEMO_USER;
}
