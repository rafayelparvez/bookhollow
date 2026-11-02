"use client";

import { apiFetch } from "@/lib/api";
import type { Book } from "@/lib/books";

export type UpdateBookInput = {
  title: string;
  author: string;
  category: string;
  copies: number;
  description: string;
  image: string | null;
};

export async function updateBookRequest(
  bookId: string,
  input: UpdateBookInput,
): Promise<Book | null> {
  const data = await apiFetch<{ book?: Book | null } | null>(
    `/books/${bookId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
  return data?.book ?? null;
}

export async function deleteBookRequest(bookId: string): Promise<void> {
  await apiFetch(`/books/${bookId}`, { method: "DELETE" });
}