---
name: project_kinken_data_integration_overview
description: KINKEN data integration overview - 13 data sources, structured/unstructured data flow, PIM integration rules, and collection platform architecture.
type: project
updated: 2026-05-05
---

# KINKEN Data Integration Overview

**Updated**: 2026-05-05  
**Source**: Interface List files from workspace

> **Note**: File này là **overview của data integration architecture**. Chi tiết từng component xem ở các file chuyên biệt:
> - [Physical Model Schema](physical_model_schema.md) - Database schema
> - [Document Subtype Tables](document_subtype_tables.md) - Document type schemas
> - [Data Flow](data_flow.md) - ETL pipeline details
> - [Tech Stack](tech_stack.md) - Technology choices

---

## 1. Data Collection Platform Architecture

### GCP Infrastructure
| Component | Name Pattern | Purpose |
|-----------|--------------|---------|
| **GCP Project** | `lixil-kinken-{env}` | Main project for KINKEN |
| **GCS Bucket (Collection)** | `lixil-kinken-collection-{env}` | Structured data from PIM and other systems |
| **GCS Bucket (Docs)** | `lixil-kinken-docs-{env}` | Unstructured document files (PDFs, images) |
| **GCS Bucket (Public Docs)** | `lixil-kinken-docs-public-{env}` | Publicly accessible documents (no auth required) |

### Structured Data Placement Rules
| Document Type | Source | Method | GCS Path | File Name Pattern | Status |
|--------------|--------|--------|----------|-------------------|--------|
| **Products** | PIM | PUSH | `/product/structure/` | `mpi_product_master-yyyy-mm-dd_hh.mm.ss.csv` | Staging connectivity complete |
| **Manuals** | PIM | PUSH | `/description/structure/` | `mpi_manual_doc-yyyy-mm-dd_hh.mm.ss.csv` | Staging connectivity complete |
| **Drawings** | PIM | PUSH | `/zumen/structure/` | `mpi_drawing_doc-yyyy-mm-dd_hh.mm.ss_{category}.csv` | Staging connectivity complete |
| **Technical Docs** | PIM | PUSH | `/technical/structure/` | `mpi_technical_doc-yyyy-mm-dd_hh.mm.ss.csv` | Staging connectivity complete |
| **Web Catalogs** | PIM | PUSH | `/webcatalog/structure/` | `mpi_catalog_data-yyyy-mm-dd_hh.mm.ss.csv` | Staging connectivity complete |
| **CAD** | PIM | PUSH | `/cad/structure/` | `mpi_cad_bim_data-yyyy-mm-dd_hh.mm.ss.csv` | Staging connectivity complete |
| **FAQs** | Product QA | PUSH | `/faq/structure/` | `faq_yyyymmddhhmm.csv` | Production release complete |
| **Past Q&A** | Product QA | PUSH | `/question/structure/` | `questions_yyyymmddhhmm.zip` | Production release complete |
| **Videos** | LIXIL-X | Manual PUSH | `/movie/structure/` | `movie_yyyymmdd.csv` | Manual integration |
| **Parts** | Parts Search Pro | PUSH | `/parts-search/structure/` | `parts_export_{YYYYMMDDhhmmss}.csv` | Feb 2026 production release |
| **Product Updates** | Product Update DB | PULL | `/product-update/structure/` | - | Pull-based |
| **Maintenance** | Maintenance DB | PULL | `/maintenance/structure/` | - | Pull-based |
| **Product Codes** | MDM | PULL | `/product-code/structure/` | - | Pull-based |

### Unstructured Data Placement Rules
| Document Type | Root Path | File Type | File Name Pattern | Notes |
|--------------|-----------|-----------|-------------------|-------|
| **Drawings** | `/zumen` | All | `/files/{drawing_no}.pdf` | New files after go-live |
| **Drawings (Migration)** | `/zumen` | All | `/files/old/{PIM_filename}` | Migration files (if filename exists in structured data) |
| **Drawings (Migration)** | `/zumen` | All | `/files/old/{PIM_drawing_id}.pdf` | Migration files (if filename empty) |
| **Technical Docs (Auth)** | `/technical` | Non-HTML | `/files/mpi/{tech_doc_id}.{ext}` | Requires auth |
| **Technical Docs (Auth)** | `/technical` | Non-HTML | `/files/bil/{tech_doc_id}.{ext}` | Requires auth |
| **Technical Docs (Auth)** | `/technical` | Non-HTML | `/files/frt/{tech_doc_id}.{ext}` | Requires auth |
| **Technical Docs (Auth)** | `/technical` | Non-HTML | `/files/hmpb/{tech_doc_id}.{ext}` | Requires auth |
| **Technical Docs (Auth)** | `/technical` | HTML | `/html/{tech_doc_id}/****.html` | Requires auth |
| **Technical Docs (Public)** | `/technical-public` | All | `/files/{tech_doc_id}.{ext}` | No auth required (moved to public bucket) |
| **Web Catalogs** | `/webcatalog` | All | `/files/{catalog_code}/{catalog_code}_{0000}.pdf` | 4-digit zero-padded page numbers |

