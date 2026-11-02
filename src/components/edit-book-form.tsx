"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import AuthGate from "@/components/auth-gate";
import { useCurrentUser } from "@/lib/auth";
import { categoryOptions } from "@/lib/book-categories";
import { updateBookRequest } from "@/lib/book-mutations";
import { isBookAddedByUser, useBooks } from "@/lib/books";
import { MAX_IMAGE_BYTES, readFileAsDataUrl } from "@/lib/files";

const fieldBase =
  "w-full rounded-lg border border-ink/15 bg-cream font-sans text-sm text-ink outline-none transition placeholder:text-ink/35 hover:border-ink/25 focus:border-brand focus:ring-4 focus:ring-brand/15 dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:placeholder:text-cream/35 dark:hover:border-cream/25 dark:focus:border-brand-light dark:focus:ring-brand-light/20";

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 font-sans text-sm font-semibold text-cream transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-brand dark:focus-visible:outline-brand-light";

const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-ink/15 bg-cream px-6 py-3 font-sans text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:hover:border-brand-light/40 dark:hover:bg-brand/10 dark:hover:text-brand-light dark:focus-visible:outline-brand-light";

export default function EditBookForm({ bookId }: { bookId: string }) {
  return (
    <AuthGate nextPath={`/books/${bookId}/edit`}>
      <EditBookFields bookId={bookId} />
    </AuthGate>
  );
}

