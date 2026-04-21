import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/app/lib/admin";
import { Status, SourceType, Category } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { normalizeTag, isBlockedTag, isEnglishTag } from "@/app/lib/tags";

// GET /api/admin/sources - List all sources with optional filters
export async function GET(request: NextRequest) {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as Status | null;
    const type = searchParams.get("type") as SourceType | null;
    const category = searchParams.get("category") as Category | null;
    const search = searchParams.get("search");

    const where: Prisma.SourceWhereInput = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const sources = await prisma.source.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        submitter: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ sources });
  } catch (error) {
    console.error("Error fetching sources:", error);
    return NextResponse.json(
      { error: "Failed to fetch sources" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/sources - Update a source
export async function PATCH(request: NextRequest) {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, status, name, url, description, type, category, tags, iconUrl } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Source ID is required" },
        { status: 400 }
      );
    }

    const updateData: Prisma.SourceUpdateInput = {};
    if (status !== undefined) updateData.status = status;
    if (name !== undefined) updateData.name = name;
    if (url !== undefined) updateData.url = url;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (category !== undefined) updateData.category = category;
    let droppedTags: string[] = [];
    if (tags !== undefined) {
      const normalizedTags = tags.map((tag: string) => normalizeTag(tag));
      droppedTags = normalizedTags.filter(
        (tag: string) => isBlockedTag(tag) || !isEnglishTag(tag)
      );
      updateData.tags = normalizedTags.filter(
        (tag: string) => tag.length > 0 && !isBlockedTag(tag) && isEnglishTag(tag)
      );
    }

    const source = await prisma.source.update({
      where: { id },
      data: updateData,
      include: {
        submitter: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Source updated successfully",
      source,
      droppedTags: droppedTags.length > 0 ? droppedTags : undefined,
    });
  } catch (error: any) {
    console.error("Error updating source:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Source not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update source" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/sources - Delete a source
export async function DELETE(request: NextRequest) {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Source ID is required" },
        { status: 400 }
      );
    }

    await prisma.vote.deleteMany({
      where: { sourceId: id },
    });

    await prisma.source.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Source deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting source:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Source not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete source" },
      { status: 500 }
    );
  }
}
