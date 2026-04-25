---
title: Source Scrapers
---

# Source Scrapers

Horizon fetches content from five source types. All scrapers inherit from `BaseScraper`, share an async HTTP client, and implement a `fetch(since)` method that returns a list of `ContentItem` objects. Sources are fetched concurrently with `asyncio.gather`.

## Hacker News

**File**: `src/scrapers/hackernews.py`

Uses the Firebase HN API:

- `GET /topstories.json`
- `GET /item/{id}.json`

Stories and comments are fetched concurrently. For each story, the top comments are included after filtering deleted or dead entries and stripping HTML.

**Config** (`sources.hackernews`):

```json
{
  "enabled": true,
  "fetch_top_stories": 30,
  "min_score": 100
}
```

- `fetch_top_stories`: number of top story IDs to fetch
- `min_score`: minimum HN score required

**Extracted data**: title, URL, author, score, comment count, and top comment text.

## GitHub

**File**: `src/scrapers/github.py`

Uses the GitHub REST API:

- `GET /users/{username}/events/public`
- `GET /repos/{owner}/{repo}/releases`

Supported source types:

- `user_events`
- `repo_releases`

**Config** (`sources.github`):

```json
{
  "type": "user_events",
  "username": "torvalds",
  "enabled": true
}
```

```json
{
  "type": "repo_releases",
  "owner": "golang",
  "repo": "go",
  "enabled": true
}
```

Set `GITHUB_TOKEN` for higher rate limits.

## RSS

**File**: `src/scrapers/rss.py`

Fetches Atom and RSS feeds with `feedparser`. It tries multiple timestamp fields such as `published`, `updated`, and `created`.

**Config** (`sources.rss`):

```json
{
  "name": "Simon Willison",
  "url": "https://simonwillison.net/atom/everything/",
  "enabled": true,
  "category": "ai-tools"
}
```

- `category`: optional grouping tag

**Extracted data**: title, URL, author, content, feed name, category, and entry tags.

## Reddit

**File**: `src/scrapers/reddit.py`

Uses Reddit's public JSON API:

- `GET /r/{subreddit}/{sort}.json`
- `GET /user/{username}/submitted.json`
- `GET /r/{subreddit}/comments/{post_id}.json`

Subreddits and users are fetched concurrently. Comments are ranked by score and trimmed to the configured limit.

**Config** (`sources.reddit`):

```json
{
  "enabled": true,
  "fetch_comments": 5,
  "subreddits": [
    {
      "subreddit": "MachineLearning",
      "sort": "hot",
      "fetch_limit": 25,
      "min_score": 10
    }
  ],
  "users": [
    {
      "username": "spez",
      "sort": "new",
      "fetch_limit": 10
    }
  ]
}
```

- `sort`: `hot`, `new`, `top`, or `rising` for subreddits; `hot` or `new` for users
- `time_filter`: for `top` or `rising`
- `min_score`: minimum subreddit post score

**Extracted data**: title, URL, author, score, upvote ratio, comment count, subreddit, flair, self-text, and top comments.

## Telegram

**File**: `src/scrapers/telegram.py`

Fetches public channel posts from Telegram's web preview pages.

**Config** (`sources.telegram`):

```json
{
  "enabled": true,
  "channels": [
    {
      "channel": "zaihuapd",
      "fetch_limit": 20,
      "enabled": true
    }
  ]
}
```

- `channel`: public Telegram channel name
- `fetch_limit`: number of recent messages to inspect

For each message, Horizon extracts the timestamp, message text, a generated title, the message URL, and the first external link as the canonical URL when available.
