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
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const category = categoryParam && VALID_CATEGORIES.includes(categoryParam as Category)
      ? (categoryParam as Category)
      : undefined;

    const tags = tagsParam
      ? tagsParam.split(",").map((tag) => resolveTagAlias(normalizeTag(tag.trim()))).filter(Boolean)
      : undefined;

    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 12;

    const filters = {
      ...(category && { category }),
      ...(tags && tags.length > 0 && { tags }),
      ...(query && { query }),
      page,
      limit,
    };

    const result = await searchSources(filters);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
