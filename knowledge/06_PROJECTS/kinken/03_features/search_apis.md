---
name: kinken_search_apis
description: Comparison of KINKEN Search Platform API and UI API usage patterns.
type: project
---

# KINKEN Search APIs

## Two API Surfaces

### 1. Search Platform API (Backend Search Service)

| Property | Value |
|----------|-------|
| Method | POST |
| Path | `/api/search-platform/v1/documents` |
| Auth | `api_key` header |
| Purpose | Richer and more flexible search queries for indexed documents |
| Use case | Internal systems, advanced filtering, complex queries |
| Path Prefix | `/ext` (External/Common Search Platform prefix, e.g., `/ext/v1/search`) |

**Example Request**:
```json
POST /api/search-platform/v1/documents
{
  "query": "アルミサッシ",
  "filters": {
    "document_type": ["technical", "catalog"],
    "product_category": "exterior"
  },
  "page": 1,
  "limit": 20
}
```

### 2. UI API (Product-Facing)

| Property | Value |
|----------|-------|
| Method | GET |
| Path | `/api/v1/documents` |
| Auth | `api_key` header |
| Purpose | Simplified list/search endpoint with pagination for UI use |
| Use case | Frontend screens, simple queries |

**Example Request**:
```
GET /api/v1/documents?page=1&q=アルミサッシ&limit=20&document_type=description
```

## Key Differences

| Aspect | UI API | Search Platform API |
|--------|--------|---------------------|
| Complexity | Simple, limited filters | Advanced, flexible queries |
| Query params | URL query string | JSON body |
| Pagination | Page-based | Page-based + cursor support |
| Response | Simplified document list | Full document metadata |
| Target audience | Frontend developers | Backend integrators |

## API Pathing Strategy

| Type | Path Pattern | Reason |
|------|--------------|--------|
| Frontend API | `/api/v1/xxxxx` | Synchronized with UI deployment |
| Common Platform API | `/ext/v1/xxxxx` | Decoupled versioning; prefix ensures `/ext` precedes version number |

## Why Both APIs Exist?

| Reason | Explanation |
|--------|-------------|
| UX simplicity | UI API provides easy-to-use interface for common cases |
| Search flexibility | Search Platform API allows complex queries for power users |
| Separation of concerns | UI changes don't affect platform integrations |
| Reusability | Other LIXIL systems can use Search Platform API |

## Interview Narrative

> "KINKEN provides two API layers to balance ease of use and flexibility. The UI API offers a simple GET endpoint with query parameters for frontend screens, while the Search Platform API provides a POST endpoint with JSON body for complex queries. This dual-layer approach allows us to serve both end-user applications and internal system integrations effectively."

## Troubleshooting Tips

| Issue | Check |
|-------|-------|
| Different results | Compare query params vs JSON body filters |
| Pagination mismatch | UI API uses page/limit, Platform API may use cursor |
| Performance difference | Platform API may have more expensive aggregations |
