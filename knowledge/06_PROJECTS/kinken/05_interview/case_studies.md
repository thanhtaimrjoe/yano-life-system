---
name: kinken_case_studies
description: Detailed case studies from KINKEN project for BrSE interview preparation.
type: project
---

# KINKEN Case Studies for BrSE Interview

## Overview

Tài liệu này chứa các case study chi tiết từ dự án KINKEN, được tổ chức theo format dễ kể chuyện trong phỏng vấn.

---

## Case Study 1: PoC Benchmark Discrepancy

### Background (Bối cảnh)

- **Sprint**: SPRINT 6 (Tháng 8/2025)
- **Context**: Team đang chuẩn bị PoC (Proof of Concept) để demo cho khách hàng LIXIL
- **Scale**: 13 triệu documents, 8.8 triệu product records

### Problem (Vấn đề)

Kết quả search của PoC mới (tháng 5/2025) **khác** với kết quả của PoC cũ (tháng 12/2024) dù dùng **cùng một bộ data**.

**Impact**:
- Khách hàng có thể mất tin tưởng vào độ chính xác của hệ thống
- Không thể explain tại sao kết quả khác nhau
- Rủi ro cao khi deploy lên PROD

### Investigation Process (Quá trình điều tra)

| Step | Investigation | Result |
|------|---------------|--------|
| 1 | Check embedding vector | Non-deterministic (cùng text có thể ra vector khác nhau) |
| 2 | Check model version | Version không đổi ✓ |
| 3 | Check ES version | **Không được record ở PoC cũ** ✗ |
| 4 | Check HNSW algorithm | Randomness trong index creation |
| 5 | Check sharding | Có thể ảnh hưởng nhưng chưa confirm |

### Root Causes (Nguyên nhân gốc rễ)

1. **Embedding Vector Non-determinism**: Model AI tạo vector có tính ngẫu nhiên
2. **HNSW Algorithm**: Approximate Nearest Neighbor có randomness trong index structure
3. **ES Version Mismatch**: Không lock version infrastructure

### Solution (Giải pháp)

**Short-term**:
- Giới hạn điều tra đến ngày 23/05 để ưu tiên task quan trọng
- Explain cho khách hàng về tính chất non-deterministic của vector search

**Long-term**:
- **Always lock and record infrastructure versions**
- Implement version control protocol cho tất cả components
- Create regression test suite để detect future discrepancies

### My Role (Vai trò của tôi)

- **QA**: Phát hiện sự khác biệt khi test search results
- **Documentation**: Note lesson learned vào sprint tracking
- **Communication**: Explain technical issue cho team và stakeholder

### Interview Talking Points

> "Trong case này, tôi học được 3 bài học quan trọng:
>
> 1. **Version control is critical**: Phải lock và record mọi version
> 2. **Non-deterministic systems need special handling**: Vector search không phải lúc nào cũng deterministic
> 3. **Communication is key**: Phải explain rõ ràng cho stakeholder về technical limitations"

---

## Case Study 2: ETL Tool Selection

### Background

- **Sprint**: SPRINT 4 (Tháng 8/2025)
- **Context**: Team cần chọn công cụ ETL cho data pipeline
- **Data volume**: 13M documents, 8.8M product records, 1.7M QA records

### Options Evaluated

| Tool | Strengths | Weaknesses |
|------|-----------|------------|
| **Databricks** | Strong data analysis, Python/PySpark familiar | Weak ingest, requires setup |
| **Cloud Data Fusion** | Strong ingest, many connectors | High cost (always-on server), low-code oriented |
| **Cloud Dataflow** | Real-time + batch, Apache Beam | High learning curve, complex |

### Decision Process

1. **Analyze requirements**:
   - Batch processing (not real-time)
   - Team familiar with Python
   - Cost-sensitive

2. **Evaluate trade-offs**:
   - Data Fusion: Good for ingest but expensive
   - Dataflow: Powerful but steep learning curve
   - Databricks: Best fit for team skills and use case

3. **Final decision**:
   - **Data Fusion** for ingest (leverage existing LIXIL infrastructure)
   - **Databricks** for ETL and analysis

### My Role

- Participated in evaluation meetings
- Asked questions about cost, learning curve, maintenance
- Helped document decision rationale

### Interview Talking Points

> "Case này dạy tôi về **trade-off analysis**. Khi chọn công nghệ, không chỉ nhìn vào features mà phải consider:
>
> 1. **Team skills**: Team đã biết Python/PySpark
> 2. **Cost**: Data Fusion tốn chi phí maintain server
> 3. **Long-term maintenance**: Databricks dễ maintain hơn cho team
>
> BrSE cần hiểu đủ sâu về technical để có thể participate vào những discussion này."

---

## Case Study 3: API Architecture Decision

### Background

- **Sprint**: SPRINT 7 (Tháng 9/2025)
- **Context**: Choose API architecture for KINKEN backend
- **Client**: Web UI calling Backend APIs

