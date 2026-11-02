"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { useAuth, useMounted } from "@/lib/auth";

const fieldClass =
  "h-11 w-full rounded-lg border border-ink/15 bg-cream px-3.5 font-sans text-sm text-ink outline-none transition placeholder:text-ink/35 hover:border-ink/25 focus:border-brand focus:ring-4 focus:ring-brand/15 dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:placeholder:text-cream/35 dark:hover:border-cream/25 dark:focus:border-brand-light dark:focus:ring-brand-light/20";

const primaryButton =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand font-sans text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-brand dark:focus-visible:outline-brand-light";

const MIN_PASSWORD_LENGTH = 8;

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { user, isPending } = useAuth();
  const mounted = useMounted();
  const isLogin = mode === "login";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(
        `Your password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
      );
      return;
    }

    if (!isLogin && !trimmedName) {
      setError("Please enter your full name.");
      return;
    }

    setSubmitting(true);

    try {
      const result = isLogin
        ? await authClient.signIn.email({
            email: trimmedEmail,
            password,
          })
        : await authClient.signUp.email({
            name: trimmedName,
            email: trimmedEmail,
            password,
          });

      if (result.error) {
        setError(
          result.error.message ??
            "We couldn't complete that request. Please try again.",
        );
        return;
      }

      router.replace(readNextPath());
      router.refresh();
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

  if (mounted && !isPending && user) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-ink/10 bg-cream px-6 py-10 text-center shadow-sm dark:border-cream/10 dark:bg-ink">
        <p className="font-sans text-sm text-ink/60 dark:text-cream/60">
          You&apos;re already signed in as
        </p>
        <p className="mt-1 text-xl font-bold text-ink dark:text-cream">
          {user.name}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 font-sans text-sm font-semibold text-cream transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:focus-visible:outline-brand-light"
          >
            Go to profile
          </Link>
          <Link
            href="/logout"
            className="inline-flex items-center justify-center rounded-lg border border-ink/15 bg-cream px-5 py-2.5 font-sans text-sm font-medium text-ink transition-colors hover:bg-brand/5 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:hover:bg-brand/10 dark:hover:text-brand-light dark:focus-visible:outline-brand-light"
          >
            Logout
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-2xl border border-ink/10 bg-cream shadow-[0_1px_2px_rgba(42,26,28,0.06),0_18px_40px_-24px_rgba(42,26,28,0.35)] dark:border-cream/10 dark:bg-ink dark:shadow-none"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-brand via-brand-light to-brand-soft" />

      <div className="p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-ink dark:text-cream">
          {isLogin ? "Welcome back" : "Create your account"}
        </h2>
        <p className="mt-2 font-sans text-sm leading-relaxed text-ink/60 dark:text-cream/60">
          {isLogin
            ? "Sign in to add books, borrow them, and keep track of your reading."
            : "Create a profile to start adding and borrowing books."}
        </p>

        <div className="mt-6 space-y-4">
          {!isLogin && (
            <div>
              <label
                htmlFor="name"
                className="mb-2 block font-sans text-sm font-medium text-ink/80 dark:text-cream/80"
              >
                Full name
                <span
                  className="ml-0.5 text-brand dark:text-brand-light"
                  aria-hidden="true"
                >
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
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block font-sans text-sm font-medium text-ink/80 dark:text-cream/80"
            >
              Email address
              <span
                className="ml-0.5 text-brand dark:text-brand-light"
                aria-hidden="true"
              >
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
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block font-sans text-sm font-medium text-ink/80 dark:text-cream/80"
            >
              Password
              <span
                className="ml-0.5 text-brand dark:text-brand-light"
                aria-hidden="true"
              >
                *
              </span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={isLogin ? "Your password" : "At least 8 characters"}
              className={fieldClass}
            />
            {!isLogin && (
              <p className="mt-1.5 font-sans text-xs text-ink/45 dark:text-cream/45">
                Use at least {MIN_PASSWORD_LENGTH} characters.
              </p>
            )}
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-brand/30 bg-brand/5 px-4 py-3 font-sans text-sm text-ink/80 dark:border-brand-light/30 dark:bg-brand/10 dark:text-cream/80"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className={`mt-6 ${primaryButton}`}
        >
          {submitting ? (
            <>
              <SpinnerIcon className="size-4 animate-spin" />
              {isLogin ? "Signing in…" : "Creating account…"}
            </>
          ) : isLogin ? (
            "Login"
          ) : (
            "Create account"
          )}
        </button>

        <p className="mt-5 text-center font-sans text-sm text-ink/55 dark:text-cream/55">
          {isLogin ? (
            <>
              New to BookHollow?{" "}
              <Link
                href="/register"
                className="font-semibold text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand-soft"
              >
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand-soft"
              >
                Login
              </Link>
            </>
          )}
        </p>
      </div>
    </form>
  );
}

function readNextPath(): string {
  const next = new URLSearchParams(window.location.search).get("next");

  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="9" className="opacity-25" />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </svg>
  );
}