function EditBookFields({ bookId }: { bookId: string }) {
  const router = useRouter();
  const user = useCurrentUser();
  const { books, loading, error, retry } = useBooks();
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (loading) {
    return (
      <div className="space-y-4 rounded-2xl border border-ink/10 bg-cream p-6 sm:p-8 dark:border-cream/10 dark:bg-ink">
        <div className="h-5 w-32 animate-pulse rounded bg-ink/10 dark:bg-cream/10" />
        <div className="h-11 w-full animate-pulse rounded-lg bg-ink/10 dark:bg-cream/10" />
        <div className="h-11 w-full animate-pulse rounded-lg bg-ink/10 dark:bg-cream/10" />
        <div className="h-28 w-full animate-pulse rounded-lg bg-ink/10 dark:bg-cream/10" />
      </div>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-brand/25 bg-brand/5 px-6 py-10 text-center dark:border-brand-light/25 dark:bg-brand/10">
        <h2 className="text-2xl font-bold text-ink dark:text-cream">
          Couldn&apos;t load this book
        </h2>
        <p className="mt-2 font-sans text-sm leading-relaxed text-ink/60 dark:text-cream/60">
          {error}
        </p>
        <button
          type="button"
          onClick={retry}
          className={`mt-6 ${secondaryButton}`}
        >
          Try again
        </button>
      </section>
    );
  }

  const book = books.find((item) => item._id === bookId);

  if (!book) {
    return (
      <section className="rounded-2xl border border-ink/10 bg-cream-dark/50 px-6 py-12 text-center dark:border-cream/10 dark:bg-ink">
        <h2 className="text-2xl font-bold text-ink dark:text-cream">
          Book not found
        </h2>
        <p className="mt-2 font-sans text-sm leading-relaxed text-ink/60 dark:text-cream/60">
          This book may have been removed from the library.
        </p>
        <Link href="/my-books" className={`mt-6 ${primaryButton}`}>
          Back to My Books
        </Link>
      </section>
    );
  }

  if (!user || !isBookAddedByUser(book, user)) {
    return (
      <section className="rounded-2xl border border-ink/10 bg-cream px-6 py-10 text-center shadow-sm dark:border-cream/10 dark:bg-ink">
        <h2 className="text-2xl font-bold text-ink dark:text-cream">
          Not your book
        </h2>
        <p className="mt-2 font-sans text-sm leading-relaxed text-ink/60 dark:text-cream/60">
          You can only edit books you added to the library.
        </p>
        <Link href={`/books/${book._id}`} className={`mt-6 ${secondaryButton}`}>
          Back to book details
        </Link>
      </section>
    );
  }

  const editTarget = book;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const copies = Number(formData.get("copies"));

    setSaving(true);
    setSubmitError("");

    try {
      let image: string | null = editTarget.image;

      const file = formData.get("image");
      if (file instanceof File && file.size > 0) {
        if (file.size > MAX_IMAGE_BYTES) {
          throw new Error("The image must be 2 MB or smaller.");
        }
        image = await readFileAsDataUrl(file);
      }

      await updateBookRequest(editTarget._id, {
        title: String(formData.get("title") ?? ""),
        author: String(formData.get("author") ?? ""),
        category: String(formData.get("category") ?? ""),
        copies,
        description: String(formData.get("description") ?? ""),
        image,
      });

      router.push(`/books/${editTarget._id}`);
      router.refresh();
    } catch (cause) {
      setSubmitError(
        cause instanceof Error
          ? cause.message
          : "Something went wrong while saving. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-2xl border border-ink/10 bg-cream shadow-[0_1px_2px_rgba(42,26,28,0.06),0_18px_40px_-24px_rgba(42,26,28,0.35)] dark:border-cream/10 dark:bg-ink dark:shadow-none"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-brand via-brand-light to-brand-soft" />

      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="h-32 w-24 shrink-0 overflow-hidden rounded-lg border border-ink/10 bg-cream-dark dark:border-cream/10 dark:bg-ink-900">
            {book.image ? (
              // Covers can be data URLs or arbitrary hosts, so next/image
              // cannot optimise them without extra configuration.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.image}
                alt={`Current cover of ${book.title}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center font-sans text-xs text-ink/40 dark:text-cream/40">
                No cover
              </span>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-ink dark:text-cream">
              {book.title}
            </h2>
            <p className="mt-1 font-sans text-sm text-ink/55 dark:text-cream/55">
              by {book.author}
            </p>
            <p className="mt-3 font-sans text-xs leading-relaxed text-ink/45 dark:text-cream/45">
              Only you can edit or delete this book because you added it to the
              library.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 border-t border-ink/10 pt-8 sm:grid-cols-2 dark:border-cream/10">
          <Field id="title" label="Book Title" required>
            <input
              id="title"
              name="title"
              type="text"
              required
              autoComplete="off"
              defaultValue={book.title}
              className={`${fieldBase} h-11 px-3.5`}
            />
          </Field>

          <Field id="author" label="Author Name" required>
            <input
              id="author"
              name="author"
              type="text"
              required
              autoComplete="off"
              defaultValue={book.author}
              className={`${fieldBase} h-11 px-3.5`}
            />
          </Field>

          <Field id="category" label="Category">
            <div className="relative">
              <select
                id="category"
                name="category"
                defaultValue={book.category}
                className={`${fieldBase} h-11 cursor-pointer appearance-none pr-10 pl-3.5`}
              >
                {categoryOptions(book.category).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink/40 dark:text-cream/40" />
            </div>
          </Field>

          <Field id="copies" label="Total Copies" required>
            <input
              id="copies"
              name="copies"
              type="number"
              min={1}
              required
              defaultValue={book.totalCopies}
              className={`${fieldBase} h-11 px-3.5`}
            />
          </Field>

          <Field
            id="image"
            label="Replace Cover"
            hint="Leave empty to keep the current cover."
            className="sm:col-span-2"
          >
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="block w-full cursor-pointer rounded-lg border border-dashed border-ink/20 bg-cream p-1.5 font-sans text-sm text-ink/50 transition hover:border-brand/40 focus:border-brand focus:ring-4 focus:ring-brand/15 focus:outline-none file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:font-sans file:text-sm file:font-semibold file:text-brand hover:file:bg-brand/15 dark:border-cream/20 dark:bg-ink-900 dark:text-cream/50 dark:hover:border-brand-light/50 dark:focus:border-brand-light dark:focus:ring-brand-light/20 dark:file:bg-brand/15 dark:file:text-brand-light dark:hover:file:bg-brand/20"
            />
          </Field>

          <Field
            id="description"
            label="Short Description"
            className="sm:col-span-2"
          >
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={book.description}
              placeholder="A sentence or two about the book…"
              className={`${fieldBase} min-h-28 resize-y px-3.5 py-3 leading-relaxed`}
            />
          </Field>
        </div>

        {submitError && (
          <p
            role="alert"
            className="mt-6 rounded-lg border border-brand/30 bg-brand/5 px-4 py-3 font-sans text-sm text-ink/80 dark:border-brand-light/30 dark:bg-brand/10 dark:text-cream/80"
          >
            {submitError}
          </p>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:items-center dark:border-cream/10">
          <Link href={`/books/${book._id}`} className={secondaryButton}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            aria-busy={saving}
            className={primaryButton}
          >
            {saving ? (
              <>
                <SpinnerIcon className="size-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <CheckIcon className="size-4" />
                Save changes
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block font-sans text-sm font-medium text-ink/80 dark:text-cream/80"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-brand" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && (
        <p className="mt-1.5 font-sans text-xs text-ink/45 dark:text-cream/45">
          {hint}
        </p>
      )}
    </div>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
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
      <path d="m6 9 6 6 6-6" />
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

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="9" className="opacity-25" />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </svg>
  );
}
