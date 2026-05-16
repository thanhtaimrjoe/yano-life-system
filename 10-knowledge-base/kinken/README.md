# KINKEN Project Knowledge Hub

**Last updated**: 2026-04-29  
**Project status**: SPRINT 25 (PROD Release Preparation)  
**My role**: QA Engineer → Transitioning to Fresher BrSE

---

## 📖 Quick Navigation

### 🎯 Start Here

| If you want to... | Go to... |
|-------------------|----------|
| Understand project purpose | [01_project/inception.md](01_project/inception.md) |
| Learn technical stack | [02_architecture/tech_stack.md](02_architecture/tech_stack.md) |
| Prepare for BrSE interview | [05_interview/playbook.md](05_interview/playbook.md) |
| Check sprint progress | [04_progress/sprint_tracking.md](04_progress/sprint_tracking.md) |
| Look up technical terms | [05_interview/glossary.md](05_interview/glossary.md) |

---

## 📁 Folder Structure

```
kinken/
├── 01_project/          # Project context & team process
├── 02_architecture/     # Technical architecture & design
├── 03_features/         # Product features & functionality
├── 04_progress/         # Sprint tracking & milestones
├── 05_interview/        # BrSE interview preparation
├── CLAUDE.md            # AI context file
└── README.md            # This file
```

---

## 01_project/ — Project Context

| File | Description |
|------|-------------|
| [inception.md](01_project/inception.md) | Project purpose, scope, stakeholders, timeline |
| [working_agreement.md](01_project/working_agreement.md) | Team workflow, PR rules, communication norms |
| [system_overview.md](01_project/system_overview.md) | System positioning, API surfaces, my role |

**When to read**: Start here to understand "Why KINKEN exists" and "How the team works".

---

## 02_architecture/ — Technical Architecture

| File | Description |
|------|-------------|
| [tech_stack.md](02_architecture/tech_stack.md) | Final tech stack, NFRs, scale baseline |
| [data_flow.md](02_architecture/data_flow.md) | Data pipeline: PIM → CSV → DB → ES → API → UI |
| [auth_model.md](02_architecture/auth_model.md) | Authentication for different user types |
| [doc_delivery.md](02_architecture/doc_delivery.md) | CloudRun-based document delivery via CDN/LB |

**When to read**: When you need to understand "How KINKEN is built" technically.

---

## 03_features/ — Product Features

| File | Description |
|------|-------------|
| [search_apis.md](03_features/search_apis.md) | UI API vs Search Platform API comparison |
| [function_design.md](03_features/function_design.md) | Product/Document search, Pickup/Limited mode |
| [elasticsearch.md](03_features/elasticsearch.md) | ES concepts, aggregations, hybrid search |

**When to read**: When you need to understand "What KINKEN does" from a product perspective.

---

## 04_progress/ — Sprint Tracking

| File | Description |
|------|-------------|
| [sprint_tracking.md](04_progress/sprint_tracking.md) | Sprint history (SPRINT 9-25) with case studies |
| [milestones.md](04_progress/milestones.md) | Key decisions, timeline, QA/BrSE milestones |

**When to read**: When you need to understand "What happened during the project" and "What decisions were made".

**Note**: Sprint tracking will be updated as new sprint reports come in.

---

## 05_interview/ — BrSE Interview Prep

| File | Description |
|------|-------------|
| [playbook.md](05_interview/playbook.md) | Interview Q&A, elevator pitch, tips |
| [case_studies.md](05_interview/case_studies.md) | 5 detailed case studies with talking points |
| [glossary.md](05_interview/glossary.md) | Technical terms (JP/EN/VI) |

**When to read**: When preparing for BrSE interviews.

---

## 🎯 Recommended Reading Order

### For New Team Members

1. [01_project/inception.md](01_project/inception.md) — Understand project purpose
2. [01_project/system_overview.md](01_project/system_overview.md) — Understand system positioning
3. [02_architecture/tech_stack.md](02_architecture/tech_stack.md) — Learn technical stack
4. [02_architecture/data_flow.md](02_architecture/data_flow.md) — Understand data pipeline
5. [03_features/function_design.md](03_features/function_design.md) — Learn product features

