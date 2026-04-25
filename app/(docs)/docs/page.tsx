import Link from "next/link";
import { getAllDocs } from "@/lib/mdx";

const DOC_ORDER: Record<string, number> = {
  quick_start: 0,
  configuration: 1,
  scoring: 2,
  scrapers: 3,
  api: 4,
  about_us: 5,
  "horizon-hub-design": 6,
};

function sortDocs(left: { slug: string; frontmatter: { title: string } }, right: { slug: string; frontmatter: { title: string } }) {
  const leftOrder = DOC_ORDER[left.slug] ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = DOC_ORDER[right.slug] ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return left.frontmatter.title.localeCompare(right.frontmatter.title);
}

export default function DocsIndexPage() {
  const docs = getAllDocs().sort(sortDocs);

  return (
    <div>
      <h1>Documentation</h1>

      <div className="grid gap-6 md:grid-cols-1 not-prose">
        {docs.map((doc) => (
          <Link
            key={doc.slug}
            href={`/docs/${doc.slug}`}
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-2">{doc.frontmatter.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{doc.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
