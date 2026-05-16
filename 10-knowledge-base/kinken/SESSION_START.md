# KINKEN Session Start Prompt

**Use this prompt to resume KINKEN work in a new session:**

---

```
Tiếp tục dự án KINKEN. Workflow:
1. Đọc SPEC_READING_ROADMAP.md để biết tiến độ hiện tại
2. Check workspace/ có specs mới không
3. Nếu có specs mới: đọc → tổng hợp vào kinken/ → update roadmap
4. Nếu không: báo cáo progress và hỏi task tiếp theo

Context: QA → BrSE interview prep, focus on understanding system architecture & decisions.
```

---

## Quick Reference

**Current Progress** (as of 2026-05-05):
- Phase 1: Foundation & Vision ✅ COMPLETED (6/58 docs)
- Next: Phase 2 - Core Architecture

**Key Files**:
- Progress tracking: `SPEC_READING_ROADMAP.md`
- Workspace specs: `../../workspace/`
- Knowledge base: `01_project/`, `02_architecture/`, `03_features/`, etc.

**Workflow**:
1. User uploads specs to `workspace/`
2. Claude reads specs
3. Claude summarizes into appropriate `kinken/` subfolder
4. Claude updates `SPEC_READING_ROADMAP.md`
5. Repeat

---

## Alternative Prompts

### Minimal
```
KINKEN: Check workspace/ for new specs, update kinken/ knowledge base, report progress.
```

### Detailed
```
KINKEN Project - Session Resume

**Context**: 
- Role: QA Engineer → Fresher BrSE interview prep
- Goal: Understand full project scope (POC → Production)
- Current: Reading & organizing specs from workspace

**Workflow**:
1. Read `projects/kinken/SPEC_READING_ROADMAP.md` for current progress
2. Check `workspace/` for new spec files
3. If new specs found:
   - Read and understand content
   - Summarize into appropriate kinken/ subfolder
   - Update SPEC_READING_ROADMAP.md progress
4. If no new specs:
   - Report current completion status
   - Suggest next phase to work on

**Output**: Always report progress in Vietnamese.
```

---

**Last Updated**: 2026-05-05
