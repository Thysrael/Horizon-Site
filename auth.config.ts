import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"

// Edge-safe config: no database adapter, can run in Vercel middleware
export default {
  providers: [GitHub],
} satisfies NextAuthConfig