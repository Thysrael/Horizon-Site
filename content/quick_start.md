---
title: Quick Start
---

# Quick Start

Learn how to submit sources and configure Horizon in 3 easy steps.

## Step 1: Submit Information Sources

Browse the [Sources](/search) page to discover quality information sources. When you find sources you like:

1. Click on a source to view details
2. Click the **Submit** button in the top navigation
3. Fill in the source information:
   - **Title**: Source name
   - **URL**: RSS feed or API endpoint
   - **Category**: AI/ML, Systems, Security, etc.
   - **Tags**: Relevant keywords (e.g., "ai", "rust", "security")

Your submission will be reviewed and added to the platform.

## Step 2: Export Sources to Config

Once you've collected sources, export them as a Horizon configuration file:

1. Visit the [Sources](/search) page
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

## Step 3: Copy Config to Horizon

Copy the downloaded configuration to your Horizon installation:

```bash
# Assuming Horizon is in ../horizon relative to current directory
cp config.json ../horizon/data/config.json

# Or specify full path
cp config.json /path/to/horizon/data/config.json
```

## Run Horizon

After copying the config, run Horizon to start fetching news:

```bash
cd ../horizon
horizon fetch
```

View your personalized news digest:

```bash
horizon view
```

## Next Steps

- Read the [Configuration Guide](/docs/configuration) for advanced AI provider settings
- Learn about the [Scoring System](/docs/scoring) to understand content ranking
- Check out [Source Scrapers](/docs/scrapers) for supported source types
- View the [API Reference](/docs/api) for programmatic access
