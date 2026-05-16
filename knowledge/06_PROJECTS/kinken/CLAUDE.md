# KINKEN Project Context

## System Summary
Document search & browsing system for LIXIL metal products (8.8M product records).
Data pipeline: PIM → CSV → DB → Elasticsearch → API → UI

## Two API Surfaces
- UI API: `GET /api/v1/documents?page=&q=&limit=&document_type=`
- Search Platform API: `POST /api/search-platform/v1/documents`

## My Role on This Project
QA — manual testing across UI, API, DB, and ES layers.
Focus areas: filter logic, document links, ES behavior, data validation.

## Key Reference Files
- `system_overview.md` — positioning & interview explanation
- `tech_glossary.md` — technical terms (JP/EN/VI)
- `sprint_tracking_summary.md` — sprint history to SPRINT 25 (PROD)

## Interview Usage
Using this project to prepare for Fresher BrSE interviews.
When asked to help with interview prep: explain from a QA perspective transitioning to BrSE.