---
name: project_kinken_update_workflow_protocol
description: Standard workflow to process KINKEN Output Summary Reports and update files consistently.
type: project
---

# KINKEN Update Workflow Protocol

Khi user làm việc với dự án KINKEN, Claude phải mặc định bám theo workflow này kể cả sau khi user clear conversation.

**Why**: User muốn quy trình ổn định, không cần nhắc lại cách làm mỗi phiên chat; mục tiêu là ghi chép xuyên suốt để phục vụ retrospective và case study BrSE.

**How to apply**: Mỗi khi user yêu cầu tiếp tục KINKEN, thực hiện đúng tuần tự các bước dưới đây.

---

## KINKEN Update Workflow (Cross-session Default)

### 1. Source of Truth & Priority

Ưu tiên đọc file người dùng chỉ định (thường ở `workspace/Spec.md`).

Sau đó đối chiếu với:
- `04_progress/sprint_tracking.md`
- `05_interview/glossary.md`

---

### 2. Extract Information by Standard Framework

Trích xuất thông tin theo khung chuẩn:

| Category | What to extract |
|----------|-----------------|
| **Sprint/Date** | Mốc thời gian, Sprint number, trạng thái (during/finish) |
| **Progress** | FE/BE/ETL/QA/API/Infra status |
| **Issue/Risk** | Blocker, dependency, tool/process issue, performance risk |
| **Decision** | Quyết định kiến trúc/quy trình/định danh |
| **Next Plan** | Action items cho sprint kế tiếp |
| **Domain Terms** | Thuật ngữ JP/EN/VN cần thêm vào glossary |

---

### 3. Identify Target File by Topic

**Automatic folder detection logic**:

| Topic Keywords | Target File | Folder |
|----------------|-------------|--------|
| ETL, Databricks, Data Fusion, Dataflow, pipeline, batch | `02_architecture/data_flow.md` | 02_architecture |
| Elasticsearch, search, index, aggregation, vector, RRF, hybrid | `03_features/elasticsearch.md` | 03_features |
| API, REST, GraphQL, gRPC, endpoint, versioning | `03_features/search_apis.md` | 03_features |
| Authentication, auth, JWT, API key, Azure, EAA, MyLIXIL | `02_architecture/auth_model.md` | 02_architecture |
| Document, PDF, preview, CloudRun, GCS, delivery | `02_architecture/doc_delivery.md` | 02_architecture |
| Product, feature, search, pickup mode, limited mode | `03_features/function_design.md` | 03_features |
| Sprint, progress, milestone, decision, case study | `04_progress/sprint_tracking.md` | 04_progress |
| Timeline, decision, architecture, lesson learned | `04_progress/milestones.md` | 04_progress |
| Technical term, JP/EN/VI, glossary | `05_interview/glossary.md` | 05_interview |
| Interview, BrSE, case study, talking point | `05_interview/case_studies.md` | 05_interview |

**If multiple topics**: Update multiple files in order of importance.

---

### 4. Update Target File

#### For `02_architecture/data_flow.md` (ETL-related):
- Add new ETL decisions/challenges
- Update data volume if changed
- Add new transformation logic
- Document lessons learned

#### For `03_features/elasticsearch.md` (Search-related):
- Add new search optimization techniques
- Document performance issues and solutions
- Update hybrid search strategy if changed
- Add new case studies

#### For `03_features/search_apis.md` (API-related):
- Add new API endpoints if any
- Update versioning strategy if changed
- Document API design decisions
- Add troubleshooting tips

#### For `02_architecture/auth_model.md` (Auth-related):
- Add new user types if any
- Update authentication flow if changed
- Document security decisions
- Add new access control rules

#### For `02_architecture/doc_delivery.md` (Document delivery):
- Update delivery architecture if changed
- Add new file types supported
- Document performance improvements
- Add security considerations

#### For `03_features/function_design.md` (Product features):
- Add new features or modes
- Update search behavior if changed
- Document UX improvements
- Add interview talking points

#### For `04_progress/sprint_tracking.md` (Sprint progress):
- Add new section: `### Giai đoạn YYYY/MM/DD (Tương ứng SPRINT X)`
- Include: Progress, Issues, Decisions, Next steps
- Use bullet points with bilingual (business-technical) style
- Maintain chronological order

#### For `04_progress/milestones.md` (Key decisions):
- Add new decision to timeline table
- Add new case study if applicable
- Update QA/BrSE milestones
- Document trade-offs

