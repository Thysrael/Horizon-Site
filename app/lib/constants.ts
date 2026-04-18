import { Category } from "@prisma/client";
import { CategoryInfo } from "../types";

export const CATEGORIES: CategoryInfo[] = [
  {
    id: Category.GENERAL,
    name: "General",
    description: "Cross-disciplinary tech news and general discussions",
    keywords: ["news", "trends", "community", "discussion", "general"],
  },
  {
    id: Category.AI_ML,
    name: "AI / Machine Learning",
    description: "Artificial intelligence, deep learning, LLMs, and neural networks",
    keywords: ["ai", "ml", "llm", "deep learning", "neural network", "nlp", "computer vision"],
  },
  {
    id: Category.SYSTEMS,
    name: "Computer Systems",
    description: "Operating systems, distributed systems, databases, and infrastructure",
    keywords: ["linux", "kernel", "distributed", "database", "cloud", "kubernetes", "networking"],
  },
  {
    id: Category.SECURITY,
    name: "Security & Privacy",
    description: "Information security, cryptography, vulnerabilities, and privacy",
    keywords: ["security", "vulnerability", "cryptography", "privacy", "pentesting", "cve"],
  },
  {
    id: Category.PL,
    name: "Programming Languages",
    description: "Language design, compilers, type systems, and language implementations",
    keywords: ["compiler", "type system", "rust", "haskell", "ocaml", "wasm"],
  },
  {
    id: Category.WEBDEV,
    name: "Web Development",
    description: "Frontend, backend, web APIs, and browser technologies",
    keywords: ["frontend", "backend", "javascript", "react", "api", "css", "html"],
  },
  {
    id: Category.EMBEDDED,
    name: "Embedded & Hardware",
    description: "IoT, microcontrollers, robotics, and hardware development",
    keywords: ["embedded", "iot", "arduino", "raspberry pi", "robotics", "hardware"],
  },
  {
    id: Category.DEV_ECOSYSTEM,
    name: "Developer Ecosystem",
    description: "Developer tools, open source, CI/CD, and workflows",
    keywords: ["devtools", "git", "ci-cd", "open source", "testing", "vscode"],
  },
  {
    id: Category.EMERGING_TECH,
    name: "Emerging Tech",
    description: "Biotech, clean energy, space, and cutting-edge innovations",
    keywords: ["biotech", "space", "quantum", "clean energy", "blockchain", "ar-vr"],
  },
  {
    id: Category.INDUSTRY,
    name: "Tech Industry",
    description: "Company news, funding, policy, and market trends",
    keywords: ["startup", "funding", "big tech", "regulation", "market"],
  },
  {
    id: Category.SCIENCE,
    name: "Science & Mathematics",
    description: "Research, mathematics, physics, and fundamental science",
    keywords: ["research", "mathematics", "physics", "algorithm", "theory"],
  },
];

export const CATEGORY_MAP: Record<Category, CategoryInfo> = CATEGORIES.reduce(
  (acc, cat) => ({ ...acc, [cat.id]: cat }),
  {} as Record<Category, CategoryInfo>
);

export const VALID_SOURCE_TYPES = [
  "RSS",
  "HACKER_NEWS",
  "REDDIT",
  "TELEGRAM",
  "GITHUB",
  "NEWSLETTER",
  "OTHER",
] as const;
