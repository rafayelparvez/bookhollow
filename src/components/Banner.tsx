"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter, Playfair_Display } from "next/font/google";
import { useCallback, useEffect, useState } from "react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const AUTOPLAY_DELAY = 5000;

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
  image: { src: string; alt: string };
};

const slides: Slide[] = [
  {
    id: "borrow-return",
    eyebrow: "BookHollow",
    title: "Borrow, read, return. Repeat.",
    description:
      "Enjoy your favorite books for seven days. Borrow with ease and return them with just one click when you're done.",
    cta: { label: "Browse Books", href: "/books" },
    image: {
      src: "/images/Banner1.png",
      alt: "Warm library lounge with a leather armchair, reading lamp and shelves of books",
    },
  },
  {
    id: "discover-books",
    eyebrow: "BookHollow",
    title: "Find your next favorite story.",
    description:
      "Explore a world of stories, knowledge, and imagination. Discover books that inspire you, one page at a time.",
    cta: { label: "Explore Collection", href: "/books" },
    image: {
      src: "/images/Banner2.png",
      alt: "Cozy reading nook with an open book, steaming mug and shelves lit by evening light",
    },
  },
  {
    id: "reading-habit",
    eyebrow: "BookHollow",
    title: "Make every page count.",
    description:
      "Build a reading habit that lasts. Keep track of your borrowed books and make more time for the stories you love.",
    cta: { label: "Start Reading", href: "/register" },
    image: {
      src: "/images/Banner3.png",
      alt: "Curved wooden bookshelves filled with colorful books in a sunlit library",
    },
  },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light";

export default function Banner() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = slides.length;

  const goTo = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, AUTOPLAY_DELAY);

    return () => clearInterval(timer);
  }, [count, index, isPaused]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured from the BookHollow shelves"
      className={`relative isolate overflow-hidden bg-ink-900 text-cream ${inter.className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="relative h-[clamp(540px,78vh,760px)] w-full">
        {slides.map((slide, slideIndex) => {
          const isActive = slideIndex === index;

          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${slideIndex + 1} of ${count}`}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${
                isActive ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <Image
                src={slide.image.src}
                alt={slide.image.alt}
                fill
                preload={slideIndex === 0}
                sizes="100vw"
                className="object-cover object-center"
              />

              <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/60 to-black/10" />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-black/30" />

              <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 py-16 sm:px-10 lg:px-12">
                <div
                  className={`max-w-2xl transition-all duration-700 ease-out motion-reduce:transition-none ${
                    isActive
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-light sm:text-sm">
                    {slide.eyebrow}
                  </p>

                  <h2
                    className={`${playfair.className} mt-5 text-balance text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl xl:text-7xl`}
                  >
                    {slide.title}
                  </h2>

                  <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg">
                    {slide.description}
                  </p>

                  <Link
                    href={slide.cta.href}
                    tabIndex={isActive ? undefined : -1}
                    className={`mt-9 inline-flex items-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:text-base ${focusRing}`}
                  >
                    {slide.cta.label}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="Previous slide"
        className={`absolute right-16 bottom-5 z-20 flex size-10 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/15 sm:top-1/2 sm:right-auto sm:bottom-auto sm:left-5 sm:size-12 sm:-translate-y-1/2 ${focusRing}`}
      >
        <ChevronIcon direction="left" className="size-5 sm:size-6" />
      </button>

      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="Next slide"
        className={`absolute right-4 bottom-5 z-20 flex size-10 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/15 sm:top-1/2 sm:bottom-auto sm:right-5 sm:size-12 sm:-translate-y-1/2 ${focusRing}`}
      >
        <ChevronIcon direction="right" className="size-5 sm:size-6" />
      </button>

      <div className="absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-2.5">
        {slides.map((slide, slideIndex) => {
          const isActive = slideIndex === index;

          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(slideIndex)}
              aria-label={`Go to slide ${slideIndex + 1}: ${slide.title}`}
              aria-current={isActive ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                isActive
                  ? "w-7 bg-brand"
                  : "w-2 bg-white/45 hover:bg-white/75"
              } ${focusRing}`}
            />
          );
        })}
      </div>
    </section>
  );
}

function ChevronIcon({
  direction,
  className,
}: {
  direction: "left" | "right";
  className?: string;
}) {
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
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}
