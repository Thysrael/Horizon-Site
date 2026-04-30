import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { Source, Status, Category, CommunityStats, AdminUser } from "@/app/types";
import { normalizeTag } from "./tags";
import { resolveTagAlias, resolveTagAliasesForSearchQuery } from "./tagAliases";
import { Prisma } from "@prisma/client";

const GITHUB_REPOS = [
  { owner: "Thysrael", repo: "Horizon" },
  { owner: "Thysrael", repo: "Horizon-Site" },
] as const;

export const getSources = cache(async function getSources(searchQuery?: string) {
  const normalizedQuery = searchQuery ? normalizeTag(searchQuery) : undefined;

  const where: Prisma.SourceWhereInput = {
    status: "APPROVED",
    ...(normalizedQuery && {
      OR: [
        {
          tags: {
            hasSome: [normalizedQuery],
          },
        },
        {
          name: {
            contains: normalizedQuery,
            mode: "insensitive" as const,
          },
        },
        {
          description: {
            contains: normalizedQuery,
            mode: "insensitive" as const,
          },
        },
      ],
    }),
  };

  return await prisma.source.findMany({
    where,
    orderBy: {
      voteCount: "desc",
    },
    take: 50,
    include: {
      submitter: {
        select: {
          name: true,
        },
      },
    },
  });
});

export interface SearchFilters {
  category?: Category;
  tags?: string[];
  query?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedSources {
  sources: Source[];
  total: number;
  totalPages: number;
}

export const searchSources = cache(async function searchSources(
  filters: SearchFilters
): Promise<PaginatedSources> {
  const { category, tags, query, page = 1, limit = 12 } = filters;

  const normalizedQuery = query ? normalizeTag(query) : undefined;
  const queryTagCandidates = normalizedQuery
    ? resolveTagAliasesForSearchQuery(normalizedQuery)
    : undefined;

  // Resolve tag aliases for tag filters
  const resolvedTags = tags?.map((tag) => resolveTagAlias(normalizeTag(tag)));

  const where: Prisma.SourceWhereInput = {
    status: "APPROVED",
    ...(category && { category }),
    ...(resolvedTags && resolvedTags.length > 0 && { tags: { hasEvery: resolvedTags } }),
    ...(normalizedQuery && {
      OR: [
        ...(queryTagCandidates && queryTagCandidates.length > 0
          ? [{ tags: { hasSome: queryTagCandidates } }]
          : []),
        { name: { contains: normalizedQuery, mode: "insensitive" as const } },
        { description: { contains: normalizedQuery, mode: "insensitive" as const } },
      ],
    }),
  };

  const [sources, total] = await Promise.all([
    prisma.source.findMany({
      where,
      orderBy: [
        { voteCount: "desc" },
        { id: "asc" },
      ],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        submitter: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.source.count({ where }),
  ]);

  return {
    sources,
    total,
    totalPages: Math.ceil(total / limit),
  };
});

export const getContributors = cache(async function getContributors() {
  return await prisma.user.findMany({
    where: {
      sources: {
        some: {
          status: "APPROVED",
        },
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
    distinct: ["id"],
  });
});

export const getPendingSources = cache(async function getPendingSources(): Promise<Source[]> {
  return await prisma.source.findMany({
    where: {
      status: "PENDING",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      submitter: {
        select: {
          name: true,
        },
      },
    },
  });
});

export const getAllSources = cache(async function getAllSources(status?: Status): Promise<Source[]> {
  return await prisma.source.findMany({
    where: {
      ...(status && { status }),
    },
    orderBy: [
      { voteCount: "desc" },
      { createdAt: "desc" },
    ],
    include: {
      submitter: {
        select: {
          name: true,
        },
      },
    },
  });
});

export const getSourceStats = cache(async function getSourceStats(): Promise<{
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}> {
  const [total, pending, approved, rejected] = await Promise.all([
    prisma.source.count(),
    prisma.source.count({ where: { status: "PENDING" } }),
    prisma.source.count({ where: { status: "APPROVED" } }),
    prisma.source.count({ where: { status: "REJECTED" } }),
  ]);

  return { total, pending, approved, rejected };
});

async function getGitHubStarCount(): Promise<number | null> {
  const responses = await Promise.all(
    GITHUB_REPOS.map(async ({ owner, repo }) => {
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "horizon-site",
          },
          next: { revalidate: 3600 },
        });

        if (!response.ok) {
          return null;
        }

        const data = (await response.json()) as { stargazers_count?: number };
        return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
      } catch {
        return null;
      }
    })
  );

  const validCounts = responses.filter((count): count is number => count !== null);
  if (validCounts.length === 0) {
    return null;
  }

  return validCounts.reduce((sum, count) => sum + count, 0);
}

export const getCommunityStats = cache(async function getCommunityStats(): Promise<CommunityStats> {
  const [totalUsers, approvedSources, githubStars] = await Promise.all([
    prisma.user.count(),
    prisma.source.count({ where: { status: "APPROVED" } }),
    getGitHubStarCount(),
  ]);

  return {
    totalUsers,
    approvedSources,
    githubStars,
  };
});

export const getAdminUsers = cache(async function getAdminUsers(): Promise<AdminUser[]> {
  const users = await prisma.user.findMany({
    orderBy: [
      { isAdmin: "desc" },
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      isAdmin: true,
      createdAt: true,
      _count: {
        select: {
          sources: true,
          votes: true,
        },
      },
      sources: {
        where: {
          status: "APPROVED",
        },
        select: {
          id: true,
        },
      },
    },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt.toISOString(),
    sourceCount: user._count.sources,
    approvedSourceCount: user.sources.length,
    voteCount: user._count.votes,
  }));
});

export interface CategoryCount {
  category: Category;
  count: number;
}

export const getCategoryCounts = cache(async function getCategoryCounts(): Promise<
  CategoryCount[]
> {
  const counts = await prisma.source.groupBy({
    by: ["category"],
    where: { status: "APPROVED" },
    _count: {
      category: true,
    },
  });

  return counts
    .map((item) => ({
      category: item.category,
      count: item._count.category,
    }))
    .sort((a, b) => b.count - a.count);
});

export const getUserVotedSourceIds = cache(async function getUserVotedSourceIds(
  userId: string
): Promise<Set<string>> {
  const votes = await prisma.vote.findMany({
    where: {
      userId,
    },
    select: {
      sourceId: true,
    },
  });

  return new Set(votes.map((vote) => vote.sourceId));
});
