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
}

const DOCS_DIRECTORY = path.join(process.cwd(), "content");

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

export function getAllDocs(): Doc[] {
  if (!fs.existsSync(DOCS_DIRECTORY)) {
    return [];
  }

  const files = fs.readdirSync(DOCS_DIRECTORY);
  const markdownFiles = files.filter((file) => file.endsWith(".md"));

  return markdownFiles.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const fullPath = path.join(DOCS_DIRECTORY, file);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { frontmatter, content } = parseFrontmatter(fileContents);

    return {
      slug,
      frontmatter,
      content,
    };
  });
}

export function getDocBySlug(slug: string): Doc | null {
  const fullPath = path.join(DOCS_DIRECTORY, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { frontmatter, content } = parseFrontmatter(fileContents);

  return {
    slug,
    frontmatter,
    content,
  };
}


