---
name: project_kinken_technical_architecture_overview
description: KINKEN technical architecture decisions including languages, frameworks, search engine, authentication, and analytics.
type: project
updated: 2026-05-05
---

# KINKEN Technical Architecture Overview (方式一覧)

**Updated**: 2026-05-05  
**Source**: Technical Architecture Overview.csv from workspace

---

## 1. Development Languages (開発言語)

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Backend** | Python | 3.13 | Version selection: 3.13 as of 2025/06, or 3.14 (expected 2025/10). Minor versions released annually. |
| **Frontend** | TypeScript (React) | 5.8 | Framework: React (Next.js) for SEO optimization (SSR/SSG), large ecosystem, high scalability. Version: 5.8 as of 2025/06, or latest stable at development time. |
| **Batch/ETL** | Python | 3.13 | System focuses on data collection/search platform. Python chosen for AI development future-proofing and proven track record. |

---

## 2. Application Frameworks

| Layer | Framework | Version | Rationale |
|-------|-----------|---------|-----------|
| **Backend** | FastAPI | 0.115.12 | Simple & modern development experience, automatic validation via type hints, auto-generated Swagger/OpenAPI docs |
| **Frontend** | Next.js | 15.x | Web application framework for React. Version: 15.x as of 2025/06, or 16.x (expected 2025/10). Major versions released annually. |
| **Batch** | Pandas, PySpark | - | Python implementation for Databricks jobs using these libraries |

---

## 3. Search Engine (検索エンジン)

| Component | Technology | Version | Rationale |
|-----------|-----------|---------|-----------|
| **Search Engine** | Elasticsearch (Elastic Cloud) | 9.x | Supports indexing methods, search result weighting, semantic search. Rich documentation. Version: 9.x is LTS as of 2025/06. Minor versions released several times per year. |

### Search Configuration

| Aspect | Method | Notes |
|--------|--------|-------|
| **Index Method** | Morphological + Semantic | Based on PoC results. Combine both approaches using reranking. Continue exploring improvements during validation. |
| **Reranking** | Reciprocal Rank Fusion (RRF) | Based on PoC results. Consider alternatives during validation if better options emerge. |
| **Vector Model** | OpenAI text-embedding-3-large | Based on PoC results. Consider alternatives (e.g., Cohere embed-multilingual-v3.0-lite) during validation. |
| **Tokenizer** | kuromoji_tokenizer | Based on PoC results. Consider alternatives during validation if better options emerge. |
| **Text Extraction** | gpt-4o-mini | Based on PoC results. Apply per tool as needed. Final decision during validation phase. |

---

## 4. Distributed Processing Platform (分散処理基盤)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Platform** | Databricks | Distributed processing using PySpark and Pandas |

---

## 5. Authentication Platform (認証基盤)

| User Type | Authentication Method | Notes |
|-----------|----------------------|-------|
| **Internal Users** | Azure Authentication | Decided during requirements definition |
| **Partner Users** | EAA Authentication | Decided during requirements definition |
| **Business Users** | MyLIXIL Authentication | Decided during requirements definition |

---

## 6. Common Search Platform (共通検索基盤)

| Aspect | Method | Rationale |
|--------|--------|-----------|
| **API Method** | REST API | Standard, proven approach. Easy integration and maintenance. |
| **Authentication** | API Key | Simple implementation, easy for consumers to understand. Easy access control and management. |

---

## 7. Behavioral Data Analysis (行動データ分析)

| Analysis Type | Technology | Status |
|---------------|-----------|--------|
| **User Behavior Analysis** | Google Analytics (GA) | Decided during requirements definition based on client request |
| **Access Log Analysis** | BigQuery / LookerStudio | Under consideration (JIRA discussion) |
| **Search Query Analysis** | BigQuery / LookerStudio | Under consideration (JIRA discussion) |

---

## 8. Preview Method (プレビュー方式)

| File Type | Library | Rationale |
|-----------|---------|-----------|
| **PDF** | React-PDF | Widely used, supports major modern browsers (Chrome, Edge, Safari). Consider alternatives if new requirements emerge. |

---

## Interview Talking Points

### Language & Framework Choices
> "We chose Python 3.13 for backend/batch due to its AI development ecosystem and proven track record. FastAPI provides modern development experience with automatic validation and API documentation. Next.js 15.x for frontend enables SEO optimization through SSR/SSG."

### Search Architecture
> "Based on PoC results, we use hybrid search combining morphological analysis (kuromoji) and semantic search (OpenAI embeddings), reranked with RRF. This balances Japanese text segmentation accuracy with semantic understanding."

### Version Strategy
> "We target latest stable versions at development time, not fixed versions from planning phase. Python and Next.js release annually, Elasticsearch releases minor versions several times per year. This keeps us current without chasing bleeding edge."

### Authentication Strategy
> "Multi-tier authentication: Azure for internal users, EAA for partners, MyLIXIL for business users. API key authentication for search platform keeps integration simple while maintaining access control."

### Analytics Approach
> "GA for user behavior tracking per client request. BigQuery + LookerStudio under consideration for access logs and search query analysis, pending JIRA discussion outcome."

---

## Key Decisions

| Decision | Rationale | Trade-offs |
|----------|-----------|------------|
| Python 3.13 | AI ecosystem, proven track record | Learning curve for non-Python teams |
| FastAPI | Modern, auto-documentation | Newer than Django/Flask |
| Next.js 15.x | SEO optimization, React ecosystem | More complex than plain React |
| Elasticsearch 9.x LTS | Proven search engine, rich features | Cost vs self-hosted alternatives |
| Hybrid Search (Morphological + Semantic) | Best of both worlds per PoC | Complexity vs single approach |
| RRF Reranking | Effective combination per PoC | May need tuning per use case |
| OpenAI text-embedding-3-large | High quality embeddings per PoC | API cost vs self-hosted models |
| kuromoji_tokenizer | Japanese text segmentation | Specific to Japanese |
| REST API | Standard, easy integration | Less flexible than GraphQL |
| API Key Auth | Simple, easy to manage | Less secure than OAuth for some use cases |
| React-PDF | Proven, widely used | May need alternatives for other file types |

---

## Version Update Strategy

**Philosophy**: Target latest stable versions at development time, not planning time.

**Rationale**: 
- Development period ~1 year
- Technologies release updates during this period
- Staying current reduces technical debt
- Latest versions have better performance and security

**Monitoring**:
- Python: Annual minor releases (3.13 → 3.14 expected 2025/10)
- Next.js: Annual major releases (15.x → 16.x expected 2025/10)
- Elasticsearch: Multiple minor releases per year (9.x series)
- React: Multiple minor releases per year (5.8 → 5.x)

---

## Related Documents
- [Tech Stack](tech_stack.md) - Infrastructure details
- [Data Flow](data_flow.md) - ETL pipeline
- [Elasticsearch](../03_features/elasticsearch.md) - Search configuration
- [Auth Model](auth_model.md) - Authentication details
