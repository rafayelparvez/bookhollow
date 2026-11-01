"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink-900">
      <nav
        aria-label="Main"
        className="mx-auto flex h-20 max-w-7xl items-center gap-10 px-6"
      >
        <Link href="/" className={`flex shrink-0 items-center ${focusRing}`}>
          <Image
            src="/images/bookhollow-logo-dark.png"
            alt="BookHollow"
            width={1822}
            height={400}
            sizes="182px"
            priority
            className="h-10 w-auto"
          />
        </Link>

        <ul className="hidden items-center gap-8 font-sans text-sm md:flex">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;

            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-sm transition-colors hover:text-cream ${focusRing} ${
                    isActive ? "text-brand-light" : "text-cream/65"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-3 font-sans">
          <button
            type="button"
            aria-label="Toggle theme"
            className={`flex size-10 items-center justify-center rounded-lg text-cream/70 transition-colors hover:bg-white/10 hover:text-cream ${focusRing}`}
          >
            <SunIcon className="size-5" />
          </button>

          <Link
            href="/login"
            className={`hidden rounded-lg border border-white/10 bg-ink px-5 py-2 text-sm font-medium text-cream transition-colors hover:bg-white/10 sm:inline-flex ${focusRing}`}
          >
            Login
          </Link>

          <Link
            href="/register"
            className={`inline-flex rounded-lg bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark ${focusRing}`}
          >
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}

function SunIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}
