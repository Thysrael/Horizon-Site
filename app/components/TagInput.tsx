"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { normalizeTag, isBlockedTag } from "../lib/tags";

interface TagSuggestion {
  name: string;
  count: number;
}

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  hideZeroCount?: boolean;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Add tags...",
  maxTags = 10,
  hideZeroCount = false,
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, exclude: value }),
      });

      if (response.ok) {
        const data = await response.json();
        let filteredSuggestions = data.suggestions || [];
        if (hideZeroCount) {
          filteredSuggestions = filteredSuggestions.filter((s: TagSuggestion) => s.count > 0);
        }
        setSuggestions(filteredSuggestions);
      }
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [value, hideZeroCount]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (input.trim()) {
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(input);
      }, 150);
    } else {
      fetchSuggestions("");
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input, fetchSuggestions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function addTag(tag: string) {
    const normalized = normalizeTag(tag);

    if (!normalized) {
      setWarning("Tag cannot be empty");
      setTimeout(() => setWarning(null), 3000);
      return;
    }

    if (value.includes(normalized)) {
      setWarning(`"${normalized}" is already added`);
      setTimeout(() => setWarning(null), 3000);
      return;
    }

    if (value.length >= maxTags) {
      setWarning(`Maximum ${maxTags} tags allowed`);
      setTimeout(() => setWarning(null), 3000);
      return;
    }

    if (isBlockedTag(normalized)) {
      setWarning(`"${normalized}" is too generic. Try a more specific tag.`);
      setTimeout(() => setWarning(null), 5000);
      return;
    }

    onChange([...value, normalized]);
    setInput("");
    setWarning(null);
    inputRef.current?.focus();
  }

  function removeTag(tagToRemove: string) {
    onChange(value.filter((tag) => tag !== tagToRemove));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) {
        addTag(input);
      }
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  }

  const showSuggestions = isOpen && (suggestions.length > 0 || isLoading || input.trim());

  return (
    <div ref={containerRef} className="relative">
      <div
        className="min-h-[44px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-sm font-medium text-orange-700"
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
                className="rounded-full p-0.5 hover:bg-orange-100 transition-colors"
              >
                <svg
                  className="h-3 w-3"
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
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[80px] bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            disabled={value.length >= maxTags}
          />
        </div>
      </div>

      {showSuggestions && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="py-1">
            {isLoading && suggestions.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-400">Loading...</div>
            )}

            {suggestions.map((tag) => (
              <button
                key={tag.name}
                type="button"
                onClick={() => {
                  addTag(tag.name);
                }}
                className="flex items-center justify-between w-full px-3 py-2 text-left text-sm hover:bg-orange-50 hover:text-orange-700 transition-colors"
              >
                <span className="text-gray-700">{tag.name}</span>
                {tag.count > 0 ? (
                  <span className="inline-flex items-center justify-center min-w-[1.5em] h-[1.5em] px-1.5 rounded-full bg-orange-500 text-white text-xs font-bold">
                    {tag.count}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">new</span>
                )}
              </button>
            ))}

            {input.trim() && !suggestions.some((s) => s.name === normalizeTag(input)) && (
              <button
                type="button"
                onClick={() => addTag(input)}
                className="flex items-center justify-between w-full px-3 py-2 text-left text-sm hover:bg-orange-50 hover:text-orange-700 transition-colors border-t border-gray-100"
              >
                <span className="text-orange-600 font-medium">
                  Create &quot;{normalizeTag(input)}&quot;
                </span>
                <span className="text-xs text-gray-400 ml-2">new</span>
              </button>
            )}

            {!isLoading && suggestions.length === 0 && !input.trim() && (
              <div className="px-3 py-2 text-sm text-gray-400">
                Type to search for tags
              </div>
            )}
          </div>
        </div>
      )}

      {warning && (
        <p className="mt-1.5 text-xs text-amber-600">{warning}</p>
      )}

      {!warning && (
        <p className="mt-1.5 text-xs text-gray-500">
          Press Enter or comma to add a tag. {value.length}/{maxTags} tags.
        </p>
      )}
    </div>
  );
}
