"use client";

import Link from "next/link";
import AuthGate from "@/components/auth-gate";
import UserAvatar from "@/components/user-avatar";
import { useCurrentUser } from "@/lib/auth";
import { useMyBorrows } from "@/lib/borrows";
import { isBookAddedByUser, useBooks } from "@/lib/books";

export default function ProfileContent() {
  return (
    <AuthGate nextPath="/profile">
      <ProfileDetails />
    </AuthGate>
  );
}

function ProfileDetails() {
  const user = useCurrentUser();
  const { books } = useBooks();
  const borrows = useMyBorrows();

  if (!user) return null;

  const addedCount = books.filter((book) => isBookAddedByUser(book, user)).length;
  // useMyBorrows already returns only the signed-in user's active borrows
  const borrowCount = borrows.length;

  const initials = user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const stats = [
    { label: "Books added", value: addedCount, href: "/my-books" },
    { label: "Books borrowed", value: borrowCount, href: "/my-borrows" },
  ];

  const actions = [
    { href: "/my-books", label: "My Books" },
    { href: "/my-borrows", label: "My Borrows" },
    { href: "/add-book", label: "Add a Book" },
    { href: "/logout", label: "Logout" },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <section className="overflow-hidden rounded-2xl border border-ink/10 bg-cream shadow-sm dark:border-cream/10 dark:bg-ink">
        <div className="h-1 w-full bg-linear-to-r from-brand via-brand-light to-brand-soft" />

        <div className="flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:items-center sm:p-8 sm:text-left">
          <UserAvatar
            src={user.image}
            name={user.name}
            initials={initials || undefined}
            className="size-20"
            textClassName="text-2xl"
            alt={`Profile photo of ${user.name}`}
          />
          <div className="min-w-0">
            <h2 className="truncate text-3xl font-bold text-ink dark:text-cream">
              {user.name}
            </h2>
            <p className="mt-1 truncate font-sans text-sm text-ink/55 dark:text-cream/55">
              {user.email}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-2xl border border-ink/10 bg-cream p-6 transition-colors hover:border-brand/30 hover:bg-brand/5 dark:border-cream/10 dark:bg-ink dark:hover:border-brand-light/40 dark:hover:bg-brand/10"
          >
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45 dark:text-cream/45">
              {stat.label}
            </p>
            <p className="mt-2 text-4xl font-bold text-ink group-hover:text-brand-dark dark:text-cream dark:group-hover:text-brand-light">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-ink/10 bg-cream p-6 dark:border-cream/10 dark:bg-ink">
        <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45 dark:text-cream/45">
          Quick links
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {actions.map((action) =>
            action.href === "/logout" ? (
              <Link
                key={action.href}
                href={action.href}
                className="inline-flex items-center justify-center rounded-lg border border-brand/25 bg-brand/5 px-5 py-2.5 font-sans text-sm font-semibold text-brand-dark transition-colors hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-brand-light/25 dark:bg-brand/10 dark:text-brand-light dark:hover:bg-brand/15 dark:focus-visible:outline-brand-light"
              >
                {action.label}
              </Link>
            ) : (
              <Link
                key={action.href}
                href={action.href}
                className="inline-flex items-center justify-center rounded-lg border border-ink/15 bg-cream px-5 py-2.5 font-sans text-sm font-medium text-ink transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:hover:border-brand-light/40 dark:hover:bg-brand/10 dark:hover:text-brand-light dark:focus-visible:outline-brand-light"
              >
                {action.label}
              </Link>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