### For BrSE Interview Prep

1. [05_interview/playbook.md](05_interview/playbook.md) — Read interview Q&A
2. [05_interview/case_studies.md](05_interview/case_studies.md) — Study case studies
3. [04_progress/milestones.md](04_progress/milestones.md) — Review key decisions
4. [05_interview/glossary.md](05_interview/glossary.md) — Memorize technical terms
5. [01_project/working_agreement.md](01_project/working_agreement.md) — Understand team process

### For Technical Deep Dive

1. [02_architecture/tech_stack.md](02_architecture/tech_stack.md) — Overall architecture
2. [03_features/elasticsearch.md](03_features/elasticsearch.md) — Search engine details
3. [03_features/search_apis.md](03_features/search_apis.md) — API design
4. [02_architecture/auth_model.md](02_architecture/auth_model.md) — Security model
5. [02_architecture/doc_delivery.md](02_architecture/doc_delivery.md) — Document delivery

---

## 🔄 Update Workflow

### When you receive a new Sprint Output Summary Report:

1. **Identify topic**: ETL, Search, API, Auth, etc.
2. **Update relevant file**:
   - ETL content → [02_architecture/data_flow.md](02_architecture/data_flow.md)
   - Search content → [03_features/elasticsearch.md](03_features/elasticsearch.md)
   - API content → [03_features/search_apis.md](03_features/search_apis.md)
   - Sprint progress → [04_progress/sprint_tracking.md](04_progress/sprint_tracking.md)
   - New decision → [04_progress/milestones.md](04_progress/milestones.md)
   - New term → [05_interview/glossary.md](05_interview/glossary.md)

3. **Update this README** if structure changes

See [workflow_kinken_update_protocol.md](workflow_kinken_update_protocol.md) for detailed workflow.

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| Documents | ~13 million |
| Product records | ~8.8 million |
| QA records | ~1.7 million |
| Target response time | ~3 seconds |
| Current sprint | SPRINT 25 (PROD prep) |
| Tech stack | Python/FastAPI, React/Next.js, Elasticsearch, Databricks |

---

## 🎓 Key Concepts

| Concept | Quick Explanation | Learn More |
|---------|-------------------|------------|
| **Hybrid Search** | Morphological + Semantic search with RRF | [03_features/elasticsearch.md](03_features/elasticsearch.md) |
| **Pickup Mode** | Show matching products above search results | [03_features/function_design.md](03_features/function_design.md) |
| **Limited Mode** | Guide users to product-filtered view | [03_features/function_design.md](03_features/function_design.md) |
| **Two API Layers** | UI API (simple) + Search Platform API (flexible) | [03_features/search_apis.md](03_features/search_apis.md) |
| **Multi-tier Auth** | Azure/EntraID, EAA, MyLIXIL | [02_architecture/auth_model.md](02_architecture/auth_model.md) |

---

## 🚀 Quick Links

| Resource | Link |
|----------|------|
| Project inception | [01_project/inception.md](01_project/inception.md) |
| Technical glossary | [05_interview/glossary.md](05_interview/glossary.md) |
| Interview playbook | [05_interview/playbook.md](05_interview/playbook.md) |
| Sprint tracking | [04_progress/sprint_tracking.md](04_progress/sprint_tracking.md) |
| Case studies | [05_interview/case_studies.md](05_interview/case_studies.md) |

---

## 📝 Notes

- **Language**: Documents are in Vietnamese with technical terms in English/Japanese
- **Audience**: QA Engineer transitioning to BrSE role
- **Purpose**: Interview preparation + knowledge retention
- **Maintenance**: Updated as new sprint reports come in

---

## 🔗 Related Projects

| Project | Status | Workspace |
|---------|--------|-----------|
| KINKEN | Active (SPRINT 25) | This folder |
| WORKLOG | Interview prep | `/projects/worklog/` |
| Japanese Study | Personal | `/projects/japanese-study/` |

---

**For questions or updates, refer to [CLAUDE.md](CLAUDE.md) for AI context.**
