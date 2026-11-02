"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCurrentUser } from "@/lib/auth";
import { deleteBookRequest } from "@/lib/book-mutations";
import { borrowBook, useMyBorrows } from "@/lib/borrows";
import { isBookAddedByUser, useBooks } from "@/lib/books";

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 font-sans text-sm font-semibold text-cream transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-brand dark:focus-visible:outline-brand-light";

const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-ink/15 bg-cream px-6 py-3 font-sans text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:hover:border-brand-light/40 dark:hover:bg-brand/10 dark:hover:text-brand-light dark:focus-visible:outline-brand-light";

const dangerButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-brand/30 bg-brand/5 px-6 py-3 font-sans text-sm font-semibold text-brand-dark transition-colors hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60 dark:border-brand-light/30 dark:bg-brand/10 dark:text-brand-light dark:hover:bg-brand/15 dark:focus-visible:outline-brand-light";

const DAYS_IN_LOAN = 7;

export default function BookDetails({ bookId }: { bookId: string }) {
  const router = useRouter();
  const { books, loading, error, retry } = useBooks();
  const user = useCurrentUser();
  const borrows = useMyBorrows();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [borrowing, setBorrowing] = useState(false);
  const [borrowError, setBorrowError] = useState("");

  if (loading) {
    return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start">
        <div className="aspect-[3/4] w-full animate-pulse rounded-2xl bg-cream-dark dark:bg-ink" />
        <div className="space-y-4">
          <div className="h-5 w-24 animate-pulse rounded-full bg-ink/10 dark:bg-cream/10" />
          <div className="h-12 w-3/4 animate-pulse rounded bg-ink/10 dark:bg-cream/10" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-ink/10 dark:bg-cream/10" />
          <div className="h-24 w-full animate-pulse rounded bg-ink/10 dark:bg-cream/10" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-xl rounded-2xl border border-brand/25 bg-brand/5 px-6 py-10 text-center dark:border-brand-light/25 dark:bg-brand/10">
        <AlertIcon className="mx-auto size-9 text-brand dark:text-brand-light" />
        <h2 className="mt-4 text-2xl font-bold text-ink dark:text-cream">
          Couldn&apos;t load this book
        </h2>
        <p className="mt-2 font-sans text-sm leading-relaxed text-ink/60 dark:text-cream/60">
          {error}
        </p>
        <button type="button" onClick={retry} className={`mt-6 ${primaryButton}`}>
          <RefreshIcon className="size-4" />
          Try again
        </button>
      </section>
    );
  }

  const book = books.find((item) => item._id === bookId);

  if (!book) {
    return (
      <section className="mx-auto max-w-xl rounded-2xl border border-ink/10 bg-cream-dark/50 px-6 py-12 text-center dark:border-cream/10 dark:bg-ink">
        <BookIcon className="mx-auto size-12 text-ink/25 dark:text-cream/25" />
        <h2 className="mt-5 text-2xl font-bold text-ink dark:text-cream">
          Book not found
        </h2>
        <p className="mt-2 font-sans text-sm leading-relaxed text-ink/60 dark:text-cream/60">
          This book may have been removed from the library.
        </p>
        <Link href="/books" className={`mt-6 ${primaryButton}`}>
          Back to All Books
        </Link>
      </section>
    );
  }

  const myRecord = user
    ? borrows.find((record) => record.bookId === book._id)
    : undefined;
  const borrowedByMe = Boolean(myRecord);
  const isAvailable = book.availableCopies > 0;
  const isOwner = user ? isBookAddedByUser(book, user) : false;
  const target = book;

  async function handleDelete() {
    if (!isOwner) return;
    if (!window.confirm(`Delete "${target.title}"? This cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    setDeleteError("");

    try {
      await deleteBookRequest(target._id);
      router.replace("/my-books");
      router.refresh();
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

  async function handleBorrow() {
    setBorrowing(true);
    setBorrowError("");

    try {
      await borrowBook(target._id);
      retry(); // availableCopies নতুন করে আনার জন্য
    } catch (cause) {
      setBorrowError(
        cause instanceof Error
          ? cause.message
          : "Could not borrow this book. Please try again.",
      );
    } finally {
      setBorrowing(false);
    }
  }

  const dueDate = myRecord
    ? new Date(
        new Date(myRecord.borrowedAt).getTime() +
          DAYS_IN_LOAN * 24 * 60 * 60 * 1000,
      )
    : null;

  const loginHref = `/login?next=${encodeURIComponent(`/books/${book._id}`)}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start">
      <div className="lg:sticky lg:top-28">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-ink/10 bg-cream-dark dark:border-cream/10 dark:bg-ink">
          <div className="absolute inset-0 flex items-center justify-center text-ink/20 dark:text-cream/15">
            <BookIcon className="size-20" />
          </div>
          {book.image && (
            // Covers can be data URLs or arbitrary hosts, so next/image cannot
            // optimise them without extra configuration.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.image}
              alt={`Cover of ${book.title}`}
              className="relative h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>
      </div>

      <div>
        <span className="inline-flex w-fit items-center rounded-full border border-ink/10 bg-ink/[0.04] px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/60 dark:border-cream/10 dark:bg-cream/5 dark:text-cream/60">
          {book.category}
        </span>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink sm:text-5xl dark:text-cream">
          {book.title}
        </h1>
        <p className="mt-2 font-sans text-base text-ink/55 dark:text-cream/55">
          by {book.author}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-xs font-semibold ${
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
        </div>

        {book.description && (
          <p className="mt-6 whitespace-pre-line font-sans text-base leading-relaxed text-ink/70 dark:text-cream/65">
            {book.description}
          </p>
        )}

        <dl className="mt-8 grid gap-5 border-t border-ink/10 pt-6 font-sans text-sm sm:grid-cols-2 dark:border-cream/10">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45 dark:text-cream/45">
              Added by
            </dt>
            <dd className="mt-1 text-ink/80 dark:text-cream/80">
              {book.addedBy?.name ?? "Unknown"}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45 dark:text-cream/45">
              Total copies
            </dt>
            <dd className="mt-1 text-ink/80 dark:text-cream/80">
              {book.totalCopies}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45 dark:text-cream/45">
              Added on
            </dt>
            <dd className="mt-1 text-ink/80 dark:text-cream/80">
              {new Date(book.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45 dark:text-cream/45">
              Loan period
            </dt>
            <dd className="mt-1 text-ink/80 dark:text-cream/80">
              {DAYS_IN_LOAN} days
            </dd>
          </div>
        </dl>

        <div className="mt-8 border-t border-ink/10 pt-6 dark:border-cream/10">
          {!user ? (
            <Link href={loginHref} className={primaryButton}>
              <BookIcon className="size-4" />
              Borrow Book
            </Link>
          ) : borrowedByMe ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" disabled className={secondaryButton}>
                <CheckIcon className="size-4" />
                Already Borrowed
              </button>
              {dueDate && (
                <p className="font-sans text-sm text-ink/60 dark:text-cream/60">
                  Due back by{" "}
                  <span className="font-semibold text-ink dark:text-cream">
                    {dueDate.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  .
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleBorrow}
                disabled={!isAvailable || borrowing}
                aria-busy={borrowing}
                className={primaryButton}
              >
                <BookIcon className="size-4" />
                {borrowing ? "Borrowing…" : "Borrow Book"}
              </button>
              {!isAvailable && (
                <p className="font-sans text-sm text-ink/60 dark:text-cream/60">
                  All copies are currently borrowed. Check back soon.
                </p>
              )}
              {borrowError && (
                <p
                  role="alert"
                  className="font-sans text-sm text-brand-dark dark:text-brand-light"
                >
                  {borrowError}
                </p>
              )}
            </div>
          )}
        </div>

        {isOwner && (
          <div className="mt-6 border-t border-ink/10 pt-6 dark:border-cream/10">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45 dark:text-cream/45">
              Manage this book
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Link href={`/books/${book._id}/edit`} className={secondaryButton}>
                Edit book
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className={dangerButton}
              >
                {deleting ? "Deleting…" : "Delete book"}
              </button>
            </div>
            {deleteError && (
              <p
                role="alert"
                className="mt-3 font-sans text-sm text-brand-dark dark:text-brand-light"
              >
                {deleteError}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
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

function CheckIcon({ className }: { className?: string }) {
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
      <path d="M20 6 9 17l-5-5" />
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