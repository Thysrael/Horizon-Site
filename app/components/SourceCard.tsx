"use client";

import Link from "next/link";
import { useState } from "react";
import type { Source } from "@/app/types";
import { VoteButton } from "./VoteButton";
import { SourceDetailModal } from "./SourceDetailModal";
import { getSourceIcon, getSourceIconFallback } from "@/app/lib/icons";

interface SourceCardProps {
  source: Source;
  view: 'grid' | 'list';
  hasVoted?: boolean;
  userVotedSourceIds?: Set<string>;
  isSelected?: boolean;
  onToggleSelection?: () => void;
}

export function SourceCard({ source, view, hasVoted, userVotedSourceIds, isSelected, onToggleSelection }: SourceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(getSourceIcon(source.type, source.iconUrl));

  if (view === 'grid') {
    return (
      <>
        <article 
          className={`group flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-gray-300 ${onToggleSelection ? '' : 'cursor-pointer'}`}
          onClick={() => !onToggleSelection && setIsModalOpen(true)}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-50 overflow-hidden">
              <img
                src={imgSrc}
                alt={source.name}
                className="h-10 w-10 object-contain"
                onError={() => setImgSrc(getSourceIconFallback(source.type))}
              />
            </div>
            {onToggleSelection && (
              <div onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={onToggleSelection}
                  className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
              </div>
            )}
          </div>

          <span className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-1">
            {source.name}
          </span>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400">({source.type})</span>
            <span className="text-xs px-2 py-0.5 rounded bg-orange-50 text-orange-600 font-medium">
              {source.category}
            </span>
          </div>

          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {source.description || "No description available."}
          </p>

          {source.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {source.tags.slice(0, 4).map((tag) => (
                <Link
                  key={tag}
                  href={`/search?tags=${encodeURIComponent(tag)}`}
                  className="text-xs text-orange-500/70 hover:text-orange-600 hover:underline transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  #{tag}
                </Link>
              ))}
              {source.tags.length > 4 && (
                <span className="text-xs text-gray-400">+{source.tags.length - 4}</span>
              )}
            </div>
          )}

          <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span>@{source.submitter.name || "anonymous"}</span>
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <VoteButton
                sourceId={source.id}
                initialVoteCount={source.voteCount}
                initialHasVoted={hasVoted}
                size="sm"
              />
            </div>
          </div>
        </article>
        <SourceDetailModal
          source={source}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userVotedSourceIds={userVotedSourceIds}
        />
      </>
    );
  }

  return (
    <>
      <article 
        className={`group flex items-center gap-4 py-4 transition-colors hover:bg-gray-50/50 ${onToggleSelection ? '' : 'cursor-pointer'}`}
        onClick={() => !onToggleSelection && setIsModalOpen(true)}
      >
        {onToggleSelection && (
          <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelection}
              className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
            />
          </div>
        )}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 overflow-hidden">
          <img
            src={imgSrc}
            alt={source.name}
            className="h-8 w-8 object-contain"
            onError={() => setImgSrc(getSourceIconFallback(source.type))}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 group-hover:text-orange-500 transition-colors truncate">
              {source.name}
            </span>
            <span className="shrink-0 text-xs text-gray-400">({source.type})</span>
            <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 font-medium">
              {source.category}
            </span>
          </div>

          <p className="mt-0.5 text-sm text-gray-600 line-clamp-1">
            {source.description || "No description available."}
          </p>

          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
            <span>@{source.submitter.name || "anonymous"}</span>
            {source.tags.length > 0 && (
              <>
                <span className="text-gray-300">|</span>
                <div className="flex gap-1">
                  {source.tags.slice(0, 3).map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?tags=${encodeURIComponent(tag)}`}
                      className="text-orange-500/70 hover:text-orange-600 hover:underline transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      #{tag}
                    </Link>
                  ))}
                  {source.tags.length > 3 && (
                    <span className="text-gray-400">+{source.tags.length - 3}</span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pl-4" onClick={(e) => e.stopPropagation()}>
          <VoteButton
            sourceId={source.id}
            initialVoteCount={source.voteCount}
            initialHasVoted={hasVoted}
            size="sm"
          />
        </div>
      </article>
      <SourceDetailModal
        source={source}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userVotedSourceIds={userVotedSourceIds}
      />
    </>
  );
}
