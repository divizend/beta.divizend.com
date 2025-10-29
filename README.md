## Divizend Beta – Teaser Landing Page

Minimal, artful landing page built with Next.js App Router + Tailwind CSS (v4), featuring:

- Dark/light theme toggle (next-themes)
- Divizend logo linking to the main site
- Hero headline: “Shape the Future of FinTech”
- Email sign-up form for the beta program
- Optional Cloudflare Turnstile (invisible) verification
- Server-side sign-up API with Drizzle ORM + PostgreSQL
- Tracking of UTM parameters, locale, timezone, referrer, user agent, and client IP

---

## Tech Stack

- Next.js 15 (App Router, RSC-first)
- Tailwind CSS 4
- next-themes (dark/light)
- Drizzle ORM + drizzle-kit + postgres (PostgreSQL driver)
- Optional: Cloudflare Turnstile (invisible)

---

## Getting Started

1) Install dependencies

```bash
pnpm install
```

2) Configure environment variables (see .env example below)

3) Initialize database schema (requires `DATABASE_URL`)

```bash
pnpm db:push
# or, if you prefer migration files
pnpm db:generate
pnpm db:migrate
```

4) Run the dev server

```bash
pnpm dev
```

Open http://localhost:3000

---

## Environment Variables

Create `.env.local` with:

```bash
# Required for database (PostgreSQL connection string)
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB

# Optional: Cloudflare Turnstile (invisible)
# If NOT provided, Turnstile is skipped (form will still submit)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_public_site_key
TURNSTILE_SECRET_KEY=your_secret_key
```

---

## Database

Drizzle schema lives in `lib/db/schema.ts`.

Table: `beta_signups`

- `id` UUID (PK)
- `email` text (unique, not null)
- `user_agent` text
- `referrer` text
- `ip_address` text
- `utm_source` text
- `utm_medium` text
- `utm_campaign` text
- `utm_term` text
- `utm_content` text
- `language` text
- `timezone` text
- `created_at` timestamp default now()

CLI scripts (package.json):

```bash
pnpm db:push      # push schema directly to DB (great for prototyping)
pnpm db:generate  # generate SQL migrations based on schema
pnpm db:migrate   # apply generated migrations
pnpm db:studio    # open Drizzle Studio
```

---

## API

Endpoint: `POST /api/submit-email`

Request body (JSON):

```json
{
  "email": "user@example.com",
  "token": "<turnstile-token-or-null>",
  "utmSource": "...",
  "utmMedium": "...",
  "utmCampaign": "...",
  "utmTerm": "...",
  "utmContent": "...",
  "language": "en-US",
  "timezone": "Europe/Berlin"
}
```

Behavior:

- If `TURNSTILE_SECRET_KEY` is set, a valid `token` is required (server verifies with Cloudflare).
- If `TURNSTILE_SECRET_KEY` is NOT set, Turnstile is skipped.
- Idempotent: Re-submitting an existing email returns success without creating duplicates.

Sample responses:

```json
{ "success": true, "message": "Email submitted successfully" }
{ "success": true, "message": "Email already registered" }
{ "success": false, "message": "Invalid email address" }
{ "success": false, "message": "Verification failed" }
```

---

## UI

- Page: `app/page.tsx`
- Theme provider: `components/theme-provider.tsx`
- Theme toggle: `components/theme-toggle.tsx`
- Email form (client): `components/email-form.tsx`

The email form collects UTM parameters from the URL, and locale/timezone from the browser. It conditionally renders the Turnstile component when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is present.

---

## Build & Lint

```bash
pnpm build
pnpm lint
```

---

## Notes

- The `drizzle` directory (migrations/output) is ignored by Git via `.gitignore`.
- Images from `divizend.com` are allowed via `next.config.ts` remotePatterns.
- The Divizend logo is served from `public/divizend-tworows-white.svg` (linked to https://divizend.com).
