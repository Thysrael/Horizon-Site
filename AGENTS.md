<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Horizon Site - Agent Instructions

This is a minimal Next.js 16 content curation app designed for Vercel deployment. The guiding principle is **avoid over-engineering** (e.g., no email auth, no complex role systems). 

## Architecture & Configuration Quirks

### Auth: NextAuth v5 (Beta)
- We use **NextAuth v5 (Auth.js)** with GitHub OAuth.
- **JWT Session Strategy:** We do NOT use database sessions. We use JWT to save database queries. 
- **Split Config:**
  - `auth.config.ts`: Contains Edge-compatible config (just the providers). Safe for middleware.
  - `auth.ts`: Contains Node-compatible config (PrismaAdapter, callbacks). Imports `auth.config.ts`.
  - `app/api/auth/[...nextauth]/route.ts`: Only re-exports `GET` and `POST` handlers from `auth.ts`.
- **JWT Callbacks:** We explicitly map `token.uid = user.id` in the `jwt` callback, and `session.user.id = token.uid` in the `session` callback so the user's DB ID is available.

### Database: Prisma + Vercel Postgres
- **Neon Serverless Adapter:** We use `@prisma/adapter-neon` via `lib/prisma.ts`. This is mandatory for serverless connection pooling on Vercel Postgres.
- **WebSocket Config:** `lib/prisma.ts` initializes `PrismaNeon` with `ws` to support transactions on Vercel Edge. 
- **Schema URLs:** `schema.prisma` uses `POSTGRES_PRISMA_URL` (pooled) for `url` and `POSTGRES_URL_NON_POOLING` (direct) for `directUrl`.
- **No SQLite:** Since the app is deployed to Vercel, SQLite cannot be used (serverless functions cannot write to local files).

## Developer Commands

- **Package Manager:** Use `yarn` (NOT npm). The project uses `yarn.lock`.
  - Install dependencies: `yarn add <package>`
  - Install dev dependencies: `yarn add -D <package>`
- **Prisma Migrations:**
  - Local dev: `npx prisma migrate dev`
  - Prod/Deploy: `npx prisma migrate deploy`
- **Regenerate Prisma Client:** `npx prisma generate` (Required if type errors appear or schema changes).
- **Environment Setup:** Local dev requires pulling Vercel Postgres connection strings from the Vercel Dashboard via `vercel env pull .env.local`.

## Operational Gotchas

- **LANGUAGE RULE: ABSOLUTELY NO CHINESE COMMENTS ALLOWED.** This is a full-English project. All code, configuration files, and documentation must use English exclusively.
- When adding new functionality, check if it requires database access. If it does, ensure it runs in the Node.js runtime, as Prisma + Neon adapter requires the `ws` package which behaves better in Node.js (or ensure Edge compatibility is maintained carefully via `auth.config.ts`).
- Do NOT add `Session` or `VerificationToken` models to Prisma schema. We use JWT strategy, so they are dead code and will never be populated.