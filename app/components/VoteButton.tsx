"use client";

import { useVote } from "@/app/hooks/useVote";

interface VoteButtonProps {
  sourceId: string;
  initialVoteCount: number;
  initialHasVoted?: boolean;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: {
    button: "px-2.5 py-1 text-xs gap-1",
    icon: "h-3.5 w-3.5",
  },
  md: {
    button: "px-3 py-1.5 text-sm gap-1.5",
    icon: "h-4 w-4",
  },
};

export function VoteButton({
  sourceId,
  initialVoteCount,
  initialHasVoted = false,
  size = "md",
}: VoteButtonProps) {
  const { voteCount, hasVoted, isLoading, toggleVote } = useVote({
    sourceId,
    initialVoteCount,
    initialHasVoted,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleVote();
  };

  const sizeClass = sizeClasses[size];

  const buttonClasses = hasVoted
    ? "bg-orange-100 text-orange-600"
    : "bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600";

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        flex items-center rounded-full font-medium transition-all
        ${sizeClass.button}
        ${buttonClasses}
        ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      aria-label={hasVoted ? "Remove vote" : "Add vote"}
    >
      <svg
        className={sizeClass.icon}
        viewBox="0 0 24 24"
        fill={hasVoted ? "currentColor" : "none"}
        stroke={hasVoted ? "none" : "currentColor"}
        strokeWidth={hasVoted ? undefined : "2"}
      >
        <path d="M12 4l-8 8h5v8h6v-8h5z" />
      </svg>
      <span>{voteCount}</span>
    </button>
  );
}
