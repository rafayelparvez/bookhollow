"use client";

import AuthGate from "@/components/auth-gate";
import BookCollection from "@/components/book-collection";
import { useCurrentUser } from "@/lib/auth";
import { borrowsMatchUser, useBorrows } from "@/lib/borrows";
import { useBooks } from "@/lib/books";

export default function MyBorrows() {
  return (
    <AuthGate nextPath="/my-borrows">
      <MyBorrowsList />
    </AuthGate>
  );
}

function MyBorrowsList() {
  const user = useCurrentUser();
  const { books, loading, error, retry } = useBooks();
  const borrows = useBorrows();

  const borrowedBookIds = new Set(
    user
      ? borrows
          .filter((record) => borrowsMatchUser(record, user))
          .map((record) => record.bookId)
      : [],
  );
  const borrowedBooks = books.filter((book) => borrowedBookIds.has(book._id));

  return (
    <BookCollection
      books={borrowedBooks}
      loading={loading}
      error={error}
      onRetry={retry}
      label="My borrows"
      emptyTitle="No borrowed books"
      emptyMessage="You haven't borrowed a book yet. Browse the shelves and pick your next read."
      emptyAction={{ href: "/books", label: "Browse books" }}
      countLabel={(count) =>
        `${count} ${count === 1 ? "book" : "books"} borrowed by you`
      }
    />
  );
}
