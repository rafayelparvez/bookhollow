export const BOOK_CATEGORIES = [
  "Fiction",
  "Non-fiction",
  "Mystery",
  "Fantasy",
  "Science Fiction",
  "Romance",
  "Biography",
  "History",
  "Poetry",
  "Children",
] as const;

export function categoryOptions(current?: string): string[] {
  const options: string[] = [...BOOK_CATEGORIES];

  if (current && !options.includes(current)) {
    options.unshift(current);
  }

  return options;
}
