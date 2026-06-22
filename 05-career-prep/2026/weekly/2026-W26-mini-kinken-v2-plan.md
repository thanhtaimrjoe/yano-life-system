# 2026-W26 — mini-kinken-v2 BrSE Training Plan

Date range: 2026-06-22 to 2026-06-26

## Context

Yano will freeze the game project for this week and use `mini-kinken-v2` as the main 1-hour/day project.

Working repo:

```text
~/Documents/mini-kinken-v2
```

Tracking note:

```text
~/Documents/yano-life-system/knowledge/06_PROJECTS/kinken/mini-kinken-v2-training.md
```

## Weekly Goal

By Friday, F001 should move from Draft AC to a small working backend slice with verification evidence, without breaking the BrSE Training Mode rule.

Main learning focus:

- write/approve AC
- define API contract
- implement small backend slice
- verify with tests/cURL
- write nghiệm thu + retrospective

## Rules for the Week

- Timebox: 1 hour/day max.
- No game project this week; game is frozen.
- No implementation before F001 Final Approved Scope is written.
- AI can code only after AC is approved.
- Every day must leave one evidence artifact.

## Monday — Approve F001 Scope

Theme: BrSE requirement closure.

Tasks:

- [ ] Review `docs/features/F001-document-search.md` one final time.
- [ ] Decide empty `q` behavior clearly:
  - current direction: empty `q` returns latest documents sorted by `updated_at desc`.
- [ ] Remove/ignore old AI review contradictions if needed.
- [ ] Fill `## 7. Final Approved Scope` for F001.
- [ ] Update F001 status from `Draft 0 needed from Yano` to `Approved` or `Ready for implementation`.
- [ ] Commit docs-only scope approval.

Evidence:

- Final Approved Scope written.
- Git commit exists for F001 approval.

Suggested commit:

```bash
git add docs/features/F001-document-search.md
git commit -m "docs: approve F001 document search scope"
```

## Tuesday — Backend Skeleton + Data Model

Theme: smallest backend foundation.

Tasks:

- [ ] Create minimal backend structure.
- [ ] Choose simple stack for v1:
  - FastAPI
  - SQLite or in-memory/sample repository for first slice
  - pytest
- [ ] Define `Document` model/schema with fields:
  - `document_id`
  - `document_type`
  - `title_ja`
  - `description_ja`
  - `product_id`
  - `download_url`
  - `visibility`
  - `updated_at`
- [ ] Add small sample data for manual/drawing/business/internal visibility.
- [ ] Do not overbuild DB/ES yet.

Evidence:

- Backend starts or imports.
- Basic test/compile passes.

Suggested verification:

```bash
python -m compileall backend
```

## Wednesday — Implement F001 Search Endpoint

Theme: implement only approved behavior.

Tasks:

- [ ] Implement `GET /api/v1/documents`.
- [ ] Support keyword search over `title_ja` + `description_ja`.
- [ ] Support `document_type=manual|drawing`.
- [ ] Support `page` and `limit`.
- [ ] Support `x-user-type=business|internal|partner|external` visibility filter.
- [ ] Support empty `q` returning latest documents if this remains approved scope.
- [ ] Return exact pagination metadata:
  - `page`
  - `limit`
  - `total_items`
  - `total_pages`

Evidence:

- Endpoint returns JSON for at least one happy path.
- cURL or pytest output captured in F001 Verification Evidence.

## Thursday — Tests / cURL Evidence

Theme: QA and acceptance.

Tasks:

- [ ] Verify each AC one by one.
- [ ] Add pytest tests or documented cURL checks for:
  - keyword match
  - document_type filter
  - invalid document_type
  - pagination
  - visibility filtering
  - empty `q` latest documents behavior
- [ ] Record command output under `## 9. Verification Evidence` in F001.
- [ ] Fix only bugs related to F001 AC.

Evidence:

- All F001 AC have pass/fail evidence.
- Test/cURL output recorded.

## Friday — Nghiệm Thu + Retrospective

Theme: BrSE closure and interview material.

Tasks:

- [ ] Fill `## 10. Retrospective / Lesson Learned` in F001.
- [ ] Write short nghiệm thu:
  - what was implemented
  - what was intentionally excluded
  - what evidence proves it works
  - what risk remains
- [ ] Update feature backlog: F001 done / F002 candidate.
- [ ] Write 5-line BrSE interview explanation of F001.
- [ ] Commit final F001 work.

Evidence:

- F001 note has retrospective.
- Git commit exists.
- Yano can explain F001 in 1 minute.

## Daily 1-Hour Template

```text
00:00-00:05 — Open plan + choose today's exact output
00:05-00:40 — Do focused work
00:40-00:50 — Verify / run command / inspect diff
00:50-01:00 — Write evidence + commit or note next blocker
```

## Daily End Checklist

- [ ] What changed?
- [ ] What evidence did I create?
- [ ] Did AI do worker work only after I approved scope?
- [ ] What is tomorrow's next smallest step?

## Friday Success Definition

Week is successful if:

- F001 approved scope exists.
- Backend has a small working F001 endpoint or at minimum tested implementation progress.
- Evidence is recorded.
- Yano understands and can explain the feature behavior.

Week is still successful even if not all code is done, as long as the BrSE process was followed and evidence exists.
