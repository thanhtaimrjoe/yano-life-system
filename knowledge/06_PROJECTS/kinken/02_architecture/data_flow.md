---
name: project_kinken_data_flow
description: KINKEN data pipeline from PIM to UI, including ETL process and data transformation.
type: project
---

# KINKEN Data Flow

## High-Level Pipeline
### GCS Bucket Transfer Architecture
Files flow between buckets before being processed by Databricks:
- **Service**: Google Cloud Storage Transfer Service.
- **Flow**: Collection Bucket (Raw) -> ETL Bucket (Ready for Databricks).
- **Transformation**: Path mapping is ideally handled by the source (PIM). If source cannot change path structure, a **Cloud Function** will be used as a custom transfer agent to remap directory structures.

```
PIM → CSV Export → Cloud Storage (GCS) → Databricks ETL → PostgreSQL → Elasticsearch → API → UI
```

## Data Sources

| Source | Data Type | Volume |
|--------|-----------|--------|
| PIM (Product Information Management) | Product master data | ~8.8M records |
| QA Database | Quality assurance records | ~1.7M records |
| Document Storage | PDF/HTML documents | ~13M documents |

## ETL Process (Databricks)

### Extract
- Pull data from PIM via CSV export
- Fetch QA records from legacy database
- Collect document metadata from storage

### Transform
- Standardize format from PULL to PUSH structure
- Clean and validate data quality
- **Chunking Strategy**: For long unstructured text, split text into chunks based on Embedding Model token limits.
- Generate embeddings for semantic search (OpenAI text-embedding-3-large) - allowing multiple vectors per single record.
- Apply kuromoji tokenization for Japanese text - storing chunked morphological text as an array in a single field.

### Load
- **File Tracking Logic**: Uses `etl_tracking` table to detect diff files in buckets. Note: Overwriting existing files with same name will NOT trigger update.
- **Unified Job (End-to-End)**: Integrated OCR, Chunking, and Embedding into the main Bronze -> ES/RDB pipeline for system testing consistency.
- Index into Elasticsearch with proper mapping
- Store normalized data in PostgreSQL
- Maintain document links in GCS

## Key Transformation Decisions

| Decision | Rationale |
|----------|-----------|
| Delta Update vs Full Reindex | Prefer delta for efficiency; full reindex only when schema changes |
| Embedding generation | Done during ETL, not real-time, to reduce API latency. Text is chunked so 1 DB record = Multiple vectors in Index |
| Index alias strategy | Enables zero-downtime reindexing |
| AI Outage Fallback | If OpenAI is down, stop all processing from Embedding step onwards (do not ingest partial data). Rerun the process once the service recovers. |
| Cross-Environment Mapping | Use Natural Keys (String codes) in Bronze. Transform to Surrogate Keys (System IDs) in Silver. Re-run mapping jobs in each environment to handle ID mismatch between Dev/Stg/Prod. |

## Dictionary Management & Index Versioning (SPRINT 13)

### SPRINT 14 Updates (During Sprint)

- **Synonym Dictionary**: Updated based on GW priority; full reindex scheduled for v1.4 (see SPRINT 14 plan). Boost score for exact ID match (KINKEN-427) applied in new index version.
- **Bug Fix**: Document‑list screen 図面 tab zero‑result issue (KINKEN-491) resolved; permission controls adjusted.
- **API Key Management**: Confirmed no dedicated DB needed; values stored in environment variables and accessed via Apigee.
- **Common Search Platform IF**: GW to finalize interface definition by 2025‑12‑05.
- **Next Steps**: Prepare reindex plan for v1.4, incorporate synonym changes, run benchmark tests (MOR) post‑deployment.

---

## Key Transformation Decisions

### Dictionary Types & Reflection Status

| Dictionary Type | Reflected in Index | Reflected in Query | Reindex Required |
|-----------------|-------------------|-------------------|------------------|
| **Morphological Dictionary (形態素辞書)** | ✅ Yes | ✅ Yes | Only on dictionary change |
| **Synonym Dictionary (同義語辞書)** | ❌ Not yet | ❌ Not yet | ✅ Full reindex required |

### SPRINT 15 Decisions (2025/12/12)

#### 1. Elasticsearch Shared Architecture
- **Decision**: ES remains **shared** between UI Search and Common Search Platform in this phase
- **Rationale**: Current scale doesn't justify splitting; consider when MCP or other systems increase usage
- **Future**: Can split when usage patterns clarify

#### 2. API Scope Rationalization
- **Scope Out**: Product List Search API, Product Filter Reference API (no use case identified)
- **Alternative**: Add "product-axis search parameter" to Document Search API request
- **Benefit**: Reuses existing infrastructure, avoids creating new endpoints

