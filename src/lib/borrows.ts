"use client";

import { useEffect, useSyncExternalStore } from "react";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/lib/auth";

// Express-এর route আলাদা হলে শুধু এই তিনটা বদলান
const MY_BORROWS_PATH = "/borrows";
const BORROW_PATH = "/borrows";
// Server returns a book with DELETE /borrows/:id
const returnPath = (recordId: string) => `/borrows/${recordId}`;

export type BorrowRecord = {
  _id: string;
  bookId: string;
  borrowedAt: string;
  dueAt?: string;
  returnedAt?: string | null;
};

const EMPTY: BorrowRecord[] = [];

let records: BorrowRecord[] = EMPTY;
let loadedForUser: string | null = null;
let inflight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function setRecords(next: BorrowRecord[]) {
  if (records === next) return;
  records = next;
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

// Server sends `borrowDate`/`returnDate`; map them onto our field names.
function normalize(data: unknown): BorrowRecord[] {
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray((data as { borrows?: unknown }).borrows)
      ? (data as { borrows: unknown[] }).borrows
      : [];

  return list
    .map((item): BorrowRecord | null => {
      if (!item || typeof item !== "object") return null;
      const raw = item as Record<string, unknown>;
      const _id = asString(raw._id);
      const bookId = asString(raw.bookId);
      if (!_id || !bookId) return null;
      return {
        _id,
        bookId,
        borrowedAt:
          asString(raw.borrowedAt) ??
          asString(raw.borrowDate) ??
          new Date().toISOString(),
        dueAt: asString(raw.dueAt) ?? asString(raw.returnDate),
        returnedAt: asString(raw.returnedAt) ?? null,
      };
    })
    .filter((record): record is BorrowRecord => record !== null && !record.returnedAt);
}

export async function refreshBorrows(): Promise<void> {
  const data = await apiFetch<unknown>(MY_BORROWS_PATH);
  setRecords(normalize(data));
}

function ensureLoaded(userId: string) {
  if (loadedForUser === userId || inflight) return;
  inflight = refreshBorrows()
    .then(() => {
      loadedForUser = userId;
    })
    .catch(() => {
      // পরের mount-এ আবার চেষ্টা হবে
    })
    .finally(() => {
      inflight = null;
    });
}

export function useMyBorrows(): BorrowRecord[] {
  const user = useCurrentUser();
  const userId = user?.id ?? null;

  const current = useSyncExternalStore(
    subscribe,
    () => records,
    () => EMPTY,
  );

  useEffect(() => {
    if (!userId) {
      loadedForUser = null;
      setRecords(EMPTY);
      return;
    }
    if (loadedForUser !== null && loadedForUser !== userId) {
      // অন্য account-এ login হলে আগের data ফেলে দিন
      loadedForUser = null;
      setRecords(EMPTY);
    }
    ensureLoaded(userId);
  }, [userId]);

  return userId ? current : EMPTY;
}

export async function borrowBook(bookId: string): Promise<void> {
  await apiFetch(BORROW_PATH, {
    method: "POST",
    body: JSON.stringify({ bookId }),
  });
  await refreshBorrows();
}

export async function returnBook(recordId: string): Promise<void> {
  await apiFetch(returnPath(recordId), { method: "DELETE" });
  await refreshBorrows();
}