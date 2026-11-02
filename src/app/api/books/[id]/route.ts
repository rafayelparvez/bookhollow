import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { bookBelongsToUser } from "@/lib/book-ownership";
import { db } from "@/lib/mongo";

// The Better Auth session and MongoDB driver both need Node APIs.
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type BookDocument = {
  _id: ObjectId;
  title?: string;
  author?: string;
  category?: string;
  description?: string;
  totalCopies?: number;
  availableCopies?: number;
  image?: string | null;
  addedBy?: {
    id?: string;
    name?: string;
    email?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

const books = db.collection<BookDocument>("books");

type OwnerResult =
  | { ok: false; response: NextResponse }
  | { ok: true; book: BookDocument; objectId: ObjectId };

function parseObjectId(id: string): ObjectId | null {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isImageDataUrl(value: string): boolean {
  return /^data:image\/(png|jpe?g|webp|gif);base64,/.test(value);
}

async function loadOwnedBook(
  request: Request,
  id: string,
): Promise<OwnerResult> {
  const objectId = parseObjectId(id);

  if (!objectId) {
    return {
      ok: false,
      response: NextResponse.json(
        { message: "That book id is not valid." },
        { status: 400 },
      ),
    };
  }

  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return {
      ok: false,
      response: NextResponse.json(
        { message: "Please sign in to change this book." },
        { status: 401 },
      ),
    };
  }

  const book = await books.findOne({ _id: objectId });

  if (!book) {
    return {
      ok: false,
      response: NextResponse.json(
        { message: "Book not found." },
        { status: 404 },
      ),
    };
  }

  if (
    !bookBelongsToUser(book, {
      id: session.user.id,
      email: session.user.email,
    })
  ) {
    return {
      ok: false,
      response: NextResponse.json(
        { message: "You can only change books you added." },
        { status: 403 },
      ),
    };
  }

  return { ok: true, book, objectId };
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const owned = await loadOwnedBook(request, id);

  if (!owned.ok) return owned.response;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Send the updated book as JSON." },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { message: "Send the updated book as JSON." },
      { status: 400 },
    );
  }

  const input = body as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const author = typeof input.author === "string" ? input.author.trim() : "";

  if (!title || !author) {
    return NextResponse.json(
      { message: "Book title and author name are required." },
      { status: 400 },
    );
  }

  const totalCopies = Number(input.copies);

  if (!Number.isInteger(totalCopies) || totalCopies < 1) {
    return NextResponse.json(
      { message: "Total copies must be a whole number of at least 1." },
      { status: 400 },
    );
  }

  let image = owned.book.image ?? null;

  if (input.image === null) {
    image = null;
  } else if (typeof input.image === "string") {
    const trimmed = input.image.trim();
    image = trimmed || null;

    if (image && !isImageDataUrl(image) && !isHttpUrl(image)) {
      return NextResponse.json(
        { message: "Image must be a PNG, JPG, WEBP or GIF file." },
        { status: 400 },
      );
    }
  }

  const previouslyBorrowed = Math.max(
    0,
    (owned.book.totalCopies ?? 0) - (owned.book.availableCopies ?? 0),
  );

  const category =
    typeof input.category === "string" && input.category.trim()
      ? input.category.trim()
      : (owned.book.category ?? "Fiction");
  const description =
    typeof input.description === "string"
      ? input.description.trim()
      : (owned.book.description ?? "");

  const updated = {
    title,
    author,
    category,
    description,
    totalCopies,
    // Keep the number of copies currently on loan unchanged.
    availableCopies: Math.max(0, totalCopies - previouslyBorrowed),
    image,
    updatedAt: new Date(),
  };

  const book = await books.findOneAndUpdate(
    { _id: owned.objectId },
    { $set: updated },
    { returnDocument: "after" },
  );

  return NextResponse.json({
    message: "Book updated.",
    book: book ? { ...book, _id: book._id.toString() } : null,
  });
}

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const owned = await loadOwnedBook(request, id);

  if (!owned.ok) return owned.response;

  const result = await books.deleteOne({ _id: owned.objectId });

  if (!result.deletedCount) {
    return NextResponse.json({ message: "Book not found." }, { status: 404 });
  }

  return NextResponse.json({ message: "Book deleted." });
}
