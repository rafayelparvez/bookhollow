"use client";

// src/components/category-section.tsx
// Home page section: books grouped by category. Fetches with the existing useBooks() hook.

import Link from "next/link";
import { useMemo, useState } from "react";
import { BOOK_GRID_CLASS, BookGrid } from "@/components/book-card";
import { useBooks } from "@/lib/books";

const ALL = "All";

const outlineButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-ink/15 bg-cream px-5 py-2.5 font-sans text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:hover:border-brand-light/40 dark:hover:bg-brand/10 dark:hover:text-brand-light dark:focus-visible:outline-brand-light";

export default function CategorySection({
  pageSize = 4,
  max = 8,
  title = "Browse by category",
  subtitle = "Pick a category and see what your neighbours are sharing.",
}: {
  /** How many books show at first, and how many each "Show more" adds */
  pageSize?: number;
  /** Max books shown on the page for the selected category */
  max?: number;
  title?: string;
  subtitle?: string;
}) {
  const { books, loading, error, retry } = useBooks();
  const [selected, setSelected] = useState<string>(ALL);
  const [count, setCount] = useState(pageSize);

  // Switching category starts again from the first page
  function selectCategory(name: string) {
    setSelected(name);
    setCount(pageSize);
  }

  // Categories sorted by number of books (most books first)
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const book of books) {
      const name = book.category?.trim();
      if (!name) continue;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, n]) => ({ name, count: n }));
  }, [books]);

  // If the selected category disappears (e.g. after a delete), fall back to All
  const active =
    selected === ALL || categories.some((c) => c.name === selected)
      ? selected
      : ALL;

  const visible = useMemo(() => {
    const list =
      active === ALL
        ? books
        : books.filter((book) => book.category?.trim() === active);
    return list.slice(0, Math.min(count, max));
  }, [books, active, count, max]);

  const totalInActive =
    active === ALL
      ? books.length
      : (categories.find((c) => c.name === active)?.count ?? 0);

  // Show more until we reach `max`; after that, link to the full list
  const canShowMore = visible.length < Math.min(totalInActive, max);
  const hasMoreBeyondMax = !canShowMore && totalInActive > visible.length;

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div
          role="alert"
          className="rounded-2xl border border-ink/10 bg-ink/5 p-8 text-center dark:border-cream/10 dark:bg-cream/5"
        >
          <p className="font-sans text-sm text-ink/70 dark:text-cream/70">
            We could not load the books right now.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            className={`mt-4 ${outlineButton}`}
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  // No books yet: nothing to browse by category
  if (books.length === 0) return null;

  const viewAllHref =
    active === ALL
      ? "/books"
      : `/books?category=${encodeURIComponent(active)}`;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-ink dark:text-cream">
          {title}
        </h2>
        <p className="mt-2 font-sans text-base text-ink/60 dark:text-cream/60">
          {subtitle}
        </p>
      </div>

      {/* Category chips */}
      <div
        className="mt-8 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter books by category"
      >
        <CategoryChip
          label={ALL}
          count={books.length}
          active={active === ALL}
          onClick={() => selectCategory(ALL)}
        />
        {categories.map(({ name, count: n }) => (
          <CategoryChip
            key={name}
            label={name}
            count={n}
            active={active === name}
            onClick={() => selectCategory(name)}
          />
        ))}
      </div>

      {/* Books */}
      <div className="mt-8">
        <BookGrid books={visible} />
      </div>

      {canShowMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setCount((c) => Math.min(c + pageSize, max))}
            className={outlineButton}
          >
            Show more
          </button>
        </div>
      )}

      {hasMoreBeyondMax && (
        <div className="mt-10 flex justify-center">
          <Link href={viewAllHref} className={outlineButton}>
            {active === ALL ? "View all books" : `View all ${active} books`}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      )}
    </section>
  );
}

function CategoryChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-sans text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand motion-reduce:transition-none dark:focus-visible:outline-brand-light ${
        active
          ? "border-brand bg-brand text-white"
          : "border-ink/15 bg-cream text-ink/70 hover:border-brand/40 hover:text-brand-dark dark:border-cream/15 dark:bg-ink-900 dark:text-cream/70 dark:hover:border-brand-light/40 dark:hover:text-brand-light"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 text-[11px] leading-5 ${
          active
            ? "bg-white/20 text-white"
            : "bg-ink/5 text-ink/50 dark:bg-cream/10 dark:text-cream/50"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function Skeleton() {
  const pulse = "animate-pulse motion-reduce:animate-none";
  const block = "bg-ink/10 dark:bg-cream/10";

  return (
    <section
      className="mx-auto w-full max-w-6xl px-6 py-16"
      aria-busy="true"
      aria-label="Loading books"
    >
      <div className={`h-8 w-64 rounded-md ${block} ${pulse}`} />
      <div className={`mt-3 h-4 w-80 max-w-full rounded-md ${block} ${pulse}`} />

      <div className="mt-8 flex flex-wrap gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-9 w-24 rounded-full ${block} ${pulse}`} />
        ))}
      </div>

      <div className={`mt-8 ${BOOK_GRID_CLASS}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-ink/10 dark:border-cream/10"
          >
            <div className={`aspect-[4/3] w-full ${block} ${pulse}`} />
            <div className="space-y-3 p-4">
              <div className={`h-4 w-20 rounded-full ${block} ${pulse}`} />
              <div className={`h-5 w-3/4 rounded-md ${block} ${pulse}`} />
              <div className={`h-4 w-1/2 rounded-md ${block} ${pulse}`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}