import { POST as booksPost } from "@/app/api/books/route";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return booksPost(request);
}