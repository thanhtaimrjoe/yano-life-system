# 06_PROJECTS

Knowledge domain for project-based documentation. Use as the **routing index** for project work — read this first, then open deeper project files khi cần.

Each project keeps its own subfolder with:
- `README.md` (or `working-notes.md`) — snapshot, routing signals, stable facts
- subfolders cho architecture / features / progress / interview material (tùy project)

---

## Project Router

### KINKEN (LIXIL)
- status: active
- aliases: KINKEN, LIXIL, 共通検索基盤, 商品特定, document search, product search
- typical keywords:
  - spec reading
  - Monday.com
  - API List
  - Elasticsearch / ES
  - Databricks
  - filter_conditions
  - type_attributes
  - `/i` / `/e`
  - product/document/category
  - public date / visibility
- typical task shapes:
  - analyze bug cause từ spec / API / data flow
  - explain architecture hoặc route behavior
  - draft JP client-facing bug/update text
  - compare request/response fields hoặc filter behavior
- default output shape:
  - Overview → Data Flow → Root Cause → QA Verification Steps
- entry points:
  - `kinken/README.md`
  - `kinken/working-notes.md` (stable facts + routing)
  - `kinken/spec-map.md` (deep architecture/data-model reference)

### WorkLog PC Connector (WPC)
- status: active
- aliases: Worklog, WorkLog, WPC, PC Connector, TeamSpirit, user_summary, BootEventLog, LogDetails
- typical keywords:
  - WLL-
  - startup delay
  - S3 batch
  - DynamoDB
  - SQS
  - Salesforce
  - TeamSpirit
  - WindowTitle log
  - batch run
  - start_time
  - JST / STG time
- typical task shapes:
  - write/organize test cases
  - analyze batch/import behavior
  - verify DB result fields sau import
  - summarize retest result / blocker / question for dev
  - draft JP/VN status update for QA progress
- default output shape:
  - Preconditions → Steps → Expected / Actual → Analysis / Next Check
- entry points:
  - `worklog/working-notes.md`

---

## Routing Rule

If user mentions:
- `WLL-...`, `BootEventLog`, `user_summary`, `LogDetails`, `WPC`, `PC Connector` → treat as **WorkLog PC Connector** unless user says otherwise.
- `KINKEN`, `LIXIL`, `商品特定`, `共通検索基盤`, `documents/products`, `/i` `/e`, `type_attributes` → treat as **KINKEN** unless user says otherwise.
- vague task với no strong keyword match → ask short disambiguation question if needed.

Khi new recurring task hoặc bug appear, add nó dưới active-task subsection của project hoặc deeper project note instead of bloating routing files.

---

## Maintenance Rule

- Keep file này lean: routing, aliases, active focus, links only.
- Stable project knowledge ở `<project>/working-notes.md` hoặc deeper subfolders.
- Day-specific discoveries không thuộc về đây — ghi ở `01-daily/YYYY/YYYY-MM-DD.md` thay vì bloat project files.
- Mỗi project chỉ có 1 canonical home dưới folder này (không split sang `notes/` hay nơi khác).
