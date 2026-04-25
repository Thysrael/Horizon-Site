import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface DocFrontmatter {
  title: string;
  layout?: string;
  date?: string;
  lang?: "en" | "zh";
  [key: string]: unknown;
}

export interface Doc {
  slug: string;
  frontmatter: DocFrontmatter;
  content: string;
  excerpt: string;
}

const LOCAL_DOCS_DIRECTORY = path.join(process.cwd(), "content");
const PRODUCT_DOCS_DIRECTORY = path.join(process.cwd(), "external", "horizon", "docs");
const EXCLUDED_DOC_SLUGS = new Set(["index"]);
const SUBMODULE_SETUP_MESSAGE =
  "Horizon docs submodule is missing. Run `git submodule update --init --recursive` before starting or building the site.";

interface DocSource {
  directory: string;
  required: boolean;
}

const DOC_SOURCES: DocSource[] = [
  { directory: LOCAL_DOCS_DIRECTORY, required: false },
  { directory: PRODUCT_DOCS_DIRECTORY, required: true },
];

export function parseFrontmatter(content: string): {
  frontmatter: DocFrontmatter;
  content: string;
} {
  const { data, content: body } = matter(content);

  return {
    frontmatter: {
      title: data.title || "Untitled",
      layout: data.layout,
      date: data.date,
      lang: data.lang,
      ...data,
    },
    content: body,
  };
}

function getMarkdownFiles(directory: string): string[] {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  return entries
    .flatMap((entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return getMarkdownFiles(entryPath);
      }

      return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : [];
    })
    .sort((left, right) => left.localeCompare(right));
}

function ensureDocsDirectory(directory: string, required: boolean): boolean {
  if (!fs.existsSync(directory)) {
    if (required) {
      throw new Error(SUBMODULE_SETUP_MESSAGE);
    }

    return false;
  }

  return true;
}

function ensureProductDocsDirectory(): void {
  if (!fs.existsSync(PRODUCT_DOCS_DIRECTORY)) {
    throw new Error(SUBMODULE_SETUP_MESSAGE);
  }
}

function slugFromFilePath(filePath: string, rootDirectory: string): string {
  const slug = path
    .relative(rootDirectory, filePath)
    .replace(/\.md$/, "")
    .split(path.sep)
    .join("/");

  if (slug.includes("/")) {
    throw new Error(
      `Nested docs are not supported by /docs/[slug]. Move \`${slug}.md\` to the top level or upgrade the route to a catch-all segment.`,
    );
  }

  return slug;
}

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractExcerpt(content: string): string {
  const sections = content
    .split(/\n\s*\n/)
    .map((section) => ({
      raw: section.trim(),
      text: stripMarkdown(section),
    }))
    .filter((section) => section.text.length > 0);

  return sections.find((section) => !section.raw.startsWith("#"))?.text ?? "Documentation";
}

function readDocFile(filePath: string, rootDirectory: string): Doc | null {
  const slug = slugFromFilePath(filePath, rootDirectory);

  if (EXCLUDED_DOC_SLUGS.has(slug)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { frontmatter, content } = parseFrontmatter(fileContents);

  return {
    slug,
    frontmatter,
    content,
    excerpt: extractExcerpt(content),
  };
}

function collectDocsFromDirectory(source: DocSource): Doc[] {
  if (!ensureDocsDirectory(source.directory, source.required)) {
    return [];
  }

  return getMarkdownFiles(source.directory)
    .map((filePath) => readDocFile(filePath, source.directory))
    .filter((doc): doc is Doc => doc !== null);
}

function buildDocIndex(): Map<string, Doc> {
  const docs = DOC_SOURCES.flatMap((source) => collectDocsFromDirectory(source));
  const docIndex = new Map<string, Doc>();

  for (const doc of docs) {
    if (docIndex.has(doc.slug)) {
      throw new Error(`Duplicate doc slug detected: ${doc.slug}`);
    }

    docIndex.set(doc.slug, doc);
  }

  return docIndex;
}

export function getAllDocs(): Doc[] {
  return Array.from(buildDocIndex().values());
}

export function getDocBySlug(slug: string): Doc | null {
  ensureProductDocsDirectory();

  if (EXCLUDED_DOC_SLUGS.has(slug)) {
    return null;
  }

  return buildDocIndex().get(slug) ?? null;
}
