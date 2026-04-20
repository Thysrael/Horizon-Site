import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";

export interface CategoryCount {
  category: Category;
  count: number;
}

export async function GET() {
  try {
    const counts = await prisma.source.groupBy({
      by: ["category"],
      where: { status: "APPROVED" },
      _count: {
        category: true,
      },
    });

    const categoryCounts: CategoryCount[] = counts
      .map((item) => ({
        category: item.category,
        count: item._count.category,
      }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({ categories: categoryCounts });
  } catch (error) {
    console.error("Error fetching category counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch category counts" },
      { status: 500 }
    );
  }
}
