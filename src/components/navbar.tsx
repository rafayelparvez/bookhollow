"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/theme-toggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
  { href: "/add-book", label: "Add Book" },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light";

export default function Navbar() {
  const pathname = usePathname();
  // The menu is tied to the route it was opened on, so a route change closes it
  // automatically without a state-syncing effect.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  const closeMenu = () => setOpenPath(null);

  // Escape press korle bondho
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPath(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Desktop size e gele menu reset
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpenPath(null);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-cream/10 bg-ink-900 dark:bg-ink">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 md:h-20 md:gap-10"
      >
        <Link href="/" className={`flex shrink-0 items-center ${focusRing}`}>
          <Image
            src="/images/bookhollow-logo-dark.png"
            alt="BookHollow"
            width={1822}
            height={400}
            sizes="182px"
            preload
            className="h-8 w-auto md:h-10"
          />
        </Link>

        {/* Desktop links */}
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
          <ThemeToggle />

          {/* Desktop buttons */}
          <Link
            href="/login"
            className={`hidden rounded-lg border border-cream/15 bg-ink px-5 py-2 text-sm font-medium text-cream transition-colors hover:bg-cream/10 md:inline-flex dark:bg-ink-900 ${focusRing}`}
          >
            Login
          </Link>

          <Link
            href="/register"
            className={`hidden rounded-lg bg-brand px-5 py-2 text-sm font-medium text-cream transition-colors hover:bg-brand-dark md:inline-flex ${focusRing}`}
          >
            Register
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpenPath((current) => (current === pathname ? null : pathname))}
            className={`flex size-10 items-center justify-center rounded-lg text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream md:hidden ${focusRing}`}
          >
            {open ? (
              <CloseIcon className="size-6" />
            ) : (
              <MenuIcon className="size-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`md:hidden ${open ? "block" : "hidden"} border-t border-cream/10 bg-ink-900 dark:bg-ink`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 font-sans sm:px-6">
          <ul className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;

              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeMenu}
                    aria-current={isActive ? "page" : undefined}
                    className={`block rounded-lg px-3 py-3 text-base transition-colors hover:bg-cream/5 hover:text-cream ${focusRing} ${
                      isActive ? "text-brand-light" : "text-cream/65"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-cream/10 pt-4">
            <Link
              href="/login"
              className={`inline-flex items-center justify-center rounded-lg border border-cream/15 bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-cream/10 dark:bg-ink-900 ${focusRing}`}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={`inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-brand-dark ${focusRing}`}
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuIcon({ className }: { className?: string }) {
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
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
