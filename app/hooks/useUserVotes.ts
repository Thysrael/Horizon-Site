import { cache } from "react"
import { prisma } from "@/lib/prisma"

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
  })

  return new Set(votes.map((vote) => vote.sourceId))
})