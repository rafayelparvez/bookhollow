"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { API_URL } from "@/lib/api";
import { useAuth, useMounted } from "@/lib/auth";
import { BOOK_CATEGORIES } from "@/lib/book-categories";
import { MAX_IMAGE_BYTES, readFileAsDataUrl } from "@/lib/files";

const ADD_BOOK_ENDPOINT = `${API_URL}/add-book`;

const fieldBase =
  "w-full rounded-lg border border-ink/15 bg-cream font-sans text-sm text-ink outline-none transition placeholder:text-ink/35 hover:border-ink/25 focus:border-brand focus:ring-4 focus:ring-brand/15 dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:placeholder:text-cream/35 dark:hover:border-cream/25 dark:focus:border-brand-light dark:focus:ring-brand-light/20";

type Status = "idle" | "submitting" | "success" | "error";

export default function AddBookForm() {
  const { user, isPending } = useAuth();
  const mounted = useMounted();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      setStatus("error");
      setErrorMessage("Please sign in before adding a book.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("submitting");
    setErrorMessage("");

    try {
      // The cover is sent as a base64 data URL inside the JSON body.
      // An untouched file input still yields an empty File, so skip it.
      let image: string | null = null;
      const file = formData.get("image");
      if (file instanceof File && file.size > 0) {
        if (file.size > MAX_IMAGE_BYTES) {
          throw new Error("The image must be 2 MB or smaller.");
        }
        image = await readFileAsDataUrl(file);
      }

      const payload = {
        title: formData.get("title"),
        author: formData.get("author"),
        category: formData.get("category"),
        copies: formData.get("copies"),
        description: formData.get("description"),
        image,
        // Associate the book with the signed-in account.
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      };

      const response = await fetch(ADD_BOOK_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(describeError(error));
    }
  }

  if (!mounted || isPending) {
    return (
      <div className="flex justify-center py-16">
        <span
          className="size-7 animate-spin rounded-full border-2 border-brand/25 border-t-brand dark:border-cream/20 dark:border-t-brand-light"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-ink/10 bg-cream px-4 py-4 font-sans text-sm text-ink/70 dark:border-cream/10 dark:bg-ink dark:text-cream/70">
        Please sign in to add a book.{" "}
        <Link
          href="/login?next=%2Fadd-book"
          className="font-semibold text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand-soft"
        >
          Login
        </Link>
      </div>
    );
  }

  const isSubmitting = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-2xl border border-ink/10 bg-cream shadow-[0_1px_2px_rgba(42,26,28,0.06),0_18px_40px_-24px_rgba(42,26,28,0.35)] dark:border-cream/10 dark:bg-ink dark:shadow-none"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-brand via-brand-light to-brand-soft" />

      <div className="p-6 sm:p-8 lg:p-10">
        <section aria-labelledby="book-details-heading">
          <h2
            id="book-details-heading"
            className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45 dark:text-cream/45"
          >
            Book details
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field id="title" label="Book Title" required>
              <input
                id="title"
                name="title"
                type="text"
                required
                autoComplete="off"
                placeholder="e.g. The Name of the Wind"
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
                placeholder="e.g. Patrick Rothfuss"
                className={`${fieldBase} h-11 px-3.5`}
              />
            </Field>

            <Field id="category" label="Category">
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  defaultValue="Fiction"
                  className={`${fieldBase} h-11 cursor-pointer appearance-none pr-10 pl-3.5`}
                >
                  {BOOK_CATEGORIES.map((category) => (
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
                defaultValue={1}
                required
                className={`${fieldBase} h-11 px-3.5`}
              />
            </Field>

            <Field
              id="image"
              label="Book Image"
              hint="A square or portrait cover works best."
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
                placeholder="A sentence or two about the book…"
                className={`${fieldBase} min-h-28 resize-y px-3.5 py-3 leading-relaxed`}
              />
            </Field>
          </div>
        </section>

        <section
          aria-labelledby="added-by-heading"
          className="mt-8 border-t border-ink/10 pt-8 dark:border-cream/10"
        >
          <h2
            id="added-by-heading"
            className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45 dark:text-cream/45"
          >
            Added by
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field id="userName" label="User Name" hint="Taken from your account.">
              <input
                id="userName"
                name="userName"
                type="text"
                readOnly
                value={user.name}
                className="h-11 w-full cursor-not-allowed rounded-lg border border-ink/10 bg-ink/[0.04] px-3.5 font-sans text-sm text-ink/60 outline-none dark:border-cream/10 dark:bg-cream/5 dark:text-cream/60"
              />
            </Field>

            <Field id="userEmail" label="User Email" hint="Taken from your account.">
              <input
                id="userEmail"
                name="userEmail"
                type="email"
                readOnly
                value={user.email}
                className="h-11 w-full cursor-not-allowed rounded-lg border border-ink/10 bg-ink/[0.04] px-3.5 font-sans text-sm text-ink/60 outline-none dark:border-cream/10 dark:bg-cream/5 dark:text-cream/60"
              />
            </Field>
          </div>
        </section>

        <div className="mt-8 border-t border-ink/10 pt-6 dark:border-cream/10">
          {status === "success" && (
            <p
              role="status"
              className="mb-5 flex items-start gap-2 rounded-lg border border-brand/20 bg-brand/5 px-4 py-3 font-sans text-sm text-ink/80 dark:border-brand-light/25 dark:bg-brand/10 dark:text-cream/80"
            >
              <CheckIcon className="mt-0.5 size-4 shrink-0 text-brand dark:text-brand-light" />
              Book added to the library. Add another whenever you&apos;re ready.
            </p>
          )}

          {status === "error" && (
            <p
              role="alert"
              className="mb-5 flex items-start gap-2 rounded-lg border border-brand/30 bg-brand/5 px-4 py-3 font-sans text-sm text-ink/80 dark:border-brand-light/30 dark:bg-brand/10 dark:text-cream/80"
            >
              <AlertIcon className="mt-0.5 size-4 shrink-0 text-brand dark:text-brand-light" />
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand font-sans text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-brand dark:focus-visible:outline-brand-light"
          >
            {isSubmitting ? (
              <>
                <SpinnerIcon className="size-4 animate-spin" />
                Adding book…
              </>
            ) : (
              <>
                <PlusIcon className="size-4" />
                Add Book
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();

    if (body && typeof body === "object") {
      const { message, error } = body as { message?: unknown; error?: unknown };
      const detail = typeof message === "string" ? message : error;

      if (typeof detail === "string" && detail.trim()) return detail;
    }
  } catch {
    // Non-JSON error body (e.g. an HTML error page) — fall back to the status.
  }

  return `The server responded with ${response.status} ${response.statusText}.`;
}

function describeError(error: unknown): string {
  // A CORS or connection failure surfaces as a TypeError from fetch.
  if (error instanceof TypeError) {
    return `Could not reach the library API at ${ADD_BOOK_ENDPOINT}. Make sure the server is running and allows requests from this site.`;
  }

  if (error instanceof Error && error.message) return error.message;

  return "Something went wrong while adding the book. Please try again.";
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
        <p className="mt-1.5 font-sans text-xs text-ink/45 dark:text-cream/45">{hint}</p>
      )}
    </div>
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
      strokeWidth={2}
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