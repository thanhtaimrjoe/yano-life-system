---
name: project_kinken_milestones
description: Key milestones, decisions, and timeline for KINKEN project.
type: project
---

# KINKEN Project Milestones

## Timeline Overview

```
2025 Q2: Foundation & Planning
2025 Q3: Design & PoC Development
2025 Q4: Development & Testing
2026 Q1: System Test & PROD Preparation
2026 Q2: PROD Release (SPRINT 25)
```

## Key Decisions Timeline

| Date | Decision | Impact |
|------|----------|---------|
| 2024/12 | **Hybrid Search Strategy** | Established methods to combine Semantic & Keyword search scores |
| 2025/05-06 | **Documentation Strategy** | Avoid double maintenance, use Markdown over Excel |
| 2025/05-06 | **ETL Evaluation** | Compare Databricks vs Data Fusion vs Dataflow |
| 2025/05-06 | **Clean Architecture** | Standardize backend development pattern |
| 2025/08 | **API Architecture** | Choose REST over GraphQL/gRPC |
| 2025/08 | **Search Approach** | Hybrid (morphological + semantic) with RRF |
| 2025/08 | **Authentication Model** | Multi-tier: Azure/EntraID, EAA, MyLIXIL |
| 2025/08 | **ETL Strategy** | Databricks for analysis, Data Fusion for ingest |
| 2025/08 | **MySQL/InnoDB Selection** | RDB engine chosen based on MOR team experience + open-source community |
| 2025/08 | **GCS Bucket Strategy** | Separated `xxxx-dev` and `xxxx-local` for environment isolation |
| 2025/08 | **Monday Ticket Protocol** | Status change requires comment, artifact links, reviewer as Owner |
| 2025/09 | **Training Camp (Gasshuku)** | Week 09/08-09/12: Onboarding new members, MOR presents design phase results |
| 2025/09 | **PoC Benchmark Issue** | Non-deterministic vector search identified |
| 2025/09 | **Document Preview** | React-PDF for PDF, Office files problematic |
| 2025/10-12 | **Development Phase** | Core feature implementation |
| 2026/01-03 | **System Testing** | UI/API/DB/ES layer testing |
| 2026/04 | **PROD Preparation** | Final testing, performance tuning |

## Critical Case Studies

### 1. PoC Benchmark Discrepancy (SPRINT 6)

**Problem**: Search results differed between old and new PoC despite same data.

**Root causes**:
1. Embedding vector non-determinism
2. HNSW algorithm randomness
3. ES version mismatch (not recorded)

**Lesson learned**: Always lock and record infrastructure versions.

**Impact**: Established version control protocol for all infrastructure components.

### 2. ETL Tool Selection (SPRINT 4)

**Options evaluated**:
- **Databricks**: Strong analysis, weak ingest
- **Cloud Data Fusion**: Strong ingest, high cost, low-code
- **Cloud Dataflow**: Real-time/batch, high learning curve

**Decision**: Databricks for ETL/analysis, Data Fusion for ingest.

**Rationale**: Leverage existing team skills, cost-effective for batch processing.

### 3. API Architecture (SPRINT 7)

**Options**:
- **GraphQL**: Flexible queries, but N+1 problem, poor caching
- **gRPC**: Fast, but browser debugging difficult
- **REST**: Good enough, excellent caching, easy debugging

**Decision**: REST API.

**Rationale**: Fits client-server model, leverages HTTP caching, easier maintenance.

### 4. Authentication Strategy

**User types**:
- Internal: Azure/EntraID
- Partner: EAA
- Business: MyLIXIL
- General: Public browsing only

**Decision**: Multi-tier authentication with API Gateway (Apigee) enforcement.

**Impact**: Secure, scalable access control for different user groups.

## Technical Debt Decisions

| Decision | Trade-off |
|----------|-----------|
| **No Office file preview** | Avoid complex conversion, focus on PDF |
| **Delta update over full reindex** | Faster updates, but more complex logic |
| **Hybrid search (RRF)** | Better results, but higher computational cost |
| **Two API layers** | Simplicity vs flexibility trade-off |

## QA Perspective Milestones

