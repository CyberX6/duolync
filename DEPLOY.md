# Deploying Duolync to duolync.com

## Stack

- **App:** Next.js 15 (App Router)
- **Database:** PostgreSQL (Railway, Neon, or Supabase)
- **Auth:** Better Auth (email/password + Google/Facebook OAuth)
- **Recommended host:** Vercel (frontend) + managed Postgres

## Prerequisites

- Node.js 20+
- pnpm 10+
- A PostgreSQL database
- Domain `duolync.com` pointed at your host

## 1. Environment variables

Set these in your hosting dashboard (Vercel → Settings → Environment Variables):

| Variable | Example | Required |
|----------|---------|----------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | Yes |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` | Yes |
| `BETTER_AUTH_URL` | `https://duolync.com` | Yes |
| `NEXT_PUBLIC_APP_URL` | `https://duolync.com` | Yes |
| `ALLOWED_ORIGINS` | `https://duolync.com` | Yes |
| `GOOGLE_CLIENT_ID` | from Google Cloud Console | Yes (if using Google login) |
| `GOOGLE_CLIENT_SECRET` | from Google Cloud Console | Yes (if using Google login) |
| `FACEBOOK_CLIENT_ID` | from Meta Developer | Optional |
| `FACEBOOK_CLIENT_SECRET` | from Meta Developer | Optional |
| `UPLOADTHING_TOKEN` | from uploadthing.com | Yes (for avatar uploads) |

All URL variables must use the same origin (`https://duolync.com`). Do not mix `www` and non-`www` unless you redirect one to the other everywhere.

## 2. OAuth redirect URLs

### Google Cloud Console

- **Authorized JavaScript origins:** `https://duolync.com`
- **Authorized redirect URIs:** `https://duolync.com/api/auth/callback/google`

### Facebook (if enabled)

- **Valid OAuth Redirect URIs:** `https://duolync.com/api/auth/callback/facebook`

## 3. Database setup

After the first deploy (or before, from your machine with production `DATABASE_URL`):

```bash
pnpm prisma migrate deploy
```

This applies all migrations, including negotiation fields (`contentFormats`, `negotiatedRate`, `brandNote`).

If your database was already updated with `prisma db push` during development and `migrate deploy` reports drift, mark the negotiation migration as applied:

```bash
pnpm prisma migrate resolve --applied 20260616100000_add_negotiation_fields
```

## 4. Build & start

The production build runs Prisma client generation automatically:

```bash
pnpm install
pnpm build    # runs: prisma generate && next build
pnpm start    # runs Next.js on port 3000
```

On **Vercel**, set:

- **Framework:** Next.js
- **Install command:** `pnpm install`
- **Build command:** `pnpm build` (default is fine if it runs `pnpm build`)
- **Output:** default (`.next`)

## 5. Custom domain (duolync.com)

1. In Vercel → Project → **Settings → Domains**, add `duolync.com` and `www.duolync.com`.
2. At your DNS provider, add the records Vercel shows (usually `A` + `CNAME`).
3. Enable HTTPS (automatic on Vercel).
4. Pick one canonical host (`duolync.com` or `www.duolync.com`) and redirect the other.

## 6. Post-deploy smoke test

- [ ] Homepage loads at `https://duolync.com`
- [ ] Sign up / sign in (email and Google)
- [ ] Brand: create a campaign
- [ ] Creator: browse campaigns and apply
- [ ] Brand: open campaign detail, negotiate application
- [ ] Profile page loads with sidebar layout
- [ ] Message button opens chat
- [ ] Notifications work

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| OAuth redirect mismatch | Wrong `BETTER_AUTH_URL` | Set to `https://duolync.com` |
| `Failed to fetch` on actions | DB schema out of date | Run `pnpm prisma migrate deploy` |
| Auth cookies not set | HTTP vs HTTPS mismatch | Use HTTPS everywhere in prod |
| Image upload fails | Missing `UPLOADTHING_TOKEN` | Add token from UploadThing dashboard |
| Prisma client errors on build | Client not generated | `build` script already runs `prisma generate` |

## Local vs production

Copy `.env.example` to `.env` for local development. Never commit `.env` to git.
