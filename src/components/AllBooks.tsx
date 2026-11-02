"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const GRID_CLASS =
  "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4";

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

export default function AllBooks() {
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

  function retry() {
    setLoading(true);
    setError("");
    setReloadToken((token) => token + 1);
  }

  if (loading) {
    return (
      <section aria-busy="true" aria-live="polite">
        <span className="sr-only">Loading books…</span>
        <div className={GRID_CLASS}>
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
        <button
          type="button"
          onClick={retry}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 font-sans text-sm font-semibold text-cream transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:focus-visible:outline-brand-light"
        >
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
          The shelves are empty
        </h2>
        <p className="mt-2 font-sans text-sm leading-relaxed text-ink/60 dark:text-cream/60">
          No books have been added yet. Be the first to put one on the shelf.
        </p>
        <Link
          href="/add-book"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 font-sans text-sm font-semibold text-cream transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:focus-visible:outline-brand-light"
        >
          <PlusIcon className="size-4" />
          Add the first book
        </Link>
      </section>
    );
  }

  return (
    <section aria-label="Book list">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-sans text-sm font-semibold text-ink/60 dark:text-cream/60">
          {books.length} {books.length === 1 ? "book" : "books"} on the shelf
        </h2>
      </div>

      <div className={GRID_CLASS}>
        {books.map((book) => {
          const isAvailable = book.availableCopies > 0;

          return (
            <article
              key={book._id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-cream shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none dark:border-cream/10 dark:bg-ink dark:hover:border-brand-light/40"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-dark dark:bg-ink-900">
                <div className="absolute inset-0 flex items-center justify-center text-ink/20 dark:text-cream/15">
                  <BookIcon className="size-12" />
                </div>

                {book.image && (
                  // Covers can be data URLs or arbitrary hosts, so next/image
                  // cannot optimise them without extra configuration.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                    loading="lazy"
                    className="relative h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-ink-900/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none" />
              </div>

              <div className="flex flex-1 flex-col p-4">
                <span className="inline-flex w-fit items-center rounded-full border border-ink/10 bg-ink/[0.04] px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/60 dark:border-cream/10 dark:bg-cream/5 dark:text-cream/60">
                  {book.category}
                </span>

                <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-ink dark:text-cream">
                  {book.title}
                </h3>
                <p className="mt-1 font-sans text-sm text-ink/55 dark:text-cream/55">
                  by {book.author}
                </p>

                {book.description && (
                  <p className="mt-3 line-clamp-2 font-sans text-sm leading-relaxed text-ink/65 dark:text-cream/60">
                    {book.description}
                  </p>
                )}

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-sans text-[11px] font-semibold ${
                      isAvailable
                        ? "border-brand/25 bg-brand/10 text-brand-dark dark:border-brand-light/25 dark:bg-brand/15 dark:text-brand-light"
                        : "border-ink/10 bg-ink/5 text-ink/50 dark:border-cream/10 dark:bg-cream/5 dark:text-cream/50"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`size-1.5 rounded-full ${
                        isAvailable
                          ? "bg-brand dark:bg-brand-light"
                          : "bg-ink/30 dark:bg-cream/30"
                      }`}
                    />
                    {isAvailable
                      ? `${book.availableCopies} of ${book.totalCopies} available`
                      : "Out of stock"}
                  </span>

                  {book.addedBy?.name && (
                    <span className="font-sans text-[11px] text-ink/40 dark:text-cream/40">
                      Added by {book.addedBy.name}
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
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
