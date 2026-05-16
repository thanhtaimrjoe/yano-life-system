# KINKEN Spec Reading Roadmap

**Created**: 2026-05-05  
**Purpose**: Track progress of reading and understanding KINKEN project specifications  
**Goal**: Prepare for BrSE interview by understanding full project scope from POC to Production

---

## 📋 Reading Status Legend

- ⏳ **Not Started**: Chưa đọc
- 🔄 **In Progress**: Đang đọc
- ✅ **Completed**: Đã đọc xong và tổng hợp
- 📝 **Notes Added**: Đã thêm notes vào knowledge base

---

## 🎯 Phase 1: Foundation & Vision (Priority: HIGHEST)

### 1.1 Project Vision & Constraints

| Item | Document Name | Status | Priority | Notes Location |
|------|---------------|--------|----------|----------------|
| 15 | **Inception Deck** (Phương châm dự án) | ✅ | P0 | `01_project/inception.md` |
| 14 | **Working Agreement** (Rule phát triển MOR-GW) | ✅ | P0 | `01_project/working_agreement.md` |
| 22 | **Non-functional Requirements** | ✅ | P0 | `01_project/non_functional_requirements.md` |
| 23 | **Baseline Metrics** (性能基礎数値) | ✅ | P0 | `01_project/baseline_metrics.md` |

**Why read first**: Understand WHY, HOW, and CONSTRAINTS before diving into technical details

**Expected Output**:
- Project Charter document
- Success criteria definition
- Technical constraints summary

---

## 🏗️ Phase 2: Core Architecture (Priority: HIGH)

### 2.1 System Architecture

| Item | Document Name | Status | Priority | Notes Location |
|------|---------------|--------|----------|----------------|
| 7 | **Data Collection Platform Architecture** | ⏳ | P1 | PDF - cannot read |
| 24 | **Technical Architecture Overview** (方式一覧) | ✅ | P1 | `02_architecture/technical_architecture_overview.md` |
| 29 | **Data Collection Platform (Core Functions)** | ⏳ | P1 | PDF - cannot read |
| 30 | **Data Collection Platform - Detail** (PULL-PUSH) | ⏳ | P1 | PDF - cannot read |

### 2.2 Data Model & Interface

| Item | Document Name | Status | Priority | Notes Location |
|------|---------------|--------|----------|----------------|
| 12 | **Physical Model Schema Design** (Diagram + Detail) | ✅ | P1 | `02_architecture/physical_model_schema.md` |
| 8 | **Interface List** (Data Integration Overview) | ✅ | P1 | `02_architecture/data_integration_overview.md` |
| 10 | **File Integration - Interface Item Definition** | ✅ | P1 | `02_architecture/interface_item_patterns.md` |
| 25 | **Document Subtype Tables** (取説/図面/技術資料等) | ✅ | P1 | `02_architecture/document_subtype_tables.md` |

**Expected Output**:
- Architecture diagram (redrawn)
- Data flow documentation
- ETL pipeline explanation

---

## 🎨 Phase 3: Features & UI (Priority: HIGH)

### 3.1 Feature Specifications

| Item | Document Name | Status | Priority | Notes Location |
|------|---------------|--------|----------|----------------|
| 6 | **Function List** (機能一覧) | ⏳ | P0 | - |
| 5 | **Screen List** (画面一覧) | ⏳ | P1 | - |
| 2 | **Sitemap** | ⏳ | P1 | - |
| 3 | **Figma Design** | ⏳ | P2 | - |

### 3.2 Search & Filter Logic

| Item | Document Name | Status | Priority | Notes Location |
|------|---------------|--------|----------|----------------|
| 16 | **Document List Summary** (資料一覧まとめ) | ⏳ | P1 | - |
| 4 | **Filter Conditions** (一覧画面の絞り込み条件) | ✅ | P1 | `03_features/pickup_limited_mode.md` |
| 43 | **Search Accuracy Evaluation Keywords** | ⏳ | P2 | - |

**Expected Output**:
- Feature breakdown with priority
- Search logic explanation
- Filter conditions mapping

---

## 🔐 Phase 4: Authentication & Security (Priority: MEDIUM)

