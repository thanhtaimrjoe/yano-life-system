---
name: project_kinken_tech_stack
description: Final technical stack, non-functional requirements, and baseline metrics for KINKEN.
type: project
originSessionId: b37d84e1-f8b9-48d3-b090-b3afc2a6deca
---

# KINKEN Technical Stack

## Final Technical Stack

| Layer | Technology |
|-------|------------|
| Backend | Python 3.13 + FastAPI |
| Frontend | TypeScript + React + Next.js |
| Batch/ETL | Python + Pandas/PySpark on Databricks |
| Search Engine | Elasticsearch 9.x on Elastic Cloud |
| Search Approach | Morphological + Semantic hybrid, reranked with RRF |
| Embeddings | OpenAI text-embedding-3-large |
| Tokenizer | kuromoji_tokenizer |
| PDF Preview | React-PDF |

## Authentication Model

| User Type | Authentication Method |
|-----------|----------------------|
| Internal users | Azure/EntraID |
| Partner users | EAA |
| Business users | MyLIXIL |
| API consumers | REST APIs with API key auth via Apigee |

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Availability | 99.9% |
| Planned maintenance | Several hours downtime allowed |
| Recovery (with data restore) | Within 1 business day |
| DB backup | Nightly, retention 7 days |
| Environment separation | Prod fully separated from dev/test |
| Responsive design | PC and smartphone supported |
| Security | Vulnerability assessment required before public release |

## Scale Baseline

| Metric | Value |
|--------|-------|
| Documents at initial release | ~13 million |
| Product-code master records | ~8.8 million |
| Past QA records | ~1.7 million |
| Target response time (average) | ~3 seconds |
| Target response time (WEB catalog) | ~4 seconds |

## Key Architecture Decisions

### Why Hybrid Search (Morphological + Semantic)?

- **Morphological (kuromoji)**: Handles Japanese text segmentation accurately
- **Semantic (Vector)**: Captures meaning beyond keyword matching
- **RRF (Reciprocal Rank Fusion)**: Combines both approaches for optimal results

### Why Databricks for ETL?

- Strong data analysis capabilities
- Good integration with GCP
- Team familiarity with Python/PySpark
- Cost-effective for batch processing vs real-time

## Infrastructure Notes

| Component | Status (as of SPRINT 9) |
|-----------|------------------------|
| **Dev Domain** | `dev-kinken.lixil.co.jp` — AkamaiWAF configured, Basic Auth enabled |
| **Prod Domains** | `kinken.lixil.co.jp/i/` (internal) + `/e/` (external) |
| **OpenAI API Key** | Issued by LIXIL. Spending threshold to be defined (Chien-san) |
| **Databricks Account** | LIXIL account still pending → using GW free account |
| **Dev Env Components** | RDB ✅, LB ✅, Cloud Run Front ✅, Cloud Run Back ✅, Elastic Cloud ✅ |
| **CI/CD** | Completed in SPRINT 10 |
| **Terraform** | Completed in SPRINT 10 |
| **CloudSQL Access** | Migrating from Public → **Cloud SQL Auth Proxy** (SPRINT 13) |
| **Cost Optimization** | CloudSQL off on weekends; Elasticsearch & CloudRun under review |

## Infrastructure Updates (SPRINT 13 - 2025/11/21)

### Cloud SQL Security Migration

**Status**: Transitioning from Public IP access to **Cloud SQL Auth Proxy** method.

**Rationale**: Protect sensitive database from direct public exposure.

**Implementation**:
1. Mount Secret (private key + known_hosts) into Cloud Run
2. App uses SSH library (`paramiko`) to connect via private key
3. VPC Connect already configured by LIXIL

**Timeline**: Chien-san to confirm implementation details (2025/11/21 afternoon).

### Cost Optimization Initiatives

| Initiative | Status | Expected Impact |
|-----------|--------|-----------------|
| **CloudSQL Auto-stop (Weekends)** | Implemented | Reduce idle compute costs |
| **Elasticsearch Spec Review** | In progress | Optimize instance size/performance ratio |
| **Cloud Run Optimization** | In progress | Review memory/CPU allocation |
| **Memorystore for Redis** | Proposed | Evaluate for caching/session management |

**Owner**: Chien-san (details to be communicated 2025/11/21).

### Staging Environment (STG) Buildout

**Timeline**: Week of 2025/11/24 (following week after SPRINT 13 finish).

**Workflow**:
1. GW: Provide Static IP + SSL Certificate
2. LIXIL: Configure A Record + AkamaiWAF
3. MOR: Build LoadBalancer using **Terraform** (specific-product portion completed by 2025/11/21)

**Status**: Terraform for specific-product ready; full STG env deployment planned for early next week.

---

## Production Environment Planning (SPRINT 17 - 2026/01/09)

### Updated Production Infrastructure Buildout Timeline

**Status**: GCP project creation requested, plan accelerated

