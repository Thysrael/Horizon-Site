export const BLOCKED_TAGS: string[] = [
  "trends",
  "community",
  "discussion",
  "analysis",
  "culture",
  "tutorial",
  "guide",
  "release",
  "announcement",
  "research",
  "paper",
  "benchmark",
  "performance",
  "deep-dive",
  "case-study",
  "interview",
  "retrospective",
  "open-source",
  "github",
  "blog",
  "newsletter",
  "podcast",
  "video",
  "conference",
  "general",
  "other",
  "misc",
  "various",
  "interesting",
  "good",
  "article",
  "post",
  "update",
  "weekly",
  "daily",
  "monthly",
];

export function normalizeTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\-\s]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);
}

export function isBlockedTag(tag: string): boolean {
  return BLOCKED_TAGS.includes(normalizeTag(tag));
}

export function isEnglishTag(tag: string): boolean {
  // Only allow English letters, numbers, and hyphens
  return /^[a-z0-9\-]+$/.test(tag);
}
