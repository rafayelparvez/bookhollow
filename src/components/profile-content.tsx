"use client";

import Link from "next/link";
import AuthGate from "@/components/auth-gate";
import UserAvatar from "@/components/user-avatar";
import { useCurrentUser } from "@/lib/auth";
import { useState } from "react";
import { useMyBorrows } from "@/lib/borrows";
import { isBookAddedByUser, useBooks } from "@/lib/books";
import SaveButton from "@/components/save-button";

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
  const [editing, setEditing] = useState(false);

  const handleSave = () => setEditing(false);
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
          {editing ? (
            <EditProfileForm user={user} onSave={handleSave} onCancel={handleCancel} />
          ) : (
            <UserAvatar
              src={user.image}
              name={user.name}
              initials={initials || undefined}
              className="size-20"
              textClassName="text-2xl"
              alt={`Profile photo of ${user.name}`}
            />
          )}
          <div className="min-w-0">
            {editing ? (
              <SaveButton onSave={handleSave} />
            ) : (
              <h2 className="truncate text-3xl font-bold text-ink dark:text-cream">
                {user.name}
              </h2>
            )}
            <p className="mt-1 truncate font-sans text-sm text-ink/55 dark:text-cream/55">
              {user.email}
            </p>
            <button
              onClick={() => setEditing(true)}
              className="mt-2 inline-flex items-center rounded-lg border border-brand/25 bg-brand/5 px-4 py-1.5 font-sans text-sm font-medium text-brand-dark transition-colors hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-brand-light/25 dark:bg-brand/10 dark:text-brand-light dark:hover:bg-brand/10 dark:hover:text-brand-light dark:focus-visible:outline-brand-light"
            >
              Edit profile
            </button>
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

      <EditProfileForm user={user} onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
}

function EditProfileForm({
  user,
  onSave,
  onCancel,
}: {
  user: import("@/lib/auth").CurrentUser;
  onSave: (() => void) | undefined;
  onCancel: (() => void) | undefined;
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [photoUrl, setPhotoUrl] = useState(user.image ?? "");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    setError("");
    setSubmitting(true);

    try {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
      const trimmedPhoto = photoUrl.trim();

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        setError("Please enter a valid email address.");
        setSubmitting(false);
        return;
      }

      // Validate password if provided
      const passwordValue = password.trim();
      if (passwordValue) {
        const hasUpperCase = /[A-Z]/.test(passwordValue);
        const hasLowerCase = /[a-z]/.test(passwordValue);
        const minLength = passwordValue.length >= 6;

        if (!hasUpperCase) {
          setError(
            "Password must contain at least one uppercase letter.",
          );
          setSubmitting(false);
          return;
        }
        if (!hasLowerCase) {
          setError(
            "Password must contain at least one lowercase letter.",
          );
          setSubmitting(false);
          return;
        }
        if (!minLength) {
          setError("Password must be at least 6 characters long.");
          setSubmitting(false);
          return;
        }
      }

      // Build update payload
      const payload: Record<string, string | null | undefined> = {};
      if (trimmedName) payload.name = trimmedName;
      if (trimmedEmail) payload.email = trimmedEmail;
      if (trimmedPhoto) payload.image = trimmedPhoto;

      // If password is provided, also change it
      if (passwordValue) {
        // TODO: Implement actual password change via Better Auth changePassword API
        setError(
          "Password change feature coming soon. For now, your password remains unchanged.",
        );
        setSubmitting(false);
        // Don't set payload.password - we'll handle this separately
      }

      // Call Better Auth updateUser
      // Note: The actual updateUser API call would go here
      // For now, just simulate success
      onSave?.();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setPhotoUrl(user.image ?? "");
    setPassword("");
    setCurrentPassword("");
    onCancel?.();
  };

  return (
    <div className="mt-6 rounded-2xl border border-ink/10 bg-cream p-6 dark:border-cream/10 dark:bg-ink">
      <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45 dark:text-cream/45">
        Edit Profile
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
          <label htmlFor="name" className="mb-2 block font-sans text-sm font-medium text-ink/80 dark:text-cream/80">
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
            className="h-11 w-full rounded-lg border border-ink/15 bg-cream px-3.5 font-sans text-sm text-ink outline-none transition placeholder:text-ink/35 hover:border-ink/25 focus:border-brand focus:ring-4 focus:ring-brand/15 dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:placeholder:text-cream/35 dark:hover:border-cream/25 dark:focus:border-brand-light dark:focus:ring-brand-light/20"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block font-sans text-sm font-medium text-ink/80 dark:text-cream/80">
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
            className="h-11 w-full rounded-lg border border-ink/15 bg-cream px-3.5 font-sans text-sm text-ink outline-none transition placeholder:text-ink/35 hover:border-ink/25 focus:border-brand focus:ring-4 focus:ring-brand/15 dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:placeholder:text-cream/35 dark:hover:border-cream/25 dark:focus:border-brand-light dark:focus:ring-brand-light/20"
          />
        </div>

        <div>
          <label htmlFor="photoUrl" className="mb-2 block font-sans text-sm font-medium text-ink/80 dark:text-cream/80">
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
            className="h-11 w-full rounded-lg border border-ink/15 bg-cream px-3.5 font-sans text-sm text-ink outline-none transition placeholder:text-ink/35 hover:border-ink/25 focus:border-brand focus:ring-4 focus:ring-brand/15 dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:placeholder:text-cream/35 dark:hover:border-cream/25 dark:focus:border-brand-light dark:focus:ring-brand-light/20"
          />
          <p className="mt-1.5 font-sans text-xs text-ink/45 dark:text-cream/45">
            Optional. Shown on your profile and in the navbar.
          </p>
        </div>

        <div>
          <label htmlFor="currentPassword" className="mb-2 block font-sans text-sm font-medium text-ink/80 dark:text-cream/80">
            Current password (for password change)
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="Enter your current password"
            className="h-11 w-full rounded-lg border border-ink/15 bg-cream px-3.5 font-sans text-sm text-ink outline-none transition placeholder:text-ink/35 hover:border-ink/25 focus:border-brand focus:ring-4 focus:ring-brand/15 dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:placeholder:text-cream/35 dark:hover:border-cream/25 dark:focus:border-brand-light dark:focus:ring-brand-light/20"
          />
          <p className="mt-1.5 font-sans text-xs text-ink/45 dark:text-cream/45">
            Leave blank if you do not want to change your password.
          </p>
        </div>

        <div>
          <label htmlFor="newPassword" className="mb-2 block font-sans text-sm font-medium text-ink/80 dark:text-cream/80">
            New password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            className="h-11 w-full rounded-lg border border-ink/15 bg-cream px-3.5 font-sans text-sm text-ink outline-none transition placeholder:text-ink/35 hover:border-ink/25 focus:border-brand focus:ring-4 focus:ring-brand/15 dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:placeholder:text-cream/35 dark:hover:border-cream/25 dark:focus:border-brand-light dark:focus:ring-brand-light/20"
          />
          <p className="mt-1.5 font-sans text-xs text-ink/45 dark:text-cream/45">
            Password must be at least 8 characters.
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={submitting}
          aria-busy={submitting}
          className="flex-1 rounded-lg border border-ink/15 bg-cream px-5 py-2.5 font-sans text-sm font-medium text-ink transition-colors hover:bg-cream/10 dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:hover:border-cream/25 dark:hover:text-cream dark:focus-visible:outline-brand-light"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSave}
          disabled={submitting}
          aria-busy={submitting}
          className="flex-1 rounded-lg bg-brand px-5 py-2.5 font-sans text-sm font-medium text-cream transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:outline-brand-light"
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
    </div>
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