**New Timeline**:
- **Original**: 19/1 ~ 28/1 (SPRINT 18)
- **Updated**: **12/1 ~ 19/1** (1 week earlier)

**Reason for Acceleration**:
- This week (SPRINT 17) will complete:
  - Cloud Function: kinken-product-search-import-data, kinken-sitemap
  - ETL: Add data for filter condition
- IAC update and deployment to STG/PROD environments

**Components to Build**:
| Component | Status | Notes |
|-----------|--------|-------|
| Elasticsearch | Planned | Production instance on Elastic Cloud |
| Databricks | Planned | Production workspace for ETL |
| SSL Certificate | Planned | Via Akamai |
| Akamai EdgeWorker | Planned | Same process as staging environment |
| Data Storage | Planned | Bucket, Master Data |
| Environment Variables | Pending | Chien-san to provide list on 12/1 |

**Production Elastic Accounts**:
- Kaz-san: tu.phungvan+lixil-kinken-es-prod@morsoftware.com
- Truong-san: truongnn+lixil-kinken-es-prod@mor.com.vn
- Chien-san: chiennd+lixil-kinken-es-prod@morsoftware.com

### Test Planning (Feb - Apr 2026)

**Test Activities Timeline**:

| Test Type | Timeline | Owner | Focus |
|-----------|----------|-------|-------|
| Performance Evaluation | 31/01 | MOR | Current performance baseline |
| Bug Re-verification | Feb | QC | Re-verify development bugs |
| End-to-End Testing | Feb | QC | Full pipeline validation |
| Load & Performance Testing | Feb | QC | System capacity & response time |
| Security Testing | Feb | QC | Vulnerability assessment |
| Regression Testing | Feb-Mar | QC | Ensure no feature breakage |
| Post-Migration Validation | Mar | QC | Data migration verification |
| UAT Support | Mar-Apr | QC/MOR | Customer acceptance testing |

**UAT Preparation Requirements**:
- Environment setup (Dev, Staging, Production)
- Test data preparation
- Documentation & procedures
- Technical support during UAT
- Feedback collection & tracking

**Updated**: 2026-01-09

## Performance Tuning & Load Testing (SPRINT 21 - 2026/03/13)

### Load Testing Results

**Current Status**: 50% completed (as of 2026/03/06)

**Tested APIs**:
- announcements, Document Search, Document Filter, Google Analytics
- Screens: TOP, #3_Document-list, #16_Product-list, #18_#19_Product-document-list

**Test Scenarios Completed**:
- Keyword search on main screens
- Pickup Mode / Limited Mode verification
- Category/keyword-based document search
- Repeat search verification
- Stress test: 924 concurrent users

**Performance Findings** ⚠️:
- **< 300 users**: Acceptable performance
- **> 300 users**: System begins to slow down
- **Current response time**: 5-6 seconds (target: 3 seconds)
- **Bottleneck identified**: Elasticsearch search performance
- **CPU usage**: 60%+ (higher than expected)

**Remaining Test Scenarios**:
- Common Platform API: Document Count, Document Filter
- Future data volume test (5 years, 10 years): 3/9 - 3/12
- Test time: 18:00 JST (16:00 VNT) ~ (requested adjustment to 15:00 JST / 13:00 VNT)

### Performance Tuning Requirements

**Deadline**: End of March 2026

**Focus Areas**:
1. **Elasticsearch Optimization**
   - Hardware profile review (General Purpose vs Compute Optimized)
   - Query optimization for count/filter operations
   - Index configuration tuning

2. **CloudRun Configuration**
   - Frontend / Backend / Search Platform: Reduce min instances from 2 → 1
   - Memory/CPU allocation review

3. **Infrastructure Review**
   - Environment inspection scheduled for 3/17
   - Pre-review by Chien-san (3/13-3/16)
   - Post-implementation double-check

### Infrastructure Alerts & Security

**Current Issue**:
- alert-lixil-kinken-dev: High error notification volume
- **Suspected cause**: External attacks
- **Proposed solution**: WAF configuration review

**Weekly Meeting Reschedule**:
- **3/20 (Fri)** → **3/23 (Mon) 15:00-16:30 JST** (13:00-14:30 VNT)
- **3/27 (Fri)** → **3/30 (Mon) 15:00-16:30 JST** (13:00-14:30 VNT)

**Updated**: 2026-03-13

## Performance Tuning & Optimization (SPRINT 22 - 2026/03/30)

### Performance Improvement Strategy

**Current Performance Issues**:
- Response time: 5-6 seconds (target: 3 seconds)
- System slows down when > 300 concurrent users
- Elasticsearch identified as main bottleneck
- CPU usage: 60%+ (higher than expected)

**Query Optimization Approaches**:

**Option 1: Retriever Consolidation**
- **Proposal**: Consolidate 12 full-text search retrievers into 1
- **Concern**: Consolidating semantic search retrievers might affect accuracy
- **Recommendation**: Only consolidate full-text retrievers, keep semantic separate
- **Status**: Under evaluation

