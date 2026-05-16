---
name: kinken_system_overview
description: KINKEN system purpose, architecture positioning, and interview-ready explanation.
type: project
---

# KINKEN System Overview

## System Purpose

KINKEN is a document search and browsing system for LIXIL metal products with two API surfaces:

| API Surface | Endpoint | Purpose |
|-------------|----------|---------|
| UI API | `GET /api/v1/documents` | Product screens, pagination, simplified search |
| Search Platform API | `POST /api/search-platform/v1/documents` | Flexible document querying, advanced filters |

## Key Interview Explanation

> "KINKEN is a **reusable internal information-discovery platform** that centralizes LIXIL metal product information. It provides two API layers: a simplified UI API for product screens and an advanced Search Platform API for flexible document querying. This dual-layer approach allows both ease of use for end users and flexibility for internal systems."

## Integration Points

| Integration | Description |
|-------------|-------------|
| PIM | Product Information Management - source of product data |
| QA Database | Quality assurance records |
| Elasticsearch | Search index for documents |
| API Gateway (Apigee) | Authentication, rate limiting, routing |

## Data Pipeline

```
PIM → CSV → DB → Elasticsearch → API → UI
```

## My Role on This Project

- **QA** — manual testing across UI, API, DB, and ES layers
- **Focus areas**: filter logic, document links, ES behavior, data validation
- **Career goal**: Transitioning to Fresher BrSE (Bridge SE)
