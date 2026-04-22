import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Category, SourceType } from "@prisma/client";
import { CATEGORIES } from "@/app/lib/constants";

function mapSourceType(type: SourceType, config: Record<string, unknown>): string {
  switch (type) {
    case "GITHUB": {
      const subtype = (config as { subtype?: string }).subtype;
      if (subtype === "user_events") return "github_user";
      if (subtype === "repo_releases") return "github_repo";
      return "github_user";
    }
    case "REDDIT": {
      const configAny = config as Record<string, unknown>;
      if (configAny.subtype === "user") return "reddit_user";
      return "reddit_subreddit";
    }
    case "RSS":
      return "rss";
    case "TELEGRAM":
      return "telegram";
    case "HACKER_NEWS":
      return "hackernews";
    case "NEWSLETTER":
      return "rss";
    case "OTHER":
      return "rss";
    default:
      return "rss";
  }
}

function mergeConfigWithDefaults(
  presetType: string,
  storedConfig: Record<string, unknown>,
  sourceName?: string
): Record<string, unknown> {
  const config = { ...storedConfig };

  switch (presetType) {
    case "reddit_subreddit":
      if (!config.sort) config.sort = "hot";
      if (!config.fetch_limit) config.fetch_limit = 15;
      if (!config.min_score) config.min_score = 60;
      break;
    case "rss":
      // Horizon expects RSS name inside config, but horizon-site stores it at the source level
      if (!config.name && sourceName) config.name = sourceName;
      break;
    case "telegram":
      if (!config.fetch_limit) config.fetch_limit = 20;
      break;
    case "hackernews":
      if (!config.fetch_top_stories) config.fetch_top_stories = 30;
      if (!config.min_score) config.min_score = 100;
      break;
  }

  // Remove horizon-site-internal fields that horizon doesn't use
  delete config.subtype;

  return config;
}

export async function GET() {
  try {
    const sources = await prisma.source.findMany({
      where: { status: "APPROVED" },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        category: true,
        tags: true,
        config: true,
      },
    });

    const categoryMap = new Map<Category, (typeof CATEGORIES)[number]>();
    for (const cat of CATEGORIES) {
      categoryMap.set(cat.id, cat);
    }

    const sourcesByCategory = new Map<Category, typeof sources>();
    for (const source of sources) {
      const cat = source.category;
      if (!sourcesByCategory.has(cat)) {
        sourcesByCategory.set(cat, []);
      }
      sourcesByCategory.get(cat)!.push(source);
    }

    const domains = [];
    for (const [category, categorySources] of sourcesByCategory) {
      const catInfo = categoryMap.get(category);
      if (!catInfo) continue;

      const tagSet = new Set<string>();
      for (const source of categorySources) {
        for (const tag of source.tags) {
          tagSet.add(tag);
        }
      }
      const keywords = [...catInfo.keywords, ...Array.from(tagSet)];

      const presetSources = categorySources.map((source) => {
        const storedConfig =
          typeof source.config === "object" && source.config !== null
            ? (source.config as Record<string, unknown>)
            : {};

        const presetType = mapSourceType(source.type, storedConfig);
        const mergedConfig = mergeConfigWithDefaults(
          presetType,
          storedConfig,
          source.name
        );

        return {
          name: source.name,
          description: source.description || source.name,
          description_zh: source.description || source.name,
          type: presetType,
          tags: source.tags,
          config: mergedConfig,
        };
      });

      domains.push({
        id: category,
        name: catInfo.name,
        name_zh: catInfo.name_zh,
        description: catInfo.description,
        description_zh: catInfo.description_zh,
        keywords,
        sources: presetSources,
      });
    }

    return NextResponse.json({ categories: domains });
  } catch (error) {
    console.error("Error fetching presets:", error);
    return NextResponse.json(
      { error: "Failed to fetch presets" },
      { status: 500 }
    );
  }
}