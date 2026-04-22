"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { Source } from "@/app/types";
import { VoteButton } from "./VoteButton";
import {
  transformToHorizonConfig,
  formatHorizonConfigJSON,
} from "@/app/lib/horizonConfig";
import { SourceConfig } from "@/app/lib/sourceConfig";
import { getSourceIcon, getSourceIconFallback } from "@/app/lib/icons";

interface SourceDetailModalProps {
  source: Source | null;
  isOpen: boolean;
  onClose: () => void;
  userVotedSourceIds?: Set<string>;
}

export function SourceDetailModal({
  source,
  isOpen,
  onClose,
  userVotedSourceIds,
}: SourceDetailModalProps) {
  const [fullSource, setFullSource] = useState<Source | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedJSON, setCopiedJSON] = useState(false);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen && source) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
      
      setIsLoading(true);
      fetch(`/api/sources/${source.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.source) {
            setFullSource(data.source);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      document.body.style.overflow = "";
      setFullSource(null);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleEscape, source]);

  if (!isOpen || !source) return null;

  const [imgSrc, setImgSrc] = useState(getSourceIcon(source.type, source.iconUrl));
  const hasVoted = userVotedSourceIds?.has(source.id) ?? false;

  const displaySource = fullSource || source;
  const configObject = displaySource.config && typeof displaySource.config === "object" ? displaySource.config : null;
  const hasValidConfig = displaySource.type === "HACKER_NEWS" || (configObject && Object.keys(configObject).length > 0);
  
  const horizonConfig = hasValidConfig
    ? transformToHorizonConfig(
        displaySource.type,
        displaySource.config as unknown as SourceConfig,
        displaySource.name
      )
    : null;
  const jsonConfig = horizonConfig ? formatHorizonConfigJSON(horizonConfig) : "";

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(jsonConfig);
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2000);
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Source Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-50 overflow-hidden">
              <img
                src={imgSrc}
                alt={source.name}
                className="h-10 w-10 object-contain"
                onError={() => setImgSrc(getSourceIconFallback(source.type))}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-lg font-semibold text-gray-900">
                  {source.name}
                </h3>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-orange-50 text-orange-600">
                  {source.category}
                </span>
                <VoteButton
                  sourceId={source.id}
                  initialVoteCount={source.voteCount}
                  initialHasVoted={hasVoted}
                  size="sm"
                />
              </div>
              <span className="text-sm text-gray-400">{source.type}</span>
            </div>
          </div>

          {source.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Description
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {source.description}
              </p>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">URL</h4>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-orange-600 hover:text-orange-700 hover:underline break-all"
            >
              {source.url}
            </a>
          </div>

          {source.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {source.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?tags=${encodeURIComponent(tag)}`}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {horizonConfig && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Horizon Configuration
                </h4>
                <button
                  onClick={handleCopyJSON}
                  className="text-xs px-3 py-1 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                >
                  {copiedJSON ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300 font-mono">
                  <code>{jsonConfig}</code>
                </pre>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Add this configuration to your horizon config file to subscribe to this source.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Submitted by @{source.submitter.name || "anonymous"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
