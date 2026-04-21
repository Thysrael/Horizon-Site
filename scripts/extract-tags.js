#!/usr/bin/env node
/**
 * Extract tags from database and merge into tagAliases.ts
 * Preserves existing aliases, only adds new tags
 * Usage: node scripts/extract-tags.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const TAG_ALIASES_PATH = path.join(__dirname, '..', 'app', 'lib', 'tagAliases.ts');

function parseExistingAliases(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('⚠️  tagAliases.ts not found, will create new file');
    return {};
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const aliases = {};

  const regex = /"([^"]+)":\s*\[([^\]]*)\]/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const tag = match[1];
    const aliasesStr = match[2];
    const tagAliases = [];
    const aliasRegex = /"([^"]+)"/g;
    let aliasMatch;
    while ((aliasMatch = aliasRegex.exec(aliasesStr)) !== null) {
      tagAliases.push(aliasMatch[1]);
    }
    aliases[tag] = tagAliases;
  }

  return aliases;
}

function formatTagEntry(tag, aliases, indent) {
  if (aliases.length === 0) {
    return `${indent}"${tag}": [],`;
  }
  const aliasStr = aliases.map(a => `"${a}"`).join(', ');
  return `${indent}"${tag}": [${aliasStr}],`;
}

function formatTagEntryWithComment(tag, aliases, count, indent) {
  if (aliases.length === 0) {
    return `${indent}// Used ${count} times\n${indent}"${tag}": [],`;
  }
  const aliasStr = aliases.map(a => `"${a}"`).join(', ');
  return `${indent}"${tag}": [${aliasStr}],`;
}

function generateTagAliasesContent(allAliases, stats) {
  const entries = Object.entries(allAliases)
    .sort(([a], [b]) => a.localeCompare(b));

  const content = `// Tag aliases configuration
// Format: "short-tag": ["alias1", "alias2", ...]
// Short tags match database storage (e.g., "llm" not "large-language-model")
// Aliases can be Chinese, abbreviations, or common variations
//
// To add aliases: yarn extract-tags

export const TAG_ALIASES: Record<string, string[]> = {
${entries.map(([tag, aliases]) => `  ${formatTagEntry(tag, aliases, '  ')}`).join('\n')}
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
`;

  return content;
}

async function extractTags() {
  console.log('🔍 Extracting tags from database...\n');

  const prisma = new PrismaClient();

  try {
    const sources = await prisma.source.findMany({
      where: { status: 'APPROVED' },
      select: { tags: true },
    });

    // Also get PENDING sources to catch new tags early
    const pendingSources = await prisma.source.findMany({
      where: { status: 'PENDING' },
      select: { tags: true },
    });

    const allSources = [...sources, ...pendingSources];

    const tagCounts = new Map();
    for (const source of allSources) {
      for (const tag of source.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }

    const sortedTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1]);

    // Load existing aliases
    const existingAliases = parseExistingAliases(TAG_ALIASES_PATH);

    console.log(`📊 Found ${sortedTags.length} unique tags from ${allSources.length} sources`);
    console.log(`📖 Existing aliases: ${Object.keys(existingAliases).length} tags\n`);

    // Merge: keep existing, add new with empty aliases
    let newCount = 0;
    const mergedAliases = { ...existingAliases };

    for (const [tag, count] of sortedTags) {
      if (!mergedAliases[tag]) {
        mergedAliases[tag] = [];
        newCount++;
      }
    }

    // Count coverage stats
    const tagsWithAliases = Object.entries(mergedAliases)
      .filter(([, aliases]) => aliases.length > 0).length;
    const tagsWithoutAliases = Object.entries(mergedAliases)
      .filter(([, aliases]) => aliases.length === 0).length;

    console.log(`✅ Tags with aliases: ${tagsWithAliases}`);
    console.log(`⚠️  Tags without aliases (need Chinese translations):`);
    console.log();

    // Show tags that need aliases, sorted by usage
    const uncoveredEntries = sortedTags
      .filter(([tag]) => mergedAliases[tag] && mergedAliases[tag].length === 0)
      .slice(0, 20);

    uncoveredEntries.forEach(([tag, count], index) => {
      console.log(`  ${index + 1}. "${tag}" (used ${count} times)`);
    });

    if (newCount > 0) {
      console.log(`\n🆕 Added ${newCount} new tags to alias configuration`);
    } else {
      console.log('\n✨ No new tags to add — all tags are already in the configuration');
    }

    // Generate the full file content, preserving all existing aliases
    const content = generateTagAliasesContent(mergedAliases, {
      totalTags: sortedTags.length,
      tagsWithAliases,
      tagsWithoutAliases,
    });

    fs.writeFileSync(TAG_ALIASES_PATH, content);

    console.log(`\n📝 Updated: ${TAG_ALIASES_PATH}`);
    console.log(`   Coverage: ${((tagsWithAliases / Object.keys(mergedAliases).length) * 100).toFixed(1)}%`);
    console.log(`   Fill in Chinese translations for tags with empty aliases: []\n`);

  } catch (error) {
    console.error('❌ Error extracting tags:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

extractTags();