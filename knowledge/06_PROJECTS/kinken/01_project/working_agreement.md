---
name: project_kinken_working_agreement
description: KINKEN team working agreement including mindset, iteration workflow, coding/test/review rules.
type: project
originSessionId: b37d84e1-f8b9-48d3-b090-b3afc2a6deca
updated: 2026-05-05
---

# KINKEN Working Agreement

**Updated**: 2026-05-05  
**Source**: Working Agreement.md from workspace

---

## 1. Introduction

This is a **team rulebook**. All team members must **agree** on the content from the start.

Rules are not fixed - we continuously **update through feedback**.

---

## 2. Core Mindset

### Focus on Business Goals
- Guildworks instructions are not absolute
- Don't just build what's told - propose optimal choices for project/system
- Actively provide opinions and suggestions

### Requirements/Specs are Inputs, Not Perfect Truth
- Requirement/spec documents don't contain every detail
- Align with project/product goals while working
- Clarify missing information through communication or design work

---

## 3. Development Workflow

### 1-Week Iterations
- **Planning**: Each member signs up for backlogs they can finish within the iteration
- **Early Communication**: If completion outlook changes, raise it early (don't wait for regular meeting)
- **Completion Target**: Each backlog must reach **Delivered** status if signed up

### Detailed Design
- **Input Documents**: Function list, non-functional requirements, wireframes, interface definitions, system architecture, major design decisions
- **Design Docs**: Create flexible Design Docs to supplement missing information
- **Document Traceability**: All important docs must be traceable from Notion
- **Format**: No strict format - any format that organizes implementation information
- **Early Questions**: Don't wait for meetings - ask via Slack/Zoom when needed

---

## 4. Implementation Rules

### Coding + Unit Test
- **One Backlog = Product Code + Unit Test Code**
- **Test Coverage**: Not just happy path - include error/abnormal cases
- **Coverage Target**:
  - Basic: Statement coverage
  - **Overall minimum: 80%**
  - Core/risky logic: Near **100%**
- **Exclusions**: Network errors, DB errors, logging, debug code, environment-dependent code
- **Static Analysis**: Use tools to maintain code quality

### Commit Format
```
<prefix>: <#ticket-number> - <one-line>
```
- **Prefixes**: `feat`, `fix`, `refactor`, `test`, `revert`, `docs`
- **Ticket Number**: Monday.com ticket ID

---

## 5. PR and Review Rules

### Basic Rules
- **Response Time**: Target within 24 hours
- **Review Levels**:
  - **MUST**: Must fix
  - **IMO**: "I would write it this way" (optional)
  - **nits**: Minor points (optional)
  - **ask**: Questions/confirmations
- **Review Language**: English
- **Core Logic**: GW review required for core logic or early project phase

### Merge Criteria
- **CI**: Green ✅
- **Approvals**: At least 1 approval
- **Merge Strategy**: Squash & merge only
- **Branch Deletion**: Delete after deployment to verification environment (not immediately after merge)

### PR Workflow
1. Create PR with template
2. Request review
3. Address comments (1 comment = 1 commit where possible)
4. Merge when criteria met
5. **Exception**: Very minor fixes can be merged with CI green + "merged early" message

---

## 6. Monday.com Operation Rules

### Status Flow
| Status | When to Change | Required Action |
|--------|---------------|-----------------|
| **Unstarted → Started** | When starting work | Add descriptive comment |
| **Started → Finished** | Code complete + PR created | Include links to artifacts (docs, PRs) |
| **Finished → Delivered** | Review complete + merged | |
| **Delivered → Accepted** | Confirmed in dev meeting | |
| **Delivered → Rejected** | Issues found | |

### Points System
- **0P**: ≤1 hour
- **1P**: 2-3 hours
- **2P**: Half day
- **4P**: 1 day
- **Other**: Based on 2P = half day

### Owner Management
- Add reviewer as **Owner** when requesting review
- Include output links in ticket comments

---

## 7. Branch Rules

### Naming Convention
```
{type}/{ticket-number}-{summary}
```

### Types
- `feature`: Feature development
- `bug`: Bug fixes
- `hotfix`: Emergency fixes (not expected during initial development)

---

## 8. Testing & Acceptance

### MOR Acceptance Test
- Early project phase: GW must review test viewpoints
- GW reviews test approach gaps and methods

### GW Acceptance Test
- GW performs internal integration testing on Accepted backlogs
- Issues found → create new bug backlogs

---

## 9. Communication Rules

### Meeting Schedule

| Meeting | Time | Participants | Purpose |
|---------|------|-------------|---------|
| **Customer Regular** | Thursday 13:00-17:00 | LIXIL + GW (Kim, Takekyo) + optional devs | Demo & review |
| **Development Regular** | Friday 13:00-14:30 | All dev team members | Progress check + planning |
| **Retrospective (KPT)** | As needed | GW + MOR (PM must) | Reflection + improvement |

### Slack Channels
| Channel | Purpose |
|---------|---------|
| `pj-lixil-sagas` | General development discussion |
| `pj-lixil-sagas-review` | Design/PR review requests |
| `pj-lixil-sagas-pulse` | CI results and automated notifications |
| `pj-lixil-sagas-with-lixil` | Communication with LIXIL |

### Communication Guidelines
- **Mention Anytime**: OK to mention anytime
- **Response Window**: Mainly 9:00-18:00 JST
- **Information Storage**: Long-lived info in Google Drive/Notion, not just Slack

---

## 10. Vietnamese Summary (Tóm tắt tiếng Việt)

### 1) Tinh thần làm việc
- Đây là **rulebook của cả team**, phải có **đồng thuận** từ đầu.
- Rule không cố định, có thể **update liên tục qua feedback**.
- Team phải tập trung vào **mục tiêu business**, không chỉ "làm theo chỉ thị".
- Requirement/spec **không phải lúc nào cũng đầy đủ**, nên dev phải chủ động hỏi, bổ sung design, và làm rõ cách đạt mục tiêu.

### 2) Cách chạy development
- Làm việc theo **1-week iteration**.
- Mỗi người **sign up backlog** mình có thể hoàn thành trong tuần.
- Nếu thấy chậm hơn hoặc nhanh hơn dự kiến thì phải **báo team sớm**, không để tới cuối kỳ.
- Mỗi backlog phải đi tới mức **Delivered** nếu đã nhận làm.

### 3) Detailed design + implementation
- Input để code: function list, non-functional requirements, wireframe, interface definition, system architecture, major design decisions.
- Nếu thiếu thông tin thì dev phải tự tạo **Design Doc** để bổ sung.
- Format của Design Doc **không bị ép cứng**, miễn đủ thông tin.
- Tất cả doc phải **truy ra được từ Notion**.
- Không được ôm vấn đề chờ meeting, cần thì hỏi ngay bằng Slack/Zoom.

### 4) Coding + unit test
- 1 backlog phải gồm cả:
  - **product code**
  - **unit test code**
- Test không chỉ test happy path, mà phải có cả **error/abnormal cases**.
- Mục tiêu coverage:
  - cơ bản là **statement coverage**
  - **toàn project tối thiểu 80%**
  - core logic / risky logic thì nên gần **100%**
- Static analysis được dùng để giữ chất lượng code.
- Cần có setup để GW cũng dựng local environment được.

### 5) Commit / PR rule
- Commit format: `<prefix>: <#ticket-number> - <one-line>`
- Prefix gồm: `feat`, `fix`, `refactor`, `test`, `revert`, `docs`
- PR rule:
  - dùng template
  - reviewer phản hồi trong **24h**
  - review comment level gồm: **MUST / IMO / nits / ask**
  - review comment dùng **tiếng Anh**
  - chỉ merge khi:
    - **CI xanh**
    - có ít nhất **1 approve**
  - merge bằng **Squash & merge**
- Với logic core hoặc giai đoạn đầu dự án, **GW review là bắt buộc**.

### 6) Monday / backlog operation
- Status flow: `Unstarted` → `Started` → `Finished` (xong code + tạo PR) → `Delivered` (review xong + merge) → `Accepted` (qua confirm ở dev meeting)
- Khi đổi trạng thái quan trọng phải **để comment**.
- Ticket phải có **link tới output** như doc hoặc PR.
- Khi request review thì thêm reviewer vào owner.

### 7) Branch rule
- Branch naming: `{type}/{ticket-number}-{summary}`
- Type gồm: `feature`, `bug`, `hotfix`

### 8) Testing / acceptance
- Giai đoạn đầu, **test viewpoint** của MOR phải được GW review.
- Backlog được Delivered rồi thì GW sẽ làm **acceptance test**.
- Nếu có vấn đề sẽ tạo bug backlog mới.

### 9) Communication rule
- **Customer regular meeting**: thứ 5, 13:00–17:00
- **Development regular meeting**: thứ 6, 13:00–14:30
- **Retrospective**: tổ chức khi cần, theo kiểu **KPT**
- Slack channels riêng cho: dev discussion, review request, CI/pulse, communication với LIXIL
- Có thể mention bất cứ lúc nào, nhưng phản hồi chủ yếu trong **9:00–18:00 JST**
- Thông tin cần lưu lâu dài thì để ở **Google Drive / Notion**, không chỉ để trên Slack.

---

## Interview Talking Points

### Team Culture
> "We focus on business goals, not just implementation. Team members are expected to propose better solutions and clarify requirements, not just follow instructions."

### Development Process
> "We work in 1-week iterations with clear status flows. Each backlog includes both product code and unit tests, with 80% coverage minimum and near-100% for core logic."

### Quality Assurance
> "PRs require CI green + at least 1 approval, with GW review mandatory for core logic. We use English for review comments and follow a structured comment level system."

### Communication
> "We have regular Thursday customer meetings and Friday development meetings. Information flows through dedicated Slack channels, with long-term docs stored in Notion/Drive."

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| 1-week iterations | Balance planning flexibility with progress visibility |
| 80% coverage minimum | Balance quality with development speed |
| English review comments | Standardize communication across teams |
| Squash & merge | Clean history, easier rebasing |
| GW review for core logic | Ensure architectural consistency |

