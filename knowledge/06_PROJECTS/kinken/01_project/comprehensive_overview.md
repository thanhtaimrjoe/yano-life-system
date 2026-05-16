# KINKEN Project - Comprehensive Overview

**Last updated**: 2026-04-30  
**Current status**: SPRINT 25 (PROD Release Preparation)  
**My role**: QA Engineer → Transitioning to Fresher BrSE

---

## 📊 Project Summary

### What is KINKEN?

KINKEN is a **document search and browsing system** for LIXIL metal products (nhôm kính). It replaces the legacy SAGAS system and provides:
- **13 million documents** (tài liệu)
- **8.8 million product records** (mã sản phẩm)
- **1.7 million QA records** (hồ sơ QA)
- **Target response time**: ~3 seconds

### Two API Surfaces

| API | Method | Path | Purpose |
|-----|--------|------|---------|
| **UI API** | GET | `/api/v1/documents` | Simplified search for product screens |
| **Search Platform API** | POST | `/api/search-platform/v1/documents` | Advanced queries for internal systems |

### Data Pipeline

```
PIM → CSV → Cloud Storage (GCS) → Databricks ETL → PostgreSQL → Elasticsearch → API → UI
```

---

## 🏗️ Technical Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.13 + FastAPI |
| **Frontend** | TypeScript + React + Next.js |
| **ETL/Batch** | Python + Pandas/PySpark on Databricks |
| **Search Engine** | Elasticsearch 9.x on Elastic Cloud |
| **Search Approach** | Morphological (kuromoji) + Semantic (OpenAI) with RRF |
| **Embeddings** | OpenAI text-embedding-3-large |
| **PDF Preview** | React-PDF |
| **Cloud Platform** | Google Cloud Platform (GCP) |
| **API Gateway** | Apigee |

---

## 👥 User Types & Authentication

| User Type | Auth Method | Data Access |
|-----------|-------------|-------------|
| **Internal** | Azure/EntraID | Full (role-based) |
| **Partner** | EAA | Partner-relevant only |
| **Business** | MyLIXIL | Business documents |
| **General** | None | Browse only (no detail/preview/download) |

---

## 🔍 Key Features

### 1. Hybrid Search (Morphological + Semantic)

- **Morphological**: Japanese text segmentation using kuromoji
- **Semantic**: Vector search using OpenAI embeddings
- **RRF (Reciprocal Rank Fusion)**: Combines both approaches for optimal results

### 2. Pickup Mode

**Trigger**: When document keywords match product names using ALL keywords together

**Behavior**: 
- Matching products highlighted above search results
- User clicks product → filtered document list

**Example**: Search "アルミサッシ 窓" → Shows matching products first

### 3. Limited Mode

**Trigger**: When full AND matching fails, but exactly one keyword finds products

**Behavior**:
- System enters limited mode
- User can narrow document search around that product
- One-character keywords ignored

**Example**: Search "アルミ 窓 修理" → Full match fails → "アルミ" alone finds products → Limited mode

---

## 📈 Project Timeline

```
2025 Q2: Foundation & Planning
2025 Q3: Design & PoC Development
2025 Q4: Development & Testing
2026 Q1: System Test & PROD Preparation
2026 Q2: PROD Release (SPRINT 25)
```

---

## 🎯 Key Milestones & Decisions

### Critical Case Studies

| Case | Sprint | Issue | Solution | Lesson |
|------|--------|-------|----------|--------|
| **PoC Benchmark Discrepancy** | SPRINT 6 | Search results differed between old/new PoC | Investigated embedding non-determinism, HNSW randomness | Always lock & record infrastructure versions |
| **ETL Tool Selection** | SPRINT 4 | Choose between Databricks, Data Fusion, Dataflow | Selected Databricks for ETL + Data Fusion for ingest | Consider team skills & long-term maintenance |
| **API Architecture** | SPRINT 7 | REST vs GraphQL vs gRPC | Chose REST | Simplicity often wins |
| **Document Preview** | SPRINT 7 | Office files problematic | Ask client about scope | Simplify scope when appropriate |
| **Authentication Model** | SPRINT 5-7 | Multi-tier auth design | Azure/EntraID, EAA, MyLIXIL, API Key | Security is multi-layered |

---

## 🔧 Architecture Decisions

### Why Hybrid Search?
- Morphological: Accurate Japanese text segmentation
- Semantic: Captures meaning beyond keywords
- RRF: Optimal combination of both approaches

### Why Databricks for ETL?
- Strong data analysis capabilities
- Good GCP integration
- Team familiar with Python/PySpark
- Cost-effective for batch processing

### Why REST API?
- Fits client-server model (Web UI → Backend)
- Leverages HTTP caching
- Easy debugging (Postman, Swagger, browser tools)
- Team familiarity

---

## 📚 Domain Knowledge (Ngành Nhôm Kính)

