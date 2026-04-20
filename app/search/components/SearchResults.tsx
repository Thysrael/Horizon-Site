"use client";

import { useState, useEffect } from "react";
import { SourceCard } from "@/app/components/SourceCard";
import { Source, Category } from "@/app/types";

interface SearchResultsProps {
  sources: Source[];
  totalCount: number;
  query: string;
  selectedCategories: Category[];
  selectedTags: string[];
}

const LOCAL_STORAGE_KEY = "horizon-search-view-preference";

export function SearchResults({
  sources,
  totalCount,
  query,
  selectedCategories,
  selectedTags,
}: SearchResultsProps) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedView = localStorage.getItem(LOCAL_STORAGE_KEY) as "grid" | "list" | null;
    if (savedView && (savedView === "grid" || savedView === "list")) {
      setView(savedView);
    }
    setIsLoaded(true);
  }, []);

  const handleViewChange = (newView: "grid" | "list") => {
    setView(newView);
    localStorage.setItem(LOCAL_STORAGE_KEY, newView);
  };

  const hasActiveFilters = query || selectedCategories.length > 0 || selectedTags.length > 0;

  if (sources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 px-8 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <svg
            className="h-10 w-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          No sources found matching your filters
        </h3>
        <p className="mt-2 max-w-md text-sm text-gray-600">
          Try adjusting your search criteria
          {hasActiveFilters && (
            <>
              {" "}
              or{" "}
              <a
                href="/search"
                className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
              >
                clear all filters
              </a>
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{totalCount}</span> result
          {totalCount !== 1 && "s"}
        </div>

        <div
          className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm"
          role="group"
        >
          <button
            onClick={() => handleViewChange("grid")}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              view === "grid"
                ? "bg-orange-50 text-orange-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            aria-pressed={view === "grid"}
            aria-label="Grid view"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => handleViewChange("list")}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              view === "list"
                ? "bg-orange-50 text-orange-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            aria-pressed={view === "list"}
            aria-label="List view"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      {isLoaded && (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sources.map((source) => (
                <SourceCard key={source.id} source={source} view="grid" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-0 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white px-6">
              {sources.map((source) => (
                <SourceCard key={source.id} source={source} view="list" />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
