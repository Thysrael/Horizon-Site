import { z } from "zod";
import { Category } from "@prisma/client";

export interface SourceConfigBase {
  version?: number;
}

export interface GitHubUserEventsConfig extends SourceConfigBase {
  subtype: "user_events";
  username: string;
}

export interface GitHubRepoReleasesConfig extends SourceConfigBase {
  subtype: "repo_releases";
  owner: string;
  repo: string;
}

export type GitHubConfig = GitHubUserEventsConfig | GitHubRepoReleasesConfig;

export interface RedditConfig extends SourceConfigBase {
  subreddit: string;
}

export interface TelegramConfig extends SourceConfigBase {
  channel: string;
}

export interface RSSConfig extends SourceConfigBase {
  url: string;
}

export type SourceConfig =
  | GitHubConfig
  | RedditConfig
  | TelegramConfig
  | RSSConfig;

const githubUserEventsSchema = z.object({
  subtype: z.literal("user_events"),
  username: z.string().min(1, "Username is required"),
});

const githubRepoReleasesSchema = z.object({
  subtype: z.literal("repo_releases"),
  owner: z.string().min(1, "Owner is required"),
  repo: z.string().min(1, "Repository name is required"),
});

export const githubConfigSchema = z.discriminatedUnion("subtype", [
  githubUserEventsSchema,
  githubRepoReleasesSchema,
]);

export const redditConfigSchema = z.object({
  subreddit: z.string().min(1, "Subreddit name is required"),
});

export const telegramConfigSchema = z.object({
  channel: z.string().min(1, "Channel name is required"),
});

export const rssConfigSchema = z.object({
  url: z.string().min(1, "RSS URL is required").url("Must be a valid URL"),
});

export const sourceConfigSchemas: {
  GITHUB: z.ZodType<GitHubConfig>;
  REDDIT: z.ZodType<RedditConfig>;
  TELEGRAM: z.ZodType<TelegramConfig>;
  RSS: z.ZodType<RSSConfig>;
} = {
  GITHUB: githubConfigSchema,
  REDDIT: redditConfigSchema,
  TELEGRAM: telegramConfigSchema,
  RSS: rssConfigSchema,
};

export const sourceSubmissionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  type: z.enum(["GITHUB", "REDDIT", "TELEGRAM", "RSS"]),
  category: z.nativeEnum(Category),
  tags: z.array(z.string()).max(10),
  iconUrl: z.string().url().optional().or(z.literal("")),
  config: z.record(z.string(), z.any()).default({}),
});

export type SourceSubmissionData = z.infer<typeof sourceSubmissionSchema>;

export interface TypeFieldDefinition {
  name: string;
  label: string;
  type: "text" | "select";
  placeholder?: string;
  required: boolean;
  description?: string;
  options?: { value: string; label: string }[];
}

export const TYPE_FIELD_CONFIG: Record<
  "GITHUB" | "REDDIT" | "TELEGRAM" | "RSS",
  TypeFieldDefinition[]
> = {
  GITHUB: [
    {
      name: "subtype",
      label: "GitHub Source Type",
      type: "select",
      required: true,
      description: "Select the type of GitHub source",
      options: [
        { value: "user_events", label: "User Events & Activity" },
        { value: "repo_releases", label: "Repository Releases" },
      ],
    },
    {
      name: "username",
      label: "GitHub Username",
      type: "text",
      required: true,
      placeholder: "e.g., karpathy",
      description: "The GitHub username to monitor (for user events)",
    },
    {
      name: "owner",
      label: "Repository Owner",
      type: "text",
      required: true,
      placeholder: "e.g., vllm-project",
      description: "The repository owner/organization",
    },
    {
      name: "repo",
      label: "Repository Name",
      type: "text",
      required: true,
      placeholder: "e.g., vllm",
      description: "The repository name",
    },
  ],
  REDDIT: [
    {
      name: "subreddit",
      label: "Subreddit Name",
      type: "text",
      required: true,
      placeholder: "e.g., MachineLearning",
      description: "The subreddit to monitor (without r/ prefix)",
    },
  ],
  TELEGRAM: [
    {
      name: "channel",
      label: "Channel Name",
      type: "text",
      required: true,
      placeholder: "e.g., zaihuapd",
      description: "The Telegram channel to monitor (without @ prefix)",
    },
  ],
  RSS: [
    {
      name: "url",
      label: "RSS Feed URL",
      type: "text",
      required: true,
      placeholder: "https://example.com/feed.xml",
      description: "The URL of the RSS feed",
    },
  ],
};

export function getVisibleFields(
  type: keyof typeof TYPE_FIELD_CONFIG,
  values: Record<string, unknown>
): string[] {
  const allFields = TYPE_FIELD_CONFIG[type];

  return allFields
    .filter((field) => {
      if (type === "GITHUB" && field.name === "username") {
        return values.subtype === "user_events";
      }
      if (
        type === "GITHUB" &&
        (field.name === "owner" || field.name === "repo")
      ) {
        return values.subtype === "repo_releases";
      }
      return true;
    })
    .map((field) => field.name);
}
