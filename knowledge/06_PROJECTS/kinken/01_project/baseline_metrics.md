---
name: project_kinken_baseline_metrics
description: KINKEN baseline metrics including data volume, user counts, access patterns, and performance targets.
type: project
updated: 2026-05-05
---

# KINKEN Baseline Metrics (性能基礎数値)

**Updated**: 2026-05-05  
**Source**: Baseline metrics.csv from workspace  
**Data Background**: [Google Sheet](https://docs.google.com/spreadsheets/d/13n17IoGac_bZwPdiR8yBCUTLgE-X0_K1iLXqMD7CgVY/edit?usp=sharing)

---

## 1. Data Volume at Initial Release

### Products & Documents

| Data Type | Count | Notes |
|-----------|-------|-------|
| **Products** | 5,164 | Structured data only at initial release |
| **Total Documents** | 13,010,791 | Current public + expected growth |
| **Structured Documents** | 11,170,640 | |
| **Unstructured Documents** | 1,802,380 | |

### Document Breakdown by Type

| Document Type | Structured | Unstructured | Total | Notes |
|---------------|-----------|--------------|-------|-------|
| **Drawings (図面)** | 277,371 | 226,826 | ~504K | Max 10K per product (typically 4-5K) |
| **Manuals (取説)** | 23,167 | 21,882 | ~45K | Max 10K per product |
| **Technical Docs (技術資料)** | 12,902 | 9,121 | ~22K | Max 10K per product |
| **Web Catalog (WEBカタログ)** | 16,922 | 1,382,478 | ~1.4M | Max 10K per product |
| **CAD** | 37,771 | - | 37,771 | Structured only |
| **Electronic Product Communication** | 12,886 | 14,281 | ~27K | |
| **Inspection/Repair Manual** | 924 | 1,816 | ~2.7K | |
| **Product QA - FAQ** | 46,000 | - | 46,000 | Structured only |
| **Product QA - Past QA** | 1,700,000 | - | 1,700,000 | 3-year retention |
| **Video (LIXIL-X)** | 1,526 | - | 1,526 | Structured only |
| **Parts Search Pro** | 278,942 | 145,976 | ~425K | |
| **Product Code Master** | 8,800,000 | - | 8,800,000 | Structured only |

---

## 2. User Metrics

| Metric | Count | Notes |
|--------|-------|-------|
| **Total Potential Users** | 287,905 | |
| **Internal Users** | 60,600 | Max monthly: 4,698 (2407-2506) |
| **Partner Users** | 157,143 | Max monthly: 4,039; Max daily: 2,634 |
| **Business Users** | 162/month | MyLIXIL authenticated |
| **General Users** | 70,000/month | Unauthenticated (GA/UA data) |
| **Concurrent Logins** | 924/hour | 9-17 JST, 1-hour unit (2024/07-2025/06) |
| **Internal Daily Users** | 1,900 | Actual usage |
| **Partner Daily Users** | 1,300 | Actual usage |

---

## 3. Access Patterns

### Normal Hours (平日 9-17時)

| Metric | Value | Notes |
|--------|-------|-------|
| **Product List Access** | 1,088 req/hour | Average (2407-2506) |
| **Document List Access** | 227 req/hour | Average across tools |

### Peak Hours (ピーク時)

| Metric | Value | Notes |
|--------|-------|-------|
| **Product List Access** | 181 req/min | |
| **Document List Access** | 38 req/min | |

---

## 4. Performance Targets (目標応答速度)

**Assumptions**:
- Network speed and device performance are NOT bottlenecks
- Weekday 10:00-12:00 business hours
- Time measured to screen render completion
- Targets reviewed periodically as data/usage changes

| Screen/Feature | Target Response Time | Notes |
|----------------|----------------------|-------|
| **Overall Average** | 3 seconds | |
| **Product List** | 3 seconds | |
| **Document List (Web Catalog)** | 4 seconds | Largest data volume, most full-text search targets |
| **Document List (Other Tools)** | 3 seconds | |

---

## 5. Annual Data Growth Projections

### Products & Documents

| Data Type | Annual Growth | Notes |
|-----------|---------------|-------|
| **Products** | 6 | Minimal growth |
| **Total Documents** | 567,862 | |
| **Structured** | Varies by type | See breakdown below |
| **Unstructured** | Varies by type | See breakdown below |

### Document Growth by Type

| Document Type | Structured Growth | Unstructured Growth | Notes |
|---------------|------------------|-------------------|-------|
| **Drawings** | 2,541 | 2,097 | |
| **Manuals** | 217 | 263 | |
| **Technical Docs** | 258 | 182 | 2% annual growth |
| **Web Catalog** | 572 | 48,333 | |
| **CAD** | 750 | - | Based on public/deleted data lists |
| **Electronic Product Communication** | 615 | 681 | 3-year average |
| **Inspection/Repair Manual** | 44 | 22 | 5-year average |
| **Product QA - FAQ** | 1,530 | - | 2-year average |
| **Product QA - Past QA** | 431,000 | - | Based on case count |
| **Video** | 365 | - | |
| **Parts Search Pro** | 2,227 | 1,165 | |
| **Product Code Master** | 75,000 | - | 0.85% annual growth |

---

## Interview Talking Points

### Scale Context
> "KINKEN handles 13M documents and 8.8M product records at launch. The largest single data source is the Product Code Master (8.8M records), followed by Past QA (1.7M records). Web Catalog is the most complex with 1.4M documents."

### User Base
> "We support ~288K potential users across four tiers: internal (60K), partners (157K), business (162/month), and general (70K/month). Peak concurrent load is ~924 users/hour, with daily active users around 3,200."

### Performance Targets
> "We target 3-second response time for most screens, with 4 seconds allowed for Web Catalog due to its large data volume. These targets assume network and device performance are not bottlenecks."

### Growth Planning
> "Annual growth is modest: 6 new products and ~568K new documents. The largest growth is in Past QA (431K/year) and Web Catalog (48K/year unstructured). This informs our scaling strategy."

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| 3-second target (4s for Web Catalog) | Balances user experience with infrastructure costs |
| 99.9% uptime | Supports business-critical operations |
| 7-day backup retention | Covers most recovery scenarios |
| Separate targets for Web Catalog | Acknowledges data volume difference |

---

## Related Documents
- [Non-Functional Requirements](non_functional_requirements.md) - Availability, scalability, operations
- [Tech Stack](../02_architecture/tech_stack.md) - Infrastructure to support these metrics
- [Data Flow](../02_architecture/data_flow.md) - ETL pipeline handling this volume
