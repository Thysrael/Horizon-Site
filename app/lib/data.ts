import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { Source, Status } from "@/app/types";
import { normalizeTag } from "./tags";

export const getSources = cache(async function getSources(searchQuery?: string) {
  const normalizedQuery = searchQuery ? normalizeTag(searchQuery) : undefined;

  return await prisma.source.findMany({
    where: {
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
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: normalizedQuery,
              mode: "insensitive",
            },
          },
        ],
      }),
    },
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