### Options Evaluated

| Architecture | Pros | Cons |
|--------------|------|------|
| **REST** | Simple, HTTP cache, easy debugging | Less flexible queries |
| **GraphQL** | Flexible queries, single endpoint | N+1 problem, poor caching |
| **gRPC** | Very fast, Protobuf | Hard to debug in browser |

### Decision: REST API

**Rationale**:
1. **Fits use case**: Client-server model (Web UI → Backend)
2. **Leverages HTTP cache**: Important for search performance
3. **Easy debugging**: Postman, Swagger, browser dev tools
4. **Team familiarity**: Team đã có experience với REST

### API Design Rules Established

- Use plural nouns for resources (`/users`, not `/user`)
- Correct HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Clear HTTP status codes (2xx, 4xx, 5xx)
- Consistent response structure (data, meta, errors)

### Versioning Strategy

| API Type | Versioning | Reason |
|----------|------------|--------|
| Internal API | No versioning | FE and BE update together |
| Public API | Required (`/v1/search`) | Prevent breaking changes for external systems |

### My Role

- Tested API endpoints during development
- Reported issues with response format
- Participated in API design review

### Interview Talking Points

> "Case này cho thấy **simplicity often wins**. GraphQL và gRPC đều mạnh, nhưng REST là lựa chọn tốt nhất cho KINKEN vì:
>
> 1. **Fit use case**: Web UI calling backend
> 2. **Team productivity**: Easy to test and debug
> 3. **Performance**: HTTP caching improves response time
>
> BrSE cần hiểu đủ để participate trong architectural decisions, không cần phải là architect."

---

## Case Study 4: Document Preview Challenge

### Background

- **Sprint**: SPRINT 7 (Tháng 9/2025)
- **Context**: Implement document preview feature
- **Document types**: PDF, Word, Excel, PowerPoint

### Problem

| Document Type | Status | Issue |
|---------------|--------|-------|
| **PDF** | ✓ Works | React-PDF works well |
| **Word/Excel/PPT** | ✗ Blocked | Office Viewer end-of-support, Office 365 requires MS account |

### Options Considered

1. **Convert Office to PDF before preview**
   - Pros: Works for all file types
   - Cons: Extra processing, storage cost, potential formatting issues

2. **Use third-party viewer**
   - Pros: May support Office files
   - Cons: Cost, dependency on external service

3. **Limit preview to PDF only**
   - Pros: Simple, no extra cost
   - Cons: Limited functionality

### Decision

**Ask client**: "Is Office preview critical enough to justify conversion effort?"

**Lesson**: Sometimes the best solution is to **simplify scope** rather than force a complex implementation.

### My Role

- Tested preview with various file types
- Reported that Office preview doesn't work for all users
- Suggested workaround options

### Interview Talking Points

> "Case này dạy tôi về **scope management**. Thay vì cố gắng implement mọi thứ, đôi khi nên:
>
> 1. **Ask the right question**: 'Is this feature critical?'
> 2. **Propose alternatives**: PDF-only preview, or conversion
> 3. **Let client decide**: Present options with trade-offs
>
> BrSE role là ensure client understands trade-offs và make informed decisions."

---

## Case Study 5: Authentication Model Design

### Background

- **Sprint**: SPRINT 5-7 (Tháng 8-9/2025)
- **Context**: Design authentication for multiple user types
- **Challenge**: Different users need different access levels

### User Types

| User Type | Auth Method | Data Access |
|-----------|-------------|-------------|
| Internal | Azure/EntraID | Full (role-based) |
| Partner | EAA | Partner-relevant only |
| Business | MyLIXIL | Business documents |
| General | None | Browse only, no detail/preview/download |

### Technical Decisions

1. **API Gateway (Apigee)**: Central point for auth enforcement
2. **JWT payload**: Include `id_type` to distinguish user types
3. **API Key + HMAC**: For third-party system authentication

### My Role

- Tested authentication flows for each user type
- Validated access control (who can see what)
- Reported security issues

### Interview Talking Points

> "Authentication design trong KINKEN cho thấy **security is multi-layered**:
>
> 1. **API Gateway**: First line of defense
> 2. **JWT**: Identify user type and permissions
> 3. **Data-level**: Visibility flags from PIM
>
> BrSE cần hiểu security concepts để communicate với cả technical team và security stakeholders."

---

## Summary: Key Lessons for BrSE

| Case Study | Key Lesson |
|------------|------------|
| PoC Benchmark | Always lock and record versions |
| ETL Selection | Consider team skills and long-term maintenance |
| API Architecture | Simplicity often wins |
| Document Preview | Simplify scope when appropriate |
| Authentication | Security is multi-layered |

---

## Changelog

| Date | Update |
|------|--------|
| 2026-04-29 | Initial creation with 5 case studies |
| (Future) | Add case studies from SPRINT 20-25 |