---

## 2. PIM Document URL Mapping Rules

### Drawing URL Mapping
| Original URL Pattern | Mapped URL (Internal/Partner) | Mapped URL (Business/General) | Rule |
|---------------------|-------------------------------|-------------------------------|------|
| `http://sas6.intra.tostem.co.jp/techlib_dl/default.aspx?P1=0020` | `https://{domain}/i/docs/zumen/files/old/{filename}` | `https://{domain}/e/docs/zumen/files/old/{filename}` | Use filename if not empty |
| Same as above | `https://{domain}/i/docs/zumen/files/old/{drawing_id}.pdf` | `https://{domain}/e/docs/zumen/files/old/{drawing_id}.pdf` | Use drawing_id if filename empty |

### Technical Document URL Mapping
| Original URL Pattern | Mapped URL (Internal/Partner) | Mapped URL (Business/General) | Rule |
|---------------------|-------------------------------|-------------------------------|------|
| `https://www2.lixil.co.jp/rp/dfw/lixila1330ex/metalproductinfo/files/technical/document` | `https://{domain}/i/docs/technical/html/{tech_doc_id}/****.html` | `https://{domain}/e/docs/technical/html/{tech_doc_id}/****.html` | Remove pattern prefix, append new prefix |
| `../../files/technical/document/` | `https://{domain}/i/docs/technical/files/mpi/{filename}` | `https://{domain}/e/docs/technical/files/mpi/{filename}` | Remove pattern prefix, append new prefix |
| `../../files/technical/document_bil/` | `https://{domain}/i/docs/technical/files/bil/{filename}` | `https://{domain}/e/docs/technical/files/bil/{filename}` | Remove pattern prefix, append new prefix |
| `../../files/technical/document_frt/` | `https://{domain}/i/docs/technical/files/frt/{filename}` | `https://{domain}/e/docs/technical/files/frt/{filename}` | Remove pattern prefix, append new prefix |
| `../../files/technical/document_hmpb/` | `https://{domain}/i/docs/technical/files/hmpb/{filename}` | `https://{domain}/e/docs/technical/files/hmpb/{filename}` | Remove pattern prefix, append new prefix |

### Key Mapping Principles
1. **User-type-specific URLs**: Separate URLs for internal/partner vs business/general users
2. **Filename vs ID fallback**: Use filename if available, fallback to document ID
3. **Pattern removal**: Remove old system URL patterns, append new KINKEN patterns
4. **Path preservation**: Maintain document hierarchy in new URL structure

---

## 3. Data Integration Matrix (13 Data Sources)

| # | Data Type | Source System | Structured Data | Unstructured Data | Update Frequency | Update Method | Key Changes Required |
|---|-----------|---------------|-----------------|-------------------|------------------|---------------|----------------------|
| 1 | **Products** | PIM | PUSH to GCS | None (thumbnails may need migration) | 3x daily (8am, 12pm, 4pm) | Delta (product_code) | New format, delta export |
| 2 | **Manuals** | PIM | PUSH to GCS | PDFs from DAM system | 3x daily | Delta (manual_doc_id) | New format, DAM access route |
| 3 | **Drawings** | PIM | PUSH to GCS | PDFs from Product Info DB | 3x daily | Delta (drawing_doc_id) | New format, file server migration |
| 4 | **Technical Docs** | PIM | PUSH to GCS | Files from KINKEN server | 3x daily | Delta (tech_doc_id) | New format, PowerPoint → PDF conversion |
| 5 | **Web Catalogs** | PIM | PUSH to GCS | PDFs from AWS S3 | 3x daily | Delta (catalog_code) | New format, S3 → GCS migration |
| 6 | **CAD** | PIM | PUSH to GCS | None | Daily | Delta (cad_doc_id) | New format |
| 7 | **Product Updates** | Product Update DB | PULL from DB | PDFs from file server | Daily | Delta (ID) | VPC Connect for file server access |
| 8 | **Maintenance** | Maintenance DB | PULL from DB | PDFs from file server | Daily | Delta (ID) | VPC Connect for file server access |
| 9 | **FAQs** | Product QA | PUSH to GCS | None | Daily | Delta (faq_id) | New format |
| 10 | **Past Q&A** | Product QA | PUSH to GCS | None | Daily | Incremental | New format |
| 11 | **Videos** | LIXIL-X | Manual CSV upload | None | As needed | Full | Manual process (LIXIL operator) |
| 12 | **Parts** | Parts Search Pro | PUSH to GCS | None | Daily (on change) | Full | New format |
| 13 | **Product Codes** | MDM | PULL from server | None | Daily | Delta (product_code) | Public key authentication |

