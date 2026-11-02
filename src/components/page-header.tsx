import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export default function PageHeader({
  eyebrow = "BookHollow",
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
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
            <span
              aria-hidden="true"
              className="h-px w-8 bg-brand/50 dark:bg-brand-light/50"
            />
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink sm:text-5xl dark:text-cream">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-lg font-sans text-base leading-relaxed text-ink/60 dark:text-cream/60">
              {description}
            </p>
          )}
        </div>

        {children && <div className="shrink-0">{children}</div>}
      </div>
    </header>
  );
}
