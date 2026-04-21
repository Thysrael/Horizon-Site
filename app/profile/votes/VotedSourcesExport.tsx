"use client";

import Link from "next/link";
import { useState } from "react";
import type { Source } from "@/app/types";
import { SourceCard } from "@/app/components/SourceCard";
import { transformToHorizonConfig } from "@/app/lib/horizonConfig";
import type { SourceConfig } from "@/app/lib/sourceConfig";

interface VotedSourcesExportProps {
  sources: Source[];
  votedSourceIds: Set<string>;
}

export function VotedSourcesExport({ sources, votedSourceIds }: VotedSourcesExportProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [exportedConfig, setExportedConfig] = useState<string | null>(null);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(sources.map((s) => s.id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleExport = () => {
    if (selectedIds.size === 0) return;

    const selectedSources = sources.filter((s) => selectedIds.has(s.id));
    const configs = selectedSources
      .map((source) =>
        transformToHorizonConfig(
          source.type,
          (source.config || {}) as SourceConfig,
          source.name
        )
      )
      .filter(Boolean) as import("@/app/lib/horizonConfig").HorizonConfig[];

    if (configs.length === 0) {
      alert("No valid configurations to export");
      return;
    }

    const { formatAllConfigsJSON } = require("@/app/lib/horizonConfig");
    const jsonContent = formatAllConfigsJSON(configs);
    setExportedConfig(jsonContent);
  };

  const handleCopyExport = () => {
    if (exportedConfig) {
      navigator.clipboard.writeText(exportedConfig);
    }
  };

  const exitMultiSelectMode = () => {
    setIsMultiSelectMode(false);
    setSelectedIds(new Set());
    setExportedConfig(null);
  };

  const allSelected = selectedIds.size === sources.length && sources.length > 0;

  if (sources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
          <svg
            className="h-8 w-8 text-orange-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </div>
        <h2 className="mb-1 text-xl font-semibold text-gray-900">No votes yet</h2>
        <p className="mb-6 text-gray-500">
          Browse sources and vote for the ones you like.
        </p>
        <Link
          href="/"
          className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
        >
          Browse Sources
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {isMultiSelectMode ? (
        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={allSelected ? deselectAll : selectAll}
              className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
            >
              {allSelected ? "Deselect All" : "Select All"}
            </button>
            {selectedIds.size > 0 && (
              <span className="text-sm text-gray-400">
                {selectedIds.size} selected
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!exportedConfig ? (
              <button
                onClick={handleExport}
                disabled={selectedIds.size === 0}
                className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Config
              </button>
            ) : (
              <button
                onClick={() => setExportedConfig(null)}
                className="flex items-center gap-2 rounded-full bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close Config
              </button>
            )}
            <button
              onClick={exitMultiSelectMode}
              className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors px-2"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4 flex items-center justify-end border-b border-gray-100 pb-4">
          <button
            onClick={() => setIsMultiSelectMode(true)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Export Config
          </button>
        </div>
      )}

      {exportedConfig && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Exported Configuration</h4>
            <button
              onClick={handleCopyExport}
              className="text-xs px-3 py-1 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              Copy
            </button>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto max-h-64 overflow-y-auto">
            <pre className="text-sm text-gray-300 font-mono">
              <code>{exportedConfig}</code>
            </pre>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sources.map((source) => (
          <SourceCard
            key={source.id}
            source={source}
            view="grid"
            hasVoted={true}
            userVotedSourceIds={votedSourceIds}
            isSelected={selectedIds.has(source.id)}
            onToggleSelection={isMultiSelectMode ? () => toggleSelection(source.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
