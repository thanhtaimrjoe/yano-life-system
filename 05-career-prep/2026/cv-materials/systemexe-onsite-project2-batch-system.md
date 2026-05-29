---
title: SystemEXE Onsite Project 2 — Batch Processing Sales System
created: 2026-05-28
period: 2025-05-01 to 2025-08-31
location: SystemEXE Co., Ltd. (Onsite 4 months, parallel with Project 1)
role: IT Communicator
project_name: 販売系業務システム (Sales Business System)
tags: [career-prep, cv-materials, systemexe, onsite, batch-processing, spring-batch]
---

# SystemEXE Onsite Project 2 — Batch Processing Sales System

> Dự án thứ 2 làm song song tại SystemEXE (2025/05-08). Hệ thống xử lý theo lô (Batch Processing) cho nghiệp vụ bán hàng.

---

## Project Overview

**Tên dự án (JP):** 販売系業務システム (Sales Business System)  
**Tên dự án (VI):** Hệ thống Nghiệp vụ Bán hàng

**Đặc trưng cốt lõi:** Xử lý dữ liệu theo lô (Batch Processing)
- Không phải ứng dụng web real-time thông thường
- Thực thi các tác vụ (Job) theo lịch trình định sẵn (cuối ngày, cuối tháng)
- Xử lý lượng lớn dữ liệu: tổng hợp doanh số, cập nhật kho, tạo báo cáo

**Quy trình phát triển:** V-Model (tuần tự, chặt chẽ, không linh hoạt như Agile)

---

## Tech Stack

**Ngôn ngữ & Framework:**
- Ngôn ngữ: Java
- Framework chính: Spring Boot, Spring Batch
- ORM/Database Access:
  - Phase 1 (ikoutool): JPA
  - Phase 2: MyBatis (SQL trực tiếp trong file XML)

**Database:**
- MySQL trên Azure service

**Integration:**
- Azure SDK for Java (tích hợp dịch vụ Azure)
- Smbj (kết nối thư mục chia sẻ qua SMB/CIFS — đọc file đầu vào, ghi file kết quả)

**Source Code & Documentation:**
- Source Code: GitHub Enterprise
- Tài liệu (Design, Test): Box

---

## Core Concepts — IT Comtor Must Know

### 1. V-Model Development Process
- Quy trình tuần tự, chặt chẽ: Requirement Analysis → Overall Design → Detailed Design → Development → Testing
- Không linh hoạt như Agile — mọi thứ phải đi theo đúng các bước

### 2. Batch Processing with Spring Batch
Toàn bộ logic nghiệp vụ chính được đóng gói thành các **"Job"**, kích hoạt theo lịch trình.

**Hai mô hình xử lý chính:**

**a) Chunk Model** — Xử lý dữ liệu lớn
- Chu trình: Read → Process → Write (theo từng khối/chunk)
- Ví dụ: Đọc 1000 dòng CSV → xử lý → ghi vào database

**b) Tasklet Model** — Thực thi tác vụ duy nhất
- Không chia nhỏ, chạy một lần
- Ví dụ: Chạy shell command, xóa file tạm, gửi email thông báo

### 3. Naming Convention (命名規約) — CRITICAL
- Tuân thủ tuyệt đối quy tắc đặt tên cho: Job, Java file (package, class, method), Database (table, column, index)
- Đây là điểm IT Comtor cần clarify với khách hàng nếu có mơ hồ

### 4. MyBatis vs JPA
- **Phase 1 (ikoutool):** JPA (ORM tự động)
- **Phase 2:** MyBatis (SQL trực tiếp trong XML) → team phải làm việc nhiều với SQL

---

## Team Structure

| Vị trí | Tên | Quốc tịch |
|---|---|---|
| Project Leader | Phạm Hoàng Tuân | VN |
| IT Comtor | Huỳnh Thanh Tài (Yano) | VN |
| Java Developer | Ninh Văn Nghĩa | VN |
| Java Developer | Hoàng Việt | VN |
| Java Developer | Trần Thanh Duy | VN |
| Leader (JP) | 飯原 裕喜 (Iihara Yūki) | JP |
| (JP) | 菅原 真悟 (Sugawara Shingo) | JP |
| (JP) | 日高 沙都 (Hidaka Sato) | JP |
| (JP) | 小澤 重基 (Ozawa Shigeki) | JP |
| (JP) | 武澤 あやの (Takezawa Ayano) | JP |
| (JP) | 橋本 夏樹 (Hashimoto Natsuki) | JP |
| (JP) | 後藤 凜 (Goto Rin) | JP |
| (JP) | 加藤 慶 (Kato Kei) | JP |
| BrSE (JP) | フィンティホア (Fin Ti Hoa) | JP |

---

## Yano's Role (IT Comtor)

**Responsibilities:**
- Clarify V-Model process requirements với team VN
- Explain Batch Processing concepts (Chunk vs Tasklet model)
- Ensure naming convention compliance
- Translate spec từ JP → VI cho Java developers
- Clarify database design, SQL queries (MyBatis phase)
- Communicate with JP team về technical issues
- Tham gia test phase, tạo evidence cho bug report

**Key Skills Needed:**
- Hiểu Spring Boot, Spring Batch architecture
- Hiểu MyBatis SQL mapping
- Hiểu V-Model process (khác Agile)
- Hiểu Batch Job scheduling, Chunk/Tasklet model
- Hiểu Azure integration, SMB file sharing

---

## Key Learnings & Contributions

**Technical Understanding:**
- Batch Processing architecture (Spring Batch)
- V-Model development process (sequential, strict)
- MyBatis SQL mapping (Phase 2)
- Azure integration, SMB file sharing
- Job scheduling, Chunk vs Tasklet model

**Communication:**
- Clarify complex batch processing concepts với team VN
- Ensure naming convention compliance
- Bridge V-Model process understanding between JP and VN teams
- Translate technical spec accurately

**QA & Testing:**
- Understand batch job testing (input/output validation, performance)
- Test data preparation for batch jobs
- Verify job execution logs and results

---

## Notes for CV Update

**Để ghi vào CV (section SystemEXE onsite, Project 2):**
- Dự án: Hệ thống Nghiệp vụ Bán hàng (Batch Processing)
- Tech: Java, Spring Boot, Spring Batch, MyBatis, MySQL (Azure)
- Role: Clarify V-Model process, explain Batch Processing concepts, translate spec JP→VI, tham gia test
- Highlight: Làm việc với batch processing system (complex data handling), V-Model process (strict sequential), Spring Batch architecture

---

**Created:** 2026-05-28 (Day 8 Sprint)  
**Source:** Yano's direct input
