import type { Metadata } from "next";
import Link from "next/link";
import AllBooks from "@/components/AllBooks";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "All Books — BookHollow",
  description: "Browse every book currently on the BookHollow shelves.",
};

export default function AllBooksPage() {
  return (
    <main className="flex-1 bg-cream dark:bg-ink-900">
      <PageHeader
        title="All Books"
        description="Every story waiting on our shelves. Pick one up, borrow it for seven days, and bring it back when you're done."
      >
        <Link
          href="/add-book"
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-brand px-5 py-2.5 font-sans text-sm font-semibold text-cream shadow-sm transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:focus-visible:outline-brand-light"
        >
          <PlusIcon className="size-4" />
          Add a book
        </Link>
      </PageHeader>

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
