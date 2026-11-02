"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Book } from "@/lib/books";

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2.5 font-sans text-sm font-semibold text-cream transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:focus-visible:outline-brand-light";

export default function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const res = await fetch("/api/books?limit=4", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to load new arrivals.");
        const data: Book[] = await res.json();
        setBooks(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-ink dark:text-cream">
            New Arrivals
          </h2>
          <p className="mt-2 font-sans text-base text-ink/60 dark:text-cream/60">
            The latest books added to our shelves.
          </p>
        </div>
        <Link href="/books" className={primaryButton}>
          See All Books
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-ink/10 bg-cream dark:border-cream/10 dark:bg-ink"
            >
              <div className="aspect-[4/3] w-full animate-pulse bg-cream-dark dark:bg-ink-900" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-ink/10 dark:bg-cream/10" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-ink/10 dark:bg-cream/10" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="mt-8 font-sans text-sm text-ink/70 dark:text-cream/70">
          We could not load the new arrivals right now.
        </p>
      ) : books.length === 0 ? (
        <p className="mt-8 font-sans text-sm text-ink/70 dark:text-cream/70">
          No books yet. Be the first to add one.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((book) => (
            <article
              key={book._id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-cream shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none dark:border-cream/10 dark:bg-ink dark:hover:border-brand-light/40"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-dark dark:bg-ink-900">
                <div className="absolute inset-0 flex items-center justify-center text-ink/20 dark:text-cream/15">
                  <BookIcon className="size-12" />
                </div>
                {book.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                    loading="lazy"
                    className="relative h-full w-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
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
                <Link
                  href={`/books/${book._id}`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-ink/15 bg-cream px-4 py-2 font-sans text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-ink/15 dark:bg-ink-900 dark:text-cream dark:hover:border-brand-light/40 dark:hover:bg-brand/10 dark:hover:text-brand-light dark:focus-visible:outline-brand-light"
                >
                  View Details
                  <ArrowRightIcon className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link href="/books" className={primaryButton}>
          See All Books
        </Link>
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

function ArrowRightIcon({ className }: { className?: string }) {
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
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}