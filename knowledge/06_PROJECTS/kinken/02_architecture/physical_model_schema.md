---
name: project_kinken_db_schema_overview
description: KINKEN database schema overview - core tables (products, documents, labels) and product-specific tables (7 exterior types).
type: project
updated: 2026-05-05
---

# KINKEN Database Schema Overview

**Updated**: 2026-05-05  
**Source**: Physical Model Schema Design.xlsx (converted to CSV) from workspace

> **Note**: File này là **overview** của toàn bộ DB schema. Chi tiết từng table type xem ở các file chuyên biệt:
> - Products: Section 1-2 bên dưới
> - Documents: [Document Subtype Tables](document_subtype_tables.md)
> - Product-specific (7 exterior types): Section 3 bên dưới

---

## Database Table Overview

### Core Tables

| Table | Logical Name | Purpose |
|-------|-------------|---------|
| **products** | 商品 | Product master data |
| **product_labels** | 商品詳細ラベル | Product detail labels for filtering |
| **documents** | 資料 | Document metadata |
| **document_brands** | 資料ブランド | Document-brand relationships |
| **document_products** | 資料商品組合せ | Document-product relationships |
| **product_xxx_divisions** | 商品別資料区分マスタ | Product-specific document divisions |
| **filter_conditions** | 絞り込み条件マスタ | Filter conditions master (predefined) |
| **extracted_filter_conditions** | 抽出済み絞り込み条件マスタ | Filter conditions extracted from documents (dynamic) |
| **product_categories** | 商品カテゴリマスタ | Product category hierarchy |
| **announcements** | お知らせ | System announcements |
| **division_sort_orders** | 区分並び順マスタ | Division sort orders |
| **reference_links** | お役立ちリンクマスタ | Reference links |

### Product-Specific Tables (7 Exterior Types)

| Table | Logical Name | Notes |
|-------|-------------|-------|
| **shaped_gate_products** | 形材門扉 | Shaped gate products |
| **shaped_gate_locks** | 形材門扉 錠 | Shaped gate locks |
| **cast_gate_products** | 鋳物門扉 | Cast gate products |
| **cast_gate_locks** | 鋳物門扉 錠 | Cast gate locks |
| **removable_gate_products** | 伸縮門扉 | Removable gate products |
| **removable_gate_codes** | 伸縮門扉 製品記号 | Removable gate product codes |
| **shaped_fence_products** | 形材フェンス | Shaped fence products |
| **mesh_fence_products** | スチールメッシュフェンス | Mesh fence products |
| **carport_products** | カーポート | Carport products |
| **terrace_products** | テラス | Terrace products |

---

## 1. products (商品テーブル)

### Schema Definition

