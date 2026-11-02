"use client";

import Link from "next/link";
import { useState } from "react";
import AuthGate from "@/components/auth-gate";
import { returnBook, useMyBorrows } from "@/lib/borrows";
import { useBooks } from "@/lib/books";

const DAYS_IN_LOAN = 7;

const dateFormat: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export default function MyBorrows() {
  return (
    <AuthGate nextPath="/my-borrows">
      <MyBorrowsList />
    </AuthGate>
  );
}

function MyBorrowsList() {
  const { books, loading, error, retry } = useBooks();
  const borrows = useMyBorrows();
  const [returningId, setReturningId] = useState<string | null>(null);
  const [returnError, setReturnError] = useState("");

  async function handleReturn(recordId: string) {
    setReturningId(recordId);
    setReturnError("");
    try {
      await returnBook(recordId);
      retry();
    } catch (cause) {
      setReturnError(
        cause instanceof Error
          ? cause.message
          : "Could not return this book. Please try again.",
      );
    } finally {
      setReturningId(null);
    }
  }

  if (loading) {
    return (
      <div
        className="h-40 animate-pulse rounded-2xl bg-cream-dark dark:bg-ink"
        aria-busy="true"
      />
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-xl rounded-2xl border border-brand/25 bg-brand/5 px-6 py-10 text-center dark:border-brand-light/25 dark:bg-brand/10">
        <p className="font-sans text-sm text-ink/60 dark:text-cream/60">
          {error}
        </p>
        <button
          type="button"
          onClick={retry}
          className="mt-6 rounded-lg bg-brand px-5 py-2.5 font-sans text-sm font-semibold text-cream hover:bg-brand-dark"
        >
          Try again
        </button>
      </section>
    );
  }

  if (borrows.length === 0) {
    return (
      <section className="mx-auto max-w-xl rounded-2xl border border-ink/10 bg-cream-dark/50 px-6 py-12 text-center dark:border-cream/10 dark:bg-ink">
        <h2 className="text-2xl font-bold text-ink dark:text-cream">
          No borrowed books
        </h2>
        <p className="mt-2 font-sans text-sm leading-relaxed text-ink/60 dark:text-cream/60">
          You haven&apos;t borrowed a book yet. Browse the shelves and pick your
          next read.
        </p>
        <Link
          href="/books"
          className="mt-6 inline-flex rounded-lg bg-brand px-5 py-2.5 font-sans text-sm font-semibold text-cream hover:bg-brand-dark"
        >
          Browse books
        </Link>
      </section>
    );
  }

  return (
    <section aria-label="My borrows">
      <h2 className="mb-6 font-sans text-sm font-semibold text-ink/60 dark:text-cream/60">
        {borrows.length} {borrows.length === 1 ? "book" : "books"} borrowed by
        you
      </h2>

      {returnError && (
        <p
          role="alert"
          className="mb-4 font-sans text-sm text-brand-dark dark:text-brand-light"
        >
          {returnError}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-ink/10 dark:border-cream/10">
        <table className="w-full min-w-[640px] text-left font-sans text-sm">
          <thead className="bg-ink/[0.04] text-[11px] uppercase tracking-[0.16em] text-ink/50 dark:bg-cream/5 dark:text-cream/50">
            <tr>
              <th className="px-4 py-3 font-semibold">Book</th>
              <th className="px-4 py-3 font-semibold">Borrowed</th>
              <th className="px-4 py-3 font-semibold">Due</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10 dark:divide-cream/10">
            {borrows.map((record) => {
              const book = books.find((item) => item._id === record.bookId);
              const borrowedAt = new Date(record.borrowedAt);
              const due = new Date(
                borrowedAt.getTime() + DAYS_IN_LOAN * 24 * 60 * 60 * 1000,
              );
              const isReturning = returningId === record._id;

              return (
                <tr key={record._id} className="text-ink/80 dark:text-cream/80">
                  <td className="px-4 py-3">
                    {book ? (
                      <Link
                        href={`/books/${book._id}`}
                        className="font-semibold text-ink hover:text-brand dark:text-cream dark:hover:text-brand-light"
                      >
                        {book.title}
                      </Link>
                    ) : (
                      <span className="text-ink/50 dark:text-cream/50">
                        Book unavailable
                      </span>
                    )}
                    {book && (
                      <p className="text-xs text-ink/50 dark:text-cream/50">
                        by {book.author}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {borrowedAt.toLocaleDateString(undefined, dateFormat)}
                  </td>
                  <td className="px-4 py-3">
                    {due.toLocaleDateString(undefined, dateFormat)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleReturn(record._id)}
                      disabled={isReturning}
                      aria-busy={isReturning}
                      className="rounded-lg border border-ink/15 px-4 py-2 font-semibold text-ink transition-colors hover:border-brand/40 hover:text-brand-dark disabled:opacity-60 dark:border-cream/15 dark:text-cream dark:hover:text-brand-light"
                    >
                      {isReturning ? "Returning…" : "Return"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}