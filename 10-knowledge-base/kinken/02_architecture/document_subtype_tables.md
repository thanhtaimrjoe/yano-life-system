---
name: project_kinken_document_subtype_tables
description: KINKEN document subtype table schemas - 11 document types (description, zumen, technical, etc.) with specialized fields and search configuration.
type: project
updated: 2026-05-05
---

# KINKEN Document Subtype Tables

**Updated**: 2026-05-05  
**Source**: Physical Model Schema Design_Document Sub Type.csv from workspace

> **Note**: File này là chi tiết **11 loại document tables**. Overview toàn bộ DB schema xem ở [Database Schema Overview](physical_model_schema.md).

---

## Document Subtype Overview

KINKEN supports 11 document types, each with specialized schema and search configuration:

| Document Type | Japanese Name | Table Name | Purpose |
|--------------|---------------|------------|---------|
| **description** | 取説 | description_documents | Product manuals |
| **zumen** | 図面 | zumen_documents | Technical drawings |
| **technical** | 技術資料 | technical_documents | Technical specifications |
| **webcatalog** | WEBカタログ | webcatalog_documents | Web catalogs |
| **cad** | CAD | cad_documents | CAD files |
| **product-update** | 電子商品連絡 | product_update_documents | Product update notifications |
| **maintenance** | 点検修理手順書 | maintenance_documents | Maintenance procedures |
| **movie** | 動画 | movie_documents | Video content |
| **faq** | FAQ | faq_documents | Frequently asked questions |
| **question** | 過去QA | question_documents | Past Q&A |
| **parts-search** | 部品 | parts_search_documents | Parts search |
| **product-code** | 商品コードマスタ | product_code_documents | Product code master |

---

## 1. description_documents (取説テーブル)

### Schema Definition

| Logical Name | Physical Name | Type | Length | Required | Search Target | Notes |
|-------------|---------------|------|--------|----------|---------------|-------|
| 資料ID | document_id | Number | 99999999 | ○ | - | Foreign key to documents.id |
| 商品カテゴリ | category | Varchar | 200 | ○ | - | Product category for this manual |
| 取説コード | description_code | Varchar | 200 | - | ○ (Full-text) | Manual code (basis for document.code) |
| 枝番 | description_branch | Varchar | 20 | - | - | Branch number |
| 旧取説コード | prev_description_code | Varchar | 300 | - | - | Old manual code from PIM (added 2025/09/04) |
| 過去版フラグ | past_version | Boolean | - | ○ | - | 0: Current / 1: Past version (added 2025/09/04) |
| 発行日 | launching_date | Date | - | - | - | Publication date (different from visibility date) |
| ページ数 | page | Number | 9999 | - | - | Page count |
| 取説種類 | description_type | Varchar | 50 | - | - | Manual type (for filtering) |
| ファイル名 | filename | Varchar | 200 | - | - | File name |

### Key Features
- **Past version tracking**: When new manual version arrives, old version gets `past_version=1`
- **Branch numbering**: Supports versioning (e.g., MAK-897D where D is branch)
- **Filtering**: `description_type` enables filtering by manual type

---

## 2. zumen_documents (図面テーブル)

### Schema Definition

| Logical Name | Physical Name | Type | Length | Required | Search Target | Notes |
|-------------|---------------|------|--------|----------|---------------|-------|
| 資料ID | document_id | Number | 99999999 | ○ | - | Foreign key to documents.id |
| 商品カテゴリ | category | Varchar | 200 | ○ | - | Product category for this drawing |
| 図番 | zumen_no | Varchar | 50 | - | - | Drawing number |
| 部品コード | parts_no | Varchar | 50 | - | ○ (Full-text) | Parts code (may be "コード無し") |
| 商品コード | product_no | Varchar | 50 | - | ○ (Full-text) | Product code (may be "コード無し") |
| 図面種類 | zumen_type | Varchar | 50 | - | ○ (Full-text) | Drawing type (for filtering) |
| ファイル名 | filename | Varchar | 200 | - | - | File name |

### Key Features
- **Parts/product codes**: Searchable codes for technical drawings
- **Drawing type filtering**: `zumen_type` enables filtering by drawing type
- **"コード無し" handling**: Some drawings have no codes, system must handle this

---

## 3. Search Configuration per Document Type

### Full-Text Search Targets

| Document Type | Search Target Fields |
|--------------|---------------------|
| **description** | description_code |
| **zumen** | parts_no, product_no, zumen_type |
| **technical** | technical_id, category, technical_type |
| **webcatalog** | webcatalog_code, category, webcatalog_type |
| **cad** | cad_no, parts_no, product_no |
| **product-update** | product_update_no, category |
| **maintenance** | maintenance_no, category, maintenance_type |
| **movie** | movie_no, category |
| **faq** | faq_id, category, faq_type |
| **question** | question_id, category |
| **parts-search** | parts_code, category |
| **product-code** | product_code, category |

### Vector Search Targets

| Document Type | Vector Search Fields |
|--------------|----------------------|
| **description** | - |
| **zumen** | - |
| **technical** | technical_type, category |
| **webcatalog** | webcatalog_type, category |
| **cad** | - |
| **product-update** | category |
| **maintenance** | maintenance_type, category |
| **movie** | category |
| **faq** | faq_type, category |
| **question** | category |
| **parts-search** | category |
| **product-code** | category |

---

## 4. Document Type-Specific Features

### Version Management (description)
- **New version arrival**: Create new record with `past_version=0`
- **Old version update**: Find existing record with matching `prev_description_code`, set `past_version=1`
- **Example**: MAK-897D arrives, MAK-897C becomes past version

### Code Handling (zumen, cad)
- **"コード無し"**: Special value meaning "no code"
- **Multiple codes**: Some documents have both parts and product codes
- **Search optimization**: Codes indexed for full-text search

### Category System
- **Per document type**: Each type has its own category values
- **Tool-specific**: Same field name but values differ per source tool
- **Filtering**: Enables filtering by product category within document type

---

## 5. Interview Talking Points

### Document Type Specialization
> "We have 11 document types with specialized schemas. This allows each type to have relevant metadata - manuals have versioning, drawings have part codes, FAQs have question types. Generic schema would miss these domain-specific needs."

### Search Configuration
> "Search targets vary by document type. Manuals search by code, drawings by part/product codes, technical docs by type. Vector search focuses on categories and types for semantic understanding."

### Version Management
> "Manual versioning tracks past versions. When MAK-897D arrives, we mark MAK-897C as past version. This prevents outdated manuals from appearing in primary search while keeping them accessible."

### "コード無し" Handling
> "Some drawings have no part/product codes. We store 'コード無し' literally. Search must handle this gracefully - either exclude from code searches or treat as special case."

### Category System
> "Categories are tool-specific. '玄関ドア・引戸' from manual tool differs from same category in drawing tool. We maintain separation while providing unified filtering interface."

---

## 6. Key Decisions

| Decision | Rationale |
|----------|-----------|
| Separate tables per type | Domain-specific metadata needs |
| Full-text search per type | Relevant fields differ by document type |
| Vector search on categories/types | Semantic understanding of document purpose |
| Past version flag | Track manual evolution without deleting data |
| "コード無し" literal | Explicit handling of missing codes |
| Tool-specific categories | Respect source system semantics |

---

## 7. Related Documents

- [Physical Model Schema](physical_model_schema.md) - Core table structure
- [Documents Schema](../workspace/Physical Model Schema Design_documents.csv) - Main documents table
- [Search APIs](../03_features/search_apis.md) - Search implementation
- [Elasticsearch](../03_features/elasticsearch.md) - Search engine configuration