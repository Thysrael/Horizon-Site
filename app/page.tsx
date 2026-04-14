'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

function getSourceIcon(type: string): string {
  const icons: Record<string, string> = {
    "Hacker News": "/hackernews-svgrepo-com.svg",
    "RSS": "/rss-svgrepo-com.svg",
    "Reddit": "/reddit-svgrepo-com.svg",
    "Telegram": "/telegram-svgrepo-com.svg",
    "GitHub": "/github-svgrepo-com.svg",
  };
  return icons[type] || "/rss-svgrepo-com.svg";
}

function TypingSubtitle() {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "AI-Powered, Community-Driven";
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (displayText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
    }
  }, [displayText]);

  useEffect(() => {
    if (isTypingComplete) {
      const interval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 530);
      return () => clearInterval(interval);
    }
  }, [isTypingComplete]);

  return (
    <p className="mt-6 text-xl text-gray-500 font-medium relative inline-block">
      {displayText}
      <span
        className={`absolute right-[-4px] top-1/2 -translate-y-1/2 w-0.5 h-6 bg-orange-500 transition-opacity duration-100 ${
          showCursor ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </p>
  );
}

function AnimatedSlogan() {
  return (
    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl cursor-default leading-tight">
      <span className="block mb-4 text-gray-900">
        Enjoy the{' '}
        <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 group">
          News
          <span className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-orange-500 to-red-600 w-0 group-hover:w-full transition-all duration-500 ease-out rounded-full" />
        </span>
        {' '}itself
      </span>
      <span className="text-gray-900">
        Leave the others to{' '}
        <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 group">
          Horizon
          <span className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-orange-500 to-red-600 w-0 group-hover:w-full transition-all duration-500 ease-out rounded-full" />
        </span>
      </span>
    </h1>
  );
}

function FloatingParticles() {
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

function GlowingOrb() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-500/20 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute inset-10 bg-gradient-to-r from-orange-300/10 to-red-400/10 rounded-full blur-[80px] animate-pulse-slow delay-1000" />
    </div>
  );
}

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

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
            <Link href="/" className="px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              Sources
            </Link>
            <Link href="/doc" className="px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
              Documents
            </Link>
            <Link href="/about" className="px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
              About
            </Link>
            <hr className="border-gray-100" />
            <button className="px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-left">
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TabView() {
  const [activeTab, setActiveTab] = useState<'demo' | 'community' | 'contributors'>('community');

  return (
    <div>
      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-full bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('demo')}
            className={`rounded-full px-6 py-2.5 text-base font-medium transition-all ${
              activeTab === 'demo'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`rounded-full px-6 py-2.5 text-base font-medium transition-all ${
              activeTab === 'community'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sources
          </button>
          <button
            onClick={() => setActiveTab('contributors')}
            className={`rounded-full px-6 py-2.5 text-base font-medium transition-all ${
              activeTab === 'contributors'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Contributors
          </button>
        </div>
      </div>

      {activeTab === 'demo' ? (
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
      ) : activeTab === 'community' ? (
        <div>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Top Sources</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Community-curated list of the best news sources, ranked by votes.
            </p>
          </div>

          <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="divide-y divide-gray-100">
              {sources.slice(0, 5).map((source, index) => (
                <article
                  key={index}
                  className="group flex items-center gap-4 py-4 transition-colors hover:bg-gray-50/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 overflow-hidden">
                    <Image
                      src={getSourceIcon(source.type)}
                      alt={source.type}
                      width={32}
                      height={32}
                      className="h-8 w-8 object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 group-hover:text-orange-500 transition-colors truncate">
                        {source.name}
                      </h3>
                      <span className="shrink-0 text-xs text-gray-400">({source.type})</span>
                    </div>

                    <p className="mt-0.5 text-sm text-gray-600 line-clamp-1">
                      {source.description}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span>@{source.author}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pl-4">
                    <button className="flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4l-8 8h5v8h6v-8h5z"/>
                      </svg>
                      <span>{source.votes}</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button className="rounded-full border border-gray-200 bg-white px-8 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                Load More
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Contributors</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Thanks to these amazing people who have contributed to Horizon.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="flex flex-wrap justify-center gap-6">
              {contributors.map((contributor, index) => (
                <a
                  key={index}
                  href={contributor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-3 transition-transform hover:scale-110"
                >
                  <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-gray-200 shadow-md transition-all group-hover:border-orange-500 group-hover:shadow-lg">
                    <img
                      src={contributor.avatar}
                      alt={contributor.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                    {contributor.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AnimatedLogo() {
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

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 border-b border-gray-100/50 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <AnimatedLogo />
            </Link>
            <div className="h-6 w-px bg-gray-200" />
            <div className="relative">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search sources..."
                className="w-56 rounded-full border-0 bg-gray-100/80 pl-10 pr-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">
              Sources
            </Link>
            <Link href="/doc" className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
              Documents
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
              About
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden sm:block rounded-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              Login
            </button>
            <button className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-2 sm:px-4 text-sm font-medium text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105 transition-all">
              <span className="text-lg leading-none">+</span>
              <span className="hidden sm:inline">Submit</span>
            </button>
            <MobileMenu />
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden border-b border-gray-100 min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-white" />
        <FloatingParticles />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-100" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center">
            <AnimatedSlogan />
            <TypingSubtitle />
            <div className="mt-10 flex justify-center gap-4">
              <button className="group flex items-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-base font-medium text-white shadow-2xl shadow-gray-900/20 hover:shadow-gray-900/40 hover:-translate-y-1 transition-all duration-300">
                <svg className="h-5 w-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Start
              </button>
              <a
                href="https://github.com/Thysrael/Horizon"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white/80 backdrop-blur-sm px-8 py-4 text-base font-medium text-gray-700 hover:bg-white hover:border-orange-300 hover:text-orange-600 transition-all duration-300"
              >
                <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-gray-50/50 to-white py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.03),transparent_70%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TabView />
        </div>
      </section>

      <footer className="mt-24 border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-orange-400 to-red-500 text-white text-xs font-bold">
                H
              </div>
              <span className="text-sm text-gray-600">© 2026 Horizon. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">GitHub</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Twitter</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const sources = [
  {
    name: "The Architecture of Open Source Applications",
    type: "Hacker News",
    votes: 342,
    description: "Architects look at thousands of buildings during their training, and study critiques of those buildings written by masters.",
    tags: ["Systems", "Architecture", "Education"],
    author: "thysrael",
  },
  {
    name: "Rust Weekly",
    type: "RSS",
    votes: 289,
    description: "A weekly newsletter about Rust programming language, featuring the latest updates, tutorials, and community news.",
    tags: ["Rust", "Programming", "Weekly"],
    author: "rustacean",
  },
  {
    name: "Papers with Code",
    type: "Reddit",
    votes: 456,
    description: "The latest in machine learning with papers, code, and evaluation tables.",
    tags: ["AI/ML", "Research", "Papers"],
    author: "researcher",
  },
  {
    name: "WebAssembly Weekly",
    type: "RSS",
    votes: 198,
    description: "Weekly newsletter about WebAssembly ecosystem, including new tools, tutorials, and use cases.",
    tags: ["WebAssembly", "Web", "Performance"],
    author: "wasmfan",
  },
  {
    name: "System Design Primer",
    type: "GitHub",
    votes: 567,
    description: "Learn how to design large-scale systems. Prep for the system design interview.",
    tags: ["Systems", "Interview", "Learning"],
    author: "donnemartin",
  },
  {
    name: "Securities Research",
    type: "Telegram",
    votes: 234,
    description: "Daily updates on cybersecurity research, vulnerabilities, and industry news.",
    tags: ["Security", "Research", "Daily"],
    author: "securityexpert",
  },
];

const contributors = [
  {
    name: "hyggge",
    avatar: "https://hyggge.github.io/medias/avatar.jpg",
    url: "https://hyggge.github.io/",
  },
  {
    name: "Dovahkiin",
    avatar: "https://the-tarnished.github.io/medias/avatar.jpg",
    url: "https://the-tarnished.github.io/",
  },
  {
    name: "saltyfishyjk",
    avatar: "https://saltyfishyjk.github.io/img/EMT.png",
    url: "https://saltyfishyjk.github.io/",
  },
  {
    name: "musel",
    avatar: "https://mmmusel.github.io/avatar/photo.jpg",
    url: "https://mmmusel.github.io/",
  },
  {
    name: "重结晶",
    avatar: "https://avatars.githubusercontent.com/u/99004256?v=4",
    url: "https://cjj826.github.io/",
  },
  {
    name: "ghy",
    avatar: "https://avatars.githubusercontent.com/u/99004256?v=4",
    url: "https://guo-hy.github.io/",
  },
  {
    name: "Zhang-kg",
    avatar: "https://zhang-kg.github.io/2023%E5%A4%B4%E5%83%8F.jpg",
    url: "https://zhang-kg.github.io/",
  },
  {
    name: "Master Tan",
    avatar: "https://avatars.githubusercontent.com/u/75460510?v=4",
    url: "https://master-tan.github.io/",
  },
  {
    name: "roife",
    avatar: "https://avatars.githubusercontent.com/u/17700217?v=4",
    url: "https://roife.github.io/",
  },
  {
    name: "Coekjan",
    avatar: "https://avatars.githubusercontent.com/u/69834864?v=4",
    url: "https://coekjan.github.io/",
  },
  {
    name: "Gwok Hiujin",
    avatar: "https://avatars.githubusercontent.com/u/70586936?v=4",
    url: "https://gwokhiujin.github.io/",
  },
  {
    name: "chlience",
    avatar: "https://avatars.githubusercontent.com/u/22586392?v=4",
    url: "https://chlience.com/",
  },
  {
    name: "Linyu",
    avatar: "https://avatars.githubusercontent.com/u/94553312?v=4",
    url: "https://www.linyu.cool/",
  },
];
