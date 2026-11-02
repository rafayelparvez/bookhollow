"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth, useMounted } from "@/lib/auth";

export default function AuthGate({
  children,
  nextPath,
}: {
  children: ReactNode;
  nextPath?: string;
}) {
  const { user, isPending } = useAuth();
  const mounted = useMounted();

  if (!mounted || isPending) {
    return (
      <div className="flex justify-center py-16">
        <span
          className="size-7 animate-spin rounded-full border-2 border-brand/25 border-t-brand dark:border-cream/20 dark:border-t-brand-light"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!user) {
    const loginHref = nextPath
      ? `/login?next=${encodeURIComponent(nextPath)}`
      : "/login";

    return (
      <section className="mx-auto max-w-md rounded-2xl border border-ink/10 bg-cream px-6 py-10 text-center shadow-sm dark:border-cream/10 dark:bg-ink">
        <LockIcon className="mx-auto size-10 text-brand dark:text-brand-light" />
        <h2 className="mt-4 text-2xl font-bold text-ink dark:text-cream">
          Please sign in
        </h2>
        <p className="mt-2 font-sans text-sm leading-relaxed text-ink/60 dark:text-cream/60">
          You need to be signed in to view this page.
        </p>
        <Link
          href={loginHref}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 font-sans text-sm font-semibold text-cream transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:focus-visible:outline-brand-light"
        >
          Login
        </Link>
      </section>
    );
  }

  return <>{children}</>;
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 15v2" />
    </svg>
  );
}