#### 3. Synonym Dictionary Handling
- **Issue**: Current synonym definitions may cause unstable search results
- **Action**: MOR to document specific examples → GW to escalate to LIXIL
- **v1.3 Timeline**: Import scheduled from 12/22 after synonym provided (12/19)

### Dictionary Change Operation Protocol

When dictionary data changes (morphological or synonym), the following workflow is required:

**Problem**: Changing dictionary requires full reindex of all existing data. This is unavoidable.

**Solution**: Zero-downtime index versioning with alias switching.

**Workflow**:
1. Create new index version in background (e.g., `documents_v1.3`)
2. Apply updated dictionary settings to new index
3. Execute full reindex from old index → new index (using `_reindex` API)
4. Validate new index data quality
5. Switch alias: `documents` → `documents_v1.3`
6. Delete old index after confirmation

**Execution Time**: To be estimated based on milestone data import results (13M documents baseline).

### Index Version Rollout Strategy (SPRINT 13-15)

| Version | Status | Content | Target |
|---------|--------|---------|--------|
| **document_v1.2** | Completed | Import milestone data; Technical docs completed 11/24; Product-code master deferred (low priority) | QC Team Test completed |
| **document_v1.3** | Planned (SPRINT 16) | Morphological dictionary update (12/22); Full reindex required for vector search field changes (KINKEN-490); Synonym support + Product-code master import | Post-dictionary delivery |

**Current State (as of 2025/12/26 - SPRINT 16 During)**:
- v1.2 data import completed and validated by QC team
- Morphological dictionary expected from LIXIL by 12/22
- v1.3 import scheduled to start 12/22 after dictionary delivery
- **Critical**: Full re-embedding required due to vector search field changes (KINKEN-490)
- OCR/Embedding for existing data: only incremental needed (diff between v1.2 and v1.3)
- Full reindex required for ES indexing with new dictionary

**v1.3 Import Considerations**:
- OCR: Only diff data between v1.2 and v1.3
- Embedding: Full re-vectorization required (KINKEN-490 changed vector search fields)
- Indexing: Full reindex required for morphological dictionary changes
- Estimated timeline: 2-3 days for full process

**SPRINT 16 Focus (2025/12/26)**:
- v1.3 data import must be completed before 2026/01/13 (LIXIL Steering Committee)
- Filter control validation on 3 screens (Doc list, Product list, Product doc list)
- Product document list tab display verification
- Preparation for LIXIL steering committee demo

## Production Data Migration Strategy (SPRINT 21)

### Migration Timeline & Approach

**Target Start**: Early March 2026 (after receiving latest PIM data)

**Data Sources**:
- PIM: Product, Description (取説), Zumen (図面), Technical (技術資料), Web Catalog, CAD
- External connections (pending LIXIL setup): Product-update, Maintenance, Product-code
- Internal preparation: FAQ, Parts-search

**Dictionary Updates**:
- Synonym dictionary: Latest version received
- Userdict: Latest version received
- Will be applied during production import

### Plan [A] - Fresh Import (Preferred)

**Approach**: Import all data fresh into production, no copying from dev

**Timeline**:
- Week 1: Question & Web-catalog full import
- Week 2: Remaining data full import

**Benefits**:
- Clean data state
- No dev/prod data inconsistency
- Simpler process

**Requirements**:
- Sufficient import performance (validated in SPRINT 20)
- All data sources ready

### Plan [B] - Hybrid Import (Fallback)

**Approach**: Copy some data from dev, import rest via ETL

**Process**:
1. Copy Question & Web-catalog from dev → PRODUCTION
   - Layers: raw / Bronze / Silver / Gold / ES
2. Import remaining data via standard ETL process

**Benefits**:
- Faster for already-validated data
- Reduces import time

**Risks**:
- Data consistency between copied and imported data
- More complex process

### Migration Order Considerations

**Issue**: Maintenance data overwrite incident in staging

**Proposed Solution**: Change migration order
- Start with Question / Web-catalog first
- Benefit: Avoid ID conflicts with other document types
- Bronze / Silver / Gold can be imported as-is

**Critical Success Factors**:
1. Detailed process documentation (Chien-san to provide)
2. Pre-migration validation checklist
3. Rollback plan for each data type
4. Post-migration verification tests

### ETL Parallelization - UUID Migration (SPRINT 22)

**Problem**: Multiple ETL jobs cannot run in parallel due to IDENTITY column conflicts

**Root Cause**:
- `id` field uses auto-increment (IDENTITY column) in Delta Lake
- Each insert triggers metadata update for ID allocation
- Concurrent writes cause `MetadataChangedException`
- Jobs must run sequentially, causing scheduling instability

**Solution**: Change `id` from IDENTITY (BIGINT) to UUID (STRING)