| Item | Document Name | Status | Priority | Notes Location |
|------|---------------|--------|----------|----------------|
| 33 | **Current LIXIL Authentication Platform** | ⏳ | P1 | - |
| 34 | **New System Authentication & Authorization** | ⏳ | P1 | - |
| 35 | **VN Authentication Confirmation Results** | ⏳ | P1 | - |
| 36 | **Authentication Proxy & Gateway** | ⏳ | P2 | - |
| - | **EdgeWorker Usage** | ⏳ | P2 | - |

**Expected Output**:
- Authentication flow diagram
- User type & permission matrix
- Security architecture summary

---

## 🔌 Phase 5: API & Integration (Priority: MEDIUM)

### 5.1 API Specifications

| Item | Document Name | Status | Priority | Notes Location |
|------|---------------|--------|----------|----------------|
| 11 | **Common Search Platform API List** | ⏳ | P1 | - |
| 28 | **API List Draft** | ⏳ | P2 | - |

### 5.2 External System Integration

| Item | Document Name | Status | Priority | Notes Location |
|------|---------------|--------|----------|----------------|
| 37 | **System Integration Connection Info** | ⏳ | P1 | - |
| 49 | **Product QA System API** | ⏳ | P2 | - |

**Expected Output**:
- API endpoint documentation
- Integration architecture
- External system dependencies

---

## 🛍️ Phase 6: Product Search (7 Exterior Types) (Priority: MEDIUM)

| Item | Document Name | Status | Priority | Notes Location |
|------|---------------|--------|----------|----------------|
| 42 | **Product Search - Screen Item Definition** | ⏳ | P1 | - |
| - | 形材門扉 / Shaped Gate | ⏳ | P2 | - |
| - | 鋳物門扉 / Cast Gate | ⏳ | P2 | - |
| - | 伸縮門扉 / Removable Gate | ⏳ | P2 | - |
| - | 形材フェンス / Shaped Fence | ⏳ | P2 | - |
| - | スチールメッシュフェンス / Mesh Fence | ⏳ | P2 | - |
| - | カーポート / Carport | ⏳ | P2 | - |
| - | テラス / Terrace | ⏳ | P2 | - |

**Expected Output**:
- Product search flow explanation
- 7 exterior types comparison
- Filter logic per product type

---

## 🧪 Phase 7: Testing & Quality (Priority: MEDIUM)

| Item | Document Name | Status | Priority | Notes Location |
|------|---------------|--------|----------|----------------|
| 50 | **Test Planning** (テスト計画) | ⏳ | P1 | - |
| 13 | **Development Order & Schedule** | ⏳ | P2 | - |
| 51 | **Test Schedule (Internal)** | ⏳ | P2 | - |

**Expected Output**:
- Test strategy summary
- QA approach documentation
- Test coverage analysis

---

## 📊 Phase 8: Operations & Monitoring (Priority: LOW)

### 8.1 Logging & Analytics

| Item | Document Name | Status | Priority | Notes Location |
|------|---------------|--------|----------|----------------|
| 44 | **BigQuery Table Definition for System Logs** | ⏳ | P2 | - |
| 45 | **GA Measurement List** | ⏳ | P2 | - |
| 46 | **GA Integration Guide** | ⏳ | P2 | - |

### 8.2 Batch & Migration

| Item | Document Name | Status | Priority | Notes Location |
|------|---------------|--------|----------|----------------|
| 32 | **Batch List** | ⏳ | P2 | - |
| 56 | **Batch Schedule** | ⏳ | P2 | - |
| 48 | **Data Migration Preparation** | ⏳ | P1 | - |
| 57 | **Final Migration Schedule** | ⏳ | P1 | - |

**Expected Output**:
- Batch job documentation
- Migration strategy summary
- Monitoring approach

---

## 📚 Phase 9: Additional Context (Priority: LOW)

| Item | Document Name | Status | Priority | Notes Location |
|------|---------------|--------|----------|----------------|
| 1 | **Blueprint + Record (GW vs LIXIL)** | ⏳ | P2 | - |
| 18 | **Domain PoC** | ⏳ | P2 | - |
| 19 | **SAGAS Data Reference Diagram** | ⏳ | P2 | - |
| 31 | **Ubiquitous Language** | ⏳ | P2 | - |
| 38 | **LIXIL Discussion Log** | ⏳ | P3 | - |
| 39 | **Figma Change Log** | ⏳ | P3 | - |

