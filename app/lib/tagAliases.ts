// Tag aliases configuration
// Format: "short-tag": ["alias1", "alias2", ...]
// Short tags match database storage (e.g., "llm" not "large-language-model")
// Aliases can be Chinese, abbreviations, or common variations
//
// To add aliases: yarn extract-tags

export const TAG_ALIASES: Record<string, string[]> = {
    "ai": ["人工智能", "AI", "artificial-intelligence"],
    "aigc": ["生成式AI", "生成式人工智能", "generative-ai"],
    "algorithms": ["算法", "Algorithms"],
    "analysis": ["分析", "Analysis"],
    "analytics": ["数据分析", "Analytics"],
    "android": ["Android", "安卓"],
    "angular": ["Angular"],
    "aws": ["AWS", "Amazon Web Services", "亚马逊云"],
    "azure": ["Azure", "微软云"],
    "backend": ["后端", "Backend"],
    "bigdata": ["大数据", "big-data", "Big Data"],
    "blockchain": ["区块链", "Blockchain", "Web3"],
    "c": ["C语言", "C"],
    "chinese": ["中文", "Chinese"],
    "cicd": ["CI/CD", "持续集成", "持续部署"],
    "cli": ["命令行", "CLI", "command-line"],
    "cpp": ["C++", "c++"],
    "cryptography": ["密码学", "加密"],
    "css": ["CSS", "样式"],
    "cv": ["计算机视觉", "CV", "computer-vision"],
    "dataeng": ["数据工程", "data-engineering", "Data Engineering"],
    "datascience": ["数据科学", "data-science", "Data Science"],
    "datastructure": ["数据结构", "data-structures", "Data Structures"],
    "defi": ["DeFi", "去中心化金融"],
    "designpattern": ["设计模式", "design-patterns", "Design Patterns"],
    "devops": ["DevOps"],
    "distributed": ["分布式系统", "distributed-systems"],
    "django": ["Django"],
    "dl": ["深度学习", "deep-learning", "神经网络"],
    "docker": ["Docker", "docker", "容器"],
    "editor": ["编辑器", "Editor"],
    "embedded": ["嵌入式", "Embedded"],
    "embodied": ["具身智能", "Embodied Intelligence"],
    "es": ["Elasticsearch", "elasticsearch", "搜索引擎"],
    "ethereum": ["以太坊", "Ethereum"],
    "flutter": ["Flutter"],
    "frontend": ["前端", "Frontend"],
    "gcp": ["GCP", "Google Cloud", "谷歌云"],
    "general": [],
    "github": [],
    "golang": ["Go", "Golang", "go语言"],
    "hardware": ["硬件", "Hardware"],
    "html": ["HTML"],
    "ios": ["iOS", "苹果开发"],
    "java": ["Java", "java语言"],
    "javascript": ["JavaScript", "JS", "js", "ECMAScript"],
    "journal": [],
    "journalism": [],
    "k8s": ["Kubernetes", "kubernetes", "容器编排"],
    "kernel": ["内核", "Kernel"],
    "kotlin": ["Kotlin"],
    "linux": ["Linux", "linux"],
    "llm": ["大语言模型", "LLM", "large-language-model", "大模型"],
    "llm-inference": ["大模型推理", "LLM Inference", "llm-inference", "推理"],
    "maker": [],
    "microservice": ["微服务", "microservices", "Microservices"],
    "ml": ["机器学习", "machine-learning"],
    "mongo": ["MongoDB", "mongodb"],
    "mysql": ["MySQL", "mysql"],
    "neovim": ["Neovim", "neovim"],
    "news": ["新闻"],
    "nextjs": ["Next.js", "NextJS"],
    "nft": ["NFT", "非同质化代币"],
    "nlp": ["自然语言处理", "NLP", "natural-language-processing"],
    "nodejs": ["Node.js", "NodeJS", "node"],
    "os": ["操作系统", "operating-system"],
    "performance": ["性能优化", "Performance"],
    "php": ["PHP", "php语言"],
    "pl": ["编程语言", "programming-languages", "Programming Languages", "语言"],
    "postgres": ["PostgreSQL", "Postgres", "PG", "pg", "postgresql"],
    "python": ["Python", "python编程", "py"],
    "react": ["React", "ReactJS", "react.js"],
    "redis": ["Redis", "缓存"],
    "research": ["研究", "Research"],
    "rl": ["强化学习", "reinforcement-learning"],
    "rn": ["React Native", "react-native"],
    "robotics": [],
    "ruby": ["Ruby", "ruby语言"],
    "rust": ["Rust", "rust语言", "rust编程"],
    "science": ["科学", "Science"],
    "security": ["安全", "网络安全", "Security"],
    "serverless": ["无服务器", "Serverless"],
    "sglang": ["SGLang"],
    "short-tag": ["alias1", "alias2"],
    "smart-contract": ["智能合约", "smart-contracts", "Smart Contracts"],
    "spring": ["Spring", "Spring Boot"],
    "svelte": ["Svelte"],
    "swift": ["Swift"],
    "systems": ["系统"],
    "terminal": ["终端", "Terminal"],
    "terraform": ["Terraform", "IaC"],
    "testing": ["测试", "Testing"],
    "theory": ["理论", "Theory"],
    "tools": ["工具", "Tools"],
    "trending": ["趋势", "Trending"],
    "typescript": ["TypeScript", "TS", "ts"],
    "vue": ["Vue", "VueJS", "vue.js", "vue框架"],
    "web": [],
    "zig": [],
};

