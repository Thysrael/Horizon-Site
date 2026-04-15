import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { sourceId } = body

    if (!sourceId || typeof sourceId !== "string" || sourceId.trim() === "") {
      return NextResponse.json(
        { error: "Source ID is required" },
        { status: 400 }
      )
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_sourceId: {
          userId: session.user.id,
          sourceId: sourceId.trim(),
        },
      },
    })

    if (existingVote) {
      return NextResponse.json(
        { error: "You have already voted for this source" },
        { status: 409 }
      )
    }

    await prisma.$transaction([
      prisma.vote.create({
        data: {
          userId: session.user.id,
          sourceId: sourceId.trim(),
        },
      }),
      prisma.source.update({
        where: { id: sourceId.trim() },
        data: { voteCount: { increment: 1 } },
      }),
    ])

    return NextResponse.json(
      { message: "Vote recorded successfully" },
      { status: 200 }
    )
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Source not found" },
        { status: 404 }
      )
    }

    console.error("Error recording vote:", error)
    return NextResponse.json(
      { error: "Failed to record vote" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { sourceId } = body

    if (!sourceId || typeof sourceId !== "string" || sourceId.trim() === "") {
      return NextResponse.json(
        { error: "Source ID is required" },
        { status: 400 }
      )
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_sourceId: {
          userId: session.user.id,
          sourceId: sourceId.trim(),
        },
      },
    })

    if (!existingVote) {
      return NextResponse.json(
        { error: "You have not voted for this source" },
        { status: 404 }
      )
    }

    await prisma.$transaction([
      prisma.vote.delete({
        where: { id: existingVote.id },
      }),
      prisma.source.update({
        where: { id: sourceId.trim() },
        data: { voteCount: { decrement: 1 } },
      }),
    ])

    return NextResponse.json(
      { message: "Vote removed successfully" },
      { status: 200 }
    )
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Source not found" },
        { status: 404 }
      )
    }

    console.error("Error removing vote:", error)
    return NextResponse.json(
      { error: "Failed to remove vote" },
      { status: 500 }
    )
  }
}