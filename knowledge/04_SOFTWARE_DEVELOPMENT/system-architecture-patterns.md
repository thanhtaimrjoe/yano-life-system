---
title: System Architecture Patterns (học từ KINKEN)
domain: SOFTWARE_DEVELOPMENT
status: active
type: concept
tags: [architecture, clean-architecture, etl, medallion, microservices, event-driven, elasticsearch]
updated: 2026-05-30
source: [internal, kinken-codebase-review]
related:
  - knowledge/04_SOFTWARE_DEVELOPMENT/cloud-deployment-targets.md
  - knowledge/06_PROJECTS/kinken/02_architecture/technical_architecture_overview.md
---

# System Architecture Patterns (học từ KINKEN)

## Summary
KINKEN không phải 1 app mà là **hệ microservices**: nhiều service nhỏ, mỗi cái một việc, nối nhau qua GCS / Pub/Sub / API / Elasticsearch. Đây là các pattern kiến trúc tái dùng được — và là chất liệu vàng để kể khi phỏng vấn BrSE.

## Toàn cảnh hệ (6 service)
```
Nguồn LIXIL (SQL Server, file server)
   │  collection (batch job)
   ▼
Google Cloud Storage (file thô + CSV)
   │  etl (Databricks: OCR tiếng Nhật + AI embedding)
   ▼
Elasticsearch Cloud (search + semantic search)
   ▲ truy vấn
backend (FastAPI / Cloud Run) ──▶ MySQL (Cloud SQL)
   ▲ gọi API
frontend (Next.js / Cloud Run) ──▶ người dùng

cloud-functions: ghi access log → BigQuery, sinh sitemap
scripts: tự scale cluster theo lịch, đánh giá chất lượng search
```

## Pattern 1 — Clean Architecture (backend)
Chia code thành tầng, tầng trong **không biết** tầng ngoài:
- **domain**: entity + port (interface), thuần logic, không dính framework
- **application**: use case (điều phối nghiệp vụ)
- **infrastructure**: adapter/repository hiện thực port (DB, ES, GCS)
- **interface**: router FastAPI (chỉ ở tầng ngoài cùng)

Lợi: đổi DB/framework không phá logic; dễ test (mock port). Dấu hiệu nhận biết: thư mục `domain/ application/ infrastructure/ interface/`.

## Pattern 2 — Medallion Architecture (ETL)
Dữ liệu chảy qua 3 lớp, mỗi lớp sạch dần:
- **Bronze**: raw, gom thẳng từ nguồn, chưa xử lý
- **Silver**: đã làm sạch / chuẩn hóa
- **Gold**: sẵn sàng cho nghiệp vụ (đẩy vào Elasticsearch để search)

Pipeline định nghĩa **data-driven** (file `pipelines.yaml`: nguồn → transform → đích) thay vì hardcode. OCR tiếng Nhật và AI embedding là các bước transform.

## Pattern 3 — Event-driven logging (cloud-functions)
Không ghi log đồng bộ trong request (chậm). Thay vào:
```
app → publish message vào Pub/Sub → Cloud Function consume → ghi vào BigQuery
```
Tách việc ghi log ra khỏi luồng chính → app phản hồi nhanh, log xử lý nền. Dùng **registry pattern** (mỗi loại event 1 model pydantic) để validate & dispatch 18 loại log gọn gàng.

## Pattern 4 — Chia microservices theo "nhịp" công việc
Một dấu hiệu chia service tốt: **tần suất chạy khác nhau thì tách ra**.
- frontend/backend: chạy liên tục (server) → Cloud Run
- collection: chạy theo batch/lịch → container không port
- etl: chạy nặng định kỳ → Databricks
- log/sitemap: chạy theo sự kiện → Cloud Functions
- scripts: chạy tay hoặc cron hiếm → script thường

→ Mỗi loại scale & deploy độc lập, không kéo nhau sập.

## Pattern 5 — 12-Factor reflexes (xuyên suốt)
- config qua **env var**, secret qua **Secret Manager** (không hardcode)
- 3 môi trường **dev/stg/prod** tách bạch
- service **stateless** (state ở DB/ES/GCS, không ở trong instance) → scale ngang thoải mái

## Practical Use
- **mini-kinken**: bắt đầu monolith Clean-Architecture-lite (chia domain/infra) là đủ; chỉ tách microservice khi có nhịp công việc khác nhau rõ rệt (vd thêm 1 job ETL).
- **BrSE**: dùng sơ đồ trên để giải thích "vì sao hệ chia nhiều service", "data chảy thế nào từ nguồn tới màn hình search". Đây là câu chuyện kiến trúc rất mạnh khi trao đổi với khách/dev.

## Related Notes
- [cloud-deployment-targets](cloud-deployment-targets.md) — mỗi pattern deploy ở đâu
- [docker-patterns](docker-patterns.md) — đóng gói từng service
- chi tiết KINKEN: `../06_PROJECTS/kinken/02_architecture/`
