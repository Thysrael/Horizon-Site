import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeTag, isBlockedTag } from "@/app/lib/tags";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const minCount = parseInt(searchParams.get("minCount") || "1", 10);
    const includeBlocked = searchParams.get("includeBlocked") === "true";
    const limit = parseInt(searchParams.get("limit") || "200", 10);

    const sources = await prisma.source.findMany({
      where: {
        status: "APPROVED",
      },
      select: {
        tags: true,
      },
    });

    const tagCountMap = new Map<string, number>();

    for (const source of sources) {
      for (const tag of source.tags) {
        const normalized = normalizeTag(tag);
        if (!normalized) continue;
        if (!includeBlocked && isBlockedTag(normalized)) continue;

        tagCountMap.set(normalized, (tagCountMap.get(normalized) || 0) + 1);
      }
    }

    let tagCounts = Array.from(tagCountMap.entries())
      .map(([name, count]) => ({ name, count }))
      .filter((tag) => tag.count >= minCount)
      .sort((a, b) => b.count - a.count);

    tagCounts = tagCounts.slice(0, limit);

    return NextResponse.json({
      tags: tagCounts,
      total: tagCounts.length,
      totalSources: sources.length,
    });
  } catch (error) {
    console.error("Error fetching tag counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch tag counts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query = "", exclude = [] } = body;

    const normalizedQuery = normalizeTag(query);

    const sources = await prisma.source.findMany({
      where: {
        status: "APPROVED",
      },
      select: {
        tags: true,
      },
    });

    const tagCountMap = new Map<string, number>();
    for (const source of sources) {
      for (const tag of source.tags) {
        const normalized = normalizeTag(tag);
        if (!normalized || isBlockedTag(normalized)) continue;
        if (exclude.includes(normalized)) continue;

        tagCountMap.set(normalized, (tagCountMap.get(normalized) || 0) + 1);
      }
    }

    let suggestions = Array.from(tagCountMap.entries())
      .map(([name, count]) => ({ name, count }))
      .filter((tag) => {
        if (exclude.includes(tag.name)) return false;
        if (normalizedQuery) {
          return tag.name.includes(normalizedQuery);
        }
        return true;
      })
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        return a.name.localeCompare(b.name);
      });

    suggestions = suggestions.slice(0, 10);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error fetching tag suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch tag suggestions" },
      { status: 500 }
    );
  }
}
