# Project

Platform that connects content creators with brands.

# Stack

- Next.js 15 App Router
- TypeScript strict
- Prisma
- PostgreSQL
- Better Auth
- Tailwind + shadcn/ui

# Package manager
pnpm — always use pnpm, never npm or yarn

# Architecture rules

- All API logic in /app/api or server actions — never in client components
- No `any` in TypeScript
- Prefer server components by default, client only when needed
- make sure you are always using the latest version of any package you add to the project

# Current migration state

- Phase: Next.js 15 App Router migration complete
- Status: Frontend migrated to Next.js; backend (Prisma + PostgreSQL + Better Auth) not yet implemented

# What NOT to do

- Don't use Pages Router
- Don't add new dependencies without asking
- Don't break existing component interfaces during migration