<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->

# BookHollow

Small online library built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, and MongoDB via Better Auth. Readers can browse books by category, add their own books, edit/delete the ones they added, borrow books, and view a profile.

This app is the **frontend + auth issuer** for a pair of services. A separate Express API (different repo, deployed at `bookhollow-server.vercel.app`) owns the primary book/borrow data path and verifies JWTs issued by this app's Better Auth instance. The Express API contract is documented in `README.md`.

## Commands

- `npm run dev` — start the dev server on http://localhost:3000 (Next 16 defaults to Turbopack).
- `npm run build` — production build (runs TypeScript).
- `npm run start` — serve the production build.
- `npm run lint` — ESLint (flat config: next core-web-vitals + typescript).
- `node scripts/reset-users.mjs` — wipe Better Auth `user/account/session/verification` collections from MongoDB (reads `.env.local`).

There is no test suite. Verify changes with `npm run build` and `npm run lint`.

## Project layout

- `src/app/` — App Router routes. Pages: `/`, `/books`, `/books/[id]`, `/books/[id]/edit`, `/add-book`, `/my-books`, `/my-borrows`, `/profile`, `/login`, `/register`, `/logout`. API: `/api/auth/[...all]` (Better Auth), `/api/books` (`GET`/`POST`), `/api/add-book` (`POST`, re-exports the `books` POST handler), `/api/books/[id]` (`PUT`/`DELETE`).
- `src/components/` — client components. `book-card.tsx` exports `BOOK_GRID_CLASS` and `BookGrid`.
- `src/lib/` — data/auth helpers: `books.ts` (`useBooks`), `borrows.ts`, `api.ts` (`API_URL` + `apiFetch`), `auth.ts` (client session facade), `auth-client.ts`, `auth-server.ts`, `mongo.ts`, `book-mutations.ts`, `book-ownership.ts`, `book-categories.ts`, `files.ts`.
- `scripts/reset-users.mjs` — maintenance script. `scripts/.probe-db.mjs` — hidden, temporary diagnostic comparing frontend/backend Mongo URIs (references a sibling server repo); not routine tooling.
- `public/images/` — logos and banners.

## Architecture & data flow

Two API surfaces exist side by side; check both before changing book/borrow behavior:

1. **External Express API** (primary data path for the UI). Base URL is `NEXT_PUBLIC_API_URL` (no code default; README uses `http://localhost:8000`). `apiFetch()` attaches `Authorization: Bearer <jwt>` from `authClient.token()`; the Express server verifies it against this app's JWKS at `/api/auth/jwks`. Used for: `useBooks()` (`GET /books`, unwraps array or `{ books }`), add/update/delete books (`POST /books`, `PATCH /books/:id`, `DELETE /books/:id`), and all borrow operations (`POST/GET /borrows`, `DELETE /borrows/:id`). User identity always comes from the verified token, never the request body.
2. **Internal Next.js route handlers** (`/api/books*`) talk to MongoDB directly and use the Better Auth session cookie (`auth.api.getSession`). `GET /api/books` supports `?limit=` (max 100, sorted `createdAt` desc) and is used by the home-page New Arrivals section; `POST /api/add-book` aliases `POST /api/books`; `PUT /api/books/[id]` preserves the number of copies currently on loan when `totalCopies` changes. The client currently calls these internal routes only for that one read; other writes go through Express. They look like a parallel (possibly in-progress) implementation of the Express API — treat changes as cross-cutting.

- Books are stored in the MongoDB collection `books` (db from `MONGODB_DB`, default `library`).
- Auth is Better Auth with the MongoDB adapter and the `jwt()` plugin (7-day sessions, refreshed daily). Session cookies are httpOnly. The browser client (`createAuthClient` in `auth-client.ts`) sets **no** `baseURL` because the auth API lives in this same app. `useAuth()`/`useCurrentUser()` in `src/lib/auth.ts` wrap `authClient.useSession()`. Google OAuth is optional and enabled only when `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` are set.
- Ownership: a book belongs to a user when `addedBy.id` or `addedBy.email` matches (`bookBelongsToUser`). The internal `PUT`/`DELETE` routes enforce this server-side (403/401); the Express API enforces the same rule for `PATCH`/`DELETE`.
- Borrows are **not** stored in localStorage anymore. `src/lib/borrows.ts` keeps a module-level in-memory store consumed with `useSyncExternalStore`; `refreshBorrows()` loads `GET /borrows`, and `normalize()` maps server field names (`borrowDate` → `borrowedAt`, `returnDate` → `dueAt`) and hides returned records. `borrowBook`/`returnBook` POST/DELETE then re-fetch. (Some comments in this file are in Bengali.)
- Theming: Tailwind dark mode via `dark` class on `<html>`, set before paint by an inline script in `layout.tsx` from `localStorage["bookhollow:theme"]` (falls back to system preference).
- Images: uploads are converted to base64 data URLs client-side (`readFileAsDataUrl`), max 2 MB (`MAX_IMAGE_BYTES`); `http(s)` image URLs are also accepted. Both are stored on the book document.

## Conventions

- Path alias `@/*` → `./src/*`.
- Client components declare `"use client"`; server components are the default (e.g. pages).
- Components define their own small SVG icon subcomponents locally rather than importing an icon library.
- Styling uses Tailwind utility classes with a custom palette (ink/cream/brand) defined in `globals.css`; prefer existing class strings over new ones.
- Forms validate client-side then POST JSON; errors are read from `{ message }`/`{ error }` response bodies.
- Internal API routes return `NextResponse.json({ message, ... }, { status })` and validate image values (`isImageDataUrl`/`isHttpUrl`) before persisting.
- Data fetching happens in client components (catalogue via `useBooks`, authed calls via `apiFetch`, new arrivals via internal `/api/books?limit=4`); there is no React Query/SWR layer.

## Environment variables (`.env.local`)

- `MONGODB_URI` (required) — MongoDB connection string; `src/lib/mongo.ts` throws at import time if missing.
- `MONGODB_DB` — db name (default `library`).
- `BETTER_AUTH_SECRET` (required), `BETTER_AUTH_URL` — Better Auth config (`BETTER_AUTH_URL` defaults to `http://localhost:3000` in `auth-server.ts`).
- `NEXT_PUBLIC_API_URL` — Express API base URL (no code default; README documents `http://localhost:8000`).
- `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (optional Google sign-in). `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is used as a fallback client id server-side and by the sign-in button.

Note: `NEXT_PUBLIC_APP_URL` appears in older docs but is not referenced anywhere in the code. There is no committed `.env.example`, though `README.md` mentions one.

## Notes

- `runtime = "nodejs"` is set on Mongo-touching route handlers; do not run them on Edge.
- `next.config.ts` enables `experimental.agentFeedback` and a Turbopack CSS rule for `@tailwindcss/turbopack`; keep both.
- `README.md` documents the Express API contract, deployment steps, and security notes — keep the two in sync when changing API behavior.
- The project has no automated tests; run `npm run build` after changes.
