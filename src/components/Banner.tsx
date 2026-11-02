"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent, PointerEvent } from "react";

const AUTOPLAY_DELAY = 5000;
const SWIPE_THRESHOLD = 50; // px

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
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const didSwipe = useRef(false);
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

  // Hover pause shudhu mouse e, touch e na
  const handlePointerEnter = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse") setIsPaused(true);
  };

  const handlePointerLeave = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse") {
      setIsPaused(false);
      pointerStart.current = null; // drag korte korte bahire gele cancel
    }
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    // Mouse e shudhu left click
    if (e.pointerType === "mouse" && e.button !== 0) return;
    didSwipe.current = false;
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;

    const deltaX = e.clientX - start.x;
    const deltaY = e.clientY - start.y;

    // Chhoto movement ba vertical movement hole ignore (normal click/scroll)
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    if (Math.abs(deltaX) < Math.abs(deltaY)) return;

    // Drag er por CTA link e accidental click jeno na hoy
    didSwipe.current = true;

    // Left drag = next, right drag = previous
    goTo(deltaX < 0 ? index + 1 : index - 1);
  };

  const handleClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (didSwipe.current) {
      e.preventDefault();
      e.stopPropagation();
      didSwipe.current = false;
    }
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured from the BookHollow shelves"
      className="relative isolate overflow-hidden bg-ink-900 text-cream"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div
        className="relative h-[clamp(540px,78vh,760px)] w-full cursor-grab touch-pan-y select-none active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => (pointerStart.current = null)}
        onClickCapture={handleClickCapture}
        onDragStart={(e) => e.preventDefault()}
      >
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
                draggable={false}
                className="object-cover object-center"
              />

              <div className="absolute inset-0 bg-linear-to-r from-ink-900/90 via-ink-900/60 to-ink-900/10" />
              <div className="absolute inset-0 bg-linear-to-t from-ink-900/80 via-ink-900/10 to-ink-900/35" />

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

                  <h2 className="mt-5 text-balance text-4xl font-bold leading-[1.05] text-cream sm:text-5xl lg:text-6xl xl:text-7xl">
                    {slide.title}
                  </h2>

                  <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg">
                    {slide.description}
                  </p>

                  <Link
                    href={slide.cta.href}
                    draggable={false}
                    tabIndex={isActive ? undefined : -1}
                    className={`mt-9 inline-flex cursor-pointer items-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-brand-dark sm:text-base ${focusRing}`}
                  >
                    {slide.cta.label}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
                  : "w-2 bg-cream/45 hover:bg-cream/75"
              } ${focusRing}`}
            />
          );
        })}
      </div>
    </section>
  );
}