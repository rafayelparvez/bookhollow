"use client";

import AuthGate from "@/components/auth-gate";
import BookCollection from "@/components/book-collection";
import { useCurrentUser } from "@/lib/auth";
import { isBookAddedByUser, useBooks } from "@/lib/books";

export default function MyBooks() {
  return (
    <AuthGate nextPath="/my-books">
      <MyBooksList />
    </AuthGate>
  );
}

function MyBooksList() {
  const user = useCurrentUser();
  const { books, loading, error, retry } = useBooks();

  const myBooks = user
    ? books.filter((book) => isBookAddedByUser(book, user))
    : [];

  return (
    <BookCollection
      books={myBooks}
      loading={loading}
      error={error}
      onRetry={retry}
      label="My books"
      emptyTitle="No books yet"
      emptyMessage="You haven't added any books to the library yet."
      emptyAction={{ href: "/add-book", label: "Add your first book" }}
      countLabel={(count) =>
        `${count} ${count === 1 ? "book" : "books"} added by you`
      }
      manage
      onDeleted={retry}
    />
  );
}
