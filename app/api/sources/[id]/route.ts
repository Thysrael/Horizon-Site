import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    const source = await prisma.source.findUnique({
      where: { id },
      include: {
        submitter: {
          select: { name: true },
        },
      },
    })

    if (!source) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 })
    }

    let hasVoted = false
    if (session?.user?.id) {
      const vote = await prisma.vote.findUnique({
        where: {
          userId_sourceId: {
            userId: session.user.id,
            sourceId: id,
          },
        },
      })
      hasVoted = !!vote
    }

    return NextResponse.json({
      source: {
        id: source.id,
        name: source.name,
        url: source.url,
        description: source.description,
        type: source.type,
        category: source.category,
        tags: source.tags,
        iconUrl: source.iconUrl,
        config: source.config,
        voteCount: source.voteCount,
        status: source.status,
        submitter: source.submitter,
      },
      hasVoted,
    })
  } catch (error) {
    console.error("Error fetching source:", error)
    return NextResponse.json(
      { error: "Failed to fetch source" },
      { status: 500 }
    )
  }
}