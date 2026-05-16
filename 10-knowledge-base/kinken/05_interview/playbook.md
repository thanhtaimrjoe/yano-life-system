---
name: kinken_interview_playbook
description: BrSE interview preparation playbook with common questions and KINKEN-based answers.
type: project
---

# KINKEN Interview Playbook for BrSE

## Overview

Tài liệu này dùng để chuẩn bị phỏng vấn vị trí **Fresher BrSE (Bridge SE)**. Các câu trả lời được xây dựng dựa trên kinh nghiệm thực tế từ dự án KINKEN.

---

## Part 1: Elevator Pitch (2 phút)

### Giới thiệu bản thân

> "Xin chào, tôi là [Tên]. Tôi có nền tảng là QA Engineer với 3 năm kinh nghiệm kiểm thử thủ công ở các layer UI, API và Database. Tôi đã tham gia dự án KINKEN - một hệ thống tìm kiếm tài liệu cho LIXIL với 13 triệu documents và 8.8 triệu product records.
>
> Trong dự án này, tôi không chỉ làm QA mà còn tham gia vào việc phân tích yêu cầu, giao tiếp với team offshore và khách hàng Nhật Bản. Tôi nhận thấy vai trò BrSE phù hợp với định hướng phát triển của mình - làm cầu nối giữa team kỹ thuật và stakeholder, đảm bảo thông tin được truyền tải chính xác và hiệu quả.
>
> Tôi đang tìm kiếm cơ hội để phát triển kỹ năng BrSE trong một môi trường chuyên nghiệp."

---

## Part 2: Câu hỏi thường gặp

### 1. "Tại sao bạn muốn chuyển từ QA sang BrSE?"

**Câu trả lời**:

> "Trong quá trình làm QA cho dự án KINKEN, tôi nhận thấy mình thường xuyên đóng vai trò 'cầu nối' giữa team offshore và khách hàng. Ví dụ:
>
> - Khi có ambiguity trong requirement, tôi chủ động đặt câu hỏi làm rõ với GW (Gateway team)
> - Tôi dịch và giải thích các tài liệu kỹ thuật từ tiếng Nhật sang tiếng Việt cho team
> - Tôi tham gia vào các buổi họp với khách hàng và note lại các điểm quan trọng
>
> Những công việc này cho tôi thấy BrSE là vai trò phù hợp với thế mạnh giao tiếp và khả năng hiểu cả hai ngôn ngữ của tôi. Tôi muốn phát triển chuyên sâu hơn theo hướng này."

---

### 2. "Bạn hiểu thế nào về vai trò BrSE?"

**Câu trả lời**:

> "Theo kinh nghiệm từ KINKEN, tôi hiểu BrSE có 3 trách nhiệm chính:
>
> **1. Bridge (Cầu nối)**:
> - Dịch và truyền tải thông tin giữa team offshore và khách hàng Nhật
> - Đảm bảo cả hai bên hiểu đúng yêu cầu và kỳ vọng
>
> **2. Technical Understanding (Hiểu kỹ thuật)**:
> - Phải hiểu đủ sâu về technical để có thể giải thích cho cả hai bên
> - Ví dụ trong KINKEN: Tôi phải hiểu Elasticsearch, ETL pipeline, API design để có thể trả lời câu hỏi từ khách hàng
>
> **3. Cultural Bridge (Cầu nối văn hóa)**:
> - Hiểu cách làm việc của cả hai bên
> - Ví dụ: Team Nhật thích document chi tiết, team Việt Nam thích agile/flexible
> - BrSE phải tìm cách cân bằng để cả hai bên đều thoải mái"

---

### 3. "Kể về một tình huống khó bạn gặp phải và cách giải quyết"

**Case Study: PoC Benchmark Discrepancy (SPRINT 6)**

**Tình huống**:

