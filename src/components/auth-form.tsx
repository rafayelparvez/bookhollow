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

const MIN_PASSWORD_LENGTH = 6;

const GOOGLE_AUTH_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim(),
);

const googleButton =
  "mt-3 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-lg border border-ink/15 bg-cream font-sans text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-70 dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:hover:border-brand-light/40 dark:hover:bg-brand/10 dark:hover:text-brand-light dark:focus-visible:outline-brand-light";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { user, isPending } = useAuth();
  const mounted = useMounted();
  const isLogin = mode === "login";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

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

    const trimmedPhoto = photoUrl.trim();

    if (trimmedPhoto) {
      try {
        const parsed = new URL(trimmedPhoto);
        if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
          throw new Error("unsupported protocol");
        }
      } catch {
        setError("Please enter a valid photo URL starting with https://.");
        return;
      }
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
            ...(trimmedPhoto ? { image: trimmedPhoto } : {}),
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

  async function handleGoogle() {
    setError("");

    if (!GOOGLE_AUTH_ENABLED) {
      setError(
        "Google sign-in isn't configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local, then restart the dev server.",
      );
      return;
    }

    setOauthLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: readNextPath(),
      });

      if (result?.error) {
        setError(
          result.error.message ??
            "Google sign-in could not be started. Please try again.",
        );
        setOauthLoading(false);
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Google sign-in could not be started. Please try again.",
      );
      setOauthLoading(false);
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

          {!isLogin && (
            <div>
              <label
                htmlFor="photoUrl"
                className="mb-2 block font-sans text-sm font-medium text-ink/80 dark:text-cream/80"
              >
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
                Optional. Shown on your profile and in the navbar.
              </p>
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

            {isLogin && (
              <p
                className="mt-2 text-sm font-sans text-ink/45 dark:text-cream/45"
                style={{ lineHeight: 1.5 }}
              >
                <a
                  href="#"
                  className="font-medium text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand-soft"
                  onClick={(e) => {
                    e.preventDefault();
                    setError("Password reset isn't available yet — contact an admin.");
                  }}
                >
                  Forgot password?
                </a>
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

        <div className="mt-5 flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-ink/10 dark:bg-cream/10" />
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40 dark:text-cream/40">
            or
          </span>
          <span className="h-px flex-1 bg-ink/10 dark:bg-cream/10" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={oauthLoading}
          aria-busy={oauthLoading}
          className={googleButton}
        >
          {oauthLoading ? (
            <SpinnerIcon className="size-4 animate-spin" />
          ) : (
            <GoogleIcon className="size-4" />
          )}
          {oauthLoading
            ? "Redirecting…"
            : isLogin
              ? "Sign in with Google"
              : "Sign up with Google"}
        </button>

        {!GOOGLE_AUTH_ENABLED && (
          <p className="mt-2 text-center font-sans text-[11px] leading-relaxed text-ink/40 dark:text-cream/40">
            Add Google OAuth credentials to .env.local to enable this button.
          </p>
        )}

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

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.47a5.53 5.53 0 0 1-2.4 3.63v3.02h3.89c2.27-2.09 3.56-5.17 3.56-8.76Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.89-3.02c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.12A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27a7.2 7.2 0 0 1 0-4.54V6.61H1.27a12 12 0 0 0 0 10.78l4.01-3.12Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.78c1.76 0 3.34.61 4.59 1.79l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4.01 3.12C6.22 6.89 8.87 4.78 12 4.78Z"
      />
    </svg>
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
