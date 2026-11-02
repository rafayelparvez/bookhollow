// src/components/reader-reviews.tsx
// Static section: sample reader testimonials.

const REVIEWS = [
  {
    name: "Ayesha Rahman",
    role: "Avid reader",
    quote:
      "BookHollow made it so easy to find my next read. I borrowed three books in a week!",
  },
  {
    name: "Tanvir Ahmed",
    role: "Student",
    quote:
      "Adding my own books to the shelf felt great. The community vibe is wonderful.",
  },
  {
    name: "Nadia Karim",
    role: "Book club host",
    quote:
      "The category filters and details page are clean and simple. Highly recommended.",
  },
];

export default function ReaderReviews() {
  return (
    <section
      aria-labelledby="reader-reviews-title"
      className="mx-auto w-full max-w-6xl px-6 py-16"
    >
      <div className="max-w-2xl">
        <h2
          id="reader-reviews-title"
          className="text-3xl font-bold tracking-tight text-ink dark:text-cream"
        >
          Reader Reviews
        </h2>
        <p className="mt-2 font-sans text-base text-ink/60 dark:text-cream/60">
          What our community is saying about BookHollow.
        </p>
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((review) => (
          <li
            key={review.name}
            className="flex flex-col rounded-2xl border border-ink/10 bg-cream p-6 shadow-sm dark:border-cream/10 dark:bg-ink"
          >
            <p className="font-sans text-base leading-relaxed text-ink/70 dark:text-cream/65">
              &ldquo;{review.quote}&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-brand font-sans text-sm font-bold text-cream">
                {review.name.charAt(0)}
              </span>
              <div>
                <p className="font-sans text-sm font-semibold text-ink dark:text-cream">
                  {review.name}
                </p>
                <p className="font-sans text-xs text-ink/50 dark:text-cream/50">
                  {review.role}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}