> "Trong dự án KINKEN, chúng tôi phát hiện kết quả search của PoC mới khác với PoC cũ dù dùng cùng một bộ data. Đây là vấn đề nghiêm trọng vì ảnh hưởng đến độ tin cậy của hệ thống search.
>
> **Vai trò của tôi**:
> - Là QA, tôi responsible cho việc verify kết quả search
> - Tôi đã test và phát hiện sự khác biệt, sau đó báo cáo cho team
>
> **Cách giải quyết**:
> - Team đã điều tra và phát hiện nhiều nguyên nhân: embedding vector non-deterministic, HNSW algorithm randomness, ES version không được record
> - Tôi đã note lại lesson learned: 'Always lock and record infrastructure versions'
> - Tôi tạo test cases để detect regression trong tương lai
>
> **Kết quả**:
> - Vấn đề được giải thích rõ ràng cho khách hàng
> - Quy trình version control được cải thiện
> - Tôi học được cách troubleshoot và communicate technical issues"

---

### 4. "Bạn có kinh nghiệm gì với dự án quy mô lớn?"

**Câu trả lời**:

> "Dự án KINKEN có quy mô:
> - 13 triệu documents
> - 8.8 triệu product records
> - 1.7 triệu QA records
> - Target response time: ~3 giây
>
> **Thách thức tôi gặp phải**:
>
> 1. **Data validation**: Với lượng data lớn, không thể test thủ công từng record. Tôi đã:
>    - Xây dựng test strategy: test sample data + automated checks
>    - Validate data pipeline từ PIM → DB → Elasticsearch
>
> 2. **Performance testing**: Đảm bảo response time đạt target
>    - Tôi đã test với các search queries phức tạp
>    - Report performance issues cho team optimize
>
> 3. **Cross-layer testing**: UI, API, DB, ES
>    - Tôi phải hiểu data flow để test đúng
>    - Ví dụ: Search từ UI → API → Elasticsearch → Return results"

---

### 5. "Bạn đã từng làm việc với team Nhật chưa? Có khó khăn gì không?"

**Câu trả lời**:

> "Có, tôi đã làm việc với khách hàng LIXIL (Nhật Bản) trong dự án KINKEN.
>
> **Khó khăn**:
>
> 1. **Ngôn ngữ**: Tài liệu bằng tiếng Nhật, tôi phải tự học từ vựng chuyên ngành
>    - Ví dụ: 見込み (Mikomi), 見付け (Mitsuke) - thuật ngữ ngành nhôm kính
>    - Giải quyết: Tôi tạo glossary JP/EN/VI để tra cứu
>
> 2. **Communication style**: Team Nhật thích document chi tiết, confirm mọi thứ
>    - Giải quyết: Tôi học cách viết email rõ ràng, luôn kèm theo confirmation points
>
> 3. **Timezone**: Chênh lệch giờ giữa VN và JP
>    - Giải quyết: Linh hoạt sắp xếp meeting time, ưu tiên async communication qua Slack/Notion
>
> **Điểm tích cực**:
> - Team Nhật rất chuyên nghiệp, deadline rõ ràng
> - Feedback chi tiết và constructive
> - Tôi học được cách làm việc có hệ thống"

---

### 6. "Giải thích một khái niệm kỹ thuật cho người không chuyên"

**Ví dụ: Giải thích "Elasticsearch" cho business user**

> "Elasticsearch giống như một 'thư viện siêu tốc'. Thay vì phải đọc từng cuốn sách để tìm thông tin (như database truyền thống), Elasticsearch tạo ra một 'mục lục thông minh' giúp bạn tìm thấy thông tin trong vài mili-giây.
>
> Trong dự án KINKEN, chúng tôi có 13 triệu documents. Nếu dùng database thường, việc tìm kiếm có thể mất hàng phút. Với Elasticsearch, người dùng chỉ mất khoảng 3 giây để có kết quả.
>
> Đặc biệt, Elasticsearch còn hiểu được 'ngữ nghĩa' của từ khóa nhờ AI (vector search), không chỉ tìm theo từ khóa đơn thuần."