---

## 4. Key Integration Patterns

### PUSH vs PULL Architecture
| Pattern | Used For | Advantages | Disadvantages |
|---------|----------|------------|---------------|
| **PUSH** | PIM, Product QA, Parts Search Pro | Source controls timing, simpler for KINKEN | Source system must support new format |
| **PULL** | Product Update, Maintenance, MDM | KINKEN controls timing, no source changes | Requires direct DB/file server access |
| **Manual** | Videos (LIXIL-X) | No system changes required | Operational overhead, error-prone |

### Delta vs Full Updates
| Method | Used For | Key Field | Rationale |
|--------|----------|-----------|-----------|
| **Delta** | Products, Manuals, Drawings, etc. | Document ID | Reduces data volume, faster processing |
| **Full** | Parts, Videos | N/A | Small datasets, infrequent changes |
| **Incremental** | Past Q&A | Completion date | Only completed Q&A, no updates after completion |

### Network Connectivity
| Source System | Connectivity Method | Notes |
|---------------|---------------------|-------|
| **PIM** | Internet | GCS bucket access |
| **Product QA** | GCP Project | Same GCP environment |
| **Product Info DB** | VPC Connect | Intranet file server |
| **DAM System** | Internet | PDF download required for OCR |
| **AWS S3** | Internet | S3 → GCS migration |
| **MDM** | SCP with public key | Secure file transfer |

---

## 5. Unstructured Data Reference Patterns

### Reference Methods by Document Type

| # | Reference Method | File Type | Document Type | Source (Current) | Source (New) | Migration Required | Notes |
|---|------------------|-----------|---------------|------------------|--------------|-------------------|-------|
| 1 | URL | PDF | Manuals | DAM System | DAM System | No | Asset data centralized in DAM |
| 2 | URL | PDF | Manuals | Terra File Server | New System GCS | Yes | Old server migration |
| 3 | File Reference | TIFF Images | Manuals | Terra File Server | New System GCS | Yes | - |
| 4 | URL | PDF | Drawings | Product Info DB Server | Product Info DB Server | No | Requires VPC Connect |
| 5 | URL | PDF | Drawings | Terra File Server | New System GCS | Yes | - |
| 6 | File Reference | TIFF Images | Drawings | Terra File Server | New System GCS | Yes | - |
| 7 | URL | PDF | Technical Docs | KINKEN Server | New System GCS | Yes | - |
| 8 | URL | Spreadsheet | Technical Docs | Google Sheets | Google Sheets | No | Public spreadsheets |
| 9 | URL | Excel (xls, xlsx) | Technical Docs | KINKEN Server | New System GCS | Yes | Source for HTML pages |
| 10 | File Reference | Excel | Technical Docs | KINKEN Server | New System GCS | Yes | - |
| 11 | File Reference | PowerPoint | Technical Docs | KINKEN Server | New System GCS | Yes | Convert to PDF (1 file only) |
| 12 | File Reference | TIFF Images | Technical Docs | KINKEN Server | New System GCS | Yes | 1 tech doc, 5 manuals, 94 drawings |
| 13 | File Reference | PDF | Product Updates | Product Update File Server | Product Update File Server | No | VPC Connect access |
| 14 | File Reference | PDF | Maintenance | Maintenance File Server | Maintenance File Server | No | VPC Connect access |
| 15 | URL | PDF | Web Catalogs | SAGAS S3 | New System GCS | Yes | Vendor uploads to GCS |

### File Type Consolidation

| Reference Method | File Type | Storage Location | Notes |
|------------------|-----------|------------------|-------|
| URL | PDF | New System GCS | - |
| File Reference | TIFF Images | New System GCS | Keep as images (not PDF) |
| File Reference | CSV | New System GCS | - |
| File Reference | Excel (xls, xlsx) | New System GCS | - |
| File Reference | PowerPoint (ppt, pptx) | New System GCS | Convert to PDF |
| URL | Spreadsheet | Google Sheets | Public spreadsheets only |
| File Reference or URL | PDF | DAM System | Internet access |
| File Reference or URL | PDF | Product Info DB Server | VPC Connect (OCR excluded) |
| File Reference | PDF | Product Update File Server | VPC Connect |
| File Reference | PDF | Maintenance File Server | VPC Connect |

