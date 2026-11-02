import type { Metadata } from "next";
import Link from "next/link";
import AllBooks from "@/components/AllBooks";

export const metadata: Metadata = {
  title: "All Books — BookHollow",
  description: "Browse every book currently on the BookHollow shelves.",
};

export default function AllBooksPage() {
  return (
    <main className="flex-1 bg-cream dark:bg-ink-900">
      <header className="relative isolate overflow-hidden border-b border-ink/10 bg-cream-dark dark:border-cream/10 dark:bg-ink">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-[-6rem] size-80 rounded-full bg-brand/10 blur-3xl dark:bg-brand/15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-8rem] left-[-4rem] size-72 rounded-full bg-brand-soft/30 blur-3xl dark:bg-brand/5"
        />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-3 font-sans text-[11px] font-semibold uppercase tracking-[0.35em] text-brand dark:text-brand-light">
              <span aria-hidden="true" className="h-px w-8 bg-brand/50 dark:bg-brand-light/50" />
              BookHollow
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink sm:text-5xl dark:text-cream">
              All Books
            </h1>
            <p className="mt-4 max-w-lg font-sans text-base leading-relaxed text-ink/60 dark:text-cream/60">
              Every story waiting on our shelves. Pick one up, borrow it for
              seven days, and bring it back when you&apos;re done.
            </p>
          </div>

          <Link
            href="/add-book"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-brand px-5 py-2.5 font-sans text-sm font-semibold text-cream shadow-sm transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:focus-visible:outline-brand-light"
          >
            <PlusIcon className="size-4" />
            Add a book
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <AllBooks />
      </div>
    </main>
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
