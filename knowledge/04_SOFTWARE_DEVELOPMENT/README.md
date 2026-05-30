# 04_SOFTWARE_DEVELOPMENT

Kiến thức kỹ thuật **tái dùng được across projects**. Khác với `06_PROJECTS/kinken/` (context bó trong 1 dự án), đây là các *pattern* rút ra từ dự án thật nhưng áp dụng được ở nơi khác — và giải thích được cho khách khi làm BrSE.

## Thuộc về đây
- architecture patterns (Clean Architecture, Medallion, event-driven)
- deployment / DevOps patterns (Docker, Cloud Run, CI/CD, secret management)
- debugging methods, coding standards, engineering heuristics
- tech references generalize được

## Không thuộc đây
- chi tiết implementation chỉ đúng trong 1 dự án → `06_PROJECTS/<project>/`
- log đời thường / học hành → `01-daily/`, `05-career-prep/`

## Note hiện có

| Note | Tóm tắt |
|---|---|
| [docker-patterns.md](docker-patterns.md) | 4 cách dùng Docker thực tế (multi-stage, entrypoint+migration, batch container, bind `$PORT`) + bài học |
| [cloud-deployment-targets.md](cloud-deployment-targets.md) | Cloud Run vs Cloud Functions vs Databricks vs Vercel — chọn cái nào khi nào; secret & môi trường dev/stg/prod |
| [system-architecture-patterns.md](system-architecture-patterns.md) | Clean Architecture, Medallion ETL, event-driven logging, cách chia microservices — học từ hệ KINKEN |

## Nguồn gốc
Bộ note này rút ra từ buổi đọc 6 repo của hệ **KINKEN** (LIXIL) ngày 2026-05-30. Context cụ thể của dự án nằm ở [../06_PROJECTS/kinken/](../06_PROJECTS/kinken/) — đặc biệt `02_architecture/`.
