---
title: Configuration Guide
---

# Configuration Guide

Horizon is configured through two files: `.env` for secrets and `data/config.json` for sources, AI provider, filtering, and delivery settings.

## AI Providers

Configure which model scores and summarizes your content.

**Anthropic Claude**

```json
{
  "ai": {
    "provider": "anthropic",
    "model": "claude-sonnet-4.5-20250929",
    "api_key_env": "ANTHROPIC_API_KEY"
  }
}
```

**OpenAI**

```json
{
  "ai": {
    "provider": "openai",
    "model": "gpt-4",
    "api_key_env": "OPENAI_API_KEY"
  }
}
```

**MiniMax**

```json
{
  "ai": {
    "provider": "minimax",
    "model": "MiniMax-M2.7",
    "api_key_env": "MINIMAX_API_KEY"
  }
}
```

Available MiniMax models: `MiniMax-M2.7`, `MiniMax-M2.7-highspeed`, `MiniMax-M2.5`, `MiniMax-M2.5-highspeed`

**Aliyun DashScope** (OpenAI-compatible)

```json
{
  "ai": {
    "provider": "ali",
    "model": "qwen-plus",
    "api_key_env": "DASHSCOPE_API_KEY"
  }
}
```

Set `DASHSCOPE_API_KEY` in `.env`. You can also set `base_url` to override the default compatible-mode endpoint.

**Custom base URL**

```json
{
  "ai": {
    "provider": "anthropic",
    "base_url": "https://your-proxy.com/v1"
  }
}
```

## Information Sources

All sources live under the top-level `sources` key.

### GitHub

```json
{
  "sources": {
    "github": [
      {
        "type": "user_events",
        "username": "gvanrossum",
        "enabled": true
      },
      {
        "type": "repo_releases",
        "owner": "python",
        "repo": "cpython",
        "enabled": true
      }
    ]
  }
}
```

### Hacker News

```json
{
  "sources": {
    "hackernews": {
      "enabled": true,
      "fetch_top_stories": 30,
      "min_score": 100
    }
  }
}
```

### RSS Feeds

```json
{
  "sources": {
    "rss": [
      {
        "name": "Blog Name",
        "url": "https://example.com/feed.xml",
        "enabled": true,
        "category": "ai-ml"
      }
    ]
  }
}
```

### Reddit

```json
{
  "sources": {
    "reddit": {
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
  }
}
```

### Telegram

```json
{
  "sources": {
    "telegram": {
      "enabled": true,
      "channels": [
        {
          "channel": "zaihuapd",
          "fetch_limit": 20,
          "enabled": true
        }
      ]
    }
  }
}
```

Telegram uses the public web preview for channels.

## Filtering

Content is scored from `0` to `10`.

- **9-10**: Groundbreaking
- **7-8**: High Value
- **5-6**: Interesting
- **3-4**: Low Priority
- **0-2**: Noise

```json
{
  "filtering": {
    "ai_score_threshold": 7.0,
    "time_window_hours": 24
  }
}
```

- `ai_score_threshold`: only include content scoring at or above this value
- `time_window_hours`: fetch content from the last N hours

## Environment Variable Substitution

RSS feed URLs support `${VAR_NAME}` syntax:

```json
{
  "name": "LWN.net",
  "url": "https://lwn.net/headlines/full_text?key=${LWN_KEY}",
  "enabled": true
}
```

This lets you keep tokens out of `config.json`.

## Email Subscription

Email delivery is optional and disabled unless `email.enabled` is `true`.

```json
{
  "email": {
    "enabled": true,
    "smtp_server": "smtp.qq.com",
    "smtp_port": 465,
    "imap_server": "imap.qq.com",
    "imap_port": 993,
    "email_address": "xxx@qq.com",
    "password_env": "EMAIL_PASSWORD",
    "sender_name": "Horizon Daily",
    "subscribe_keyword": "SUBSCRIBE",
    "unsubscribe_keyword": "UNSUBSCRIBE"
  }
}
```

- `enabled`: enable email delivery and subscription handling
- `smtp_server` / `smtp_port`: SMTP server used to send mail
- `imap_server` / `imap_port`: IMAP server used to scan subscription requests
- `email_address`: sender account and monitored mailbox
- `password_env`: environment variable holding the email password or app password
- `sender_name`: display name shown in outgoing emails
- `subscribe_keyword` / `unsubscribe_keyword`: keywords Horizon reads from incoming subjects

## Webhook Notification

Webhook delivery is optional and disabled unless `webhook.enabled` is `true`.

```json
{
  "webhook": {
    "enabled": true,
    "url_env": "HORIZON_WEBHOOK_URL",
    "request_body": {
      "text": "Horizon #{date}: #{result}\n#{summary?limit=3000&split=---}"
    },
    "headers": ""
  }
}
```

- `enabled`: enable webhook delivery
- `url_env`: environment variable containing the webhook URL
- `request_body`: if empty, Horizon sends a `GET`; if present, it sends a `POST`
- `headers`: optional custom headers, one `Key: Value` pair per line

When `request_body` is JSON, Horizon renders placeholders and serializes it as JSON. When it is a string, Horizon renders it directly and detects JSON automatically if the rendered string is valid JSON.

### Webhook Templates

| Variable | Description |
| --- | --- |
| `#{date}` | Report date, for example `2026-04-24` |
| `#{language}` | Language code such as `en` or `zh` |
| `#{important_items}` | Number of items that passed the threshold |
| `#{all_items}` | Total number of fetched items |
| `#{result}` | `success` or `failed` |
| `#{timestamp}` | Unix timestamp |
| `#{summary}` | Full summary Markdown |

Use `#{key?limit=N&split=DELIM}` to truncate long values.

```text
#{summary?limit=3000&split=---}
```

### DingTalk

```json
{
  "msgtype": "markdown",
  "markdown": {
    "title": "Horizon #{date} Daily",
    "text": "Horizon result: #{result}\n\nHorizon important items: #{important_items}/#{all_items}\n\n#{summary}"
  }
}
```

### Feishu / Lark

```json
{
  "msg_type": "interactive",
  "card": {
    "config": {
      "wide_screen_mode": true
    },
    "header": {
      "title": {
        "tag": "plain_text",
        "content": "Horizon #{date} Daily"
      },
      "template": "blue"
    },
    "elements": [
      {
        "tag": "markdown",
        "content": "Horizon result: #{result}\nHorizon important items: #{important_items}/#{all_items}"
      },
      {
        "tag": "hr"
      },
      {
        "tag": "markdown",
        "content": "#{summary?limit=3000&split=---}"
      }
    ]
  }
}
```

## Static Site

Horizon writes generated summaries to `data/summaries/` and can copy publishable Markdown into `docs/` for a GitHub Pages site. The repository includes a ready-to-use workflow at `.github/workflows/daily-summary.yml`.
