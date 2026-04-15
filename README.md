This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Authentication Setup

GitHub OAuth via NextAuth v5, with Prisma + Vercel Postgres for user records (sessions use JWT — no DB hit per request).

### 1. Create Vercel Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → your project → Storage
2. Click "Create Database" → select "Postgres"
3. After creation, Vercel auto-injects `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` into your deployment

For local development, pull the env vars:

```bash
vercel env pull .env.local
```

Or manually copy from: Vercel Dashboard → Storage → your database → .env.local tab.

### 2. Run Database Migrations

```bash
npx prisma migrate dev
```

### 3. Set up GitHub OAuth App

1. Go to GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App
2. Fill in:
   - Application name: `Horizon (Local)`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. Click "Register application"
4. Copy Client ID and generate Client Secret
5. Update `.env.local`:
   ```
   AUTH_GITHUB_ID="your-github-oauth-app-id"
   AUTH_GITHUB_SECRET="your-github-oauth-app-secret"
   ```

### 4. Generate Auth Secret

```bash
npx auth secret
```

This auto-writes `AUTH_SECRET` to `.env.local`.

### 5. Start Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) and click "Login" to test.

## Functions

- Auth (GitHub OAuth via NextAuth v5)
- Submit
- Rank
- Profile(a collection of)
- Dashboard
- Query
- Comment

## UI

### Navigate Bar

- search
- sources
- doc
- demo
- login
- submit