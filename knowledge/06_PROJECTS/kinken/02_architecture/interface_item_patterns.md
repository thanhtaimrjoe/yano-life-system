---
name: project_kinken_interface_item_patterns
description: KINKEN interface item definition patterns - common field patterns across 4 main data types (Product, Manual, Drawing, Technical).
type: project
updated: 2026-05-05
---

# KINKEN Interface Item Patterns

**Updated**: 2026-05-05  
**Source**: Interface Item Definition files from workspace

> **Note**: File này tóm tắt **common patterns** trong interface definitions. Chi tiết từng field xem trong source files.

---

## 1. Common Interface Specifications

### File Format
| Specification | Value |
|---------------|-------|
| **Format** | CSV |
| **Encoding** | UTF-8 |
| **Line ending** | CRLF |
| **Quoting** | All values wrapped in double quotes |
| **Update timing** | 3x daily (8:00, 12:00, 16:00 on weekdays) |
| **Update method** | Delta only (by unique ID) |

### GCS Placement Pattern
```
gs://lixil-kinken-collection-{env}/{document_type}/structure/{filename}
```

---

## 2. Product Data Interface (28 fields)

### Key Fields

| Field | Logical Name | Required | Notes |
|-------|--------------|----------|-------|
| `product_id` | 商品コード | ○ | Unique identifier from PIM (UK) |
| `seriesdetail_name` | 商品名 | ○ | Product name (search target) |
| `seriesdetail_name_sub01` | 商品別名 | - | Product alias (search target) |
| `seriesdetail_category` | 商材 | ○ | e.g., エクステリア |
| `seriesdetail_subcategory01` | 商品種別 | ○ | Multi-category support with `/` separator |
| `seriesdetail_brand` | ブランド | ○ | Pipe-delimited: `LIXIL|TOSTEM` |
| `seriesdetail_launching_date` | 販売開始日 | ○ | YYYY-MM-DD format |
| `seriesdetail_abolition_date` | 販売終了日 | - | YYYY-MM-DD format |
| `flag_seriesdetail_abolition` | 販売終了フラグ | - | 0: On sale / 1: Discontinued |

### Label Fields (for filtering)
| Field | Logical Name | Values |
|-------|--------------|--------|
| `seriesdetail_label` | サッシ区分 | Pipe-delimited: `ドア|引違い窓|` |
| `flag_spec_heat_insulation` | 断熱性能区分 | 一般 / 高断熱 / 選択式 / 断熱 / (empty) |
| `flag_spec_fire_guard` | 防火認定区分 | ON / OFF |

### Link Control Fields
| Field | Logical Name | Purpose |
|-------|--------------|---------|
| `flag_link_drawing` | 図面リンク有フラグ | Show drawing link if 1 |
| `flag_link_description` | 取説リンク有フラグ | Show manual link if 1 |
| `link_technical` | 技術資料リンク有フラグ | Show technical docs if value exists |
| `flag_link_catalog` | WEBカタログリンク有フラグ | Show web catalog if 1 |
| `link_movie` | 動画：URL | LIXIL-X video URL |
| `flag_intranet_restriction` | 公開権限フラグ：LIXIL社内 | Access control flags |

### Access Control Logic
Priority order (first match wins):
1. `インターネット` ON → 一般 (Public)
2. `TOEX or トステム or 販売店` ON → パートナー (+ 社内)
3. `LIXIL社内` ON only → 社内 (Internal)
4. All OFF but public flag ON → Non-display

---

## 3. Document Interface Common Patterns

### Shared Fields Across All Document Types

| Field Pattern | Logical Name | Purpose |
|---------------|--------------|---------|
| `{doc_type}_id` | ID | Unique identifier (STEP ID from PIM) |
| `document_name` | 資料名 | Document name (no extension) |
| `document_ext` | 資料説明 | HTML-formatted description |
| `document_url_internet` | 資料URL（一般） | URL for general users |
| `document_url_intranet` | 資料URL（社内） | URL for internal users |
| `document_url_extranet` | 資料URL（流通） | URL for partners |
| `flag_doc_restriction` | 公開フラグ | Inverted: 1→0, 0→1 on import |
| `flag_doc_intranet_restriction` | 公開権限フラグ：LIXIL社内 | Access control flags |
| `flag_doc_toex_restriction` | 公開権限フラグ：TOEX代理店 | Access control flags |
| `flag_doc_inter_restriction` | 公開権限フラグ：インターネット | Access control flags |
| `flag_doc_tostem_restriction` | 公開権限フラグ：トステム代理店 | Access control flags |
| `flag_doc_salse_restriction` | 公開権限フラグ：販売店 | Access control flags |
| `document_manual_category` | 商品カテゴリー | 12 category values |

### Access Control Pattern (Same as Products)
```
1. インターネット ON → 一般
2. TOEX or トステム or 販売店 ON → パートナー (+ME、社内)
3. ME ON → ME (+社内)
4. LIXIL社内 ON only → 社内
```

---

## 4. Manual (取説) Interface - Specific Fields

| Field | Logical Name | Notes |
|-------|--------------|-------|
| `document_manual_code` | 取説コード | Manual code (unique with branch) |
| `document_manual_version` | 枝番 | Branch number (e.g., MAK-897D → D) |
| `document_manual_previous_varsion` | 旧取説コード | Previous version code (pipe-delimited) |
| `document_launching` | 発行日 | Publication date (different from visibility date) |
| `document_page` | ページ数 | Page count |
| `flag_document_manual_type` | 取説種類 | Manual type for filtering |
| `document_filename` | ファイル名 | Actual PDF filename |
| `k_kotei_id` | 商品ID | Related product IDs (pipe-delimited) |

