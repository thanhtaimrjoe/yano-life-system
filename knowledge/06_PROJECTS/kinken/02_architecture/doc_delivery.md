---
name: project_kinken_doc_delivery
description: CloudRun-based document delivery design for serving PDF/HTML from GCS through CDN/LB.
type: project
originSessionId: f60dbbd3-28db-43a4-ad97-6209b9c42de7
---

# KINKEN Document Delivery (CloudRun)

## Purpose

- Validate whether PDF and HTML documents stored on GCS can be downloaded/referenced via Cloud Run APIs
- Clarify request routing and avoid incorrect server-to-server assumptions

## Request Flow

```
Client → Akamai CDN → Load Balancer (origin) → Cloud Run → GCS → Response
```

**Note**: Direct routing from CDN/LB to CloudRun, NOT through frontend server.

## Why NOT Through Frontend (Critical)

**Problem**: If request is routed through Frontend → Backend, it becomes **server-to-server communication** (Frontend server calls Backend server). This breaks authentication because the auth token belongs to the browser/client, not the server.

**Solution**: Route directly: `AkamaiCDN → LB(Origin) → Backend Service` — no Frontend involved.

## Concrete URL Examples (from SPRINT 11 Validation)

| Public URL (User) | Rewritten Internal URL |
|-------------------|------------------------|
| `/i/docs/technical/files/DDC0000009.pdf` | `gs://lixil-kinken-docs-poc-dev/docs/technical/files/DDC0000009.pdf` |
| `/i/docs/technical/html/SDC0002233/search.htm` | `gs://lixil-kinken-docs-poc-dev/docs/technical/html/SDC0002233/search.htm` |

- Prefix `/i/` = internal user domain path
- UrlRewrite: `/i/docs/` → `/api/docs/` → GCS bucket object

## URL Rewrite Mappings

| External Path | GCS Object Path |
|---------------|-----------------|
| `/api/docs/technical/files/...` | `gs://lixil-kinken-docs-{env}/docs/technical/files/...` |
| `/api/docs/technical/html/...` | `gs://lixil-kinken-docs-{env}/docs/technical/html/...` |

## Processing Flow

1. Client requests document URL (PDF/HTML)
2. CDN forwards to LB origin rule
3. LB routes to Cloud Run backend service
4. Cloud Run resolves rewritten path to GCS object path
5. Cloud Run reads object from GCS and returns content to client

## Interview Questions

| Question | Key Points |
|----------|------------|
| Why direct CDN→CloudRun routing? | Avoid unnecessary frontend mediation, reduce latency |
| Security checkpoints? | Auth at API Gateway, environment separation |
| Caching strategy differences? | PDF: binary cache; HTML: needs static asset handling |
| Failure modes in URL rewrite? | Path mapping errors, environment leakage |
| Environment separation? | `{env}` placeholder prevents prod doc leakage |

## Security Considerations

- Authentication enforced at API Gateway (Apigee)
- Environment isolation via URL path `{env}` placeholder
- Access logging for audit trail