---

### 7. "Bạn có câu hỏi gì cho chúng tôi không?"

**Câu hỏi nên hỏi**:

1. "Team BrSE hiện tại có bao nhiêu người? Cơ cấu team như thế nào?"
2. "Dự án sắp tới team sẽ tham gia là gì? Có phải dự án Nhật không?"
3. "Công ty có chương trình training cho Fresher BrSE không?"
4. "Team sử dụng những tools nào để communicate với khách hàng Nhật? (Slack, Notion, Jira...)"
5. "Có cơ hội được cử sang Nhật làm việc onsite không?"

---

## Part 3: Technical Knowledge

### Kiến thức cần chuẩn bị

| Topic | Level | Notes |
|-------|-------|-------|
| Elasticsearch | Basic-Medium | Understand index, mapping, aggregations, hybrid search |
| ETL Pipeline | Basic | Understand Extract-Transform-Load flow |
| API Design | Basic | REST API, versioning, authentication |
| Authentication | Basic | JWT, API Key, OAuth concepts |
| Cloud (GCP) | Basic | Cloud Run, GCS, basic concepts |
| Agile/Scrum | Medium | Sprint, backlog, retrospective |

### Key Technical Terms (JP-EN-VI)

| JP | EN | VI |
|----|----|----|
| 検索エンジン | Search Engine | Công cụ tìm kiếm |
| 索引 | Index | Chỉ mục |
| 認証 | Authentication | Xác thực |
| 認可 | Authorization | Phân quyền |
| バッチ処理 | Batch Processing | Xử lý theo lô |
| データパイプライン | Data Pipeline | Quy trình dữ liệu |

---

## Part 4: Case Studies for Interview

### Case Study 1: ETL Tool Selection

**Context**: Team cần chọn công cụ ETL giữa Databricks, Data Fusion, và Dataflow.

**My contribution**:
- Participated in evaluation meetings
- Asked clarifying questions about cost, learning curve, team skills
- Helped document the decision rationale

**Decision**: Databricks for ETL/analysis, Data Fusion for ingest.

**Lesson**: Always consider team skills and long-term maintenance, not just features.

---

### Case Study 2: API Architecture Decision

**Context**: Choose between REST, GraphQL, and gRPC for KINKEN backend.

**My contribution**:
- Tested API endpoints during development
- Reported issues with response format and error handling
- Participated in API design review

**Decision**: REST API for simplicity, caching, and ease of debugging.

**Lesson**: Choose technology that fits the team and use case, not the trendiest option.

---

### Case Study 3: Document Preview Challenge

**Context**: PDF preview works, but Office files (Word/Excel/PPT) are problematic.

**My contribution**:
- Tested preview feature with various file types
- Reported that Office preview doesn't work for all users
- Suggested workaround: convert to PDF before preview

**Lesson**: Sometimes the best solution is to simplify scope rather than force a complex implementation.

---

## Part 5: Tips for Interview Day

### Before Interview

- [ ] Review this playbook
- [ ] Prepare 2-3 questions to ask interviewer
- [ ] Prepare your own elevator pitch
- [ ] Review KINKEN technical glossary
- [ ] Practice explaining technical concepts in simple terms

### During Interview

- Speak clearly and confidently
- Use specific examples from KINKEN
- If you don't know something, say "I'm not sure, but I would approach it by..."
- Ask clarifying questions if needed
- Show enthusiasm for learning

### After Interview

- Send thank-you email within 24 hours
- Note down questions you couldn't answer well for future preparation
- Reflect on what went well and what could improve

---

## Changelog

| Date | Update |
|------|--------|
| 2026-04-29 | Initial creation |
| (Future) | Add more case studies from SPRINT 20-25 |
| (Future) | Add mock interview Q&A |
