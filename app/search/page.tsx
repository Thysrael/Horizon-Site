"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Category, Source } from "@/app/types";
import { CATEGORIES } from "@/app/lib/constants";
import { TagInput } from "@/app/components/TagInput";
import { SourceCard } from "@/app/components/SourceCard";
import { Navbar } from "@/app/components/Navbar";
import { transformToHorizonConfig } from "@/app/lib/horizonConfig";
import type { SourceConfig } from "@/app/lib/sourceConfig";

const LOCAL_STORAGE_KEY = "horizon-search-view-preference";

function SearchLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Search Sources
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Find and filter community-curated sources
          </p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500"></div>
        </div>
      </div>
    </div>
  );
}

function SearchContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isLoaded, setIsLoaded] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [exportedConfig, setExportedConfig] = useState<string | null>(null);

  const categoryParam = searchParams.get("category") as Category | null;
  const tagsParam = searchParams.get("tags");
  const queryParam = searchParams.get("q") || "";

  const selectedCategory = categoryParam || null;
  const selectedTags = tagsParam ? tagsParam.split(",").filter(Boolean) : [];
  const query = queryParam;

  const [currentCategory, setCurrentCategory] = useState<Category | null>(selectedCategory);
  const [currentTags, setCurrentTags] = useState<string[]>(selectedTags);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    async function fetchSources() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.set("category", selectedCategory);
        if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
        if (query) params.set("q", query);

        const response = await fetch(`/api/search?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch sources");
        
        const data = await response.json();
        setSources(data.sources || []);
        setTotalCount(data.total || 0);
      } catch (error) {
        console.error("Error fetching sources:", error);
        setSources([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSources();
  }, [selectedCategory, tagsParam, query]);

  useEffect(() => {
    const savedView = localStorage.getItem(LOCAL_STORAGE_KEY) as "grid" | "list" | null;
    if (savedView && (savedView === "grid" || savedView === "list")) {
      setView(savedView);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsSidebarOpen(false);
      }
    }

    if (isSidebarOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isSidebarOpen]);

  const handleViewChange = (newView: "grid" | "list") => {
    setView(newView);
    localStorage.setItem(LOCAL_STORAGE_KEY, newView);
  };

  const activeFiltersCount =
    (currentCategory ? 1 : 0) + currentTags.length;

  const updateUrl = useCallback(
    (category: Category | null, tags: string[], queryValue: string) => {
      const params = new URLSearchParams();

      if (category) {
        params.set("category", category);
      }

      if (tags.length > 0) {
        params.set("tags", tags.join(","));
      }

      if (queryValue.trim()) {
        params.set("q", queryValue.trim());
      }

      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.push(newUrl, { scroll: false });
    },
    [pathname, router]
  );

  const selectCategory = (categoryId: Category | "" | null) => {
    const category = categoryId === "" ? null : (categoryId as Category);
    setCurrentCategory(category);
    updateUrl(category, currentTags, searchQuery);
  };

  const handleTagsChange = (tags: string[]) => {
    setCurrentTags(tags);
    updateUrl(currentCategory, tags, searchQuery);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateUrl(currentCategory, currentTags, value);
  };

  const clearAllFilters = () => {
    setCurrentCategory(null);
    setCurrentTags([]);
    router.push(pathname + (searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""), { scroll: false });
  };

  const clearSearch = () => {
    setSearchQuery("");
    updateUrl(currentCategory, currentTags, "");
  };

  const hasActiveFilters = selectedCategory || selectedTags.length > 0;
  const hasSearchQuery = !!searchQuery;

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showSearch={false} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Search Sources
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Find and filter community-curated sources
          </p>
        </div>

        <div className="flex gap-6">
          <aside
            className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
              isSidebarOpen ? "w-72 opacity-100" : "w-0 opacity-0"
            }`}
          >
            <div className="w-72 space-y-6 pr-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                  aria-label="Close filters"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Categories</label>
                <div className="relative">
                  <select
                    value={currentCategory || ""}
                    onChange={(e) => selectCategory(e.target.value as Category | null)}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {currentCategory && (
                  <p className="text-xs text-gray-500">
                    {CATEGORIES.find(c => c.id === currentCategory)?.description}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <TagInput
                  value={currentTags}
                  onChange={handleTagsChange}
                  placeholder="Filter by tags..."
                  hideZeroCount={true}
                />
              </div>

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </aside>

          <main className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-col gap-3">
              {isMultiSelectMode && (
                <div className="flex items-center justify-between">
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
                        className="flex items-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Generate
                      </button>
                    ) : (
                      <button
                        onClick={() => setExportedConfig(null)}
                        className="flex items-center gap-2 rounded-lg bg-gray-500 px-3 py-2 text-sm font-medium text-white hover:bg-gray-600 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Close
                      </button>
                    )}
                    <button
                      onClick={exitMultiSelectMode}
                      className="flex items-center justify-center h-8 w-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      aria-label="Cancel"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search sources..."
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-9 text-sm text-gray-700 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                      aria-label="Clear search"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {!isMultiSelectMode && (
                    <button
                      onClick={() => setIsMultiSelectMode(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Export
                    </button>
                  )}

                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filter
                    {activeFiltersCount > 0 && (
                      <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-medium text-white">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm" role="group">
                    <button
                      onClick={() => handleViewChange("grid")}
                      className={`inline-flex items-center rounded-md px-2 py-1.5 text-sm font-medium transition-all ${
                        view === "grid"
                          ? "bg-orange-50 text-orange-600 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      aria-pressed={view === "grid"}
                      aria-label="Grid view"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleViewChange("list")}
                      className={`inline-flex items-center rounded-md px-2 py-1.5 text-sm font-medium transition-all ${
                        view === "list"
                          ? "bg-orange-50 text-orange-600 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      aria-pressed={view === "list"}
                      aria-label="List view"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{totalCount}</span>{" "}
              result{totalCount !== 1 ? "s" : ""}
            </div>

            {exportedConfig && (
              <div className="rounded-xl border border-gray-200 bg-white p-4">
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

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500"></div>
              </div>
            ) : sources.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 px-8 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  No sources found
                </h3>
                <p className="mt-2 max-w-md text-sm text-gray-600">
                  Try adjusting your search or filters
                  {hasActiveFilters && (
                    <>
                      {" "}or{" "}
                      <button
                        onClick={clearAllFilters}
                        className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                      >
                        clear filters
                      </button>
                    </>
                  )}
                </p>
              </div>
            ) : (
              isLoaded && (
                <>
                  {view === "grid" ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {sources.map((source) => (
                        <SourceCard 
                          key={source.id} 
                          source={source} 
                          view="grid"
                          isSelected={selectedIds.has(source.id)}
                          onToggleSelection={isMultiSelectMode ? () => toggleSelection(source.id) : undefined}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-0 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white px-6">
                      {sources.map((source) => (
                        <SourceCard 
                          key={source.id} 
                          source={source} 
                          view="list"
                          isSelected={selectedIds.has(source.id)}
                          onToggleSelection={isMultiSelectMode ? () => toggleSelection(source.id) : undefined}
                        />
                      ))}
                    </div>
                  )}
                </>
              )
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}
