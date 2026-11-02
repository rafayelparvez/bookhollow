"use client";

import { useSyncExternalStore } from "react";
import type { CurrentUser } from "@/lib/auth";

export type BorrowRecord = {
  bookId: string;
  userId: string;
  userName: string;
  userEmail: string;
  borrowedAt: string;
};

/**
 * The current backend only exposes `GET /books` and `POST /add-book`, so
 * borrows are tracked in this browser. The record is keyed by user id/email,
 * which lets several accounts share one browser without seeing each other's
 * borrows. Swap this store for API calls once a borrow endpoint exists.
 */
const BORROWS_KEY = "bookhollow:borrows";
const EMPTY: BorrowRecord[] = [];

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function isBorrowRecord(value: unknown): value is BorrowRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.bookId === "string" &&
    typeof record.userId === "string" &&
    typeof record.userEmail === "string" &&
    typeof record.borrowedAt === "string"
  );
}

function parse(value: string): BorrowRecord[] {
  try {
    const data: unknown = JSON.parse(value);
    return Array.isArray(data) ? data.filter(isBorrowRecord) : [];
  } catch {
    return [];
  }
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(BORROWS_KEY);
  } catch {
    return null;
  }
}

let cachedRaw: string | null = null;
let cached: BorrowRecord[] = EMPTY;
let hasReadStorage = false;

function getSnapshot(): BorrowRecord[] {
  const raw = readRaw();

  if (!hasReadStorage || raw !== cachedRaw) {
    hasReadStorage = true;
    cachedRaw = raw;
    cached = raw ? parse(raw) : EMPTY;
  }

  return cached;
}

function getServerSnapshot(): BorrowRecord[] {
  return EMPTY;
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function write(records: BorrowRecord[]) {
  try {
    window.localStorage.setItem(BORROWS_KEY, JSON.stringify(records));
  } catch {
    // Storage can be unavailable (private mode, blocked cookies).
  }

  emit();
}

export function useBorrows(): BorrowRecord[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function borrowsMatchUser(
  record: BorrowRecord,
  user: CurrentUser,
): boolean {
  return (
    record.userId === user.id ||
    record.userEmail.toLowerCase() === user.email.toLowerCase()
  );
}

export function hasBorrowed(
  records: BorrowRecord[],
  bookId: string,
  user: CurrentUser | null,
): boolean {
  if (!user) return false;
  return records.some(
    (record) => record.bookId === bookId && borrowsMatchUser(record, user),
  );
}

export function borrowBook(
  bookId: string,
  user: CurrentUser,
): BorrowRecord | null {
  const current = getSnapshot();

  if (current.some((record) => record.bookId === bookId && borrowsMatchUser(record, user))) {
    return null;
  }

  const record: BorrowRecord = {
    bookId,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    borrowedAt: new Date().toISOString(),
  };

  write([record, ...current]);
  return record;
}

export function returnBook(bookId: string, user: CurrentUser): void {
  const next = getSnapshot().filter(
    (record) => !(record.bookId === bookId && borrowsMatchUser(record, user)),
  );
  write(next);
}
