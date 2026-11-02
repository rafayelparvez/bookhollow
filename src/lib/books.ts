"use client";

import { useCallback, useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import type { CurrentUser } from "@/lib/auth";

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  image: string | null;
  addedBy?: {
    id?: string;
    name?: string;
    email?: string;
  };
  createdAt: string;
}

export interface BooksState {
  books: Book[];
  loading: boolean;
  error: string;
  retry: () => void;
}

export function useBooks(): BooksState {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBooks() {
      try {
        const res = await fetch(`${API_URL}/books`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to load books.");
        const data: Book[] = await res.json();
        setBooks(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadBooks();
    return () => controller.abort();
  }, [reloadToken]);

  const retry = useCallback(() => {
    setLoading(true);
    setError("");
    setReloadToken((token) => token + 1);
  }, []);

  return { books, loading, error, retry };
}

export function isBookAddedByUser(book: Book, user: CurrentUser): boolean {
  const addedBy = book.addedBy;
  if (!addedBy) return false;

  const emailMatches =
    !!addedBy.email &&
    addedBy.email.toLowerCase() === user.email.toLowerCase();
  const idMatches = !!addedBy.id && addedBy.id === user.id;

  return emailMatches || idMatches;
}