**Option 2: is_searchable Flag**
- **Proposal**: Add `is_searchable` flag for default conditions
- **Limitation**: Filter conditions change dynamically from UI, hard to consolidate
- **Feasibility**: Only for default conditions

**Option 3: Keyword-Based Search Control**
- **Concept**: Automatic control between "Full-text only" OR "Full-text + Vector (RRF)"
- **Trigger Logic**:
  - If all words ≤ 10 characters: Full-text search only
  - If any word ≥ 11 characters: Full-text + Vector (RRF)
- **Pre-validation**: Evaluate with 2 patterns before consulting LIXIL
- **Benefit**: Optimize performance without sacrificing accuracy

**Option 4: Document Type Exclusion**
- **Scope**: Remove document types that always return 0 results from queries
- **Document Types to Exclude**:
  - 部品 / Parts-search
  - 商品コード / Product-code
  - 電子商品連絡 / Product-update
  - 点検修理手順書 / Maintenance
  - CAD
  - 動画 / Movie
- **Implementation**: 3/24 (Hoang-san, Kaz-san)
- **Status**: ✅ Completed

**Option 5: Elasticsearch Spec Upgrade**
- **Current**: 720 GB storage | 16 GB RAM | 4 vCPU ($1009.728/month)
- **Upgrade**: 1.41 TB storage | 32 GB RAM | 8 vCPU ($1979.712/month)
- **Potential**: Significant performance improvement possible
- **Approach**: Test with existing logic first to measure improvement

**Decision Timeline**: End of March / Early April (critical for release schedule)

### Elasticsearch Configuration Tuning

**Shard Configuration**:
- **Current (during reindex)**: Primary = 4, Replica = 0
- **Reason**: Temporary setting for data update/reindex performance optimization
- **Production**: Primary = 4, Replica = 1 (must restore before load test)

**Index Versioning**:
- **Staging v2 indexes** (with latest dictionaries):
  - documents_v2_20260310_1252
  - products_v2_20260310_1316
- **Status**: Team evaluating search results, alias swap planned

### Debug & Monitoring

**Performance Logging**:
- FE: performance/v1 branch
- BE: feature/performance-log branch
- **Purpose**: Identify bottlenecks and processing delays
- **Execution**: 3/23 on Dev environment

**Updated**: 2026-03-30

## Release Timeline & Infrastructure (SPRINT 23 - 2026/04/10)

### Release Schedule

**1st Release**: 2026-05-13 (Wednesday) - LIXIL Internal Users Only

**2nd Release**: 2026-06-10 (Wednesday) - Partner, Business, LTS ME, Internet

### Infrastructure Spec Finalization

**Load Test Results**: ✅ Completed and confirmed

**CloudRun Configuration**:
- **May 2026 (Internal release)**: min 1 instance sufficient
- **June 2026 (External release)**: Evaluate based on May usage, potentially min 2 instances

**Staging Spec Management**:
- **4/10**: Upgraded to production-equivalent for LIXIL presentation (4/15)
- **4/16**: Downgraded back to documented spec
- **Purpose**: Ensure smooth performance for client demonstrations

### Performance Status

**Current Response Time**: 1.5 seconds (baseline achieved)

**Improvement**: From 5-6 seconds (SPRINT 21) to 1.5 seconds (SPRINT 23)

**Factors Contributing**:
1. Elasticsearch spec upgrade
2. Query optimization (No.1 & No.2 measures)
3. Document type exclusion from queries

### Data Migration & Sync Schedule

**UUID Migration Completion**:
- **Staging**: 4/8 ✅
- **Production**: 4/9 ✅

**Production Data Sync**:
- **4/13**: Start automatic PIM production data sync
- **4/14**: Start automatic non-PIM production data sync
  - Product-update, Maintenance, FAQ, Question (excluding Parts-search)
  - Product-code (MDM): 4/13 full import, 4/14 start diff imports

**Databricks Cost Estimation**:
- **Method**: Use 1 document from 4/13 diff data as 1-month sample
- **Formula**:
  - PROD monthly = sample cost × 0.7
  - DEV monthly = sample cost × 0.1  
  - STG monthly = sample cost × 0.2
- **Status**: Requesting LIXIL access to Databricks cost dashboard

### Known Issues & Solutions

**Filter Condition Display Issue**:
- **Problem**: Occasionally filter conditions don't display on dev environment
- **Root Cause**: Suspected Backend or ES timeout (~10 seconds)
- **Proposed Solutions**:
  1. Merge list search and filter retrieval APIs
  2. Increase timeout duration
  3. Display error message (Toast) if API fails

**OpenAI Degraded Mode Handling**:
- **Status**: Not started (prioritizing other tasks)
- **Plan**: Start 4/8-4/9, complete by 4/15

**Updated**: 2026-04-10