| Logical Name | Physical Name | Type | Length | Required | Search Target | Notes |
|-------------|---------------|------|--------|----------|---------------|-------|
| ID | id | Number | 99999999 | ○ | - | Surrogate key |
| 商品コード | code | Varchar | 200 | ○ | - | Unique identifier from PIM (UK constraint) |
| 商品名 | name | Varchar | 200 | ○ | ○ (Partial) | Product name |
| 商品別名 | alias_name | Varchar | 200 | - | ○ (Partial) | Product alias (added 2025/08/28) |
| 商材 | category | Varchar | 200 | ○ | - | e.g., エクステリア |
| 商品種別 | sub_category | Varchar | 200 | - | - | Can have hierarchy & multiple categories (pipe-delimited) |
| ブランド：INAX | brand_inax | Boolean | - | ○ | - | Brand flags |
| ブランド：LIXIL | brand_lixil | Boolean | - | ○ | - | |
| ブランド：sunwave | brand_sunwave | Boolean | - | ○ | - | |
| ブランド：TOEX | brand_toex | Boolean | - | ○ | - | |
| ブランド：TOSTEM | brand_tostem | Boolean | - | ○ | - | |
| ブランド：新日軽 | brand_snk | Boolean | - | ○ | - | |
| 販売開始日 | launching_date | Date | - | - | - | Used for "New!" label |
| 販売終了日 | abolition_date | Date | - | - | - | |
| 販売終了フラグ | abolition | Boolean | - | ○ | - | 0: On sale / 1: Discontinued |
| 改訂日 | revision_date | Date | - | - | - | Used for "改訂" label |
| 改訂備考 | revision_remark | Varchar | 100 | - | - | Revision notes from PIM |
| 商品詳細ID | product_detail_id | Number | 99999 | - | - | Used for sort order (added 2025/08/29) |
| 図面用：リンク有フラグ | linked_zumen | Boolean | - | ○ | - | Show drawings link if 1 |
| 取説用：リンク有フラグ | linked_description | Boolean | - | ○ | - | Show manual link if 1 |
| 技術資料用：リンク有フラグ | linked_technical | Boolean | - | ○ | - | Show technical docs link if 1 |
| WEBカタログ用：リンク有フラグ | linked_webcatalog | Boolean | - | ○ | - | Show web catalog link if 1 |
| 商品QA用：連携区分 | qa_link_type | Varchar | 300 | ○ | - | none / category / keyword |
| 商品QA用：リンク内容 | qa_link | Varchar | 300 | - | - | Category ID or keyword for QA link |
| 動画：URL | movie_link | Varchar | 500 | - | - | LIXIL-X video URL |
| 公開区分 | visibility_level | Varchar | 20 | ○ | - | 社内 / パートナー / ビジネス (added 2025/12/22) |
| 非表示フラグ | hidden | Boolean | - | ○ | - | 0: Show / 1: Hide (added 2025/12/22) |

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Surrogate key (id) | Separate internal ID from PIM code |
| Multiple brand flags | Products can have multiple brands, but new brands unlikely |
| UK on code | Unique identifier from PIM, but not used as PK |
| sub_category as Varchar | Supports hierarchy and multiple categories (pipe-delimited) |
| Link flags | Control which document links appear per product |
| visibility_level | Control access by user type |

---

## 2. product_labels (商品詳細ラベルテーブル)

### Schema Definition

| Logical Name | Physical Name | Type | Length | Required | Sample |
|-------------|---------------|------|--------|----------|--------|
| ID | id | Number | 99999999 | ○ | 123 |
| 商品ID | product_id | Number | 99999999 | ○ | 135 |
| ラベルキー | label_key | Varchar | 100 | ○ | sash_type |
| ラベル値 | label_value | Varchar | 100 | ○ | sash_door |

