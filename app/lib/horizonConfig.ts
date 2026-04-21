import { SourceConfig } from "./sourceConfig";

export interface HorizonConfig {
  sourceType: string;
  type: string;
  name?: string;
  config: Record<string, string | number | boolean>;
}

export function transformToHorizonConfig(
  sourceType: string,
  storedConfig: SourceConfig,
  sourceName?: string
): HorizonConfig | null {
  switch (sourceType) {
    case "GITHUB": {
      const config = storedConfig as { subtype?: string; username?: string; owner?: string; repo?: string };
      if (config.subtype === "user_events" && config.username) {
        return { 
          sourceType: "github", 
          type: "user_events", 
          name: sourceName, 
          config: { username: config.username, enabled: true } 
        };
      }
      if (config.subtype === "repo_releases" && config.owner && config.repo) {
        return { 
          sourceType: "github", 
          type: "repo_releases", 
          name: sourceName, 
          config: { owner: config.owner, repo: config.repo, enabled: true } 
        };
      }
      break;
    }
    case "HACKER_NEWS": {
      const config = storedConfig as { fetch_top_stories?: number; min_score?: number };
      return { 
        sourceType: "hackernews", 
        type: "hackernews", 
        name: sourceName,
        config: { 
          enabled: true,
          fetch_top_stories: config.fetch_top_stories || 10,
          min_score: config.min_score || 200
        } 
      };
    }
    case "REDDIT": {
      const config = storedConfig as { subreddit?: string; sort?: string; time_filter?: string; fetch_limit?: number; min_score?: number };
      if (config.subreddit) {
        return { 
          sourceType: "reddit", 
          type: "subreddit", 
          name: sourceName, 
          config: { 
            subreddit: config.subreddit,
            enabled: true,
            sort: config.sort || "hot",
            time_filter: config.time_filter || "day",
            fetch_limit: config.fetch_limit || 15,
            min_score: config.min_score || 60
          } 
        };
      }
      break;
    }
    case "TELEGRAM": {
      const config = storedConfig as { channel?: string; fetch_limit?: number };
      if (config.channel) {
        return { 
          sourceType: "telegram", 
          type: "channel", 
          name: sourceName, 
          config: { 
            channel: config.channel,
            enabled: true,
            fetch_limit: config.fetch_limit || 20
          } 
        };
      }
      break;
    }
    case "RSS": {
      const config = storedConfig as { url?: string; category?: string };
      if (config.url) {
        const rssConfig: Record<string, string | boolean> = { 
          url: config.url,
          enabled: true 
        };
        if (config.category) {
          rssConfig.category = config.category;
        }
        return { 
          sourceType: "rss", 
          type: "feed", 
          name: sourceName, 
          config: rssConfig 
        };
      }
      break;
    }
  }

  return null;
}

export function formatHorizonConfigTOML(config: HorizonConfig): string {
  const lines: string[] = [];

  lines.push(`[[${config.sourceType}]]`);
  lines.push(`type = "${config.type}"`);

  if (config.name && config.sourceType !== "hackernews") {
    lines.push(`name = "${config.name}"`);
  }

  for (const [key, value] of Object.entries(config.config)) {
    if (typeof value === "boolean") {
      lines.push(`${key} = ${value}`);
    } else if (typeof value === "number") {
      lines.push(`${key} = ${value}`);
    } else {
      lines.push(`${key} = "${value}"`);
    }
  }

  return lines.join("\n") + "\n";
}

