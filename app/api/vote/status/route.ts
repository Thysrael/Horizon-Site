import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get("ids")

    if (!idsParam) {
      return NextResponse.json(
        { votedSourceIds: [] },
        { status: 200 }
      )
    }

    const sourceIds = idsParam.split(",").map((id) => id.trim()).filter(Boolean)

    if (sourceIds.length === 0) {
      return NextResponse.json(
        { votedSourceIds: [] },
        { status: 200 }
      )
    }

    const votes = await prisma.vote.findMany({
      where: {
        userId: session.user.id,
        sourceId: {
          in: sourceIds,
        },
      },
      select: {
        sourceId: true,
      },
    })

    const votedSourceIds = votes.map((vote) => vote.sourceId)

    return NextResponse.json(
      { votedSourceIds },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error checking vote status:", error)
    return NextResponse.json(
      { error: "Failed to check vote status" },
      { status: 500 }
    )
  }
}