### Key Terms

| JP | Romaji | EN | VI | Context |
|----|--------|----|----|---------|
| 見込み | Mikomi | Depth of frame | Chiều sâu khung cửa | Distance from inside to outside |
| 見付け | Mitsuke | Width of frame | Chiều rộng khung cửa | Visible width when facing directly |
| 商品 | Shohin | Product | Sản phẩm | Product master data |
| 資料 | Shiryo | Document | Tài liệu | Technical docs, manuals, etc. |
| 部品 | Buhin | Parts | Linh kiện | Components/parts |

### Data Relationships

- **Product - Document (N:N)**: Some docs map directly (drawings, manuals), some don't (QA records, repair guides)
- **Product - Parts (N:N)**: Parts managed in two systems: PIM (products) and separate parts search system
- **Complex ETL mapping**: Pipeline must handle these relationships carefully

---

## 🎓 BrSE Interview Preparation

### Elevator Pitch (2 minutes)

> "I'm a QA Engineer with 3 years of experience in UI/API/DB testing. I worked on KINKEN - a document search system for LIXIL with 13M documents and 8.8M product records. Beyond QA, I participated in requirement analysis, communicated with offshore team and Japanese stakeholders. I want to transition to BrSE to bridge technical and business teams effectively."

### Key Interview Topics

1. **Why QA → BrSE?** Bridge role, communication skills, technical understanding
2. **BrSE responsibilities**: Bridge communication, technical understanding, cultural bridge
3. **Case studies**: PoC benchmark, ETL selection, API architecture, document preview, authentication
4. **Technical knowledge**: Elasticsearch, ETL, API design, authentication, GCP basics
5. **Japanese experience**: LIXIL stakeholder communication, terminology learning, timezone management

### Technical Terms to Know

- **Elasticsearch**: Fast full-text search engine for 13M documents
- **Aggregations**: Server-side summaries without returning all documents
- **Hybrid search**: Combines keyword + semantic search
- **Zero-downtime reindex**: Use alias switching to update index without service interruption
- **Vector Search/Embedding**: AI converts text to numbers for semantic understanding
- **ANN (Approximate Nearest Neighbor)**: Fast but approximate search algorithm
- **RRF (Reciprocal Rank Fusion)**: Hybrid search algorithm combining multiple ranking approaches

---

## 📋 QA Testing Focus Areas

1. **Filter logic**: Product/document search filters
2. **Document links**: Broken links detection
3. **ES behavior**: Search accuracy, performance
4. **Data validation**: PIM → DB → ES pipeline
5. **Cross-layer testing**: UI, API, DB, ES layers
6. **Performance testing**: Response time targets (~3 seconds)

---

## 🚀 Current Status (SPRINT 24 - 2026/04/24)

- **Phase**: SPRINT 24 Completed - Beta Preview & Release Preparation
- **Completed**: 
  - Beta preview release (4/27) - Early access for LIXIL employees
  - LIXIL internal webinar - Very positive feedback
  - Preview performance investigation started
  - Unstructured data handling strategy defined
  - Emergency contact protocol established for 5/13-5/15
- **Next Phase**: 
  - **1st Release: 5/13 (Wed)** - LIXIL Internal Users Only (8 days from today)
  - Emergency support period: 5/13-5/15 (10:00-19:00 JST)
  - Data collection platform enhancement (post-5/13)
- **Key Achievements**:
  - **User Validation**: "Much faster than previous system", "10-year improvement request addressed"
  - **Release Readiness**: Beta preview live, team ready for emergency support
  - **Performance**: Preview optimization investigation underway
  - **Data Strategy**: Flag-based approach for unstructured data changes
- **Team Status**: Final countdown to 1st Release, team on standby

---

## 💡 Key Lessons Learned

1. **Version control is critical**: Always lock and record infrastructure versions
2. **Non-deterministic systems need special handling**: Vector search isn't always deterministic
3. **Communication is key**: Explain technical limitations clearly to stakeholders
4. **Trade-off analysis**: Consider team skills, cost, and long-term maintenance
5. **Simplicity often wins**: Choose technology that fits the team and use case
6. **Scope management**: Sometimes simplifying scope is better than forcing complex implementation
7. **Security is multi-layered**: API Gateway → JWT → Data-level visibility flags

---

## 📞 Stakeholders

| Organization | Role | Key Contacts |
|--------------|------|--------------|
| **LIXIL** | Client | GW (Gateway team) |
| **Guildworks** | Gateway/PM | Kim (キムさん), Takekyo (タケさん) |
| **MOR** | Offshore Dev | Dan, Narita, Kazu, Chien, Truong |

---

## 🎯 Next Steps

- Continue SPRINT 25 activities
- Prepare for PROD release
- Document lessons learned for retrospective
- Update case studies with SPRINT 20-25 experiences
