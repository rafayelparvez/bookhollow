// src/components/how-to-borrow.tsx
// Static, purely visual section: shows how borrowing a book works.
// No state, no handlers, so this stays a server component.

import type { ReactNode } from "react";

const STEPS: { title: string; text: string; preview: ReactNode }[] = [
  {
    title: "Create your account",
    text: "Register with your name and email, then log in to start borrowing.",
    preview: <RegisterPreview />,
  },
  {
    title: "Find a book you like",
    text: "Browse by category or open All books to see what your neighbours have shared.",
    preview: <BrowsePreview />,
  },
  {
    title: "Borrow it",
    text: "Open the book's page, check that a copy is available, and borrow it.",
    preview: <BorrowPreview />,
  },
  {
    title: "Track it in My Borrows",
    text: "Everything you have borrowed is kept together on your My Borrows page.",
    preview: <BorrowsPreview />,
  },
];

export default function HowToBorrow() {
  return (
    <section
      aria-labelledby="how-to-borrow-title"
      className="border-y border-ink/10 bg-ink/5 dark:border-cream/10 dark:bg-cream/5"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="max-w-2xl">
          <h2
            id="how-to-borrow-title"
            className="text-3xl font-bold tracking-tight text-ink dark:text-cream"
          >
            How borrowing works
          </h2>
          <p className="mt-2 font-sans text-base text-ink/60 dark:text-cream/60">
            Four simple steps from the shelf to your hands.
          </p>
        </div>

        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="relative flex flex-col rounded-2xl border border-ink/10 bg-cream p-4 shadow-sm dark:border-cream/10 dark:bg-ink"
            >
              {/* Mini UI preview */}
              <div
                aria-hidden="true"
                className="relative flex h-44 items-center justify-center overflow-hidden rounded-xl border border-ink/10 bg-cream-dark p-4 dark:border-cream/10 dark:bg-ink-900"
              >
                <span className="absolute left-3 top-3 flex size-7 items-center justify-center rounded-full bg-brand font-sans text-sm font-bold text-white">
                  {i + 1}
                </span>
                {step.preview}
              </div>

              <h3 className="mt-5 text-lg font-bold leading-snug text-ink dark:text-cream">
                {step.title}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-ink/65 dark:text-cream/60">
                {step.text}
              </p>

              {/* Arrow between cards (desktop row only) */}
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-7 top-[5.75rem] hidden size-6 items-center justify-center rounded-full border border-ink/10 bg-cream text-ink/50 lg:flex dark:border-cream/10 dark:bg-ink dark:text-cream/50"
                >
                  <ArrowIcon className="size-3.5" />
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Step previews (static mockups) ---------- */

const miniBox =
  "rounded-md border border-ink/10 bg-cream dark:border-cream/10 dark:bg-ink";

function RegisterPreview() {
  return (
    <div className="w-full max-w-[11rem] space-y-2">
      <div
        className={`${miniBox} px-2 py-1.5 font-sans text-[10px] text-ink/40 dark:text-cream/40`}
      >
        Your name
      </div>
      <div
        className={`${miniBox} px-2 py-1.5 font-sans text-[10px] text-ink/40 dark:text-cream/40`}
      >
        you@email.com
      </div>
      <div className="rounded-md bg-brand px-2 py-1.5 text-center font-sans text-[10px] font-semibold text-white">
        Create account
      </div>
    </div>
  );
}

function BrowsePreview() {
  const chips = ["Fiction", "Poetry", "Science"];
  return (
    <div className="w-full space-y-2.5">
      <div className="flex gap-1.5">
        {chips.map((chip, i) => (
          <span
            key={chip}
            className={`rounded-full border px-2 py-0.5 font-sans text-[9px] font-semibold ${
              i === 0
                ? "border-brand bg-brand text-white"
                : "border-ink/15 bg-cream text-ink/60 dark:border-cream/15 dark:bg-ink dark:text-cream/60"
            }`}
          >
            {chip}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <MiniBook />
        <MiniBook />
      </div>
    </div>
  );
}

function MiniBook() {
  return (
    <div className={`${miniBox} overflow-hidden`}>
      <div className="flex h-12 items-center justify-center bg-ink/5 text-ink/25 dark:bg-cream/5 dark:text-cream/25">
        <BookIcon className="size-5" />
      </div>
      <div className="space-y-1 p-1.5">
        <div className="h-1.5 w-3/4 rounded bg-ink/20 dark:bg-cream/20" />
        <div className="h-1.5 w-1/2 rounded bg-ink/10 dark:bg-cream/10" />
      </div>
    </div>
  );
}

function BorrowPreview() {
  return (
    <div
      className={`${miniBox} flex w-full max-w-[13rem] gap-3 rounded-lg p-2.5`}
    >
      <div className="flex h-24 w-14 shrink-0 items-center justify-center rounded-md bg-ink/5 text-ink/25 dark:bg-cream/5 dark:text-cream/25">
        <BookIcon className="size-6" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="h-2 w-5/6 rounded bg-ink/25 dark:bg-cream/25" />
        <div className="h-1.5 w-1/2 rounded bg-ink/10 dark:bg-cream/10" />
        <span className="inline-flex w-fit items-center gap-1 rounded-full border border-brand/25 bg-brand/10 px-1.5 py-0.5 font-sans text-[9px] font-semibold text-brand-dark dark:border-brand-light/25 dark:bg-brand/15 dark:text-brand-light">
          <span className="size-1 rounded-full bg-brand dark:bg-brand-light" />
          2 of 3 available
        </span>
        <div className="mt-auto rounded bg-brand py-1 text-center font-sans text-[10px] font-semibold text-white">
          Borrow
        </div>
      </div>
    </div>
  );
}

function BorrowsPreview() {
  return (
    <div className="w-full max-w-[13rem] space-y-2">
      <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/50 dark:text-cream/50">
        My Borrows
      </div>
      {[0, 1].map((i) => (
        <div key={i} className={`${miniBox} flex items-center gap-2 p-2`}>
          <div className="flex size-8 shrink-0 items-center justify-center rounded bg-ink/5 text-ink/25 dark:bg-cream/5 dark:text-cream/25">
            <BookIcon className="size-4" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="h-1.5 w-3/4 rounded bg-ink/20 dark:bg-cream/20" />
            <div className="h-1.5 w-1/2 rounded bg-ink/10 dark:bg-cream/10" />
          </div>
          <span className="inline-flex items-center gap-0.5 rounded-full border border-brand/25 bg-brand/10 px-1.5 py-0.5 font-sans text-[9px] font-semibold text-brand-dark dark:border-brand-light/25 dark:bg-brand/15 dark:text-brand-light">
            <CheckIcon className="size-2.5" />
            Borrowed
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Icons ---------- */

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

function ArrowIcon({ className }: { className?: string }) {
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}