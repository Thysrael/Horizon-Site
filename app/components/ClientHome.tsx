'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Source, Contributor, CommunityStats } from "../types";
import { TagCloud } from "./TagCloud";
import { SourceCard } from "./SourceCard";

export type { Source, Contributor };

export function TypingSubtitle() {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "AI-Powered, Community-Driven";

  useEffect(() => {
    if (displayText.length < fullText.length) {
      const randomDelay = 30 + Math.random() * 120;
      const timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length + 1));
      }, randomDelay);
      return () => clearTimeout(timeout);
    }
  }, [displayText]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <p className="mt-6 text-xl text-gray-500 font-medium">
      <span className="relative inline-block">
        {displayText}
        <span
          className={`absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-orange-500 transition-opacity duration-75 ${
            showCursor ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </span>
    </p>
  );
}

export function AnimatedSlogan() {
  return (
    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl cursor-default leading-tight">
      <span className="block mb-4 text-gray-900">
        Enjoy the{' '}
        <span className="relative inline-block text-orange-500 group">
          News
          <svg className="absolute -bottom-1 left-0 w-0 group-hover:w-full transition-all duration-250 ease-out h-3 overflow-visible" viewBox="0 0 100 10" preserveAspectRatio="none">
            <path
              d="M0 8 Q 50 2, 100 8"
              stroke="#f97316"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </svg>
        </span>
        {' '}itself
      </span>
      <span className="text-gray-900">
        Leave others to{' '}
        <span className="relative inline-block text-orange-500 group">
          Horizon
          <svg className="absolute -bottom-1 left-0 w-0 group-hover:w-full transition-all duration-250 ease-out h-3 overflow-visible" viewBox="0 0 120 10" preserveAspectRatio="none">
            <path
              d="M0 8 Q 60 2, 120 8"
              stroke="#f97316"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </svg>
        </span>
      </span>
    </h1>
  );
}

export function FloatingParticles() {
  const particles = [
    { left: 15, top: 20, delay: 0, duration: 18 },
    { left: 25, top: 60, delay: 2, duration: 22 },
    { left: 40, top: 15, delay: 1, duration: 20 },
    { left: 55, top: 70, delay: 3, duration: 19 },
    { left: 70, top: 25, delay: 4, duration: 21 },
    { left: 85, top: 65, delay: 2, duration: 17 },
    { left: 10, top: 80, delay: 1, duration: 23 },
    { left: 45, top: 40, delay: 3, duration: 16 },
    { left: 60, top: 85, delay: 0, duration: 20 },
    { left: 80, top: 35, delay: 4, duration: 19 },
    { left: 30, top: 75, delay: 2, duration: 18 },
    { left: 90, top: 50, delay: 1, duration: 22 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 bg-orange-300/40 rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function AuthButton() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  if (status === "loading") {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (session) {
    return (
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button className="flex items-center rounded-full p-0.5 hover:bg-gray-100 transition-colors cursor-pointer">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user?.name || "User"}
              width={32}
              height={32}
              unoptimized
              className="h-8 w-8 rounded-full border border-gray-200"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-xs font-semibold text-gray-500">
              {(session.user?.name || session.user?.email || "U").slice(0, 1).toUpperCase()}
            </div>
          )}
        </button>

        <div className={`${isOpen ? "block" : "hidden"} absolute right-0 top-full pt-1`}>
          <div className="w-48 rounded-lg border border-gray-100 bg-white py-2 shadow-lg ring-1 ring-black/5">
            <div className="border-b border-gray-100 px-4 py-2">
              <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
            </div>
            {session.user?.isAdmin && (
              <Link
                href="/admin"
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Admin
              </Link>
            )}
            <Link
              href="/profile/votes"
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              My Votes
            </Link>
            <button
              onClick={() => signOut()}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("github")}
      className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
    >
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      <span className="hidden sm:inline">Sign in</span>
    </button>
  );
}

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push("/search");
    }
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-lg py-4 px-4">
          <div className="flex flex-col gap-3">
            <form onSubmit={handleSearch} className="relative px-4 py-2">
              <svg className="absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search sources..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-base text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
              />
            </form>
            <hr className="border-gray-100 mx-4" />
            <Link href="/" className="px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              Sources
            </Link>
            <Link href="/docs" className="px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
              Docs
            </Link>
            <Link href="/about" className="px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
              About
            </Link>
            <Link href="/submit" className="px-4 py-2 text-base font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
              Submit Source
            </Link>
            <hr className="border-gray-100 mx-4" />
            {session ? (
              <button 
                onClick={() => signOut()}
                className="px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                Logout ({session.user?.name})
              </button>
            ) : (
              <button 
                onClick={() => signIn("github")}
                className="px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-left flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Login with GitHub
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface TabViewProps {
  sources: Source[];
  contributors: Contributor[];
  stats: CommunityStats;
  userVotedSourceIds?: Set<string>;
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
}

export function TabView({ sources, contributors, stats, userVotedSourceIds }: TabViewProps) {
  const [activeTab, setActiveTab] = useState<'community' | 'demo' | 'contributors' | 'tags' | 'stats'>('stats');
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) {
      return;
    }

    const updateHeight = () => {
      setContentHeight(element.offsetHeight);
    };

    updateHeight();

    const animationFrame = window.requestAnimationFrame(updateHeight);
    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [activeTab]);

  return (
    <div>
      <div className="mb-8 flex justify-center">
        <div className="no-scrollbar -mx-4 flex w-screen snap-x snap-mandatory gap-2 overflow-x-auto px-4 sm:mx-0 sm:w-auto sm:max-w-3xl sm:justify-center sm:overflow-visible sm:rounded-full sm:bg-gray-100 sm:p-1.5">
          <button
            onClick={() => setActiveTab('demo')}
            className={`min-w-fit shrink-0 snap-start rounded-full border border-gray-200 bg-white px-4 py-2.5 text-center text-sm font-medium transition-all sm:border-transparent sm:bg-transparent sm:px-6 sm:text-base ${
              activeTab === 'demo'
                ? 'border-white bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 sm:hover:bg-white/70'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`min-w-fit shrink-0 snap-start rounded-full border border-gray-200 bg-white px-4 py-2.5 text-center text-sm font-medium transition-all sm:border-transparent sm:bg-transparent sm:px-6 sm:text-base ${
              activeTab === 'stats'
                ? 'border-white bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 sm:hover:bg-white/70'
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`min-w-fit shrink-0 snap-start rounded-full border border-gray-200 bg-white px-4 py-2.5 text-center text-sm font-medium transition-all sm:border-transparent sm:bg-transparent sm:px-6 sm:text-base ${
              activeTab === 'community'
                ? 'border-white bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 sm:hover:bg-white/70'
            }`}
          >
            Sources
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`min-w-fit shrink-0 snap-start rounded-full border border-gray-200 bg-white px-4 py-2.5 text-center text-sm font-medium transition-all sm:border-transparent sm:bg-transparent sm:px-6 sm:text-base ${
              activeTab === 'tags'
                ? 'border-white bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 sm:hover:bg-white/70'
            }`}
          >
            Tags
          </button>
          <button
            onClick={() => setActiveTab('contributors')}
            className={`min-w-fit shrink-0 snap-start rounded-full border border-gray-200 bg-white px-4 py-2.5 text-center text-sm font-medium transition-all sm:border-transparent sm:bg-transparent sm:px-6 sm:text-base ${
              activeTab === 'contributors'
                ? 'border-white bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 sm:hover:bg-white/70'
            }`}
          >
            Contributors
          </button>
        </div>
      </div>

      <div
        className="min-h-[42rem] transition-[height] duration-300 ease-out sm:min-h-[38rem]"
        style={contentHeight ? { height: `${contentHeight}px` } : undefined}
      >
        <div ref={contentRef}>
          {activeTab === 'demo' ? (
            <DemoTab />
          ) : activeTab === 'community' ? (
            <SourcesTab sources={sources} userVotedSourceIds={userVotedSourceIds} />
          ) : activeTab === 'tags' ? (
            <TagsTab />
          ) : activeTab === 'stats' ? (
            <StatisticsTab stats={stats} />
          ) : (
            <ContributorsTab contributors={contributors} />
          )}
        </div>
      </div>
    </div>
  );
}

function StatisticsTab({ stats }: { stats: CommunityStats }) {
  const statCards = [
    {
      label: "Curated sources",
      value: stats.approvedSources,
      eyebrow: "Signal over noise",
      valueTone: "text-white",
      copyTone: "text-orange-100/80",
      accent: "bg-orange-400",
    },
    {
      label: "GitHub stars",
      value: stats.githubStars,
      eyebrow: "Open-source proof",
      valueTone: "text-white",
      copyTone: "text-orange-100/80",
      accent: "bg-amber-400",
    },
  ];

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Community in numbers</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          A quick snapshot of how many people are joining, contributing sources, and backing Horizon in public.
        </p>
      </div>

      <div className="mx-auto max-w-[51rem]">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-gray-950 p-7 text-white shadow-2xl shadow-gray-900/20 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.42),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.18),transparent_38%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              Live community snapshot
            </div>
            <p className="mt-6 max-w-xl text-4xl font-bold tracking-tight sm:text-[3.25rem]">
              {formatCompactNumber(stats.totalUsers)}+ people are already shaping the feed.
            </p>
            <p className="mt-5 max-w-xl text-sm leading-6 text-gray-300 sm:text-base">
              Horizon works because real people keep adding sharper sources, voting on what matters,
              and building a stronger signal layer together.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200/90">
                        {card.eyebrow}
                      </p>
                      <p className={`mt-4 text-4xl font-bold tracking-tight sm:text-5xl ${card.valueTone}`}>
                        {typeof card.value === "number" ? formatCompactNumber(card.value) : "--"}
                      </p>
                      <p className={`mt-2 text-sm sm:text-base ${card.copyTone}`}>{card.label}</p>
                    </div>
                    <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${card.accent}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoTab() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">See it in action</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Horizon automatically curates, summarizes, and enriches tech news from multiple sources.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="group relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 opacity-20 blur transition-opacity group-hover:opacity-30" />
          <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs font-medium text-gray-500">Daily Overview</span>
              </div>
            </div>
            <div className="relative overflow-hidden bg-gray-100">
              <Image
                src="/overview_en.png"
                alt="Horizon Daily Overview"
                width={800}
                height={600}
                className="h-auto w-full object-contain transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
          <p className="mt-4 text-center text-base text-gray-600">
            <span className="font-semibold text-gray-900">AI-Powered Curation</span> — Automatically selects the most important tech news from hundreds of sources.
          </p>
        </div>

        <div className="group relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 opacity-20 blur transition-opacity group-hover:opacity-30" />
          <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs font-medium text-gray-500">Detailed Summary</span>
              </div>
            </div>
            <div className="relative overflow-hidden bg-gray-100">
              <Image
                src="/one_news_en.png"
                alt="Horizon News Detail"
                width={800}
                height={600}
                className="h-auto w-full object-contain transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
          <p className="mt-4 text-center text-base text-gray-600">
            <span className="font-semibold text-gray-900">Rich Context</span> — Each story includes AI summary, background, references, and community discussion.
          </p>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href="https://thysrael.github.io/Horizon/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3 text-base font-medium text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/30 transition-all"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Live Demo
        </a>
      </div>
    </div>
  );
}

interface SourcesTabProps {
  sources: Source[];
  userVotedSourceIds?: Set<string>;
}

function SourcesTab({ sources, userVotedSourceIds }: SourcesTabProps) {
  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Top Sources</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Community-curated list of the best news sources, ranked by votes.
        </p>
      </div>

      <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="divide-y divide-gray-100">
          {sources.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p className="text-lg font-medium">No sources found</p>
              <p className="mt-2 text-sm">Try adjusting your search or check back later.</p>
            </div>
          ) : (
            sources.slice(0, 10).map((source) => (
              <SourceCard
                key={source.id}
                source={source}
                view="list"
                hasVoted={userVotedSourceIds?.has(source.id)}
                userVotedSourceIds={userVotedSourceIds}
              />
            ))
          )}
        </div>

        {sources.length > 10 && (
          <div className="mt-6 flex justify-center">
            <Link
              href="/search"
              className="rounded-full border border-gray-200 bg-white px-8 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              View all sources
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function TagsTab() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Popular Tags</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Discover sources by topic. Click any tag to explore.
        </p>
      </div>
      <TagCloud />
    </div>
  );
}

interface ContributorsTabProps {
  contributors: Contributor[];
}

function ContributorsTab({ contributors }: ContributorsTabProps) {
  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Contributors</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Thanks to these amazing people who have contributed sources to Horizon.
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        {contributors.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No contributors yet. Be the first to submit a source!</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {contributors.map((contributor) => (
              <div
                key={contributor.id}
                className="group flex flex-col items-center gap-3 transition-transform hover:scale-110"
              >
                <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-gray-200 shadow-md transition-all group-hover:border-orange-500 group-hover:shadow-lg">
                  <Image
                    src={contributor.image || "https://avatars.githubusercontent.com/u/0?v=4"}
                    alt={contributor.name || "Contributor"}
                    width={80}
                    height={80}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                  {contributor.name || "Anonymous"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function AnimatedLogo() {
  return (
    <div className="logo-wrapper relative h-10 w-[120px] cursor-pointer">
      <svg
        className="h-full w-full"
        viewBox="0 0 120 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          className="logo-shape"
          x="1.5"
          y="1.5"
          width="117"
          height="37"
          rx="4"
          fill="transparent"
          stroke="#f97316"
        />
      </svg>
      <div className="logo-text">
        Horizon
      </div>
    </div>
  );
}

interface SearchInputProps {
  initialQuery?: string;
}

export function SearchInput({ initialQuery = "" }: SearchInputProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        placeholder="Search sources..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="w-56 rounded-full border-0 bg-gray-100/80 pl-10 pr-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all"
      />
    </form>
  );
}
