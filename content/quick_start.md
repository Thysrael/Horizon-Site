---
title: Quick Start
---

# Quick Start

Learn how to install Horizon, configure it and share news sources with community.

## Step 1: Install Horizon

**Option A: Local Installation**

```bash
git clone https://github.com/Thysrael/Horizon.git
cd horizon

# Install with uv (recommended)
uv sync

# Or with pip
pip install -e .
```

**Option B: Docker**

```bash
git clone https://github.com/Thysrael/Horizon.git
cd horizon

# Configure environment
cp .env.example .env
cp data/config.example.json data/config.json
# Edit .env and data/config.json with your API keys and preferences

# Run with Docker Compose
docker-compose run --rm horizon

# Or run with custom time window
docker-compose run --rm horizon --hours 48
```

### Step 2: Configure

**Option A: Interactive wizard (recommended)**

```bash
uv run horizon-wizard
```

The wizard asks about your interests (e.g. "LLM inference", "embedded systems", "web security") and auto-generates `data/config.json`.

**Option B: Manual configuration**

```bash
cp .env.example .env          # Add your API keys
cp data/config.example.json data/config.json  # Customize your sources
```

Here's what a config looks like:

```jsonc
{
  "ai": {
    "provider": "openai",       // or "anthropic", "gemini", "doubao", "minimax"
    "model": "gpt-4",
    "api_key_env": "OPENAI_API_KEY",
    "languages": ["en", "zh"]   // bilingual output
  },
  "sources": {
    "hackernews": { "enabled": true, "fetch_top_stories": 20, "min_score": 100 },
    "rss": [
      { "name": "Simon Willison", "url": "https://simonwillison.net/atom/everything/" }
    ],
    "reddit": {
      "subreddits": [{ "subreddit": "MachineLearning", "sort": "hot" }],
      "fetch_comments": 5
    },
    "telegram": {
      "channels": [{ "channel": "zaihuapd", "fetch_limit": 20 }]
    }
  },
  "filtering": {
    "ai_score_threshold": 6.0,
    "time_window_hours": 24
  }
}
```

For the full reference, see the [Configuration Guide](docs/configuration.md).

**Option C: Browse and pick sources on the official website**

You can search and browse sources you're interested in on the Horizon [official website](https://www.horizon1123.top/).

Once you've collected sources, export them as a Horizon configuration file:

1. Visit the [Sources](https://www.horizon1123.top//search) page
2. Use filters to find sources you want
3. Click **Export** button to generate `config.json`
4. Download the configuration file

The exported config will look like:

```json
{
  "sources": {
    "rss": [
      {
        "name": "Source Name",
        "url": "https://example.com/feed.xml",
        "enabled": true,
        "category": "ai-ml"
      }
    ],
    "reddit": {
      "enabled": true,
      "subreddits": [
        {
          "subreddit": "MachineLearning",
          "sort": "hot",
          "fetch_limit": 25
        }
      ]
    }
  }
}
```

You can merge these into your configuration file. Note that this exported config only includes news sources and does not include LLM-related settings; you still need to configure those manually by referring to the example file.

## Step 3: Submit Information Sources

If you also want to contribute sources to the Horizon community, you can:

1. Click on a source to view details
2. Click the **Submit** button in the top navigation
3. Fill in the source information:
   - **Title**: Source name
   - **URL**: RSS feed or API endpoint
   - **Category**: AI/ML, Systems, Security, etc.
   - **Tags**: Relevant keywords (e.g., "ai", "rust", "security")

Your submission will be reviewed and added to the platform.


## Next Steps

- Read the [Configuration Guide](/docs/configuration) for advanced AI provider settings
- Learn about the [Scoring System](/docs/scoring) to understand content ranking
- Check out [Source Scrapers](/docs/scrapers) for supported source types
- View the [API Reference](/docs/api) for programmatic access
