"use client";

import BookCollection from "@/components/book-collection";
import { useBooks } from "@/lib/books";

export default function AllBooks() {
  const { books, loading, error, retry } = useBooks();

  return (
    <BookCollection
      books={books}
      loading={loading}
      error={error}
      onRetry={retry}
      label="All books"
      emptyTitle="The shelves are empty"
      emptyMessage="No books have been added yet. Be the first to put one on the shelf."
      emptyAction={{ href: "/add-book", label: "Add the first book" }}
      countLabel={(count) =>
        `${count} ${count === 1 ? "book" : "books"} on the shelf`
      }
    />
  );
}
