"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TagCloud as ReactTagCloud, type Tag, type RendererFunction } from "react-tagcloud";

interface TagWithCount {
  name: string;
  count: number;
}

const customRenderer: RendererFunction = (tag, size, color) => {
  return (
    <span
      key={tag.value}
      className="tag-cloud-tag inline-block transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 cursor-pointer"
      style={{
        color,
        fontSize: size,
        margin: "3px 5px",
        lineHeight: 1.4,
      }}
    >
      <Link
        href={`/search?tags=${encodeURIComponent(tag.value)}`}
        className="text-current no-underline hover:text-current"
      >
        {tag.value}
      </Link>
    </span>
  );
};

export function TagCloud() {
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch("/api/tags?limit=50");
        if (response.ok) {
          const data = await response.json();
          setTags(data.tags || []);
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

  const data: Tag[] = tags.map((tag) => ({
    value: tag.name,
    count: tag.count,
  }));

  return (
    <div className="py-8 flex justify-center">
      <div className="max-w-3xl w-full text-center">
        <ReactTagCloud
          tags={data}
          minSize={13}
          maxSize={36}
          shuffle={true}
          renderer={customRenderer}
          colorOptions={{
            luminosity: "bright",
            hue: "orange",
            format: "hex",
          }}
          className="tag-cloud"
        />
      </div>
    </div>
  );
}
