---
title: SystemEXE Onsite Project Details (2025/05-08)
created: 2026-05-28
period: 2025-05-01 to 2025-08-31
location: SystemEXE Co., Ltd. (Onsite 4 months)
role: IT Communicator
tags: [career-prep, cv-materials, systemexe, onsite]
---

# SystemEXE Onsite Project Details

> Thông tin chi tiết 2 dự án onsite tại SystemEXE (2025/05-08) để update vào CV.

---

## Project 1: 建設業許可・経営事項審査の電子申請システム開発
### (Construction License & Business Capability Assessment E-Application System)

**Tên dự án (VI):** Hệ thống Nộp hồ sơ điện tử cho Giấy phép Kinh doanh Xây dựng và Thẩm định Năng lực Doanh nghiệp

**Mục đích:**
- Cho phép doanh nghiệp xây dựng nộp hồ sơ xin cấp phép, thay đổi, báo cáo qua mạng.
- Cho phép cơ quan hành chính tiếp nhận, xem xét và xử lý các hồ sơ.

**Đối tượng sử dụng:**
- **Người nộp đơn (申請者):** Các công ty, doanh nghiệp xây dựng.
- **Cơ quan hành chính (行政庁):** Cán bộ cấp phép.

**Tech Stack:**
- IDE: Visual Studio 2019
- Ngôn ngữ: C#
- Framework: .NET Core 3.1
- Database: SQL Server 2019
- Client: Windows 10/8.1, Edge, Chrome, IE11

**Kiến trúc & Hệ thống liên kết:**
- **gBizID:** Xác thực danh tính doanh nghiệp
- **CIIS (Construction Industry Information System):** Lưu trữ dữ liệu giấy phép
- **F-REGI & Wellnet:** Payment Gateway (thu phí)
- **R-Cloud:** Cloud Storage (lưu file đính kèm)
- **LGWAN:** Mạng riêng bảo mật của chính phủ Nhật (cán bộ hành chính truy cập qua đây)

**Quy trình chính:**
- **Người nộp đơn:** Đăng nhập gBizID → My Page → Chọn loại hồ sơ → Điền thông tin → Nộp
- **Cơ quan hành chính:** Đăng nhập → Xem danh sách hồ sơ → Xem chi tiết → Xử lý

**Yano's Role (IT Comtor):**
- Dịch spec và QA document từ tiếng Nhật sang tiếng Việt
- Hỗ trợ team VN hiểu requirement và clarify với khách hàng Nhật
- Tham gia test và tạo evidence cho bug report

---

## Project 2: Migration Project (Spring Boot)

**Mục đích:** Migration hệ thống từ công nghệ cũ sang Spring Boot

**Tech Stack:**
- Framework: Spring Boot
- Ngôn ngữ: Java

**Yano's Role (IT Comtor):**
- Đọc tài liệu migration spec (JP)
- Tổng hợp key points cho team VN
- Hỗ trợ QA cho phase migration testing

---

## Team Structure

| Vị trí | Tên | Quốc tịch |
|---|---|---|
| Project Leader | Trương Quốc Thắng | VN |
| IT Comtor | Huỳnh Thanh Tài (Yano) | VN |
| C# Developer | Nguyễn Đình Hảo | VN |
| C# Developer | Trần Quốc Duy | VN |
| Leader (JP side) | 松岡智之 | JP |
| BrSE (JP side) | ﾌﾞｲｸｱﾝﾃｨｴﾝ | JP |

---

## Key Learnings & Contributions

**Spec Reading:**
- Đọc và phân tích spec tiếng Nhật phức tạp (hệ thống hành chính công)
- Hiểu kiến trúc hệ thống với nhiều hệ thống liên kết (gBizID, CIIS, Payment Gateway, Cloud Storage, LGWAN)

**Communication:**
- Clarify requirement giữa team VN và khách hàng Nhật
- Dịch tài liệu kỹ thuật chính xác
- Tham gia daily meeting với team Nhật

**QA & Testing:**
- Tham gia test phase, tạo evidence cho bug report
- Hiểu quy trình testing cho hệ thống hành chính (high-security, high-reliability)

**Technical Understanding:**
- Hiểu kiến trúc .NET Core 3.1 + SQL Server
- Hiểu Spring Boot migration process
- Hiểu integration với external systems (payment gateway, cloud storage, government network)

---

## Notes for CV Update

**Để ghi vào CV (section SystemEXE onsite):**
- Dự án 1: Hệ thống nộp hồ sơ điện tử cho giấy phép xây dựng (hệ thống hành chính công Nhật)
- Dự án 2: Migration project (Spring Boot)
- Tech: .NET Core 3.1, C#, SQL Server, Spring Boot, Java
- Role: Dịch spec JP→VI, clarify requirement, tham gia test
- Highlight: Làm việc với hệ thống hành chính công (high-security), integrate với nhiều external systems

---

**Created:** 2026-05-28 (Day 8 Sprint)  
**Source:** Yano's direct input
