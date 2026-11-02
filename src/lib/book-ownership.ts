export type BookOwnership = {
  addedBy?: {
    id?: string;
    email?: string;
  } | null;
};

export type OwnerIdentity = {
  id: string;
  email: string;
};

/**
 * A book belongs to a reader when either the account id or the account email
 * matches. The email fallback keeps books that were added before real accounts
 * existed editable by whoever owns that email address.
 */
export function bookBelongsToUser(
  book: BookOwnership,
  user: OwnerIdentity,
): boolean {
  const addedBy = book.addedBy;
  if (!addedBy) return false;

  const idMatches = !!addedBy.id && addedBy.id === user.id;
  const emailMatches =
    !!addedBy.email &&
    addedBy.email.toLowerCase() === user.email.toLowerCase();

  return idMatches || emailMatches;
}
