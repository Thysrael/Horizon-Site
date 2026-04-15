import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const VALID_SOURCE_TYPES = ["RSS", "HACKER_NEWS", "REDDIT", "TELEGRAM", "GITHUB", "NEWSLETTER", "OTHER"]

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
    const { url, name, description, type, category, tags, iconUrl } = body

    if (!url || typeof url !== "string" || url.trim() === "") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      )
    }

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    if (!type || !VALID_SOURCE_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Type must be one of: ${VALID_SOURCE_TYPES.join(", ")}` },
        { status: 400 }
      )
    }

    if (!category || typeof category !== "string" || category.trim() === "") {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      )
    }

    const validatedTags = Array.isArray(tags)
      ? tags.filter((tag): tag is string => typeof tag === "string")
      : []

    const source = await prisma.source.create({
      data: {
        url: url.trim(),
        name: name.trim(),
        description: description?.trim() || null,
        type,
        category: category.trim(),
        tags: validatedTags,
        iconUrl: iconUrl?.trim() || null,
        submitterId: session.user.id,
      },
    })

    return NextResponse.json(
      { message: "Source submitted successfully", source },
      { status: 201 }
    )
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This URL has already been submitted" },
        { status: 409 }
      )
    }

    console.error("Error submitting source:", error)
    return NextResponse.json(
      { error: "Failed to submit source" },
      { status: 500 }
    )
  }
}