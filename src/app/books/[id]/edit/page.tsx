import type { Metadata } from "next";
import Link from "next/link";
import EditBookForm from "@/components/edit-book-form";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Edit Book — BookHollow",
  description: "Update the details of a book you added to BookHollow.",
};

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="flex-1 bg-cream dark:bg-ink-900">
      <PageHeader
        title="Edit Book"
        description="Update the details of a book you added to the library."
      >
        <Link
          href={`/books/${id}`}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-ink/15 bg-cream px-5 py-2.5 font-sans text-sm font-semibold text-ink shadow-sm transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:hover:border-brand-light/40 dark:hover:bg-brand/10 dark:hover:text-brand-light dark:focus-visible:outline-brand-light"
        >
          <ArrowLeftIcon className="size-4" />
          Back to details
        </Link>
      </PageHeader>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
        <EditBookForm bookId={id} />
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
