import type { Metadata } from "next";
import Link from "next/link";
import NavbarWrapper from "./NavbarWrapper";

export const metadata: Metadata = {
  title: "Documentation - Horizon",
  description: "Horizon documentation and guides",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <NavbarWrapper />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-8 flex items-center space-x-4 text-sm">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            href="/docs"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            Docs
          </Link>
        </nav>
        <main className="prose dark:prose-invert max-w-none">{children}</main>
      </div>
    </div>
  );
}