**Architecture Change**:
```
Before: id BIGINT (IDENTITY, auto-increment)
After:  id STRING (UUID, unique per record)
```

**Tables Affected** (Silver & Gold layers):
- Core: products, documents
- Document types: description_documents, zumen_documents, technical_documents, webcatalog_documents, cad_documents, faq_documents, question_documents, maintenance_documents, product_update_documents, product_code_documents, movie_documents
- Relations: document_brands, product_labels, webcatalog_products, document_products, product_description_divisions, product_zumen_divisions
- Gold extra: chunks, embeddings, product_index, document_index_fulltext
- Mapping: documents_id_mapping, products_id_mapping, chunks_id_mapping

**Migration Process**:
1. Create new tables with "_new" prefix (id: STRING UUID)
2. Create mapping table (xxx_tmp): id (old), uuid (new)
3. Insert data from old → new, populate mapping table
4. Create backup tables (xxx_backup_YYYYMMDD) for rollback
5. Rename: old → _old, new → original name

**Execution Time**: ~55 minutes per environment

**Timeline**:
- Dev: Complete by 4/2
- Staging/Production: Complete by 4/9

**Benefits**:
- ✅ Parallel job execution enabled
- ✅ Scheduled automation (cron) possible
- ✅ No metadata conflicts
- ✅ Low implementation complexity vs alternatives (partitioning, orchestration changes)

**Impact Scope**:
- Database: Schema update (ETL/RDB)
- Elasticsearch: Mapping/index update
- Backend/Frontend: Type change handling (if id referenced)
- All 3 environments: Data re-import required

## Processing Performance Challenges (Scale: 13M Docs / 8.8M Products)

### Case Study: Web Catalog OCR Bottleneck (SPRINT 19)

**Problem**: Processing ~700,000 files for Web Catalog created a huge bottleneck in the Data Pipeline during the v1.4 full import prep.

**Impact**: Delayed the availability of data for Performance Testing and restricted the ability to run "End-to-End" jobs for unstructured data.

**Mitigation Strategy**: 
1. Separate "Heavy" AI jobs (OCR/Embedding) from "Fast" structured data jobs (PIM import).
2. Provide a mapping table for Testers to run specific jobs manually on Databricks based on data type.

### Case Study: Diff Migration ETL Workaround (SPRINT 23)

**Problem**: During the crunch time of Diff Data Migration before Production release, the AI processing (OCR/Embedding) for 4,000 Technical documents threatened the timeline.

**Mitigation Strategy (Database State Hack)**: 
1. Run pipeline for Technical data up to Silver layer.
2. Manually update tracking DB status from `ready_for_ocr` to `ready_for_gold`.
3. Resume pipeline. This bypassed the slow Unstructured Data processing while successfully importing all Structured Data (Metadata) to the UI.

## Data Consistency Challenges

### ⚠️ Risk: Data Normalization Effort Blowup (SPRINT 10 - KINKEN-234)

**Problem**: Data Normalization Processing task ballooned to **11x original estimate** due to complexity of normalization rules across multiple data sources.

**Impact**: Potential risk to overall development schedule.

**Resolution**:
- MOR reassessed scope and impact.
- Sub-tasks converted to standalone main tasks, re-imported into Monday by GW.

**Lesson**: Complex data normalization tasks need deeper spike/research before estimation.

### Case Study: Dirty Data from External Source (SPRINT 23)

**Problem**: QA team discovered incorrect Part-search data on Production. Root cause was identified as the upstream source providing corrupted data.

**Resolution**: Upstream source provided a full clean data dump. Instead of using Delta Update, the team executed a **Hard Delete** of all existing Parts data on Production before doing a Full Import to prevent logic corruption. (Required extreme caution to not delete cross-table data).

### Case Study: PoC Benchmark Discrepancy

**Problem**: Search results differed between old and new PoC despite same data.

**Root causes investigated**:
1. Embedding vector non-determinism
2. HNSW algorithm randomness in index creation
3. Elasticsearch version mismatch (not recorded in old PoC)

**Lesson learned**: Always lock and record infrastructure versions for reproducibility.

## RDB Selection (SPRINT 4)

| Property | Value |
|----------|-------|
| **Engine** | MySQL (InnoDB) |
| **Rationale** | Strong open-source community support; deep experience within MOR team |
| **Output** | DDL created in SPRINT 4 |

## GCS Bucket Architecture (SPRINT 4)

Processed data collection files stored in GCS with environment separation:

| Bucket | Purpose |
|--------|---------|
| `xxxx-dev` | Shared dev environment |
| `xxxx-local` | Individual developer local testing |

Both buckets reside under `lixil-kinken-dev` project. Developers use GCS for all file handling during local development.
