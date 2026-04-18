import type { SourceConfig } from "./sourceConfig";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasStringProperty<K extends string>(
  obj: Record<string, unknown>,
  key: K
): obj is Record<string, unknown> & Record<K, string> {
  return typeof obj[key] === "string" && obj[key] !== "";
}

export function buildSourceUrl(
  type: "GITHUB" | "REDDIT" | "TELEGRAM" | "RSS",
  config: SourceConfig
): string {
  if (!isRecord(config)) {
    throw new Error("Config must be an object");
  }

  switch (type) {
    case "GITHUB": {
      const subtype = config.subtype;
      if (subtype !== "user_events" && subtype !== "repo_releases") {
        throw new Error("GitHub subtype must be 'user_events' or 'repo_releases'");
      }

      if (subtype === "user_events") {
        if (!hasStringProperty(config, "username")) {
          throw new Error("GitHub user_events requires a username");
        }
        return `https://github.com/${config.username}`;
      } else {
        if (!hasStringProperty(config, "owner") || !hasStringProperty(config, "repo")) {
          throw new Error("GitHub repo_releases requires owner and repo");
        }
        return `https://github.com/${config.owner}/${config.repo}`;
      }
    }

    case "REDDIT": {
      if (!hasStringProperty(config, "subreddit")) {
        throw new Error("Reddit requires a subreddit name");
      }
      return `https://reddit.com/r/${config.subreddit}`;
    }

    case "TELEGRAM": {
      if (!hasStringProperty(config, "channel")) {
        throw new Error("Telegram requires a channel name");
      }
      return `https://t.me/${config.channel}`;
    }

    case "RSS": {
      if (!hasStringProperty(config, "url")) {
        throw new Error("RSS requires a URL");
      }
      return config.url;
    }

    default: {
      const exhaustiveCheck: never = type;
      throw new Error(`Unsupported source type: ${exhaustiveCheck}`);
    }
  }
}

export function parseUrlToConfig(
  type: "GITHUB" | "REDDIT" | "TELEGRAM" | "RSS",
  url: string
): Partial<SourceConfig> | null {
  try {
    const urlObj = new URL(url);

    switch (type) {
      case "GITHUB": {
        const pathParts = urlObj.pathname.split("/").filter(Boolean);
        if (pathParts.length === 1) {
          return {
            subtype: "user_events",
            username: pathParts[0],
          };
        } else if (pathParts.length === 2) {
          return {
            subtype: "repo_releases",
            owner: pathParts[0],
            repo: pathParts[1],
          };
        }
        return null;
      }

      case "REDDIT": {
        const match = urlObj.pathname.match(/\/r\/([^/]+)/);
        if (match) {
          return { subreddit: match[1] };
        }
        return null;
      }

      case "TELEGRAM": {
        const match = urlObj.pathname.match(/\/([^/]+)/);
        if (match) {
          return { channel: match[1] };
        }
        return null;
      }

      case "RSS": {
        return { url };
      }

      default: {
        const exhaustiveCheck: never = type;
        return null;
      }
    }
  } catch {
    return null;
  }
}
