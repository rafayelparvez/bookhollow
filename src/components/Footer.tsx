import Image from "next/image";

const SITE = {
  name: "BookHollow",
  tagline:
    "A community-driven online library where you can share books from your own collection and borrow books you’ve always wanted to read.",
  email: "info@bookhollow.com",
  phone: "+880 1812 345 678",
  address: "Agrabad, Chattogram",
};

const SOCIAL = [
  { label: "X", href: "#", icon: XIcon },
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-ink/10 bg-ink/5 text-ink transition-colors duration-300 motion-reduce:transition-none dark:border-cream/10 dark:bg-cream/5 dark:text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3 md:gap-12">
        {/* Brand */}
        <div>
          <a href="/" aria-label={`${SITE.name} home`} className="inline-block">
            {/* Light mode logo */}
            <Image
              src="/images/bookhollow-logo-light.png"
              alt={SITE.name}
              width={220}
              height={56}
              className="h-14 w-auto dark:hidden"
            />
            {/* Dark mode logo */}
            <Image
              src="/images/bookhollow-logo-dark.png"
              alt={SITE.name}
              width={220}
              height={56}
              className="hidden h-14 w-auto dark:block"
            />
          </a>
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-ink/70 dark:text-cream/70">
            {SITE.tagline}
          </p>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-2xl font-bold">Contact</h2>
          <ul className="mt-5 space-y-4 text-lg text-ink/70 dark:text-cream/70">
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-3 transition-colors hover:text-ink dark:hover:text-cream"
              >
                <MailIcon className="h-6 w-6 shrink-0" />
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 transition-colors hover:text-ink dark:hover:text-cream"
              >
                <PhoneIcon className="h-6 w-6 shrink-0" />
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <PinIcon className="h-6 w-6 shrink-0" />
              {SITE.address}
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h2 className="text-2xl font-bold">Follow us</h2>
          <ul className="mt-5 flex gap-4">
            {SOCIAL.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-ink/10 bg-cream text-ink transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-cream/10 dark:bg-ink-900 dark:text-cream"
                >
                  <Icon className="h-6 w-6" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink/10 py-6 text-center text-lg text-ink/70 dark:border-cream/10 dark:text-cream/70">
        &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}

/* ---------- Inline icons (no extra dependency) ---------- */

type IconProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </svg>
  );
}

function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M5 4h3.5l1.7 4.2-2.1 1.4a11 11 0 0 0 5.3 5.3l1.4-2.1L19 14.5V18a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function PinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.3 4.7H5.5l11.2 14.5Z" />
    </svg>
  );
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12Z" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
    </svg>
  );
}