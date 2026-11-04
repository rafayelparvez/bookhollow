"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import AuthGate from "@/components/auth-gate";
import UserAvatar from "@/components/user-avatar";
import { authClient } from "@/lib/auth-client";
import { useCurrentUser } from "@/lib/auth";
import { useMyBorrows } from "@/lib/borrows";
import { isBookAddedByUser, useBooks } from "@/lib/books";
import { isHttpUrl } from "@/lib/files";
import { getPasswordError } from "@/lib/password";
import type { CurrentUser } from "@/lib/auth";

export default function ProfileContent() {
  return (
    <AuthGate nextPath="/profile">
      <ProfileDetails />
    </AuthGate>
  );
}

const fieldClass =
  "h-11 w-full rounded-lg border border-ink/15 bg-cream px-3.5 font-sans text-sm text-ink outline-none transition placeholder:text-ink/35 hover:border-ink/25 focus:border-brand focus:ring-4 focus:ring-brand/15 dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:placeholder:text-cream/35 dark:hover:border-cream/25 dark:focus:border-brand-light dark:focus:ring-brand-light/20";

const labelClass =
  "mb-2 block font-sans text-sm font-medium text-ink/80 dark:text-cream/80";

function ProfileDetails() {
  const user = useCurrentUser();
  const { books } = useBooks();
  const borrows = useMyBorrows();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
  };
  const handleCancel = () => setEditing(false);

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
            {saved && !editing && (
              <p
                role="status"
                className="mt-2 inline-flex items-center gap-1.5 font-sans text-xs font-medium text-brand-dark dark:text-brand-light"
              >
                <CheckIcon className="size-4" />
                Profile updated.
              </p>
            )}
            {!editing && (
              <button
                onClick={() => {
                  setSaved(false);
                  setEditing(true);
                }}
                className="mt-2 inline-flex items-center rounded-lg border border-brand/25 bg-brand/5 px-4 py-1.5 font-sans text-sm font-medium text-brand-dark transition-colors hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-brand-light/25 dark:bg-brand/10 dark:text-brand-light dark:hover:bg-brand/10 dark:hover:text-brand-light dark:focus-visible:outline-brand-light"
              >
                Edit profile
              </button>
            )}
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

      {editing && (
        <EditProfileForm user={user} onSave={handleSave} onCancel={handleCancel} />
      )}
    </div>
  );
}

function EditProfileForm({
  user,
  onSave,
  onCancel,
}: {
  user: CurrentUser;
  onSave: () => void;
  onCancel: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [photoUrl, setPhotoUrl] = useState(user.image ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhoto = photoUrl.trim();

    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (trimmedPhoto && !isHttpUrl(trimmedPhoto)) {
      setError("Please enter a valid photo URL starting with http:// or https://.");
      return;
    }

    // Passwords are intentionally not trimmed — spaces can be significant.
    const passwordRequested = newPassword.length > 0 || currentPassword.length > 0;
    if (passwordRequested) {
      if (!currentPassword) {
        setError("Enter your current password to set a new one.");
        return;
      }
      const passwordProblem = getPasswordError(newPassword);
      if (passwordProblem) {
        setError(passwordProblem);
        return;
      }
    }

    setSubmitting(true);

    try {
      // 1) Name + photo. (Empty URL clears the photo.)
      const updateResult = await authClient.updateUser({
        name: trimmedName,
        image: trimmedPhoto || null,
      });
      if (updateResult.error) {
        throw new Error(
          updateResult.error.message ?? "Could not update your profile.",
        );
      }

      // 2) Email change (optional). No verification service is configured,
      // so the change applies immediately for unverified accounts.
      if (trimmedEmail.toLowerCase() !== user.email.toLowerCase()) {
        const emailResult = await authClient.changeEmail({ newEmail: trimmedEmail });
        if (emailResult?.error) {
          throw new Error(
            emailResult.error.message ?? "Could not change your email address.",
          );
        }
      }

      // 3) Password change (optional).
      if (passwordRequested) {
        const passwordResult = await authClient.changePassword({
          currentPassword,
          newPassword,
          revokeOtherSessions: false,
        });
        if (passwordResult.error) {
          throw new Error(
            passwordResult.error.message ??
              "Could not change your password. Check your current password.",
          );
        }
      }

      setCurrentPassword("");
      setNewPassword("");
      router.refresh();
      onSave();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-2xl border border-ink/10 bg-cream p-6 shadow-sm dark:border-cream/10 dark:bg-ink"
    >
      <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45 dark:text-cream/45">
        Edit profile
      </h2>

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-brand/30 bg-brand/5 px-4 py-3 font-sans text-sm text-ink/80 dark:border-brand-light/30 dark:bg-brand/10 dark:text-cream/80"
        >
          {error}
        </p>
      )}

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name
            <span className="ml-0.5 text-brand dark:text-brand-light" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Forhad Hossen"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email address
            <span className="ml-0.5 text-brand dark:text-brand-light" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={fieldClass}
          />
          <p className="mt-1.5 font-sans text-xs text-ink/45 dark:text-cream/45">
            A new email address takes effect immediately.
          </p>
        </div>

        <div>
          <label htmlFor="photoUrl" className={labelClass}>
            Photo URL
          </label>
          <input
            id="photoUrl"
            name="photoUrl"
            type="url"
            autoComplete="url"
            value={photoUrl}
            onChange={(event) => setPhotoUrl(event.target.value)}
            placeholder="https://example.com/your-photo.jpg"
            className={fieldClass}
          />
          <p className="mt-1.5 font-sans text-xs text-ink/45 dark:text-cream/45">
            Optional. Shown on your profile and in the navbar. Leave empty to
            remove your photo.
          </p>
        </div>

        <div>
          <label htmlFor="currentPassword" className={labelClass}>
            Current password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="Enter your current password"
            className={fieldClass}
          />
          <p className="mt-1.5 font-sans text-xs text-ink/45 dark:text-cream/45">
            Required only if you set a new password.
          </p>
        </div>

        <div>
          <label htmlFor="newPassword" className={labelClass}>
            New password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="At least 6 characters"
            className={fieldClass}
          />
          <p className="mt-1.5 font-sans text-xs text-ink/45 dark:text-cream/45">
            At least 6 characters, with one uppercase and one lowercase letter.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-lg border border-ink/15 bg-cream px-5 py-2.5 font-sans text-sm font-medium text-ink transition-colors hover:bg-cream/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60 dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:hover:border-cream/25 dark:focus-visible:outline-brand-light"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2.5 font-sans text-sm font-medium text-cream transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-brand dark:focus-visible:outline-brand-light"
        >
          {submitting ? (
            <>
              <SpinnerIcon className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </form>
  );
}

function CheckIcon({ className }: { className?: string }) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="9" className="opacity-25" />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </svg>
  );
}
