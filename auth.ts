import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import authConfig from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { isAdmin: true },
        })
        token.isAdmin = dbUser?.isAdmin ?? false
      }
      return token
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.uid as string
        session.user.isAdmin = token.isAdmin as boolean
      }
      return session
    },
  },
  ...authConfig,
})