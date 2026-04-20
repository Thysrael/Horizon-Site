"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface TagWithCount {
  name: string;
  count: number;
}

export function TagCloud() {
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch("/api/tags?limit=50");
        if (response.ok) {
          const data = await response.json();
          const sortedTags = (data.tags || [])
            .sort((a: TagWithCount, b: TagWithCount) => b.count - a.count)
            .slice(0, 50);
          setTags(sortedTags);
        }
      } catch {
        setTags([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTags();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-orange-500 border-t-transparent"></div>
        <p className="mt-3 text-sm text-gray-500">Loading tags...</p>
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        <p className="text-lg font-medium">No tags yet</p>
        <p className="mt-2 text-sm">Tags will appear as sources are added.</p>
      </div>
    );
  }

  const maxCount = Math.max(...tags.map((t) => t.count));
  const minCount = Math.min(...tags.map((t) => t.count));

  function getTagStyle(count: number): { fontSize: string; opacity: number; fontWeight: number } {
    if (maxCount === minCount) {
      return { fontSize: "1rem", opacity: 1, fontWeight: 500 };
    }

    const ratio = (count - minCount) / (maxCount - minCount);

    const minSize = 0.875;
    const maxSize = 2.5;
    const fontSize = minSize + (maxSize - minSize) * ratio;
    const opacity = 0.6 + 0.4 * ratio;
    const fontWeight = 400 + Math.round(300 * ratio);

    return {
      fontSize: `${fontSize}rem`,
      opacity,
      fontWeight,
    };
  }

  return (
    <div className="py-8">
      <div className="flex flex-wrap justify-center items-baseline gap-x-3 gap-y-2 max-w-5xl mx-auto">
        {tags.map((tag) => {
          const style = getTagStyle(tag.count);
          return (
            <Link
              key={tag.name}
              href={`/search?tags=${encodeURIComponent(tag.name)}`}
              className="text-gray-600 hover:text-orange-600 transition-colors"
              style={{
                fontSize: style.fontSize,
                opacity: style.opacity,
                fontWeight: style.fontWeight,
              }}
            >
              {tag.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
