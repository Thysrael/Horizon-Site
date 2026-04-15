import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import authConfig from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    jwt: ({ user, token }) => {
      if (user) {
        token.uid = user.id
      }
      return token
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.uid as string
      }
      return session
    },
  },
  ...authConfig,
})