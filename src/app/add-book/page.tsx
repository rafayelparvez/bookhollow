import type { Metadata } from "next";
import AddBookForm from "@/components/add-book-form";

export const metadata: Metadata = {
  title: "Add a Book — BookHollow",
  description: "Put a book from your shelf into the BookHollow library.",
};

const tips = [
  {
    title: "A cover readers recognise",
    body: "A square or portrait image under 2 MB works best. It is the first thing people see on the shelf.",
  },
  {
    title: "Count the copies you can lend",
    body: "Set the total copies to what you can actually share. Availability updates as books are borrowed.",
  },
  {
    title: "Keep the description short",
    body: "A sentence or two is enough to help someone decide whether this story is for them.",
  },
];

export default function AddBookPage() {
  return (
    <main className="flex-1 bg-cream dark:bg-ink-900">
      <header className="relative isolate overflow-hidden border-b border-ink/10 bg-cream-dark dark:border-cream/10 dark:bg-ink">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-[-6rem] size-80 rounded-full bg-brand/10 blur-3xl dark:bg-brand/15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-8rem] right-[-4rem] size-72 rounded-full bg-brand-soft/30 blur-3xl dark:bg-brand/5"
        />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="flex items-center gap-3 font-sans text-[11px] font-semibold uppercase tracking-[0.35em] text-brand dark:text-brand-light">
            <span
              aria-hidden="true"
              className="h-px w-8 bg-brand/50 dark:bg-brand-light/50"
            />
            BookHollow
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink sm:text-5xl dark:text-cream">
            Add a Book
          </h1>
          <p className="mt-4 max-w-lg font-sans text-base leading-relaxed text-ink/60 dark:text-cream/60">
            Put a book from your shelf into the library. Fill in the details
            below and it will appear for everyone to borrow.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] lg:items-start">
          <aside className="lg:sticky lg:top-28">
            <div className="rounded-2xl border border-ink/10 bg-cream-dark/50 p-6 sm:p-7 dark:border-cream/10 dark:bg-ink">
              <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45 dark:text-cream/45">
                Before you add
              </h2>

              <ol className="mt-5 space-y-5">
                {tips.map((tip, index) => (
                  <li key={tip.title} className="flex gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/10 font-sans text-xs font-bold text-brand-dark dark:bg-brand/15 dark:text-brand-light">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-sans text-sm font-semibold text-ink dark:text-cream">
                        {tip.title}
                      </p>
                      <p className="mt-1 font-sans text-sm leading-relaxed text-ink/55 dark:text-cream/55">
                        {tip.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="mt-6 border-t border-ink/10 pt-5 font-sans text-xs leading-relaxed text-ink/45 dark:border-cream/10 dark:text-cream/45">
                Your name and email are attached automatically so readers know
                who added the book.
              </p>
            </div>
          </aside>

          <div>
            <AddBookForm />
          </div>
        </div>
      </div>
    </main>
  );
}
