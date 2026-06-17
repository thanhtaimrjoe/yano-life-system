# GCP BrSE 2-Week Plan (Start: 2026-05-31)

## Why this plan
- Mục tiêu chính hiện tại vẫn là BrSE Fresher (target gần).
- GCP được học theo hướng "BrSE-ready": hiểu kiến trúc, bảo mật, chi phí, trade-off, không sa vào cấu hình quá sâu.
- Outcome cần đạt: nói được 1 case cloud rõ ràng trong phỏng vấn (JP/VN/EN tùy ngữ cảnh).

## Guardrails (để không đốt trial)
- Tạo `Billing Budget Alert` ngay buổi đầu:
  - Alert mốc: 5 USD, 15 USD, 30 USD, 60 USD.
- Mọi lab đều có bước cleanup cuối buổi.
- Không mở dịch vụ nâng cao (GKE, NAT gateway, tải lớn) trong track này.
- Ưu tiên dịch vụ có free tier hoặc workload nhỏ.
- Chỉ chạy tài nguyên khi đang học, xong là stop/delete.

## Scope (chỉ 5 mảng)
1. IAM (ai được làm gì)
2. Cloud Run (deploy app nhanh)
3. Cloud SQL (Postgres/MySQL managed)
4. Cloud Storage (file/object)
5. Monitoring + Cost visibility

## Timebox
- 14 ngày, mỗi ngày 45-60 phút.
- Mỗi buổi: 5 phút mục tiêu, 35-45 phút thực hành, 10 phút note + cleanup.

## Week 1 (Foundation + Mini app)

### Day 1 — Account safety setup
- Tạo project học riêng: `brse-gcp-lab`.
- Bật Billing Budget + Email alert.
- Bật IAM review: hiểu Owner/Editor/Viewer/Service Account.
- Deliverable note:
  - "Tại sao least privilege quan trọng với khách hàng Nhật".

### Day 2 — IAM thực hành cơ bản
- Tạo 1 service account cho app runtime.
- Gán role tối thiểu (viewer/storage object viewer tùy bài).
- Thực hành revoke 1 role và xác nhận access bị chặn.
- Deliverable note:
  - 3 lỗi phân quyền phổ biến và cách nói với dev team.

### Day 3 — Cloud Run hello service
- Deploy 1 app rất nhỏ (hello api/web).
- Set region duy nhất, không multi-region.
- Test URL, scale to zero behavior.
- Deliverable note:
  - "Khi nào chọn Cloud Run thay vì VM" (3 ý).

### Day 4 — Cloud Storage integration
- Tạo bucket (standard), upload/download object.
- Cấu hình quyền đọc tối thiểu cho app/service account.
- Không public toàn bucket nếu không cần.
- Deliverable note:
  - "Use case lưu file user upload" và risk nếu permission sai.

### Day 5 — Cloud SQL basic
- Tạo Cloud SQL instance nhỏ nhất phù hợp lab.
- Tạo DB + 1 table demo.
- Kết nối thử từ local hoặc service đơn giản.
- Deliverable note:
  - "Managed DB giúp team giảm việc gì".

### Day 6 — Connect Cloud Run ↔ Cloud SQL (lite)
- App Cloud Run đọc/ghi 1-2 bản ghi demo.
- Kiểm tra service account quyền DB.
- Deliverable note:
  - Luồng request từ user đến DB (mô tả 6-8 bước).

### Day 7 — Week 1 review
- Tổng hợp kiến thức tuần 1 (1 trang markdown).
- Chốt 1 architecture mini:
  - User -> Cloud Run -> Cloud SQL
  - Asset file -> Cloud Storage
  - IAM phân quyền runtime
- Cleanup toàn bộ tài nguyên không dùng.

## Week 2 (BrSE communication mode)

### Day 8 — Monitoring & logging basics
- Xem log Cloud Run.
- Xem metric cơ bản (request count, latency).
- Deliverable note:
  - "Nếu khách báo chậm, kiểm tra gì trước" (runbook mini).

### Day 9 — Cost awareness
- Đọc Billing report theo service.
- Ghi nhận dịch vụ nào tốn nhiều nhất trong lab.
- Deliverable note:
  - 5 đòn bẩy giảm cost không ảnh hưởng nhiều tới dev speed.

### Day 10 — Security pass cơ bản
- Rà lại IAM role, xóa role dư.
- Verify bucket không public nhầm.
- Deliverable note:
  - Checklist security pre-release mức BrSE.

### Day 11 — Translate business requirement -> architecture
- Tự đặt đề bài: "Nội bộ cần app upload tài liệu + tra cứu".
- Viết mapping:
  - Functional requirement -> GCP service
  - Non-functional (security/cost) -> config direction
- Deliverable note:
  - Bảng mapping 2 cột (requirement / design choice).

### Day 12 — STAR story draft
- Viết 1 STAR cloud story:
  - Situation, Task, Action, Result
  - Nhấn vào quyết định service + lý do cost/security.
- Deliverable note:
  - 1 phiên bản VN + 1 phiên bản ngắn EN/JP outline.

### Day 13 — Mock explanation day
- Tập nói 5-7 phút như đang giải thích cho khách hàng.
- Tập nói 3 câu clarify requirement trước khi thiết kế.
- Deliverable note:
  - Các câu hỏi clarify chuẩn BrSE.

### Day 14 — Final checkpoint
- Tổng hợp "GCP for BrSE one-pager":
  - Khi nào dùng Cloud Run / VM
  - IAM nguyên tắc
  - DB + Storage pattern cơ bản
  - Cost/safety checklist
- Đóng toàn bộ tài nguyên lab.
- Đánh dấu phần cần học tiếp sau deadline BrSE.

## Interview-focused outputs (bắt buộc có)
- 1 architecture mini có thể vẽ tay trong 1 phút.
- 1 STAR cloud case (nói được trong 90 giây và 3 phút).
- 1 checklist cost + security trước khi demo với khách.

## Anti-overload rules
- Không học quá 1 service mới/ngày.
- Nếu ngày đó mệt: chỉ làm cleanup + review note 20 phút.
- Nếu phát sinh lỗi hạ tầng: giới hạn debug 20 phút, quá thì ghi issue để hôm sau xử lý.

## Suggested file updates during this plan
- Daily prep log: `05-career-prep/2026/daily/YYYY-MM-DD.md`
- Weekly prep review: `05-career-prep/2026/weekly/YYYY-MM-DD.md`
- Nếu cần tracking nhanh: thêm mục "GCP mini-progress" vào sprint plan đang active.

## Start today (2026-05-31)
1. Tạo project lab + budget alerts.
2. Viết 5 dòng note: "BrSE cần cloud để làm gì".
3. Dành 10 phút cuối để cleanup checklist (kể cả chưa tạo gì).
