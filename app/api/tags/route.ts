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

    // Map to store: normalizedTag -> { originalTag, count }
    // We keep the most common original form for display
    const tagMap = new Map<string, { original: string; count: number }>();

    for (const source of sources) {
      for (const originalTag of source.tags) {
        const normalized = normalizeTag(originalTag);
        if (!normalized) continue;
        if (!includeBlocked && isBlockedTag(normalized)) continue;

        const existing = tagMap.get(normalized);
        if (existing) {
          existing.count += 1;
          // Keep the shorter original tag for display (usually cleaner)
          if (originalTag.length < existing.original.length) {
            existing.original = originalTag;
          }
        } else {
          tagMap.set(normalized, { original: originalTag, count: 1 });
        }
      }
    }

    let tagCounts = Array.from(tagMap.entries())
      .map(([normalized, data]) => ({ 
        name: data.original,  // Use original tag name for display
        normalized,          // Keep normalized for internal use
        count: data.count 
      }))
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

    // Map to store: normalizedTag -> { originalTag, count }
    const tagMap = new Map<string, { original: string; count: number }>();

    for (const source of sources) {
      for (const originalTag of source.tags) {
        const normalized = normalizeTag(originalTag);
        if (!normalized || isBlockedTag(normalized)) continue;

        const existing = tagMap.get(normalized);
        if (existing) {
          existing.count += 1;
          if (originalTag.length < existing.original.length) {
            existing.original = originalTag;
          }
        } else {
          tagMap.set(normalized, { original: originalTag, count: 1 });
        }
      }
    }

    let suggestions = Array.from(tagMap.entries())
      .map(([normalized, data]) => ({ 
        name: data.original,
        normalized,
        count: data.count 
      }))
      .filter((tag) => {
        if (exclude.includes(tag.normalized)) return false;
        if (normalizedQuery) {
          return tag.normalized.includes(normalizedQuery);
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
