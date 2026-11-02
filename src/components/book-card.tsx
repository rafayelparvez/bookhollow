"use client";

import Link from "next/link";
import { useState } from "react";
import { useCurrentUser } from "@/lib/auth";
import { deleteBookRequest } from "@/lib/book-mutations";
import { hasBorrowed, returnBook, useBorrows } from "@/lib/borrows";
import { isBookAddedByUser } from "@/lib/books";
import type { Book } from "@/lib/books";

export const BOOK_GRID_CLASS =
  "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4";

export function BookGrid({
  books,
  manage,
  onDeleted,
  returnable,
  onReturned,
}: {
  books: Book[];
  manage?: boolean;
  onDeleted?: () => void;
  returnable?: boolean;
  onReturned?: () => void;
}) {
  return (
    <div className={BOOK_GRID_CLASS}>
      {books.map((book) => (
        <BookCard
          key={book._id}
          book={book}
          manage={manage}
          onDeleted={onDeleted}
          returnable={returnable}
          onReturned={onReturned}
        />
      ))}
    </div>
  );
}

export default function BookCard({
  book,
  manage,
  onDeleted,
  returnable,
  onReturned,
}: {
  book: Book;
  manage?: boolean;
  onDeleted?: () => void;
  returnable?: boolean;
  onReturned?: () => void;
}) {
  const user = useCurrentUser();
  const borrows = useBorrows();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const borrowedByMe = hasBorrowed(borrows, book._id, user);
  const isAvailable = book.availableCopies > 0;
  const isOwner = !!user && isBookAddedByUser(book, user);

  async function handleDelete() {
    if (!isOwner) return;
    if (!window.confirm(`Delete "${book.title}"? This cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    setDeleteError("");

    try {
      await deleteBookRequest(book._id);
      onDeleted?.();
    } catch (cause) {
      setDeleteError(
        cause instanceof Error
          ? cause.message
          : "Could not delete this book. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-cream shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none dark:border-cream/10 dark:bg-ink dark:hover:border-brand-light/40">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-dark dark:bg-ink-900">
        <div className="absolute inset-0 flex items-center justify-center text-ink/20 dark:text-cream/15">
          <BookIcon className="size-12" />
        </div>

        {book.image && (
          // Covers can be data URLs or arbitrary hosts, so next/image cannot
          // optimise them without extra configuration.
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
              borrowedByMe || isAvailable
                ? "border-brand/25 bg-brand/10 text-brand-dark dark:border-brand-light/25 dark:bg-brand/15 dark:text-brand-light"
                : "border-ink/10 bg-ink/5 text-ink/50 dark:border-cream/10 dark:bg-cream/5 dark:text-cream/50"
            }`}
          >
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${
                borrowedByMe || isAvailable
                  ? "bg-brand dark:bg-brand-light"
                  : "bg-ink/30 dark:bg-cream/30"
              }`}
            />
            {borrowedByMe
              ? "Borrowed by you"
              : isAvailable
                ? `${book.availableCopies} of ${book.totalCopies} available`
                : "Out of stock"}
          </span>

          {book.addedBy?.name && (
            <span className="font-sans text-[11px] text-ink/40 dark:text-cream/40">
              Added by {book.addedBy.name}
            </span>
          )}
        </div>

        <Link
          href={`/books/${book._id}`}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-ink/15 bg-cream px-4 py-2 font-sans text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:hover:border-brand-light/40 dark:hover:bg-brand/10 dark:hover:text-brand-light dark:focus-visible:outline-brand-light"
        >
          View Details
          <ArrowRightIcon className="size-4" />
        </Link>

        {manage && isOwner && (
          <div className="mt-2">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/books/${book._id}/edit`}
                className="inline-flex items-center justify-center rounded-lg border border-ink/15 bg-cream px-3 py-2 font-sans text-xs font-semibold text-ink transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:hover:border-brand-light/40 dark:hover:bg-brand/10 dark:hover:text-brand-light dark:focus-visible:outline-brand-light"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center rounded-lg border border-brand/25 bg-brand/5 px-3 py-2 font-sans text-xs font-semibold text-brand-dark transition-colors hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60 dark:border-brand-light/25 dark:bg-brand/10 dark:text-brand-light dark:hover:bg-brand/15 dark:focus-visible:outline-brand-light"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
            {deleteError && (
              <p
                role="alert"
                className="mt-2 font-sans text-[11px] leading-relaxed text-brand-dark dark:text-brand-light"
              >
                {deleteError}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
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
