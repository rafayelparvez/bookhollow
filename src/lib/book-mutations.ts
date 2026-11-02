"use client";

import type { Book } from "@/lib/books";

export type UpdateBookInput = {
  title: string;
  author: string;
  category: string;
  copies: number;
  description: string;
  image: string | null;
};

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();

    if (body && typeof body === "object") {
      const { message } = body as { message?: unknown };

      if (typeof message === "string" && message.trim()) return message;
    }
  } catch {
    // Non-JSON error body — fall back to the status text.
  }

  return `The server responded with ${response.status} ${response.statusText}.`;
}

export async function updateBookRequest(
  bookId: string,
  input: UpdateBookInput,
): Promise<Book | null> {
  const response = await fetch(`/api/books/${bookId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const data: { book?: Book | null } = await response.json();
  return data.book ?? null;
}

export async function deleteBookRequest(bookId: string): Promise<void> {
  const response = await fetch(`/api/books/${bookId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
}
