# KINKEN (LIXIL)

## Snapshot
- status: active
- kind: QA / spec-reading / architecture understanding / JP client-facing support
- owner_context: Yano
- last_updated: 2026-05-28

## What this project is
- Metal product information search / document retrieval support context.
- Typical support includes bug analysis, architecture explanation, API/debug mapping, and concise Japanese client-facing drafts.

## Routing Signals
- aliases: KINKEN, LIXIL, 共通検索基盤, 商品特定, document search, product search
- strong keywords:
  - API List
  - Elasticsearch / ES
  - Databricks
  - filter_conditions
  - type_attributes
  - `/i` / `/e`
  - products / documents / categories
  - public date / visibility

## Stable Working Map
- Architecture reading path: PIM → CSV / GCS → import → RDB → Elasticsearch → API → UI.
- Prioritize uploaded specs first, then `/mnt/project/` spec files, then dev reference files.
- For bug analysis, cover:
  1. layer
  2. related fields / flags
  3. root-cause hypothesis
  4. verification steps
- Default output shape:
  - Overview
  - Data Flow
  - Root Cause
  - QA Verification Steps

## Known Stable Facts
- `fire_guard_type` ở ES dùng `防火あり` / `防火なし`.
- RDB brand fields dùng VARCHAR `'0'` / `'1'`.
- `qa_link_type` stored as raw string.
- `segment` là pipe-delimited single keyword; dùng `.raw` cho exact match.
- `qa_knowledge_category` NULL is expected.
- `documents` index `document_type` dùng normalizer `n_keyword`.
- Bug tracking dùng Monday.com.
- Dùng Vietnamese cho discussion, Japanese cho client-facing drafts.

## References
- canonical deeper note: `knowledge/06_PROJECTS/kinken/spec-map.md`
- router/index: `knowledge/06_PROJECTS/README.md`

## Update Rule
- Keep stable facts và reusable routing info ở đây.
- Put day-specific findings, raw experiments, temporary blockers vào `01-daily/YYYY/YYYY-MM-DD.md`.
- If new recurring bug family appear, add short subsection dưới Active Focus hoặc Known Stable Facts only after nó proves durable.
