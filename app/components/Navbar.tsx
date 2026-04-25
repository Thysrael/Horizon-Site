"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  AnimatedLogo,
  AuthButton,
  MobileMenu,
  SearchInput,
} from "./ClientHome";
import { CATEGORIES } from "@/app/lib/constants";
import { Category } from "@/app/types";

interface NavbarProps {
  searchQuery?: string;
  showSearch?: boolean;
}

interface CategoryCount {
  category: Category;
  count: number;
}

export function Navbar({ searchQuery, showSearch = true }: NavbarProps) {
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);

  useEffect(() => {
    async function fetchCategoryCounts() {
      try {
        const response = await fetch("/api/categories/counts");
        if (response.ok) {
          const data = await response.json();
          setCategoryCounts(data.categories || []);
        }
      } catch (error) {
        console.error("Failed to fetch category counts:", error);
      }
    }
    fetchCategoryCounts();
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100/50 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <AnimatedLogo />
          </Link>
          {showSearch && (
            <>
              <div className="hidden md:block h-6 w-px bg-gray-200" />
              <div className="hidden md:block">
                <SearchInput initialQuery={searchQuery} />
              </div>
            </>
          )}
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <div className="relative group">
            <Link
              href="/search"
              className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
            >
              Sources
              <svg
                className="h-3 w-3 transition-transform group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="w-64 rounded-xl border border-gray-200 bg-white shadow-lg py-2">
                {CATEGORIES.map((category) => {
                  const count = categoryCounts.find(c => c.category === category.id)?.count || 0;
                  return (
                    <Link
                      key={category.id}
                      href={`/search?category=${category.id}`}
                      className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <span>{category.name}</span>
                      <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                        {count}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link
              href="/docs"
              className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
            >
              Docs
              <svg
                className="h-3 w-3 transition-transform group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="w-56 rounded-xl border border-gray-200 bg-white shadow-lg py-2">
                <Link
                  href="/docs/configuration"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Configuration Guide
                </Link>
                <Link
                  href="/docs/scoring"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Scoring System
                </Link>
                <Link
                  href="/docs/scrapers"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Source Scrapers
                </Link>
                <Link
                  href="/docs/api"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  API Reference
                </Link>
              </div>
            </div>
          </div>
          <Link
            href="/docs/about_us"
            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            About Us
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <AuthButton />
          <Link
            href="/submit"
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-2 sm:px-4 text-sm font-medium text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105 transition-all"
          >
            <span className="text-lg leading-none">+</span>
            <span className="hidden sm:inline">Submit</span>
          </Link>
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}
