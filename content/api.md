---
title: API Reference
---

# API Reference

Horizon provides REST APIs for accessing sources, votes, and search functionality.

## Authentication

Most endpoints require authentication via NextAuth session.

## Sources API

### List Sources

```http
GET /api/sources
```

Query parameters:
- `category` - Filter by category (AI_ML, SYSTEMS, SECURITY, etc.)
- `tag` - Filter by tag
- `q` - Search query

Response:
```json
{
  "sources": [
    {
      "id": "source-id",
      "title": "Source Title",
      "url": "https://example.com",
      "category": "AI_ML",
      "tags": ["ai", "ml"],
      "votes": 42
    }
  ]
}
```

### Submit Source

```http
POST /api/sources
```

Body:
```json
{
  "title": "Source Title",
  "url": "https://example.com/feed",
  "category": "AI_ML",
  "tags": ["ai", "machine-learning"]
}
```

## Votes API

### Vote for Source

```http
POST /api/vote
```

Body:
```json
{
  "sourceId": "source-id",
  "direction": "up"
}
```

### Get Vote Status

```http
GET /api/vote/status?sourceId=source-id
```

## Search API

### Search Sources

```http
POST /api/search
```

Body:
```json
{
  "query": "machine learning",
  "category": "AI_ML",
  "tags": ["ai"]
}
```

## Categories API

### Get Category Counts

```http
GET /api/categories/counts
```

Response:
```json
{
  "categories": [
    { "category": "AI_ML", "count": 150 },
    { "category": "SYSTEMS", "count": 89 }
  ]
}
```

## Tags API

### Get All Tags

```http
GET /api/tags
```

Response:
```json
{
  "tags": ["ai", "ml", "rust", "go"]
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message"
}
```

Common status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error
