import type { Metadata } from "next";
import Link from "next/link";
import BookDetails from "@/components/book-details";

export const metadata: Metadata = {
  title: "Book Details — BookHollow",
  description: "View a book and borrow it from the BookHollow library.",
};

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="flex-1 bg-cream dark:bg-ink-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/books"
          className="inline-flex items-center gap-2 rounded-sm font-sans text-sm font-medium text-ink/60 transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:text-cream/60 dark:hover:text-brand-light dark:focus-visible:outline-brand-light"
        >
          <ArrowLeftIcon className="size-4" />
          All Books
        </Link>

        <div className="mt-8">
          <BookDetails bookId={id} />
        </div>
      </div>
    </main>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
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
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}
