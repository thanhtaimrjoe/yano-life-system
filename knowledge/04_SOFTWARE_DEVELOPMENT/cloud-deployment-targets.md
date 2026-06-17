---
title: Cloud Deployment Targets — chọn nơi deploy
domain: SOFTWARE_DEVELOPMENT
status: active
type: reference
tags: [gcp, cloud-run, cloud-functions, databricks, vercel, cicd, deployment, secrets]
updated: 2026-05-30
source: [internal, kinken-codebase-review]
related:
  - knowledge/04_SOFTWARE_DEVELOPMENT/docker-patterns.md
  - knowledge/04_SOFTWARE_DEVELOPMENT/system-architecture-patterns.md
---

# Cloud Deployment Targets — chọn nơi deploy

## Summary
Cùng một hệ thống (KINKEN) dùng **3 kiểu deploy khác nhau** tùy loại việc. Hiểu khi nào dùng cái nào là kiến thức cốt lõi cho cả dev lẫn BrSE (giải thích kiến trúc cho khách).

## Google Cloud (GCP) là gì
GCP là **cả một nền tảng cloud** (như AWS, Azure) — hàng trăm dịch vụ con. **Vercel** thì chỉ là 1 dịch vụ chuyên deploy web JS. So sánh GCP với Vercel là so cả siêu thị với một quầy.

## Bảng chọn target

| Loại việc | Target | Vì sao |
|---|---|---|
| Web app / API có URL, container tùy ý | **Cloud Run** | Serverless container, scale 0→N, trả tiền theo dùng. "Vercel của backend" nhưng chạy *mọi* ngôn ngữ |
| Việc nhỏ chạy theo sự kiện (file mới vào GCS, message Pub/Sub) hoặc HTTP đơn lẻ | **Cloud Functions** | Khỏi viết Dockerfile, GCP tự đóng gói. Nhẹ hơn Cloud Run |
| Xử lý dữ liệu lớn / Spark / ML / OCR | **Databricks** | Cluster tính toán mạnh, không hợp Cloud Run |
| Frontend JS thuần (Next.js), muốn deploy siêu nhanh | **Vercel** | Zero-config, nhưng kém linh hoạt cho backend |

> KINKEN cho thấy: không có "một nơi deploy đúng cho tất cả". backend+frontend → Cloud Run; 4 function logging/sitemap → Cloud Functions; ETL → Databricks.

## Cloud Run — chi tiết (gần mini-kinken nhất)
- Chạy 1 **container** (Docker), bind `0.0.0.0:$PORT` (GCP tự set `PORT`).
- **Scale to zero**: không request → 0 instance → không tốn tiền. Đổi lại có "cold start" (lần đầu hơi chậm). Prod thường set `min-instances=1` để tránh cold start.
- Cấu hình: RAM, vCPU, `concurrency` (số request/instance), `max-instances`.
- `--allow-unauthenticated` = cho public truy cập (frontend). Bỏ đi = chỉ nội bộ gọi được.

## CI/CD pattern (Cloud Build)
3 file `cloudbuild-dev.yaml` / `-stg.yaml` / `-prod.yaml`, mỗi file 3 bước:
```
1. docker build  → tạo image
2. push          → đẩy lên Artifact Registry (kho image của GCP)
3. gcloud run deploy → deploy image lên Cloud Run
```
Github push code → trigger pipeline tương ứng môi trường.

## Secret management — quy tắc vàng
- **KHÔNG hardcode** mật khẩu/API key trong code hay trong image.
- Lấy từ **GCP Secret Manager** lúc deploy (`--set-secrets`) hoặc build (ghi ra `.env.production`).
- 3 môi trường **dev / stg / prod**, mỗi cái một bộ secret riêng (đặt tên có suffix `-dev`, `-stg`, `-prod`).
- Lưu ý: secret inject lúc **build** (frontend) → đổi secret phải build+deploy lại; inject lúc **runtime** (backend) → linh hoạt hơn.

## Practical Use (mini-kinken)
1. App web/API → Cloud Run. Viết Dockerfile theo [docker-patterns](docker-patterns.md) pattern 4.
2. Local: secret trong `.env` (gitignore). Cloud: Secret Manager.
3. Muốn cron/event nhỏ → Cloud Functions, khỏi Docker.
4. Tách dev/stg/prod ngay từ đầu, đừng để chung 1 môi trường.

## Related Notes
- [docker-patterns](docker-patterns.md) — đóng gói trước khi deploy
- [system-architecture-patterns](system-architecture-patterns.md) — chia service để biết cái nào deploy đâu
