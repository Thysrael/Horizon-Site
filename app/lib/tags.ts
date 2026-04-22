export const BLOCKED_TAGS: string[] = [
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
