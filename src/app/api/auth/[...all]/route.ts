import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth-server";

// The MongoDB adapter needs Node APIs, so this route must not run on Edge.
export const runtime = "nodejs";

export const { GET, POST } = toNextJsHandler(auth);
