# KINKEN - Document & Product Search Platform (LIXIL)

> **Source**: Real project worked on as a QA Engineer for a Japanese client.  
> **Purpose**: Preserve all knowledge, specifications, architecture decisions, and design rationale for learning and BrSE practice.

**Last updated**: 2026-05-16  
**Project status**: SPRINT 25 (PROD Release Preparation)  
**Scale**: ~13 million documents + ~8.8 million product records + ~1.7 million QA records  
**Target response time**: ~3 seconds

---

## 📌 Purpose in yano-life-system

This folder contains the complete documentation from the **KINKEN** project (the largest project worked on so far).

Main objectives:
- Preserve real-world knowledge from a large-scale production system
- Serve as reference material when building **mini-kinken**
- Support BrSE interview preparation and skill development
- Act as a centralized knowledge base after archiving the original Claude-Yano9920 repository

---

## 🎯 Quick Navigation

### Where to start?

| If you want to...                      | Recommended file                                      |
|----------------------------------------|-------------------------------------------------------|
| Understand project purpose & context   | [01_project/inception.md](01_project/inception.md)    |
| Learn the overall technical architecture | [02_architecture/tech_stack.md](02_architecture/tech_stack.md) |
| Prepare for BrSE interviews            | [05_interview/playbook.md](05_interview/playbook.md)  |
| Review project progress & decisions    | [04_progress/sprint_tracking.md](04_progress/sprint_tracking.md) |
| Look up technical terms (JP/EN/VI)     | [05_interview/glossary.md](05_interview/glossary.md)  |

---

## 📁 Documentation Structure

```
kinken/
├── 01_project/          # Project context, goals, and team processes
├── 02_architecture/     # Technical architecture, data flow, authentication, deployment
├── 03_features/         # Product features, search APIs, and Elasticsearch details
├── 04_progress/         # Sprint history and key decisions (Sprint 9 → 25)
├── 05_interview/        # BrSE interview preparation materials
└── workflow_*.md        # AI-assisted documentation update workflows
```

### Folder Details

**01_project/** — Project Context
- `inception.md`: Project purpose, scope, stakeholders, and timeline
- `working_agreement.md`: Team workflow, PR rules, and communication norms
- `system_overview.md`: System positioning, API surfaces, and team roles

**02_architecture/** — Technical Architecture
- `tech_stack.md`: Final technology stack and non-functional requirements
- `data_flow.md`: Data pipeline from PIM → CSV → Database → Elasticsearch → API → UI
- `auth_model.md`: Multi-tier authentication model (Azure/EntraID, EAA, MyLIXIL)
- `doc_delivery.md`: Document delivery mechanism using Cloud Run + CDN/LB

**03_features/** — Product Features
- `search_apis.md`: Comparison between UI API and Search Platform API
- `function_design.md`: Pickup Mode, Limited Mode, Product & Document search
- `elasticsearch.md`: Hybrid search, RRF, kuromoji tokenizer, and aggregations

**04_progress/** — Sprint Tracking
- `sprint_tracking.md`: Sprint history with case studies (Sprint 9–25)
- `milestones.md`: Key decisions and project timeline

**05_interview/** — BrSE Interview Preparation
- `playbook.md`: Interview questions, answers, and tips
- `case_studies.md`: 5 detailed case studies with talking points
- `glossary.md`: Technical glossary (Japanese / English / Vietnamese)

---

## 🎯 Recommended Reading Order

### For understanding the project
1. `01_project/inception.md`
2. `01_project/system_overview.md`
3. `02_architecture/tech_stack.md`
4. `02_architecture/data_flow.md`
5. `03_features/function_design.md`

### For BrSE interview preparation
1. `05_interview/playbook.md`
2. `05_interview/case_studies.md`
3. `04_progress/milestones.md`
4. `05_interview/glossary.md`
5. `01_project/working_agreement.md`

### For technical deep dive
1. `02_architecture/tech_stack.md`
2. `03_features/elasticsearch.md`
3. `03_features/search_apis.md`
4. `02_architecture/auth_model.md`
5. `02_architecture/doc_delivery.md`

---

## 🔄 Update Workflow

When receiving a new Sprint Output Summary Report:

1. Identify the topic (ETL, Search, API, Auth, etc.)
2. Update the relevant file:
   - ETL-related content → `02_architecture/data_flow.md`
   - Search-related content → `03_features/elasticsearch.md`
   - API-related content → `03_features/search_apis.md`
   - Sprint progress → `04_progress/sprint_tracking.md`
   - New decisions → `04_progress/milestones.md`
   - New terms → `05_interview/glossary.md`
3. Update this README if the structure changes

---

## 📊 Project Stats

| Metric                    | Value                    |
|---------------------------|--------------------------|
| Documents                 | ~13 million              |
| Product records           | ~8.8 million             |
| QA records                | ~1.7 million             |
| Target response time      | ~3 seconds               |
| Current sprint            | SPRINT 25 (PROD prep)    |
| Tech stack                | Python/FastAPI, React/Next.js, Elasticsearch, Databricks, GCP |

---

## 🎓 Key Concepts

| Concept            | Quick Explanation                                      | Learn more in                              |
|--------------------|--------------------------------------------------------|--------------------------------------------|
| **Hybrid Search**  | Combination of morphological + semantic search with RRF | `03_features/elasticsearch.md`             |
| **Pickup Mode**    | Display matching products above search results         | `03_features/function_design.md`           |
| **Limited Mode**   | Guide users to filtered product view                   | `03_features/function_design.md`           |
| **Two API Layers** | UI API (simple) + Search Platform API (flexible)       | `03_features/search_apis.md`               |
| **Multi-tier Auth**| Azure/EntraID, EAA, MyLIXIL                            | `02_architecture/auth_model.md`            |

---

## 📝 Notes

- All content in this folder was **migrated from `Claude-Yano9920/projects/kinken/`** on 2026-05-16.
- The primary purpose is **learning and reference**, not full system re-implementation.
- When updating, prioritize editing the original files in their respective folders first.
- This documentation serves as a knowledge base for building **mini-kinken** and preparing for Fresher BrSE interviews.

---

**Original Author**: Tài (Yano)  
**Intended Use**: BrSE skill development • mini-kinken implementation • Interview preparation