### Version Management
- New version arrives → Create new record
- `document_manual_previous_varsion` specified → Update old record's `past_version` flag to 1
- Example: MAK-897D arrives → MAK-897C marked as past version

---

## 5. Drawing (図面) Interface - Specific Fields

| Field | Logical Name | Notes |
|-------|--------------|-------|
| `document_manual_drawing_no` | 図番 | Drawing number |
| `document_manual_parts_no` | 部品コード | Parts code (may be empty or "コード無し") |
| `mpi_product_drawing_code` | 商品コード | Product code |
| `flag_document_drawing_type` | 図面種類 | 加工図 / 基本図 / 形材図 / 部品図 |
| `document_drawing_division1-5` | 図面区分1-5 | Sort order controls |
| `k_kotei_id` | 商品ID | Related product IDs (pipe-delimited) |

### Code Handling
- All three codes (図番, 部品コード, 商品コード) stored separately
- "コード無し" handled as literal string
- Empty values allowed

---

## 6. Technical Document (技術資料) Interface - Specific Fields

| Field | Logical Name | Notes |
|-------|--------------|-------|
| `document_technical_id` | 技術資料ID | Technical document ID |
| `document_filetype` | ファイル名タイプ | e.g., エクセル資料, PDF資料 |
| `document_registration_date` | 資料登録日 | Used for "NEW" label display |
| `document_thumbnail_intranet` | サムネイルURL（社内） | Thumbnail URL (internal only used) |
| `document_keyword` | キーワード | Search keywords |
| `document_sort_number` | 並び順管理 | Sort order (0 if empty) |
| `rel_product_id` | 商品ID | Related product IDs (pipe-delimited) |

### Multi-Value Filter Flags (Pipe-delimited)
| Field | Logical Name | Values |
|-------|--------------|--------|
| `flag_doc_category` | カテゴリー | インテリア建材|エクステリア|... |
| `flag_doc_brand` | ブランド | LIXIL|TOEX|トステム|新日軽 |
| `flag_doc_type` | 資料種別 | 交換・メンテナンス|商品特定|... |
| `flag_doc_sash` | 窓種別 | ドア|引違い窓|... |

### Unstructured Data Reference Rules
1. If `document_url_intranet` is Google Spreadsheet → Use spreadsheet as input
2. Otherwise → Extract file from GCS using `file_path` rules
3. Display: Spreadsheet → Navigate to URL; File → Download

---

## 7. Interview Talking Points

### Interface Design Philosophy
> "We use CSV with UTF-8 encoding and delta updates. All values are double-quoted to handle special characters. Updates come 3x daily on weekdays, tracking changes by unique ID rather than timestamp."

### Multi-Value Field Handling
> "Many fields use pipe-delimited values for multi-value support: brands, categories, labels. This avoids complex join tables while maintaining flexibility. Example: `LIXIL|TOSTEM|TOEX` for multi-brand products."

### Access Control Pattern
> "Access control uses priority-based flag evaluation. We check flags in order: Internet → Partner → ME → Internal. First match wins. This ensures proper data visibility per user type without complex role management."

### Product-Document Relationship
> "Documents link to products via `k_kotei_id` or `rel_product_id` fields. One document can link to multiple products (pipe-delimited). Some documents have no product links - those are still searchable but don't appear in product-specific views."

### Version Control for Manuals
> "Manual versioning uses `document_manual_previous_varsion` to track evolution. When MAK-897D arrives, we mark MAK-897C as past version. This keeps history while highlighting current documents."

### Label System for Filtering
> "Product labels use key-value pattern: `seriesdetail_label` contains pipe-delimited values like `ドア|引違い窓|`. These map to filter conditions in Elasticsearch, enabling flexible filtering without schema changes."

### URL Management
> "Each document has three URLs: internet, intranet, extranet. Different URLs per user type ensure proper access control. Empty URL for a type means that document is hidden for that user type."

### Data Flow Pattern
> "PIM pushes structured data to GCS. Collection batch processes and loads to RDS. Non-structured files migrate from various sources. OCR processes technical documents using pattern matching to find source Excel files."

---

## 8. Key Patterns Summary

| Pattern | Implementation | Rationale |
|---------|---------------|-----------|
| **Pipe-delimited multi-values** | `LIXIL|TOSTEM|TOEX` | Avoid join tables, maintain flexibility |
| **Priority-based access control** | Check flags in order, first match wins | Simple, deterministic access logic |
| **Delta updates by ID** | Track changes by unique ID | Reliable change detection |
| **User-type-specific URLs** | 3 URL fields per document | Different auth paths per user type |
| **Flag inversion on import** | Public flag 1→0, 0→1 | Match KINKEN's display logic |
| **Version tracking** | Previous version code field | Keep history while highlighting current |
| **Key-value labels** | Pipe-delimited label values | Flexible filtering without schema changes |
| **Empty value handling** | Default values on import (0, empty string) | Consistent data state |

---

## 9. Related Documents

- [Physical Model Schema](physical_model_schema.md) - Database schema for imported data
- [Data Integration Overview](data_integration_overview.md) - Data flow and collection platform
- [Document Subtype Tables](document_subtype_tables.md) - Document type schemas
- [Tech Stack](tech_stack.md) - Technology implementation