export function formatHorizonConfigJSON(config: HorizonConfig): string {
  const entry: Record<string, unknown> = {};
  
  switch (config.sourceType) {
    case "hackernews":
      return JSON.stringify({
        enabled: config.config.enabled ?? true,
        fetch_top_stories: config.config.fetch_top_stories ?? 10,
        min_score: config.config.min_score ?? 200
      }, null, 2);
    
    case "telegram":
      entry.channel = config.config.channel;
      entry.enabled = config.config.enabled ?? true;
      if (config.config.fetch_limit) {
        entry.fetch_limit = config.config.fetch_limit;
      }
      return JSON.stringify(entry, null, 2);
    
    case "reddit":
      entry.subreddit = config.config.subreddit;
      entry.enabled = config.config.enabled ?? true;
      if (config.config.sort) entry.sort = config.config.sort;
      if (config.config.time_filter) entry.time_filter = config.config.time_filter;
      if (config.config.fetch_limit) entry.fetch_limit = config.config.fetch_limit;
      if (config.config.min_score) entry.min_score = config.config.min_score;
      return JSON.stringify(entry, null, 2);
    
    case "github":
      entry.type = config.type;
      if (config.type === "user_events") {
        entry.username = config.config.username;
      } else if (config.type === "repo_releases") {
        entry.owner = config.config.owner;
        entry.repo = config.config.repo;
      }
      entry.enabled = config.config.enabled ?? true;
      return JSON.stringify([entry], null, 2);
    
    case "rss":
    default:
      entry.name = config.name;
      entry.url = config.config.url;
      entry.enabled = config.config.enabled ?? true;
      if (config.config.category) {
        entry.category = config.config.category;
      }
      return JSON.stringify(entry, null, 2);
  }
}

export function formatAllConfigsTOML(configs: HorizonConfig[]): string {
  return configs.map(formatHorizonConfigTOML).join("\n");
}

export function formatAllConfigsJSON(configs: HorizonConfig[]): string {
  const result: Record<string, unknown> = {};
  const grouped: Record<string, HorizonConfig[]> = {};
  
  for (const config of configs) {
    if (!grouped[config.sourceType]) {
      grouped[config.sourceType] = [];
    }
    grouped[config.sourceType].push(config);
  }
  
  for (const [sourceType, items] of Object.entries(grouped)) {
    switch (sourceType) {
      case "hackernews": {
        if (items.length > 0) {
          const config = items[0].config;
          result[sourceType] = {
            enabled: config.enabled ?? true,
            fetch_top_stories: config.fetch_top_stories ?? 10,
            min_score: config.min_score ?? 200
          };
        }
        break;
      }
      
      case "telegram": {
        const channels = items.map(item => {
          const ch: Record<string, unknown> = {
            channel: item.config.channel,
            enabled: item.config.enabled ?? true
          };
          if (item.config.fetch_limit) {
            ch.fetch_limit = item.config.fetch_limit;
          }
          return ch;
        });
        result[sourceType] = {
          enabled: true,
          channels
        };
        break;
      }
      
      case "reddit": {
        const subreddits = items.map(item => {
          const sub: Record<string, unknown> = {
            subreddit: item.config.subreddit,
            enabled: item.config.enabled ?? true
          };
          if (item.config.sort) sub.sort = item.config.sort;
          if (item.config.time_filter) sub.time_filter = item.config.time_filter;
          if (item.config.fetch_limit) sub.fetch_limit = item.config.fetch_limit;
          if (item.config.min_score) sub.min_score = item.config.min_score;
          return sub;
        });
        result[sourceType] = {
          enabled: true,
          subreddits
        };
        break;
      }
      
      case "github": {
        result[sourceType] = items.map(item => {
          const entry: Record<string, unknown> = {
            type: item.type,
            enabled: item.config.enabled ?? true
          };
          if (item.type === "user_events") {
            entry.username = item.config.username;
          } else if (item.type === "repo_releases") {
            entry.owner = item.config.owner;
            entry.repo = item.config.repo;
          }
          return entry;
        });
        break;
      }
      
      case "rss":
      default: {
        result[sourceType] = items.map(item => {
          const entry: Record<string, unknown> = {
            name: item.name,
            url: item.config.url,
            enabled: item.config.enabled ?? true
          };
          if (item.config.category) {
            entry.category = item.config.category;
          }
          return entry;
        });
        break;
      }
    }
  }
  
  return JSON.stringify(result, null, 2);
}