// Build reverse lookup map: alias -> main tag
const REVERSE_ALIAS_MAP: Map<string, string> = new Map();

function buildReverseMap() {
  for (const [mainTag, aliases] of Object.entries(TAG_ALIASES)) {
    REVERSE_ALIAS_MAP.set(mainTag.toLowerCase(), mainTag);
    for (const alias of aliases) {
      REVERSE_ALIAS_MAP.set(alias.toLowerCase(), mainTag);
    }
  }
}

buildReverseMap();

export function resolveTagAlias(input: string): string {
  const normalized = input.toLowerCase().trim();
  const resolved = REVERSE_ALIAS_MAP.get(normalized);
  if (resolved) {
    return resolved;
  }
  return normalized;
}

export function resolveTagAliasesForSearchQuery(input: string): string[] {
  const normalized = input.toLowerCase().trim();
  if (!normalized) {
    return [];
  }

  const exact = REVERSE_ALIAS_MAP.get(normalized);
  if (exact) {
    return [exact];
  }

  const matches = new Set<string>();

  for (const [mainTag, aliases] of Object.entries(TAG_ALIASES)) {
    if (mainTag.includes(normalized)) {
      matches.add(mainTag);
      continue;
    }

    if (aliases.some((alias) => alias.toLowerCase().includes(normalized))) {
      matches.add(mainTag);
    }
  }

  if (matches.size > 0) {
    return Array.from(matches);
  }

  return [normalized];
}

export function resolveTagAliases(tags: string[]): string[] {
  return tags.map((tag) => resolveTagAlias(tag));
}

export function hasAliases(tag: string): boolean {
  const normalized = tag.toLowerCase().trim();
  return TAG_ALIASES[normalized] !== undefined;
}

export function getAliases(mainTag: string): string[] | undefined {
  return TAG_ALIASES[mainTag.toLowerCase()];
}

export function getAllMainTags(): string[] {
  return Object.keys(TAG_ALIASES);
}

export function getAliasStats(): {
  totalMainTags: number;
  totalAliases: number;
  averageAliasesPerTag: number;
} {
  const totalMainTags = Object.keys(TAG_ALIASES).length;
  const totalAliases = Object.values(TAG_ALIASES).reduce(
    (sum, aliases) => sum + aliases.length,
    0
  );

  return {
    totalMainTags,
    totalAliases,
    averageAliasesPerTag: totalAliases / totalMainTags,
  };
}

export function findMatchingTags(
  query: string,
  limit: number = 10
): Array<{ tag: string; match: string; isAlias: boolean }> {
  const normalizedQuery = query.toLowerCase().trim();
  const results: Array<{ tag: string; match: string; isAlias: boolean }> = [];

  for (const [mainTag, aliases] of Object.entries(TAG_ALIASES)) {
    if (mainTag.includes(normalizedQuery)) {
      results.push({ tag: mainTag, match: mainTag, isAlias: false });
    }
    for (const alias of aliases) {
      if (alias.toLowerCase().includes(normalizedQuery)) {
        results.push({ tag: mainTag, match: alias, isAlias: true });
      }
    }
    if (results.length >= limit) break;
  }

  return results.slice(0, limit);
}
