import { NextResponse } from "next/server";
import { Category } from "@prisma/client";
import { searchSources } from "@/app/lib/data";
import { normalizeTag } from "@/app/lib/tags";
import { resolveTagAlias } from "@/app/lib/tagAliases";

const VALID_CATEGORIES = Object.values(Category);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const categoryParam = searchParams.get("category");
    const tagsParam = searchParams.get("tags");
    const query = searchParams.get("q");

    const category = categoryParam && VALID_CATEGORIES.includes(categoryParam as Category)
      ? (categoryParam as Category)
      : undefined;

    const tags = tagsParam
      ? tagsParam.split(",").map((tag) => resolveTagAlias(normalizeTag(tag.trim()))).filter(Boolean)
      : undefined;

    const filters = {
      ...(category && { category }),
      ...(tags && tags.length > 0 && { tags }),
      ...(query && { query }),
    };

    const sources = await searchSources(filters);

    return NextResponse.json({
      sources,
      total: sources.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
