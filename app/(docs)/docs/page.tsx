import Link from "next/link";

const DOCS = [
  {
    slug: "quick_start",
    title: "Quick Start",
    description: "Learn how to submit sources and configure Horizon in 3 easy steps",
  },
  {
    slug: "configuration",
    title: "Configuration Guide",
    description: "AI providers, information sources, filtering, and environment variable substitution",
  },
  {
    slug: "scoring",
    title: "Scoring System",
    description: "AI-based content analysis and the 0-10 scoring scale",
  },
  {
    slug: "scrapers",
    title: "Source Scrapers",
    description: "How Horizon collects content from GitHub, Hacker News, RSS, Reddit, and Telegram",
  },
  {
    slug: "api",
    title: "API Reference",
    description: "REST APIs for accessing sources, votes, and search functionality",
  },
  {
    slug: "about_us",
    title: "About Us",
    description: "Learn about Horizon's mission, team, and technology stack",
  },
];

export default function DocsIndexPage() {
  return (
    <div>
      <h1>Documentation</h1>

      <div className="grid gap-6 md:grid-cols-1 not-prose">
        {DOCS.map((doc) => (
          <Link
            key={doc.slug}
            href={`/docs/${doc.slug}`}
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-2">{doc.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{doc.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
