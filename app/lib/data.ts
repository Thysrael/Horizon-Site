import { prisma } from "@/lib/prisma";

export async function getSources(searchQuery?: string) {
  return await prisma.source.findMany({
    where: {
      status: "APPROVED",
      ...(searchQuery && {
        tags: {
          hasSome: [searchQuery],
        },
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
}

export async function getContributors() {
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
}