---

## 🎓 BrSE Interview Preparation Milestones

### Milestone 1: Foundation Understanding (Week 1)
- [x] Complete Phase 1 (Vision & Constraints) ✅ 2026-05-05
- [x] Complete Phase 2 (Core Architecture) ✅ 2026-05-05
- [x] Create Project Charter document ✅ 2026-05-05
- [x] Draw architecture diagram ✅ 2026-05-05

**Deliverable**: Can explain "What is KINKEN and why it matters" ✅ DONE

### Milestone 2: Technical Deep Dive (Week 2)
- [ ] Complete Phase 3 (Features & UI)
- [ ] Complete Phase 4 (Authentication)
- [ ] Complete Phase 5 (API & Integration)
- [x] Create feature breakdown document ✅ (comprehensive_notes.md)

**Deliverable**: Can explain technical decisions and trade-offs

### Milestone 3: Domain Expertise (Week 3)
- [ ] Complete Phase 6 (Product Search)
- [ ] Complete Phase 7 (Testing)
- [ ] Create case studies from sprint tracking
- [ ] Prepare Q&A scenarios

**Deliverable**: Can discuss domain-specific challenges

### Milestone 4: Interview Ready (Week 4)
- [ ] Complete Phase 8 (Operations)
- [ ] Review all case studies
- [ ] Mock interview practice
- [ ] Prepare presentation materials

**Deliverable**: Ready for BrSE interview

---

## 📝 Notes & Observations

### Key Questions to Answer While Reading:
1. **Why KINKEN?** - What problems does it solve?
2. **Why Elasticsearch?** - Why not traditional DB search?
3. **Why Hybrid Search?** - Morphological + Semantic
4. **Why UUID Migration?** - ETL parallelization
5. **Why 7 Exterior Types?** - Business domain complexity

### Technical Decisions to Understand:
- [ ] REST vs GraphQL choice
- [ ] Databricks vs other ETL tools
- [ ] OpenAI vs other embedding models
- [ ] CloudRun vs other compute options
- [ ] PostgreSQL vs other RDB

### Business Context to Capture:
- [ ] LIXIL's 10-year pain points
- [ ] User types & their needs
- [ ] Document types & relationships
- [ ] Search accuracy requirements

---

## 🔄 Progress Tracking

**Last Updated**: 2026-05-05 18:15  
**Total Documents**: 59 items  
**Completed**: 12  
**In Progress**: 0  
**Not Started**: 47  

**Current Phase**: Phase 2 - Core Architecture (Near completion)  
**Next Document to Read**: Item 7 - Data Collection Platform Architecture (PDF)

### Recent Additions
- 2026-05-05 18:15: ✅ Completed Interface List (Data Integration Overview) - 13 data sources, PUSH/PULL patterns, OCR rules
- 2026-05-05 18:15: ✅ Completed Interface Item Definition - Field patterns for Product, Manual, Drawing, Technical docs
- 2026-05-05 18:15: 📝 Created comprehensive interview notes from NotebookLM analysis
- 2026-05-05 18:15: 🔄 Established NotebookLM + Claude workflow for efficient knowledge extraction
- 2026-05-05 08:43: Added 4 new master tables (filter_conditions, extracted_filter_conditions, product_categories, announcements, division_sort_orders)
- 2026-05-05 08:25: Added Document Subtype Schemas (11 document types with specialized schemas)
- 2026-05-05: Completed Phase 1 Foundation & Vision

---

## 💡 How to Use This Roadmap

1. **Before reading**: Check this file to see what's next
2. **While reading**: Update status to 🔄
3. **After reading**: 
   - Update status to ✅
   - Add notes location
   - Update progress tracking
4. **New session**: Check this file first to continue where you left off

---

## 📞 Contact & Collaboration

**Your Role**: QA Engineer → Transitioning to BrSE  
**My Role**: Full-stack Dev + PM (simulation)  
**Goal**: Prepare for BrSE interview in 1 month  
**Approach**: Step-by-step, learn by doing

---

**Ready to start! Upload Inception Deck first! 🚀**
