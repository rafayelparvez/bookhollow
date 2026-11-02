import type { Metadata } from "next";
import Link from "next/link";
import MyBorrows from "@/components/my-borrows";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "My Borrows — BookHollow",
  description: "Books you have borrowed from the BookHollow library.",
};

export default function MyBorrowsPage() {
  return (
    <main className="flex-1 bg-cream dark:bg-ink-900">
      <PageHeader
        title="My Borrows"
        description="The books currently on loan to you, all in one place."
      >
        <Link
          href="/books"
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-ink/15 bg-cream px-5 py-2.5 font-sans text-sm font-semibold text-ink shadow-sm transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:hover:border-brand-light/40 dark:hover:bg-brand/10 dark:hover:text-brand-light dark:focus-visible:outline-brand-light"
        >
          Browse books
        </Link>
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <MyBorrows />
      </div>
    </main>
  );
}
