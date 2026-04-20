"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { TagInput } from "@/app/components/TagInput";
import { CATEGORIES } from "@/app/lib/constants";
import { Category } from "@/app/types";

interface SearchFiltersProps {
  initialCategory: Category | null;
  initialTags: string[];
  initialQuery: string;
}

export function SearchFilters({
  initialCategory,
  initialTags,
  initialQuery,
}: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCategory);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const lastPropagatedQueryRef = useRef<string>(initialQuery);

  const activeFiltersCount = (selectedCategory ? 1 : 0) + selectedTags.length + (searchQuery ? 1 : 0);

  useEffect(() => {
    const urlCategory = searchParams.get("category") as Category | null;
    const urlTags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
    const urlQuery = searchParams.get("q") || "";

    setSelectedCategory(urlCategory);
    setSelectedTags(urlTags);
    lastPropagatedQueryRef.current = urlQuery;
    if (!isTypingRef.current) {
      setSearchQuery(urlQuery);
    }
  }, [searchParams]);

  const updateUrl = useCallback((
    category: Category | null,
    tags: string[],
    query: string
  ) => {
    const params = new URLSearchParams();

    if (category) {
      params.set("category", category);
    }

    if (tags.length > 0) {
      params.set("tags", tags.join(","));
    }

    if (query.trim()) {
      params.set("q", query.trim());
    }

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    lastPropagatedQueryRef.current = query;
    router.push(newUrl, { scroll: false });
  }, [pathname, router]);

  const selectCategory = useCallback((categoryId: Category | null) => {
    setSelectedCategory(categoryId);
    updateUrl(categoryId, selectedTags, searchQuery);
  }, [selectedTags, searchQuery, updateUrl]);

  const handleTagsChange = useCallback((tags: string[]) => {
    setSelectedTags(tags);
    updateUrl(selectedCategory, tags, searchQuery);
  }, [selectedCategory, searchQuery, updateUrl]);

  const handleSearchChange = useCallback((value: string) => {
    isTypingRef.current = true;
    setSearchQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      isTypingRef.current = false;
      updateUrl(selectedCategory, selectedTags, value);
    }, 300);
  }, [selectedCategory, selectedTags, updateUrl]);

  const clearAllFilters = useCallback(() => {
    setSelectedCategory(null);
    setSelectedTags([]);
    setSearchQuery("");
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  const clearSearch = useCallback(() => {
    isTypingRef.current = false;
    setSearchQuery("");
    updateUrl(selectedCategory, selectedTags, "");
  }, [selectedCategory, selectedTags, updateUrl]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="sticky top-4 space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {activeFiltersCount > 0 && (
          <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">
            {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""} applied
          </span>
        )}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search sources..."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Categories
        </label>
        <div className="space-y-2">
          <label
            className="group flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-gray-50 transition-colors"
            title="Show all categories"
          >
            <input
              type="radio"
              name="category"
              checked={selectedCategory === null}
              onChange={() => selectCategory(null)}
              className="mt-0.5 h-4 w-4 border-gray-300 text-orange-500 focus:ring-orange-500/20 cursor-pointer"
            />
            <div className="flex-1">
              <span className="block text-sm text-gray-700 group-hover:text-gray-900">
                All Categories
              </span>
              <span className="block text-xs text-gray-400 group-hover:text-gray-500 mt-0.5">
                Show sources from all categories
              </span>
            </div>
          </label>
          <div className="border-t border-gray-100 my-2" />
          {CATEGORIES.map((category) => (
            <label
              key={category.id}
              className="group flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-gray-50 transition-colors"
              title={category.description}
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category.id}
                onChange={() => selectCategory(category.id)}
                className="mt-0.5 h-4 w-4 border-gray-300 text-orange-500 focus:ring-orange-500/20 cursor-pointer"
              />
              <div className="flex-1">
                <span className="block text-sm text-gray-700 group-hover:text-gray-900">
                  {category.name}
                </span>
                <span className="block text-xs text-gray-400 group-hover:text-gray-500 mt-0.5">
                  {category.description}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <TagInput
          value={selectedTags}
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
          Clear All Filters
        </button>
      )}
    </div>
  );
}