// src/components/top-categories.tsx
// Static section: highlights popular book categories.

import Link from "next/link";

const CATEGORIES = [
  { name: "Fiction", blurb: "Stories that spark imagination." },
  { name: "Mystery", blurb: "Puzzles worth staying up for." },
  { name: "Fantasy", blurb: "Worlds beyond the ordinary." },
  { name: "Science Fiction", blurb: "Ideas from tomorrow." },
  { name: "Romance", blurb: "Hearts and happy endings." },
  { name: "Biography", blurb: "Real lives, real lessons." },
];

export default function TopCategories() {
  return (
    <section
      aria-labelledby="top-categories-title"
      className="border-y border-ink/10 bg-ink/5 dark:border-cream/10 dark:bg-cream/5"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="max-w-2xl">
          <h2
            id="top-categories-title"
            className="text-3xl font-bold tracking-tight text-ink dark:text-cream"
          >
            Top Categories
          </h2>
          <p className="mt-2 font-sans text-base text-ink/60 dark:text-cream/60">
            Jump straight into the genres our readers love most.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <li key={category.name}>
              <Link
                href={`/books?category=${encodeURIComponent(category.name)}`}
                className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-cream p-5 shadow-sm transition-colors hover:border-brand/40 hover:bg-brand/5 dark:border-cream/10 dark:bg-ink dark:hover:border-brand-light/40 dark:hover:bg-brand/10"
              >
                <span className="inline-flex w-fit items-center rounded-full border border-brand/25 bg-brand/10 px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-dark dark:border-brand-light/25 dark:bg-brand/15 dark:text-brand-light">
                  {category.name}
                </span>
                <p className="mt-3 font-sans text-sm leading-relaxed text-ink/65 dark:text-cream/60">
                  {category.blurb}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 font-sans text-sm font-semibold text-brand-dark group-hover:text-brand dark:text-brand-light">
                  Browse
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}