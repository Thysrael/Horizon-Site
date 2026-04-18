import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import type { Session } from "next-auth"

export async function isAdmin(): Promise<boolean> {
  const session = await auth()
  if (!session?.user?.id) {
    return false
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  return user?.isAdmin ?? false
}

export async function requireAdmin(): Promise<Session | NextResponse> {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const isAdminUser = await isAdmin()

  if (!isAdminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return session
}
