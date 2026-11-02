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

Small online library built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, and MongoDB via Better Auth. Readers can browse books by category, add their own books, edit/delete the ones they added, borrow books (tracked in the browser), and view a profile.

## Commands

- `npm run dev` — start the dev server (Turbopack) on http://localhost:3000.
- `npm run build` — production build (runs TypeScript).
- `npm run start` — serve the production build.
- `npm run lint` — ESLint (next core-web-vitals + typescript).
- `node scripts/reset-users.mjs` — wipe Better Auth `user/account/session/verification` collections from MongoDB (reads `.env.local`).

There is no test suite. Verify changes with `npm run build` and `npm run lint`.

## Project layout

- `src/app/` — App Router routes. Pages: `/`, `/books`, `/books/[id]`, `/books/[id]/edit`, `/add-book`, `/my-books`, `/my-borrows`, `/profile`, `/login`, `/register`, `/logout`. API: `/api/auth/[...all]` (Better Auth), `/api/books/[id]` (PUT/DELETE).
- `src/components/` — client components. `book-card.tsx` exports `BOOK_GRID_CLASS` and `BookGrid`.
- `src/lib/` — data/auth helpers: `books.ts` (`useBooks`), `borrows.ts` (localStorage borrow store), `auth.ts`/`auth-client.ts`/`auth-server.ts`, `mongo.ts`, `api.ts` (`API_URL`), `book-mutations.ts`, `book-ownership.ts`, `book-categories.ts`, `files.ts`.
- `scripts/reset-users.mjs` — maintenance script.
- `public/images/` — logos and banners.

## Architecture & data flow

- Books are stored in MongoDB collection `books` (db from `MONGODB_DB`, default `library`). `GET /books` and `POST /add-book` are expected from an external API at `API_URL` (default `http://localhost:8000`); only PUT/DELETE `/api/books/[id]` live in this app. `useBooks()` fetches `${API_URL}/books`.
- Auth is Better Auth with the MongoDB adapter; session cookie is httpOnly, read via `authClient.useSession()` wrapped by `useAuth()`/`useCurrentUser()`.
- Ownership: a book belongs to a user when `addedBy.id` or `addedBy.email` matches (`bookBelongsToUser`).
- Borrows are client-side only (localStorage keyed by user id/email) because the backend has no borrow endpoint.
- Theming: Tailwind dark mode via `dark` class on `<html>`, set before paint by inline script in `layout.tsx` from `localStorage["bookhollow:theme"]` (falls back to system preference).

## Conventions

- Path alias `@/*` → `./src/*`.
- Client components declare `"use client"`; server components are the default (e.g. pages).
- Components define their own small SVG icon subcomponents locally rather than importing an icon library.
- Styling uses Tailwind utility classes with a custom palette (ink/cream/brand) defined in `globals.css`; prefer existing class strings over new ones.
- Forms validate client-side then POST JSON; errors are read from `{ message }`/`{ error }` response bodies.
- Image uploads are converted to base64 data URLs client-side (`readFileAsDataUrl`), max 2 MB (`MAX_IMAGE_BYTES`), and stored on the book document.
- Keep new routes under `src/app/...` and new helpers under `src/lib/...`.

## Environment variables (`.env.local`)

- `MONGODB_URI` (required) — MongoDB connection string.
- `MONGODB_DB` — db name (default `library`).
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` — Better Auth config.
- `NEXT_PUBLIC_APP_URL` — auth client base URL.
- `NEXT_PUBLIC_API_URL` — books API base URL (default `http://localhost:8000`).
- `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (and `NEXT_PUBLIC_GOOGLE_CLIENT_ID`) — optional Google OAuth.

## Notes

- `runtime = "nodejs"` is set on Mongo-touching route handlers; do not run them on Edge.
- `next.config.ts` enables `experimental.agentFeedback` and a Tailwind Turbopack CSS rule; keep these.
- The project has no automated tests; run `npm run build` after changes.