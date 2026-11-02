import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { db } from "@/lib/mongo";

export const runtime = "nodejs";

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

function toIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string" && value.trim()) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
    return value;
  }
  if (typeof value === "number") return new Date(value).toISOString();
  return new Date().toISOString();
}

function toBook(doc: BookDocument) {
  return {
    _id: doc._id.toString(),
    title: doc.title ?? "",
    author: doc.author ?? "",
    category: doc.category ?? "Fiction",
    description: doc.description ?? "",
    totalCopies: doc.totalCopies ?? 1,
    availableCopies: doc.availableCopies ?? doc.totalCopies ?? 1,
    image: doc.image ?? null,
    addedBy: doc.addedBy ?? {},
    createdAt: toIso(doc.createdAt),
    updatedAt: doc.updatedAt ? toIso(doc.updatedAt) : undefined,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitRaw = searchParams.get("limit");
  let limit = 0;
  if (limitRaw) {
    const parsed = Number.parseInt(limitRaw, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      limit = Math.min(parsed, 100);
    }
  }

  const cursor = books.find({}).sort({ createdAt: -1 });
  if (limit) cursor.limit(limit);

  const docs = await cursor.toArray();
  return NextResponse.json(docs.map(toBook));
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Send the new book as JSON." },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { message: "Send the new book as JSON." },
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

  const totalCopies = Number(input.copies ?? input.totalCopies ?? 1);
  if (!Number.isInteger(totalCopies) || totalCopies < 1) {
    return NextResponse.json(
      { message: "Total copies must be a whole number of at least 1." },
      { status: 400 },
    );
  }

  let image: string | null = null;
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

  const category =
    typeof input.category === "string" && input.category.trim()
      ? input.category.trim()
      : "Fiction";
  const description =
    typeof input.description === "string" ? input.description.trim() : "";

  // Prefer the signed-in session when available; fall back to payload fields.
  const session = await auth.api.getSession({ headers: request.headers });
  const addedBy = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      }
    : {
        id:
          typeof input.userId === "string"
            ? input.userId
            : typeof input.addedBy === "object" && input.addedBy
              ? (input.addedBy as { id?: string }).id
              : undefined,
        name:
          typeof input.userName === "string"
            ? input.userName
            : typeof input.addedBy === "object" && input.addedBy
              ? (input.addedBy as { name?: string }).name
              : undefined,
        email:
          typeof input.userEmail === "string"
            ? input.userEmail
            : typeof input.addedBy === "object" && input.addedBy
              ? (input.addedBy as { email?: string }).email
              : undefined,
      };

  const now = new Date();
  const doc: BookDocument = {
    _id: new ObjectId(),
    title,
    author,
    category,
    description,
    totalCopies,
    availableCopies: totalCopies,
    image,
    addedBy,
    createdAt: now,
    updatedAt: now,
  };

  await books.insertOne(doc);
  return NextResponse.json({ message: "Book added.", book: toBook(doc) }, { status: 201 });
}