export const SOURCE_DEFAULT_ICONS: Record<string, string> = {
  HACKER_NEWS: "/hackernews-svgrepo-com.svg",
  RSS: "/rss-svgrepo-com.svg",
  REDDIT: "/reddit-svgrepo-com.svg",
  TELEGRAM: "/telegram-svgrepo-com.svg",
  GITHUB: "/github-svgrepo-com.svg",
  NEWSLETTER: "/rss-svgrepo-com.svg",
  OTHER: "/rss-svgrepo-com.svg",
};

export function getSourceIcon(type: string, iconUrl?: string | null): string {
  if (iconUrl) return iconUrl;
  return SOURCE_DEFAULT_ICONS[type] || "/rss-svgrepo-com.svg";
}

export function getSourceIconFallback(type: string): string {
  return SOURCE_DEFAULT_ICONS[type] || "/rss-svgrepo-com.svg";
}