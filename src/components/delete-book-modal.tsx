"use client";

import { useState } from "react";
import Modal from "@/components/modal";
import { deleteBookRequest } from "@/lib/book-mutations";

/**
 * Shared "are you sure?" dialog for deleting a book. Performs the delete
 * against the API and reports progress and errors inside the modal.
 */
export default function DeleteBookModal({
  bookId,
  bookTitle,
  onClose,
  onDeleted,
}: {
  bookId: string;
  bookTitle: string;
  onClose: () => void;
  /** Called after the book has been deleted, e.g. to refresh the list. */
  onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    if (deleting) return;
    setDeleting(true);
    setError("");

    try {
      await deleteBookRequest(bookId);
      onClose();
      onDeleted();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not delete this book. Please try again.",
      );
      setDeleting(false);
    }
  }

  return (
    <Modal
      title="Delete book?"
      onClose={() => {
        if (!deleting) onClose();
      }}
    >
      <p className="font-sans text-sm leading-relaxed text-ink/70 dark:text-cream/70">
        This will permanently remove{" "}
        <span className="font-semibold text-ink dark:text-cream">
          “{bookTitle}”
        </span>{" "}
        from the library. This cannot be undone.
      </p>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-brand/30 bg-brand/5 px-4 py-3 font-sans text-sm text-ink/80 dark:border-brand-light/30 dark:bg-brand/10 dark:text-cream/80"
        >
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={deleting}
          className="inline-flex items-center justify-center rounded-lg border border-ink/15 bg-cream px-4 py-2.5 font-sans text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60 dark:border-cream/15 dark:bg-ink-900 dark:text-cream dark:hover:border-brand-light/40 dark:hover:bg-brand/10 dark:hover:text-brand-light dark:focus-visible:outline-brand-light"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={deleting}
          aria-busy={deleting}
          className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2.5 font-sans text-sm font-semibold text-cream transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:outline-brand-light"
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </Modal>
  );
}
