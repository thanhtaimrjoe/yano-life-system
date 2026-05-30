---
name: project_kinken_repo_inventory
description: Map of the 6 lixil-kinken repos — role, stack, Docker setup, deploy target, how they connect. Concrete companion to tech_stack.md.
type: project
updated: 2026-05-30
source: kinken-codebase-review (6 repos read 2026-05-30)
---

# KINKEN Repo Inventory (6 repos)

Bản đồ cụ thể 6 repo `lixil-kinken-*`. Stack tổng quát xem `tech_stack.md`; pattern tái dùng xem `../../04_SOFTWARE_DEVELOPMENT/`.

## Bảng tổng

| Repo | Vai trò | Stack | Docker | Deploy |
|---|---|---|---|---|
| **backend-main** | API chính: product, document, search, auth, access-log | Python 3.13 / FastAPI, SQLAlchemy, Alembic, ES client 9.x, Poetry | single-stage alpine + `docker-entrypoint.sh` (wait DB → `alembic upgrade head` → uvicorn) | **Cloud Run** (4GiB/2vCPU, prod min-instances=1), cloudbuild dev/stg/prod |
| **frontend-main** | Web SPA cho user: search, product detail, docs, announcements | Next.js 15 / React 19 / TS, MUI 7, Jotai, Axios, pnpm | **multi-stage** + nginx trong cùng container (entrypoint sinh nginx.conf) | **Cloud Run** (`--allow-unauthenticated`), secret ghi vào `.env.production` lúc build |
| **etl-main** | ETL Medallion (Bronze→Silver→Gold), OCR JP + AI embedding → ES | Python / PySpark, Tesseract-jpn, Azure OpenAI, ES 9.x | Dockerfile chỉ để test local | **Databricks** Jobs (param `["bronze","cad"]`), secret = Databricks Secret Scopes |
| **collection-main** | Batch gom data: SQL Server / SMB / SFTP → MySQL staging → GCS | Python 3.13 / Poetry, pymssql, pysmb, paramiko, selenium | batch container **không port**, chọn job qua `BATCH_TYPE` | chưa có CI/CD trong repo (trigger ngoài, đoán Cloud Run Jobs + Scheduler) |
| **cloud-functions-main** | 4 function: collection(log GCS event), log(→BigQuery), product-search(CSV→Cloud SQL), sitemap | Python 3.11 / functions-framework | **không Docker** | **Cloud Functions** (deploy source thẳng), trigger Pub/Sub hoặc HTTP |
| **scripts-main** | 4 tool: collection upload, resource-scheduler, search-eval, synonym-eval | Python 3.11–3.13, uv/poetry | chỉ search-eval có Dockerfile (+ ES local compose) | chỉ **resource-scheduler** lên Cloud Functions gen2 (deploy.sh); còn lại chạy tay |

## Data flow (1 dòng)
`nguồn LIXIL → collection → GCS → etl(Databricks) → Elasticsearch ← backend(Cloud Run) ← frontend(Cloud Run) ← user`; song song: app → Pub/Sub → cloud-functions → BigQuery (analytics).

## Điểm đáng nhớ
- **2 router auth khác nhau** ở backend: internal `authorization()` vs external `authentication_ext()` (API key) cho search-platform.
- **OpenAI feature flag** ở backend là Redis hot-toggle — bật/tắt không cần redeploy.
- **resource-scheduler** (scripts) tự scale Elastic Cloud + tắt/bật Cloud SQL theo lịch (Fri 21:00 JST tắt, Mon 08:00 JST bật) để tiết kiệm tiền — pattern hay.
- **search-api-eval-toolkit** thiết kế kiểu Unix pipeline (mỗi `qe_*` đọc/ghi JSONL, nối bằng pipe) để benchmark NDCG/MRR/RRF.
- **collection function** trong cloud-functions có phần insert DB đang bị stub (cần fix trước prod).

## Related
- `tech_stack.md`, `technical_architecture_overview.md`, `data_flow.md` (cùng folder)
- pattern tái dùng: `../../04_SOFTWARE_DEVELOPMENT/{docker-patterns, cloud-deployment-targets, system-architecture-patterns}.md`