---

## 6. OCR Document Processing Rules

### Manuals OCR Rules

| URL Pattern | OCR Target Derivation Rule | Sample |
|-------------|---------------------------|--------|
| `https://assets.lixil.com` | Use document URL directly (publicly accessible) | - |
| Other patterns | OCR excluded, structured data only | - |

### Technical Documents OCR Rules

| URL Pattern | OCR Target Derivation Rule | Sample |
|-------------|---------------------------|--------|
| `https://www2.lixil.co.jp/rp/dfw/lixila1330ex/metalproductinfo/files/technical/document` (HTML) | **Pattern A**: If path contains `/` after first segment → Extract tech_doc_id → Find Excel files in `gs://lixil-kinken-docs-{env}/technical/html/{tech_doc_id}/` (including subfolders) | `/IDC0002637/search.html` → tech_doc_id: `IDC0002637` |
| Same as above | **Pattern B**: If path has no `/` after first segment → Extract tech_doc_id from filename → Find `{tech_doc_id}.xls` or `.xlsx` in `gs://lixil-kinken-docs-{env}/technical/html/` | `/IDC0000422.htm` → tech_doc_id: `IDC0000422` |
| `../../files/technical/document/` | Remove pattern prefix → Use filename → Find file in `gs://lixil-kinken-docs-{env}/technical/files/mpi/{filename}` | `../../files/technical/document/IDC0000002.xls` → `gs://.../technical/files/mpi/IDC0000002.xls` |
| `../../files/technical/document_bil/` | Remove pattern prefix → Use filename → Find file in `gs://lixil-kinken-docs-{env}/technical/files/bil/{filename}` | Same pattern as above |
| `../../files/technical/document_frt/` | Remove pattern prefix → Use filename → Find file in `gs://lixil-kinken-docs-{env}/technical/files/frt/{filename}` | Same pattern as above |
| `../../files/technical/document_hmpb/` | Remove pattern prefix → Use filename → Find file in `gs://lixil-kinken-docs-{env}/technical/files/hmpb/{filename}` | Same pattern as above |
| `https://docs.google.com/spreadsheets` | Use spreadsheet URL directly (publicly accessible) | - |
| `https://assets.lixil.com` | Use document URL directly (publicly accessible) | - |
| `i/docs/technical/files/mpi/` | Remove pattern prefix → Use filename → Find file in `gs://lixil-kinken-docs-{env}/technical/files/mpi/{filename}` | Added 2026/05/01 |
| `i/docs/technical/files/bil/` | Remove pattern prefix → Use filename → Find file in `gs://lixil-kinken-docs-{env}/technical/files/bil/{filename}` | Added 2026/05/01 |
| `i/docs/technical/files/frt/` | Remove pattern prefix → Use filename → Find file in `gs://lixil-kinken-docs-{env}/technical/files/frt/{filename}` | Added 2026/05/01 |
| `i/docs/technical/files/hmpb/` | Remove pattern prefix → Use filename → Find file in `gs://lixil-kinken-docs-{env}/technical/files/hmpb/{filename}` | Added 2026/05/01 |
| `i/docs/technical/html` | Same as HTML pattern above | Added 2026/05/01 |
| `public-docs/technical/files/` | Remove pattern prefix → Use filename → Find file in `gs://lixil-kinken-docs-public-{env}/technical/files/{filename}` | Added 2026/05/01 |
| `public-docs/technical/html` | Same as HTML pattern but use `lixil-kinken-docs-public-{env}` bucket | Added 2026/05/01 |
| Other patterns | OCR excluded, structured data only | - |

### Web Catalogs OCR Rules

| URL Pattern | OCR Target Derivation Rule | Sample |
|-------------|---------------------------|--------|
| All patterns | Use `catalog_code` from structured data → Find files matching `gs://lixil-kinken-docs-{env}/webcatalog/files/{catalog_code}/{catalog_code}_{0000}.pdf` | catalog_code: `0051` → `/webcatalog/files/0051/0051_0001.pdf` ~ `0051_0076.pdf` |

### Product Updates OCR Rules

| URL Pattern | OCR Target Derivation Rule | Sample |
|-------------|---------------------------|--------|
| All patterns | Use `tenpu_file_mei` from structured data → Reference file via VPC Connect → Pre-fetch in Collection batch | - |

