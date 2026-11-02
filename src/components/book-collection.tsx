"use client";

import Link from "next/link";
import { BOOK_GRID_CLASS, BookGrid } from "@/components/book-card";
import type { Book } from "@/lib/books";

type EmptyAction = { href: string; label: string };

type BookCollectionProps = {
  books: Book[];
  loading: boolean;
  error: string;
  onRetry: () => void;
  emptyTitle: string;
  emptyMessage: string;
  emptyAction?: EmptyAction;
  countLabel?: (count: number) => string;
  label?: string;
  manage?: boolean;
  onDeleted?: () => void;
};

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2.5 font-sans text-sm font-semibold text-cream transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:focus-visible:outline-brand-light";

export default function BookCollection({
  books,
  loading,
  error,
  onRetry,
  emptyTitle,
  emptyMessage,
  emptyAction,
  countLabel,
  label = "Books",
  manage,
  onDeleted,
}: BookCollectionProps) {
  if (loading) {
    return (
      <section aria-busy="true" aria-live="polite">
        <span className="sr-only">Loading books…</span>
        <div className={BOOK_GRID_CLASS}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-ink/10 bg-cream dark:border-cream/10 dark:bg-ink"
            >
              <div className="aspect-[4/3] w-full animate-pulse bg-cream-dark dark:bg-ink-900" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-16 animate-pulse rounded-full bg-ink/10 dark:bg-cream/10" />
                <div className="h-5 w-4/5 animate-pulse rounded bg-ink/10 dark:bg-cream/10" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-ink/10 dark:bg-cream/10" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-xl rounded-2xl border border-brand/25 bg-brand/5 px-6 py-10 text-center dark:border-brand-light/25 dark:bg-brand/10">
        <AlertIcon className="mx-auto size-9 text-brand dark:text-brand-light" />
        <h2 className="mt-4 text-2xl font-bold text-ink dark:text-cream">
          Couldn&apos;t load the shelves
        </h2>
        <p className="mt-2 font-sans text-sm leading-relaxed text-ink/60 dark:text-cream/60">
          {error}
        </p>
        <button type="button" onClick={onRetry} className={`mt-6 ${primaryButton}`}>
          <RefreshIcon className="size-4" />
          Try again
        </button>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section className="mx-auto max-w-xl rounded-2xl border border-ink/10 bg-cream-dark/50 px-6 py-12 text-center dark:border-cream/10 dark:bg-ink">
        <BookIcon className="mx-auto size-12 text-ink/25 dark:text-cream/25" />
        <h2 className="mt-5 text-2xl font-bold text-ink dark:text-cream">
          {emptyTitle}
        </h2>
        <p className="mt-2 font-sans text-sm leading-relaxed text-ink/60 dark:text-cream/60">
          {emptyMessage}
        </p>
        {emptyAction && (
          <Link href={emptyAction.href} className={`mt-6 ${primaryButton}`}>
            <PlusIcon className="size-4" />
            {emptyAction.label}
          </Link>
        )}
      </section>
    );
  }

  return (
    <section aria-label={label}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-sans text-sm font-semibold text-ink/60 dark:text-cream/60">
          {countLabel
            ? countLabel(books.length)
            : `${books.length} ${books.length === 1 ? "book" : "books"}`}
        </h2>
      </div>

      <BookGrid books={books} manage={manage} onDeleted={onDeleted} />
    </section>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}
