import { Category } from "@prisma/client";
import { CategoryInfo } from "../types";

export const CATEGORIES: CategoryInfo[] = [
  {
    id: Category.GENERAL,
    name: "General",
    name_zh: "综合技术",
    description: "Cross-disciplinary tech news and general discussions",
    description_zh: "跨领域技术新闻与综合讨论",
    keywords: ["news", "trends", "community", "discussion", "general"],
  },
  {
    id: Category.AI_ML,
    name: "AI / Machine Learning",
    name_zh: "人工智能 / 机器学习",
    description: "Artificial intelligence, deep learning, LLMs, and neural networks",
    description_zh: "人工智能、深度学习、大语言模型与神经网络",
    keywords: ["ai", "ml", "llm", "deep learning", "neural network", "nlp", "computer vision"],
  },
  {
    id: Category.SYSTEMS,
    name: "Computer Systems",
    name_zh: "系统 / 基础设施",
    description: "Operating systems, distributed systems, databases, and infrastructure",
    description_zh: "操作系统、分布式系统、数据库与基础设施",
    keywords: ["linux", "kernel", "distributed", "database", "cloud", "kubernetes", "networking"],
  },
  {
    id: Category.SECURITY,
    name: "Security & Privacy",
    name_zh: "安全 / 隐私",
    description: "Information security, cryptography, vulnerabilities, and privacy",
    description_zh: "信息安全、漏洞、密码学与隐私",
    keywords: ["security", "vulnerability", "cryptography", "privacy", "pentesting", "cve"],
  },
  {
    id: Category.PL,
    name: "Programming Languages",
    name_zh: "编程语言 / 编译器",
    description: "Language design, compilers, type systems, and language implementations",
    description_zh: "编程语言设计、编译器、类型系统与语言实现",
    keywords: ["compiler", "type system", "rust", "haskell", "ocaml", "wasm"],
  },
  {
    id: Category.WEBDEV,
    name: "Web Development",
    name_zh: "Web 开发",
    description: "Frontend, backend, web APIs, and browser technologies",
    description_zh: "前端、后端、Web API 与浏览器技术",
    keywords: ["frontend", "backend", "javascript", "react", "api", "css", "html"],
  },
  {
    id: Category.EMBEDDED,
    name: "Embedded & Hardware",
    name_zh: "嵌入式 / 硬件",
    description: "IoT, microcontrollers, robotics, and hardware development",
    description_zh: "IoT、微控制器、机器人与硬件开发",
    keywords: ["embedded", "iot", "arduino", "raspberry pi", "robotics", "hardware"],
  },
  {
    id: Category.DEV_ECOSYSTEM,
    name: "Developer Ecosystem",
    name_zh: "开源 / 开发工具",
    description: "Developer tools, open source, CI/CD, and workflows",
    description_zh: "开发者工具、开源、CI/CD 与工作流",
    keywords: ["devtools", "git", "ci-cd", "open source", "testing", "vscode"],
  },
  {
    id: Category.EMERGING_TECH,
    name: "Emerging Tech",
    name_zh: "新兴技术",
    description: "Biotech, clean energy, space, and cutting-edge innovations",
    description_zh: "生物科技、清洁能源、太空与前沿创新",
    keywords: ["biotech", "space", "quantum", "clean energy", "blockchain", "ar-vr"],
  },
  {
    id: Category.INDUSTRY,
    name: "Tech Industry",
    name_zh: "科技行业",
    description: "Company news, funding, policy, and market trends",
    description_zh: "公司动态、融资、政策与市场趋势",
    keywords: ["startup", "funding", "big tech", "regulation", "market"],
  },
  {
    id: Category.SCIENCE,
    name: "Science & Mathematics",
    name_zh: "科学 / 学术研究",
    description: "Research, mathematics, physics, and fundamental science",
    description_zh: "研究、数学、物理与基础科学",
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