| Date | QA Focus | Outcome |
|------|----------|---------|
| 2025/08 | **Filter logic validation** | Edge cases identified, test cases created |
| 2025/09 | **Document link testing** | Broken links fixed, redirect logic validated |
| 2025/10 | **ES behavior testing** | Search accuracy benchmarks established |
| 2025/11 | **Data validation** | Data quality issues identified and fixed |
| 2026/01 | **Performance testing** | Response time targets validated |
| 2026/03 | **Regression testing** | Pre-PROD full regression suite executed |

## BrSE-Specific Milestones

| Date | BrSE Activity | Outcome |
|------|---------------|---------|
| 2025/06 | **Document translation** | Technical docs translated JP ↔ EN ↔ VN |
| 2025/08 | **Requirement clarification** | Ambiguous specs clarified with GW |
| 2025/09 | **Stakeholder communication** | Regular updates between MOR and LIXIL |
| 2025/10 | **Technical explanation** | Complex concepts explained to non-technical stakeholders |
| 2026/01 | **Progress reporting** | Sprint progress translated and reported |

## Production Environment Milestones (SPRINT 17 - 2026/01/09)

| Date | Milestone | Status | Notes |
|------|-----------|--------|-------|
| 2025/12/26 | GCP Project creation requested | In progress | Initial request |
| 2026/01/09 | Production timeline accelerated | Updated | From 19/1-28/1 → 12/1-19/1 |
| 2026/01/12 | Environment variables list provided | Planned | Chien-san to provide |
| 2026/01/12-19 | Production environment buildout | Planned | Updated timeline |
| 2026/01/13 | LIXIL Steering Committee presentation | Planned | Status report to stakeholders |
| 2026/01/31 | Performance evaluation deadline | Planned | Current performance baseline |
| 2026/02 | Test activities start | Planned | E2E, Load, Security, Regression |
| 2026/03-04 | UAT support | Planned | Customer acceptance testing |

### Test Planning Milestones (Feb - Apr 2026)

| Test Phase | Timeline | Key Activities |
|------------|----------|----------------|
| **Performance & Bug** | Feb 2026 | Performance evaluation, bug re-verification |
| **System Testing** | Feb 2026 | E2E, Load & Performance, Security testing |
| **Regression & Validation** | Feb-Mar 2026 | Regression testing, post-migration validation |
| **UAT Support** | Mar-Apr 2026 | Customer acceptance testing, feedback collection |

### Bug Lifecycle Process Established

**Definition of "Done"**:
1. Code fixed and merged to main branches
2. Complete documentation: Root cause, Solution, Impact, Evidence
3. Deployed to Dev, Staging, Production environments
4. QC verified on all environments
5. No regression on related features

**Process Steps**:
1. Bug confirmation → 2. Monday update → 3. Chien-san review → 4. Dev fix → 5. PR review → 6. QC verification → 7. Deployment planning → 8. LIXIL confirmation

**Quality Assurance Measures**:
- Clear priority classification
- Daily sync meetings
- OT (Overtime) for schedule acceleration
- Round 1 quality check planning

### LIXIL Steering Committee Requirements (13/1/2026)

**Demo Scope**:
- Document List screen with search accuracy validation
- Product List screen functionality
- Product Document List screen with tab display
- Product Search (minimum 1 exterior product type)

**Critical Prerequisites**:
1. v1.3 data import completed
2. Filter controls operational on all 3 screens
3. Product document list tabs displaying correctly
4. Minimal bugs, all screens operational

### Production Infrastructure Components

| Component | Timeline | Notes |
|-----------|----------|-------|
| GCP Project | 2025/12 - 2026/01 | Creation requested |
| Elasticsearch | SPRINT 18 (19/1-28/1) | Production instance |
| Databricks | SPRINT 18 (19/1-28/1) | Production workspace |
| SSL/Akamai EdgeWorker | SPRINT 18 (19/1-28/1) | Same process as staging |
| Data Migration | Before release | Test data → Clear → Production data |

## Future Milestones (To be updated)

| Sprint | Planned Activities |
|--------|-------------------|
| SPRINT 17-19 | Production environment setup, data migration planning |
| SPRINT 20-25 | PROD preparation, performance tuning, security audit |
| Post-release | Monitoring, bug fixes, feature enhancements |
