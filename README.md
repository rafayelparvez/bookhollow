# 📚 BookHollow

**A small online library.** Browse books, add your own, borrow what you like, and return it when you're done.

[![Live Site](https://img.shields.io/badge/live-bookhollow.vercel.app-brightgreen?style=flat-square)](https://bookhollow.vercel.app)
[![API](https://img.shields.io/badge/api-bookhollow--server.vercel.app-blue?style=flat-square)](https://bookhollow-server.vercel.app)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-404D59?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

---

## ✨ Features

- **Browse the collection**: public book catalogue with cover, author, category and live copy availability
- **Authentication**: email + password and Google sign-in, powered by [Better Auth](https://www.better-auth.com)
- **Password rules**: at least 6 characters, with one uppercase and one lowercase letter (checked on both client and server)
- **Add books**: upload a cover image or paste an image URL
- **Edit and delete**: only the person who added a book can change or remove it
- **Borrow and return**: 14-day loans, one copy per user per book, with live availability tracking
- **My Borrows / My Books**: personal dashboards for what you've borrowed and what you've added
- **Light and dark mode**
- **Privacy-aware API**: owner emails are never exposed in public responses

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS |
| Auth | Better Auth (email/password + Google OAuth) with the `jwt()` plugin |
| API | Express.js, `jose` for JWT verification |
| Database | MongoDB |
| Hosting | Vercel (frontend and API) |

---

## 🏗️ Architecture

```
┌────────────────────┐   1. sign in    ┌───────────────────────────┐
│  Next.js frontend  │ ──────────────▶ │  Better Auth (Next.js API) │
│  bookhollow.vercel │ ◀────────────── │  issues JWT, serves JWKS   │
└─────────┬──────────┘   2. JWT token  └───────────────▲───────────┘
          │                                            │ 4. fetch public keys
          │ 3. Authorization: Bearer <JWT>             │    (/api/auth/jwks)
          ▼                                            │
┌────────────────────┐                                 │
│   Express API      │ ────────────────────────────────┘
│ verifies the token │
│ with jose + JWKS   │ ──▶  MongoDB (books, borrows)
└────────────────────┘
```

The frontend signs the user in through Better Auth and receives a JWT. Every protected request to the Express API carries that token, and the API verifies it against Better Auth's public JWKS. The user's identity always comes from the verified token, never from the request body.

---

## 🔌 API Reference

Base URL: `https://bookhollow-server.vercel.app`

Protected routes need the header `Authorization: Bearer <token>`.

### Books

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/books` | Public | List all books (owner emails hidden) |
| `GET` | `/books/:id` | Required | Get a single book |
| `POST` | `/books` | Required | Add a book |
| `PATCH` | `/books/:id` | Owner only | Update a book |
| `DELETE` | `/books/:id` | Owner only | Delete a book and its borrow records |

**`POST /books` body**

```json
{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "category": "Fantasy",
  "copies": 3,
  "description": "Bilbo Baggins joins an unexpected adventure.",
  "image": "https://example.com/cover.jpg"
}
```

`image` accepts an `http(s)` URL or a base64 `data:image/...` string (PNG, JPG, WEBP, GIF). `imageUrl` is also accepted as an alias.

### Borrows

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/borrows` | Required | Borrow a book. Body: `{ "bookId": "..." }` |
| `GET` | `/borrows` | Required | List the current user's borrows |
| `DELETE` | `/borrows/:id` | Required | Return a book (own borrows only) |

### Status codes

| Code | Meaning |
|---|---|
| `400` | Validation failed or invalid id |
| `401` | Missing, invalid or expired token |
| `403` | You don't own this book |
| `404` | Book or borrow record not found |
| `409` | Already borrowed, or no copies available |
| `413` | Uploaded image too large |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database (Atlas or local)
- A Google OAuth client (only if you want Google sign-in)

### 1. Clone

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Frontend (Next.js)

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

Runs at `http://localhost:3000`.

**Frontend environment variables**

```env
# Better Auth
BETTER_AUTH_SECRET=<long random string>
BETTER_AUTH_URL=http://localhost:3000

# Database used by Better Auth
MONGODB_URI=<your mongodb connection string>

# Google sign-in (optional)
GOOGLE_CLIENT_ID=<your client id>
GOOGLE_CLIENT_SECRET=<your client secret>

# URL of the Express API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. API server (Express)

```bash
npm install
npm start     # or: node server.js
```

Runs at `http://localhost:8000`.

**Server environment variables**

```env
# URL of the Next.js app where Better Auth runs.
# Must match BETTER_AUTH_URL exactly.
AUTH_URL=http://localhost:3000

MONGODB_URI=<your mongodb connection string>
MONGODB_DB=library        # optional, defaults to "library"
PORT=8000                 # optional
```

The server refuses to start if `AUTH_URL` or `MONGODB_URI` is missing.

---

## ☁️ Deployment (Vercel)

1. Deploy the **frontend** and set `BETTER_AUTH_URL=https://<your-frontend-domain>` plus the other frontend variables.
2. Deploy the **API** and set `AUTH_URL` to the same frontend URL.
3. Add the production origin to the CORS list in `server.js`.
4. In Google Cloud Console, add these under **Authorized redirect URIs**:
   ```
   https://<your-frontend-domain>/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```
5. Redeploy after changing any environment variable.

---

## 🔐 Security Notes

- Every write operation requires a verified JWT; the user is read from the token, not the request body.
- `PATCH` and `DELETE` on a book are limited to its owner (`403` otherwise).
- Public responses never include other users' email addresses.
- A unique index on `borrows (bookId, userEmail)` prevents duplicate borrows, even under concurrent requests.
- Password rules are enforced on the server as well as in the form.
- CORS only allows the configured frontend origins.
- Internal error details are hidden from clients on `5xx` responses.

---

## 🧪 Quick API Check

```bash
API=https://bookhollow-server.vercel.app

curl -i $API/books                       # 200, public
curl -i $API/borrows                     # 401, token missing
curl -i $API/borrows -H "Authorization: Bearer abc.def.ghi"   # 401, invalid token
```

---

## 🛣️ Ideas for Later

- Search, filters and pagination on the catalogue
- Due-date reminders and overdue tracking
- Book reviews and ratings
- Admin role for moderating the library

---

Made with ☕ and a love of books.