### Maintenance OCR Rules

| URL Pattern | OCR Target Derivation Rule | Sample |
|-------------|---------------------------|--------|
| All patterns | Use `filepath` from structured data → Reference file via VPC Connect → Pre-fetch in Collection batch | - |

### OCR Processing Notes
- **Empty document_url**: OCR excluded, structured data only
- **HTML files with non-.htm/.html extension**: OCR excluded, error log generated for operational monitoring
- **Interface field reference**: See [Interface Definition](https://docs.google.com/spreadsheets/d/1X1XMsA5uVbLh5Lo6UVEDjE7ooiVUXW_J9A8UFUatnhE/edit?gid=1993979645#gid=1993979645&range=G2)

---

## 7. Interview Talking Points

### Data Collection Platform Design
> "We use GCP as our data hub with three buckets: collection for structured data, docs for auth-protected files, and public-docs for freely accessible content. This separation ensures proper access control while maintaining performance."

### PIM Integration Strategy
> "PIM pushes structured data 3x daily using delta updates. We track changes by document ID, not timestamps, ensuring reliable change detection even with clock skew."

### URL Mapping Complexity
> "PIM document URLs require complex mapping. We handle filename vs ID fallback, user-type-specific URLs, and pattern removal. This ensures seamless transition from old to new system URLs."

### Hybrid PUSH/PULL Architecture
> "We use PUSH for systems that can export data (PIM, QA), PULL for databases we need to query directly (product updates, maintenance), and manual for one-off sources (videos). This balances control with implementation complexity."

### File Migration Strategy
> "Unstructured files migrate from various sources: DAM system for manuals, product info DB for drawings, AWS S3 for web catalogs. We use VPC Connect for intranet access and maintain original file hierarchy."

### Delta Update Implementation
> "Delta updates use document IDs as keys, not timestamps. This prevents missed updates due to timezone issues or system clock differences. Source systems export only changed records."

### User-Type URL Generation
> "We generate separate URLs for internal/partner vs business/general users. This allows different access paths and authentication requirements per user type while maintaining single source of truth."

### Unstructured Data Reference Patterns
> "We support multiple reference methods: URL references for publicly accessible files, file references for VPC-protected content. Technical documents have complex patterns - HTML files reference Excel sources, which we extract for OCR processing."

### OCR Document Processing Strategy
> "OCR processing varies by document type. Manuals from DAM are processed directly. Technical documents require pattern matching to find Excel sources behind HTML pages. We handle two patterns: subfolder-based (Pattern A) and flat-file (Pattern B). Empty URLs skip OCR but keep structured data."

### File Type Consolidation
> "We standardized on PDF for most documents. PowerPoint converts to PDF (only 1 file). TIFF images stay as-is for quality. This reduces processing complexity while maintaining document fidelity."

### VPC Connect for Legacy Systems
> "Product updates and maintenance docs live on intranet file servers. We use VPC Connect for secure access and pre-fetch files in Collection batch. This avoids runtime latency while maintaining security boundaries."

---

## 8. Key Decisions

| Decision | Rationale |
|----------|-----------|
| **GCP as data hub** | Centralized storage, integrates with other GCP services |
| **Three-bucket separation** | Clear access control boundaries |
| **PUSH for PIM** | PIM controls export timing, simpler for KINKEN |
| **PULL for databases** | Direct query access, no source system changes |
| **Delta updates by ID** | Reliable change detection, reduces data volume |
| **User-type-specific URLs** | Different auth requirements per user type |
| **VPC Connect for intranet** | Secure access to internal file servers |
| **Manual video integration** | Low volume, operational acceptable |
| **PowerPoint → PDF conversion** | Standardizes document format for processing |
| **Public bucket for auth-free docs** | Performance optimization for public content |
| **Multiple reference patterns** | Flexibility for different document sources |
| **OCR pattern matching** | Handles complex HTML-to-Excel relationships |
| **Pre-fetch VPC files** | Avoids runtime latency for intranet access |
| **TIFF images preserved** | Maintains quality for technical drawings |
| **Filename vs ID fallback** | Handles missing filename gracefully |

---

## 9. Related Documents

- [Physical Model Schema](physical_model_schema.md) - Database schema populated by this data
- [Document Subtype Tables](document_subtype_tables.md) - Document type schemas
- [Data Flow](data_flow.md) - ETL pipeline processing this data
- [Tech Stack](tech_stack.md) - Technology implementation details
- [Technical Architecture Overview](technical_architecture_overview.md) - Overall system architecture