### Purpose
- Enable filtering on product list screen
- 1 product can have multiple labels
- Labels are NOT exhaustive (product doesn't have all labels)

### Label Key Types

| Label Key | Label Values |
|-----------|-------------|
| **sash_type** (サッシ区分) | shutter / other / door / sliding_window / blind / bay_window / decorative_window / skylight / area_grid |
| **heat_insulation_type** (断熱性能区分) | standard (一般) / high (高断熱) / optional (選択式) / insulated (断熱) |
| **fire_guard_type** (防火認定区分) | on / off |

### Design Pattern
- Label key prefix matches label value prefix
  - sash_type → sash_xxx
  - heat_insulation_type → heat_insulation_xxx
  - fire_guard_type → fire_guard_xxx

---

## Interview Talking Points

### Schema Design Philosophy
> "We use surrogate keys (id) instead of PIM codes as primary keys. This decouples our internal identifiers from external system codes, giving us flexibility if PIM code format changes."

### Multi-Category Support
> "Products can belong to multiple categories stored as pipe-delimited strings in sub_category. This reflects real-world business where products span multiple use cases."

### Label System
> "product_labels is a key-value store for flexible filtering. Instead of adding columns for each filter type, we use a generic structure that can accommodate new label types without schema changes."

### Access Control
> "visibility_level and hidden flag control access per user type. This ensures partners only see relevant products and sensitive products stay internal."

### Product-Specific Tables
> "7 exterior types (gates, fences, carports, terraces) have dedicated tables. This allows specialized attributes per product type while maintaining the core products table as the master record."

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Surrogate keys | Decouple internal IDs from external codes |
| Varchar for categories | Support hierarchy & multiple values |
| Boolean brand flags | Low likelihood of new brands |
| Key-value label store | Flexible filtering without schema changes |
| Separate product type tables | Specialized attributes per exterior type |
| Link flags | Control document navigation per product |
| visibility_level | Row-level access control |

---

## 3. filter_conditions (絞り込み条件マスタ)

### Schema Definition

| Logical Name | Physical Name | Type | Length | Required | Sample | Notes |
|-------------|---------------|------|--------|----------|--------|-------|
| 条件区分 | condition_type | Varchar | 50 | ○ | product | Which screen/tool: product, document_all, product_document_webcatalog |
| 絞り込み条件項目コード | condition_key | Varchar | 50 | ○ | sales_type | Filter item code |
| 絞り込み条件項目ラベル | condition_label | Varchar | 50 | ○ | 販売フラグ | Filter item label |
| 絞り込み条件項目並び順 | condition_order | Number | 9999 | ○ | 1 | Sort order within condition_type |
| 絞り込み条件コード | option_key | Varchar | 50 | ○ | new | Filter option code |
| 絞り込み条件ラベル | option_label | Varchar | 50 | ○ | 新商品 | Filter option label |
| 絞り込み条件並び順 | option_order | Number | 999 | ○ | 1 | Sort order within condition_key |

### Purpose
- **Predefined master data** for filter conditions
- Controls which filters appear on which screens
- User visibility control handled in separate table

### condition_type Examples
- `product` - Product list screen
- `document_all` - Document list "All" tab
- `product_document_webcatalog` - Product document list "Web Catalog" tab

---

## 4. extracted_filter_conditions (抽出済み絞り込み条件マスタ)

### Schema Definition

| Logical Name | Physical Name | Type | Length | Required | Sample | Notes |
|-------------|---------------|------|--------|----------|--------|-------|
| 条件区分 | condition_type | Varchar | 50 | ○ | maintenance | Which screen/document type |
| 絞り込み条件項目コード | condition_key | Varchar | 50 | ○ | sales_type | Filter item code |
| 絞り込み条件項目ラベル | condition_label | Varchar | 50 | ○ | 商品カテゴリ | Filter item label |
| 絞り込み条件項目並び順 | condition_order | Number | 9999 | ○ | 1 | Sort order within condition_type |
| 絞り込み条件コード | option_key | Varchar | 50 | ○ | new | Filter option code |
| 絞り込み条件ラベル | option_label | Varchar | 100 | ○ | ビル用出窓 | Filter option label |
| 絞り込み条件並び順 | option_order | Number | 999 | ○ | 1 | Sort order within condition_key |

### Purpose
- **Dynamically extracted** filter options from document data
- Populated by Collection batch process
- Separate from predefined master data (filter_conditions)

### Key Difference from filter_conditions
- `filter_conditions` = predefined master data
- `extracted_filter_conditions` = dynamically extracted from actual document data

---

## 5. product_categories (商品カテゴリマスタ)

### Schema Definition

| Logical Name | Physical Name | Type | Length | Required | Sample | Notes |
|-------------|---------------|------|--------|----------|--------|-------|
| ID | id | Number | 99999999 | ○ | 123 | Surrogate key |
| カテゴリ名 | name | Varchar | 200 | ○ | 引違い窓 | Category name |
| 親カテゴリID | parent_id | Number | 99999999 | - | 2 | Parent category ID (for hierarchy) |
| レベル | level | Number | 99999 | ○ | 3 | Hierarchy level |
| 並び順 | order | Number | 99999 | ○ | 9 | Sort order |
| カテゴリ種別 | type | Varchar | 50 | - | door | Category type for filter control |
| 公開区分 | visibility_level | Varchar | 20 | ○ | lixil | lixil / partner / internet |

### Purpose
- Hierarchical product category structure
- Controls filter display per category type
- Access control via visibility_level

---

## 6. announcements (お知らせ)

### Schema Definition

| Logical Name | Physical Name | Type | Length | Required | Sample | Notes |
|-------------|---------------|------|--------|----------|--------|-------|
| ID | id | Number | 99999999 | ○ | 123 | Surrogate key |
| タイトル | title | Varchar | 200 | ○ | リニューアルのお知らせ | Announcement title (shown on TOP screen) |
| 本文 | content | Text | - | ○ | `<div>本文です。<b>太字</b>です。</div>` | HTML content (supports formatting & links) |
| 掲載開始日 | start_date | Date | - | ○ | 2025-07-01 | Publication start date |
| 掲載終了日 | end_date | Date | - | - | 2025-07-31 | Publication end date (optional) |
| 公開区分 | visibility_level | Varchar | 20 | ○ | lixil | lixil / partner / internet |

### Purpose
- System announcements displayed on TOP screen
- Supports HTML formatting (bold, links, etc.)
- Time-based publication control
- Access control per user type

### Notes
- If `end_date` is null, announcement displays indefinitely after `start_date`
- HTML tags allowed for text formatting and links

---

## 7. division_sort_orders (区分並び順マスタ)

### Schema Definition

| Logical Name | Physical Name | Type | Length | Required | Sample | Notes |
|-------------|---------------|------|--------|----------|--------|-------|
| ID | id | Number | 99999999 | ○ | 123 | Surrogate key |
| 区分 | division | Varchar | 200 | ○ | 引違い窓 | Division name |
| 並び順 | sort_order | Number | 99999 | ○ | 9 | Sort order |

### Purpose
- Controls sort order for document divisions
- Used for manuals and drawings sort control

---

## 8. reference_links (お役立ちリンクマスタ)

### Schema Definition

| Logical Name | Physical Name | Type | Length | Required | Sample | Notes |
|-------------|---------------|------|--------|----------|--------|-------|
| ID | id | Number | 99999999 | ○ | 123 | Surrogate key |
| グループ名 | group_name | Varchar | 200 | ○ | お役立ち情報 | Group name for reference links |
| グループ並び順 | group_order | Number | 99999 | ○ | 5 | Group sort order |
| グループアイコン名 | group_icon | Varchar | 100 | - | Info.svg | Icon filename (stored in GCS: `lixil-kinken-docs-public-{env}/reference_links/{group_icon}`) |
| サイト名 | site_name | Varchar | 200 | ○ | インテリア互換表 | Link name |
| サイト並び順 | site_order | Number | 99999 | ○ | 5 | Site link sort order |
| 説明 | site_description | Varchar | 1000 | - | 室内建具の交換時の枠と本体の互換性... | Site description |
| サイトURL(社内) | site_url_lixil | Varchar | 500 | - | http://www.intra.lixil.co.jp/... | URL for LIXIL internal users (LTS ME included). If empty, hide for internal users. |
| サイトURL(パートナー) | site_url_partner | Varchar | 500 | - | https://apps.lixil.co.jp/... | URL for partner users. If empty, hide for partners. |
| サイトURL(一般) | site_url_internet | Varchar | 500 | - | - | URL for business/general users. If empty, hide for these users. |

### Purpose
- Provides useful external links grouped by category
- Access control via user-type-specific URLs
- Icon support for visual grouping

### Key Features
- **User-type-specific URLs**: Different URLs per user type (internal, partner, general)
- **Conditional visibility**: If URL is empty for user type, link is hidden
- **Grouped display**: Links organized by group_name with icons
- **GCS icon storage**: Icons stored in Google Cloud Storage per environment

---

## 9. product_search_categories (商品特定カテゴリマスタ)

### Schema Definition

| Logical Name | Physical Name | Type | Length | Required | Sample | Notes |
|-------------|---------------|------|--------|----------|--------|-------|
| ID | id | Number | 99999999 | ○ | 123 | Surrogate key |
| カテゴリ名 | name | Varchar | 200 | ○ | 窓・シャッター | Category name |
| 親カテゴリID | parent_id | Number | 99999999 | - | 2 | Parent category ID (for hierarchy level 2+) |
| レベル | level | Number | 99999 | ○ | 3 | Hierarchy level |
| 並び順 | order | Number | 99999 | ○ | 10 | Sort order |
| 資料種別 | document_type | Varchar | 50 | - | internal_link | Link type for leaf categories: `external_link` (external system URL) or `internal_link` (KINKEN relative path) |
| 資料URL | document_url | Varchar | 500 | - | /product-search/shaped-gate | URL or relative path |

### Purpose
- Hierarchical category structure for product search navigation
- Supports both internal KINKEN pages and external system links
- Leaf categories contain actual links

### Key Features
- **Hierarchical structure**: Multi-level categories via parent_id
- **Leaf node links**: Only leaf categories have document_type and document_url
- **Link type distinction**: `internal_link` for KINKEN pages, `external_link` for external systems
- **Master data reference**: [Google Sheets](https://docs.google.com/spreadsheets/d/1NZY2I7B5aflDig41Wd3Ip9tMBJZIQOTVI94A5J-vx5o/edit?gid=451694227#gid=451694227)

### Design Pattern
- Similar to product_categories but for search navigation
- Leaf nodes contain actionable links
- Internal links use relative paths (e.g., `/product-search/shaped-gate`)

---

## Interview Talking Points (Updated)

### Filter System Architecture
> "We have two filter tables: predefined master data (filter_conditions) and dynamically extracted options (extracted_filter_conditions). Predefined covers static filters like sales status. Dynamic extraction handles document-specific categories that emerge from actual data."

### Category Hierarchy
> "product_categories supports multi-level hierarchy via parent_id. Each level has explicit level number and sort order. Category type enables filter control - different categories show different filter options."

### Announcement System
> "Announcements support HTML for rich formatting. Time-based publication with optional end date. If no end date, announcement stays visible. Access control ensures right users see right announcements."

### Dynamic Filter Extraction
> "Collection batch extracts filter options from document data. This ensures filters reflect actual document content, not just predefined assumptions. Separate table keeps master data clean."

### Reference Links with User-Type Access Control
> "reference_links provides helpful external links grouped by category. Each link has three URL variants - one for internal LIXIL users, one for partners, one for general users. If a URL is empty for a user type, the link is hidden. This ensures users only see relevant resources."

### Product Search Navigation
> "product_search_categories is a hierarchical navigation structure for product search. Leaf categories contain links - either internal KINKEN pages (relative paths) or external system URLs. This separates navigation structure from actionable links, making it flexible for future changes."

---

## Key Decisions (Updated)

| Decision | Rationale |
|----------|-----------|
| Surrogate keys | Decouple internal IDs from external codes |
| Varchar for categories | Support hierarchy & multiple values |
| Boolean brand flags | Low likelihood of new brands |
| Key-value label store | Flexible filtering without schema changes |
| Separate product type tables | Specialized attributes per exterior type |
| Link flags | Control document navigation per product |
| visibility_level | Row-level access control |
| **Two filter tables** | Separate predefined vs dynamic filter options |
| **HTML in announcements** | Rich formatting for important notices |
| **Hierarchical categories** | Reflect real product taxonomy |
| **Optional end_date** | Flexible announcement lifecycle |
| **User-type-specific URLs** | Conditional visibility per user type without duplicating records |
| **Leaf-node links** | Navigation structure separate from actionable links |
| **GCS icon storage** | Centralized icon management per environment |

---

## Related Documents
- [Data Flow](data_flow.md) - ETL pipeline populating these tables
- [Document Subtype Tables](document_subtype_tables.md) - Document type schemas
- [Function Design](../03_features/function_design.md) - Features using this data
- [Tech Stack](tech_stack.md) - Database technology choice
