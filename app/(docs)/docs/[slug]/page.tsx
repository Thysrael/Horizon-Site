import { notFound } from "next/navigation";
import { getDocBySlug, getAllDocs } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import Link from "next/link";

interface DocPageProps {
  params: Promise<{ slug: string }>;
}

const HORIZON_BLOB_BASE_URL =
  "https://github.com/Thysrael/Horizon/blob/main";

function resolveDocHref(currentSlug: string, href?: string): string | undefined {
  if (!href || href.startsWith("#")) {
    return href;
  }

  if (/^[a-z]+:/i.test(href) || href.startsWith("//")) {
    return href;
  }

  if (href.startsWith("/")) {
    return href;
  }

  if (href.endsWith(".md")) {
    const currentPath = `${currentSlug}.md`;
    const resolvedPath = new URL(href, `https://docs.horizon.local/${currentPath}`).pathname.slice(1);

    if (resolvedPath.startsWith("docs/")) {
      return `/docs/${resolvedPath.replace(/^docs\//, "").replace(/\.md$/, "")}`;
    }

    return `${HORIZON_BLOB_BASE_URL}/${resolvedPath}`;
  }

  return href;
}

export async function generateStaticParams() {
  const docs = getAllDocs();
  return docs.map((doc) => ({
    slug: doc.slug,
  }));
}

export async function generateMetadata({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    return { title: "Not Found" };
  }

  return {
    title: `${doc.frontmatter.title} - Horizon Docs`,
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  return (
    <MDXRemote
      source={doc.content}
      components={{
        a: ({ href, children, ...props }) => {
          const resolvedHref = resolveDocHref(slug, href);

          if (!resolvedHref) {
            return <a {...props}>{children}</a>;
          }

          if (resolvedHref.startsWith("/docs/")) {
            return (
              <Link
                href={resolvedHref}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                {children}
              </Link>
            );
          }

          const isExternal = /^https?:/i.test(resolvedHref);

          return (
            <a
              {...props}
              href={resolvedHref}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noreferrer" : undefined}
            >
              {children}
            </a>
          );
        },
      }}
      options={{
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypePrism],
        },
      }}
    />
  );
}
