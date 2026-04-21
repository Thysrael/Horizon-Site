"use client"

import { useState, useCallback, useEffect } from "react"
import { useSession } from "next-auth/react"

interface UseVoteOptions {
  sourceId: string
  initialVoteCount: number
  initialHasVoted: boolean
}

interface UseVoteReturn {
  voteCount: number
  hasVoted: boolean
  isLoading: boolean
  toggleVote: () => void
  error: string | null
}

export function useVote({
  sourceId,
  initialVoteCount,
  initialHasVoted,
}: UseVoteOptions): UseVoteReturn {
  const { data: session } = useSession()
  const [voteCount, setVoteCount] = useState(initialVoteCount)
  const [hasVoted, setHasVoted] = useState(initialHasVoted)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setVoteCount(initialVoteCount)
    setHasVoted(initialHasVoted)
  }, [initialVoteCount, initialHasVoted])

  const toggleVote = useCallback(async () => {
    if (!session?.user?.id) {
      setError("Please sign in to vote")
      return
    }

    if (isLoading) return

    setError(null)
    setIsLoading(true)

    const previousVoteCount = voteCount
    const previousHasVoted = hasVoted

    setVoteCount((prev) => (hasVoted ? prev - 1 : prev + 1))
    setHasVoted(!hasVoted)

    try {
      if (hasVoted) {
        const response = await fetch("/api/vote", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sourceId }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to remove vote")
        }
      } else {
        const response = await fetch("/api/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sourceId }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to add vote")
        }
      }
    } catch (err) {
      setVoteCount(previousVoteCount)
      setHasVoted(previousHasVoted)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [session, sourceId, hasVoted, isLoading, voteCount])

  return {
    voteCount,
    hasVoted,
    isLoading,
    toggleVote,
    error,
  }
}