import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const votes = await prisma.vote.findMany({
      where: { userId: session.user.id },
      include: {
        source: {
          include: {
            submitter: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const sources = votes
      .filter((vote) => vote.source !== null)
      .map((vote) => ({
        id: vote.source.id,
        name: vote.source.name,
        url: vote.source.url,
        description: vote.source.description,
        type: vote.source.type,
        category: vote.source.category,
        tags: vote.source.tags,
        iconUrl: vote.source.iconUrl,
        voteCount: vote.source.voteCount,
        status: vote.source.status,
        submitter: vote.source.submitter.name,
      }))

    return NextResponse.json({ sources })
  } catch (error) {
    console.error("Error fetching user votes:", error)
    return NextResponse.json(
      { error: "Failed to fetch votes" },
      { status: 500 }
    )
  }
}