#### For `05_interview/glossary.md` (Technical terms):
- Add only NEW terms not already in glossary
- Place in appropriate category
- Include JP + romaji + EN + VI
- Add context from KINKEN project

#### For `05_interview/case_studies.md` (Case studies):
- Add new case study if significant decision/issue
- Follow format: Background → Problem → Investigation → Solution → My Role → Interview Talking Points
- Link to related files

---

### 5. Format & Style Guidelines

#### For sprint_tracking.md:
```markdown
### Giai đoạn YYYY/MM/DD (Tương ứng SPRINT X)

#### Topic Name (English Name)

**Vấn đề**: [Problem statement]

**Giải quyết**: [Solution approach]

**Kết quả**: [Outcome]

**Lesson learned**: [Key takeaway]
```

#### For glossary.md:
```markdown
- **Term (Romaji):** English definition. Vietnamese meaning. Context in KINKEN.
```

#### For case_studies.md:
```markdown
## Case Study N: Title

### Background
- Sprint, Context, Scale

### Problem
- What went wrong

### Investigation
- Steps taken, findings

### Solution
- How it was resolved

### My Role
- What I contributed

### Interview Talking Points
- Key lessons for interview
```

---

### 6. Self-Check Before Marking Done

- [ ] Mốc ngày/sprint không mâu thuẫn
- [ ] Không duplicate terms trong glossary
- [ ] Section mới nằm đúng vị trí (chronological order)
- [ ] Format heading/bullet đúng chuẩn
- [ ] Links giữa các file chính xác (nếu có)
- [ ] Bilingual content (VN + EN) rõ ràng
- [ ] Không có typo hoặc lỗi ngữ pháp

---

### 7. When Data is Missing

Nếu report thiếu ngày/sprint hoặc mơ hồ:
- Hỏi 1 câu làm rõ trước khi ghi vào memory files
- Không tự bịa thông tin không có trong source report
- Ví dụ: "Bạn có thể confirm sprint number và ngày hoàn thành không?"

---

### 8. Response to User

**If user only asks for update**:
```
Đã cập nhật:
- 02_architecture/data_flow.md: Thêm ETL decision
- 04_progress/sprint_tracking.md: Thêm SPRINT X case study
- 05_interview/glossary.md: Thêm 3 terms mới
```

**If user asks for explanation**:
```
Storytelling format (dễ nhớ khi kể chuyện):
- Vấn đề gì xảy ra
- Team giải quyết như thế nào
- Lesson learned là gì
- Liên quan đến BrSE role thế nào
```

---

## Guardrails

| Rule | Reason |
|------|--------|
| Không đổi format tổng thể của file | Maintain consistency |
| Không biến sprint note thành phân tích lan man | Keep focused on decisions & actions |
| Không ghi đè nội dung lớn bằng rewrite toàn file | Use patch updates instead |
| Luôn giữ bilingual (VN + EN) | Support both audiences |
| Không xóa nội dung cũ trừ khi user yêu cầu sửa sai | Maintain historical record |

---

## Example Workflow

### Input: User sends SPRINT 21 Output Summary Report

**Report contains**:
- ETL optimization for Databricks
- New Elasticsearch aggregation technique
- Performance improvement from 5s → 3s
- New domain term: "Segment Bloat"

### Workflow execution:

1. **Identify topics**: ETL, Elasticsearch, Performance
2. **Target files**:
   - `02_architecture/data_flow.md` (ETL)
   - `03_features/elasticsearch.md` (ES)
   - `04_progress/sprint_tracking.md` (Sprint progress)
   - `05_interview/glossary.md` (New term)

3. **Update each file**:
   - data_flow.md: Add Databricks optimization technique
   - elasticsearch.md: Add aggregation technique + performance improvement
   - sprint_tracking.md: Add SPRINT 21 section with case study
   - glossary.md: Add "Segment Bloat" definition

4. **Self-check**: Verify all updates are consistent

5. **Response to user**:
   ```
   Đã cập nhật SPRINT 21:
   - ETL optimization: Databricks technique
   - Search: Aggregation + performance (5s → 3s)
   - Glossary: +1 term (Segment Bloat)
   ```

---

## Changelog

| Date | Update |
|------|--------|
| 2026-04-29 | Initial creation with folder detection logic |
| (Future) | Add more topic keywords as needed |
