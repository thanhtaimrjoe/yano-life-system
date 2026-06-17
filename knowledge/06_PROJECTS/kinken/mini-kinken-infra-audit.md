---
name: project_mini_kinken_infra_audit
description: Honest audit of mini-kinken (local sandbox) infra + 4-step roadmap to actually use GCP/ES/GCS/Databricks for BrSE infra learning.
type: project
updated: 2026-05-30
source: mini-kinken audit (3 sub-agents, 2026-05-30)
related:
  - knowledge/04_SOFTWARE_DEVELOPMENT/cloud-deployment-targets.md
  - knowledge/04_SOFTWARE_DEVELOPMENT/docker-patterns.md
  - knowledge/06_PROJECTS/kinken/02_architecture/repo_inventory.md
---

# mini-kinken — Infra Audit & Learning Roadmap

> Mục tiêu của Yano: **dùng thử GCP / Databricks / Elasticsearch thật** để hiểu infra cho vai trò BrSE.
> mini-kinken sống ở `~/Documents/mini-kinken` (repo git riêng). Đây là bản audit + lộ trình; code làm bên đó.

## Kết luận 1 câu
mini-kinken mô phỏng **đúng *hình dạng* kiến trúc** KINKEN (rất tốt để kể khi phỏng vấn), nhưng về **hạ tầng thật thì ~100% local/giả** — chưa chạm GCP, Databricks, hay managed ES. Đi từ đây tới "infra thật" là **viết thêm/viết lại**, không phải nâng cấp nhẹ.

## Điểm mạnh (giữ lại)
- Cấu trúc mirror hệ thật: backend Clean Architecture, Medallion `data/bronze|silver|gold`, collection job, frontend.
- **Frontend Dockerfile là hàng thật** (multi-stage + nginx) — copy từ repo LIXIL, dùng làm tài liệu Docker tham khảo tốt.
- **Tầng Silver của ETL** dạy đúng khái niệm: schema detect, map 28 cột → DB, chuẩn hóa flag, xử lý null/date.
- `docker-compose` ES + MySQL chạy thật ở local.

## Vấn đề theo từng service muốn học

### GCP — hiện là "trang trí", không chạy được
- 3 file `cloudbuild-*.yaml` + Dockerfile frontend **copy nguyên từ repo LIXIL** (README còn ghi `git clone ...GuildWorks/lixil-kinken-frontend`). Tham chiếu ~13 secret `lixil-kinken-frontend-*` và biến `${_PROJECT_ID}` **không tồn tại trong GCP của Yano** → deploy chết ngay.
- Frontend image **không build local được** (thiếu `docker/nginx/.htpasswd`, `.env.production`).
- Backend **không có Dockerfile**, không bind `0.0.0.0:$PORT` → chưa Cloud-Run-ready.
- **Zero `google-cloud-*` SDK**; "GCS" chỉ là chuỗi URL giả.

### Databricks — hoàn toàn không có
- ETL là **pandas thuần, single-node**, cap `head(1000)`. Không một dòng `pyspark`/`delta`/`databricks`.
- Lên Databricks = viết lại: pandas → Spark API, CSV → Delta, Unity Catalog, secret scopes.

### Elasticsearch — ES thật nhưng "chết lâm sàng"
- ES container chạy thật, có index/mapping, **nhưng không endpoint nào query ES**. Search product → MySQL; search document → `LIKE` của SQLAlchemy. ES chỉ ghi, không đọc.
- **Semantic search giả**: `dense_vector dims=3` (thật ~1536), vector = `[len(name), 0.5, 0.1]`. Không embedding, không OCR tiếng Nhật — đúng phần khó & KINKEN nhất lại vắng.

## Lỗi nhỏ nên sửa sớm
- **Config lệch**: backend default DB `kinken` vs compose tạo `kinken_db` → fresh start lỗi nếu thiếu `.env`.
- **Auth toàn mock**: API key hardcode `dev-api-key-12345`; login chấp nhận mọi user.
- **CORS sai**: `allow_origins=["*"]` + `allow_credentials=True` (không hợp lệ & không an toàn).
- **Secret plaintext** trong compose (`root`/`kinken_password`).

## Lộ trình 4 bước (dễ → khó, mỗi bước 1 "khoảnh khắc thật")

### Bước 1 — Cloud Run (dễ nhất, thấy URL ngay)
- Viết Dockerfile cho **backend**, bind `uvicorn --host 0.0.0.0 --port $PORT`.
- Deploy lên Cloud Run bằng **GCP project của chính Yano**.
- Học: build image → Artifact Registry → `gcloud run deploy`. Tham khảo [docker-patterns](../../04_SOFTWARE_DEVELOPMENT/docker-patterns.md) pattern 1+2+4.

### Bước 2 — Managed ES (Elastic Cloud free trial)
- Trỏ `ELASTICSEARCH_URL` sang Elastic Cloud + API key (bỏ `verify_certs=False`).
- **Wire ES vào endpoint search thật** (hiện đi MySQL).
- Thêm **kuromoji analyzer** tiếng Nhật → chạm phần KINKEN-relevant nhất.

### Bước 3 — GCS
- Thêm `google-cloud-storage`, thay chuỗi URL giả bằng upload/đọc bucket thật + signed URL.

### Bước 4 — Databricks (khó nhất)
- Port `etl/pipeline.py` sang PySpark trên Databricks Community/trial.
- Đọc từ GCS → ghi Delta → (tùy) đẩy vào ES. Dùng secret scopes thay creds hardcode.

> Mỗi bước là 1 sprint nhỏ, làm được thật với free tier trong vài giờ.

## Cross-link
- Pattern tái dùng: `../../04_SOFTWARE_DEVELOPMENT/{docker-patterns, cloud-deployment-targets, system-architecture-patterns}.md`
- Bản đồ hệ thật để đối chiếu: `02_architecture/repo_inventory.md`
