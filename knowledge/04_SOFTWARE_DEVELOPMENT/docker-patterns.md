---
title: Docker Patterns thực tế
domain: SOFTWARE_DEVELOPMENT
status: active
type: reference
tags: [docker, dockerfile, devops, deployment]
updated: 2026-05-30
source: [internal, kinken-codebase-review]
related:
  - knowledge/04_SOFTWARE_DEVELOPMENT/cloud-deployment-targets.md
  - knowledge/06_PROJECTS/kinken/02_architecture/tech_stack.md
---

# Docker Patterns thực tế

## Summary
Một Dockerfile không chỉ có một kiểu. Tùy app là **web server**, **frontend build**, hay **job chạy 1 lần** mà cách viết khác hẳn. 4 pattern dưới đây rút từ hệ KINKEN, dùng lại được cho bất kỳ app nào (kể cả mini-kinken).

## Key Ideas

### 1) Multi-stage build — image nhẹ (frontend Next.js)
Tách "môi trường build" khỏi "môi trường chạy". Stage 1 build ra artifact, stage 2 chỉ copy artifact sang → không mang theo source + devDependencies → image nhỏ hơn nhiều.
```dockerfile
# Stage 1: builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN pnpm install && pnpm build      # ra .next standalone

# Stage 2: runner (chỉ lấy kết quả build)
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "server.js"]
```
Đây là lý do Docker "tiện khủng khiếp": build bẩn ở stage 1, chạy sạch ở stage 2.

### 2) Entrypoint script — đợi DB + chạy migration trước khi start (backend FastAPI)
Container đừng start app ngay. Dùng `docker-entrypoint.sh` để: (1) đợi DB sẵn sàng, (2) chạy migration, (3) mới start server. Tránh lỗi "DB chưa lên app đã chạy".
```bash
#!/bin/sh
# docker-entrypoint.sh
wait-for-db.sh                 # poll tới khi MySQL nhận kết nối
alembic upgrade head           # áp migration mới nhất
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8080}"
```
```dockerfile
ENTRYPOINT ["/docker-entrypoint.sh"]
```
> Lưu ý scale: nếu container scale-out nhiều bản, mỗi bản sẽ chạy migration lúc khởi động → cân nhắc tách migration thành 1 bước deploy riêng khi hệ lớn.

### 3) Batch container — không có port (collection job)
Không phải container nào cũng là server. Job gom dữ liệu chạy 1 lần rồi tắt: không `EXPOSE`, không server, chọn việc qua biến môi trường.
```dockerfile
FROM python:3.13-slim
# ... cài deps ...
CMD ["python", "-m", "app.jobs.main"]   # đọc BATCH_TYPE để biết chạy job nào
```
Cùng 1 image deploy nhiều lần với `BATCH_TYPE` khác nhau → tái dùng tối đa.

### 4) Bind `0.0.0.0:$PORT` + dùng base alpine/slim
- **Bind `0.0.0.0`** (không phải `127.0.0.1`) để nhận request từ ngoài container.
- **Đọc `$PORT` từ env** (`${PORT:-8080}`) → chạy được trên Cloud Run mà khỏi sửa code (Cloud Run tự set `PORT`).
- **`-alpine` / `-slim`** base image → nhỏ, build nhanh. Đổi lại đôi khi thiếu lib hệ thống phải cài thêm (vd `libsmbclient-dev`).

## Practical Use (cho mini-kinken)
1. Web app → pattern 1 + 2 + 4.
2. Có DB + migration → bắt buộc pattern 2 (entrypoint).
3. Job xử lý dữ liệu → pattern 3.
4. Muốn sau này lên Cloud Run dễ → luôn theo pattern 4 ngay từ đầu.
5. Secret: **không hardcode** — đọc từ env (`.env` local, Secret Manager khi lên cloud). Xem [cloud-deployment-targets](cloud-deployment-targets.md).

## Related Notes
- [cloud-deployment-targets](cloud-deployment-targets.md) — đẩy image này lên đâu
- [system-architecture-patterns](system-architecture-patterns.md) — chia service thế nào trước khi dockerize
