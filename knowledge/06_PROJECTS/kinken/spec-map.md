# KINKEN Spec Map

## Phase 1 — Architecture / system map
- Status: read on 2026-03-26
- Sources:
  - `方式一覧 _ Technical Architecture Overview のコピー.xlsx`
  - `画面一覧 (URL設計) _ Screen list (URL design) のコピー.xlsx`
  - `ユビキタス言語 のコピー.xlsx`

### System overview (high level)
- KINKEN is a product/document search platform for LIXIL-related product information and materials.
- Expected macro flow from roadmap: PIM → CSV/interface ingestion → RDB/search preparation → Elasticsearch → API → UI.
- Confirmed architecture-related tech from `方式一覧`:
  - Backend: Python 3.13 + FastAPI
  - Frontend: TypeScript + React / Next.js
  - Batch: Python with Pandas / PySpark on Databricks
  - Search engine: Elasticsearch 9.x (Elastic Cloud)
  - Search approach: morphological analysis + semantic search
  - Re-ranking: RRF
  - Embedding model candidate: OpenAI `text-embedding-3-large`
  - Tokenizer candidate: `kuromoji_tokenizer`
  - Text extraction candidate mentioned: `gpt-4o-mini`

### Auth / user segmentation (phase-1 level only)
- Auth bases seen in `方式一覧`:
  - 社内ユーザ: Azure認証
  - パートナーユーザ: EAA認証
  - ビジネスユーザ: MyLIXIL認証
- Common search platform API style:
  - API方式: REST API
  - 認証方式: APIキー

### URL / routing map (confirmed from `画面一覧 (URL設計)`)
- Two site prefixes by user segment:
  - `/i` = internal / partner users (社内・パートナー向け)
  - `/e` = business / general users (ビジネス・一般向け)
- SEO/index rule noted in spec:
  - index control targets `/e`
  - `/i` pages are all `noindex`

### Main page groups identified
- TOP: `/`
- Document list root: `/documents`
- Document type pages under `/documents/...`
  - `/documents/description`
  - `/documents/zumen`
  - `/documents/technical` or related design variants `technical-doc` seen in other sheet variants
  - `/documents/webcatalog` or variant `web-catalog`
  - `/documents/cad`
  - `/documents/product-update`
  - `/documents/maintenance`
  - `/documents/faq`
  - `/documents/question`
  - `/documents/movie`
  - `/documents/parts-search`
  - `/documents/product-code`
- Product list: `/products`
- Product-scoped document list examples:
  - `/products/{商品コード}/documents/description`
  - `/products/{商品コード}/documents/zumen`
  - `/products/{商品コード}/documents/technical-doc`
  - `/products/{商品コード}/documents/web-catalog`
  - `/products/{商品コード}/documents/faq`
  - `/products/{商品コード}/documents/question`
  - `/products/{商品コード}/documents/movie`
- Product search / 商品特定 examples:
  - `/product-search/shaped-gate/products`
  - `/product-search/shaped-gate/products/{商品コード}`
  - similar patterns for cast-gate, mesh-fence, shaped-fence, carport, removable-gate, terrace

### Navigation / user-flow hints
- There are multiple entry routes into product-related document pages:
  - from 商品名一覧
  - from 資料一覧（商品ピックアップモード mentioned in breadcrumbs）
  - from 商品特定 detail pages
- Breadcrumbs are expected to preserve prior conditions when navigating back.
- This matters for QA because expected return behavior depends on entry source and carried search/filter conditions.

### Core terminology confirmed from `ユビキタス言語`
- 商材 = category
- 商品 = product
- 部品 = parts
- ツール = classification for searchable material types; semantically near 資料
- ブランド = brand
- 現行品 = current
- 終息（廃盤） = discontinued
- PIM = source system for product master data feeding new system
- 資料 = document
- Document subtypes confirmed in glossary:
  - 図面 = zumen
  - 取説 = description
  - 技術資料 = technical
  - WEBカタログ = webcatalog
  - 過去QA = question

### Architecture-level QA checkpoints to remember
- Distinguish global 資料一覧 routes vs 商品単位 document routes.
- Watch route naming inconsistencies between sheets/variants (`technical` vs `technical-doc`, `webcatalog` vs `web-catalog`, `parts-search` vs `parts`). Need later source-of-truth confirmation.
- `/i` vs `/e` behavior is not just auth; it also affects SEO / indexing.
- Breadcrumb restore behavior is likely a key regression area.
- 商品特定 has category-specific route trees; test scope may differ by category slug.

### Open questions after phase 1
- Exact source-of-truth flow for PIM → CSV/GCS → RDB/ES is not fully confirmed yet from phase-1 files alone; need `インタフェース一覧_設計` and `データ移行整理` in phase 2.
- Need confirmation of final canonical route naming where sheet variants disagree.
- Need exact mapping of user types beyond phase-1 auth summary; likely in `認証周りの確認結果` phase 3.

### Phase 2 — Data model / migration / interfaces
- Status: read on 2026-03-26
- Sources:
  - `物理モデル 項目整理 _ Physical Model Schema Design のコピー.xlsx`
  - `データ移行整理 _ Data Migration Preparation のコピー.xlsx`
  - `インタフェース一覧_設計 のコピー.xlsx`

### Data model — source-of-truth level entities identified
From `物理モデル` model list and sheets:
- `products`
- `product_labels`
- `documents`
- `document_brands`
- `product_xxx_divisions` (tool-specific per-product document division tables)
- `document_products`
- `filter_conditions`
- `extracted_filter_conditions`
- `product_categories`
- `product_search_categories`
- product-search specific tables such as:
  - `shaped_gate_products`
  - `cast_gate_products`
  - `removable_gate_products`
  - `shaped_fence_products`
  - `mesh_fence_products`
  - `carport_products`
  - `terrace_products`

### Priority tables from roadmap
#### 1) `products`
Key observations:
- `code` is business-unique product code from PIM, but new system does not use it directly as PK; surrogate key is implied.
- Searchable product-list fields include at least:
  - `name` (partial match)
  - `alias_name` (partial match)
- Product has visibility and UX-driving flags, not just master data:
  - `linked_zumen`
  - `linked_description`
  - `linked_technical`
  - `linked_webcatalog`
  - `qa_link_type`
  - `qa_link`
  - `movie_link`
  - `visibility_level`
- `visibility_level` explicitly controls display/availability in:
  - 商品名一覧
  - 商品ピックアップモード
  - 商品限定モード
- `sub_category` note says one product may map to multiple categories/hierarchies, suggesting normalization pressure beyond flat storage.

#### 2) `documents`
Key observations:
- Core abstract table for all document/tool types.
- `type` is the canonical tool/document discriminator and explicitly maps to route-ish values:
  - `description`
  - `zumen`
  - `technical`
  - `webcatalog`
  - `cad`
  - `product-update`
  - `maintenance`
  - `movie`
  - `faq`
  - `question`
  - `parts-search`
  - `product-code`
- `visibility_level` exists on documents too; note says only 図面 and 技術資料 may have `ME` as a public scope value.
- Document has per-user-type URL fields:
  - `url_lixil`
  - `url_partner`
  - `url_internet`
- `access_type` is important for document opening behavior; spec points to `資料一覧まとめ` for判定 details later.
- `extracted_text` stores text extracted from unstructured files and is part of search/index behavior.
- `hidden` controls display suppression.
- Public start dates can differ by user segment (`start_date_lixil` etc.); data not yet at public start date must be excluded from search.

#### 3) `document_products`
- Explicit many-to-many relationship between documents and products.
- This table is key to product-scoped document listing and target-product modal behavior.
- Document rows may also use product names from relation context in search/indexing notes.

#### 4) `filter_conditions`
- Confirmed as master table for filter conditions.
- There is also `extracted_filter_conditions`, meaning some filterable values are likely extracted/derived rather than only master-managed.
- Need deeper read in later business-rule phase to understand default conditions vs generated filter axes.

### Related supporting tables worth remembering
- `product_labels` = holds fields for product-list filtering.
- `product_xxx_divisions` = per-product/per-document divisions used for product-specific document filtering (e.g. 取説用区分, 図面区分1..n).
- `document_brands` = separate brand table because source identifiers are not normalized consistently.
- `product_categories` = hierarchical category master with parent, level, sort order, category type, visibility.

### Migration / source data understanding
From `データ移行整理`:
- Migration prep sheet includes many import targets split by tool and by structured/unstructured nature.
- `product_categories` master references a Google Sheet as source material.
- Category rows carry `公開区分` values like `internet` and `lixil`, reinforcing that visibility is a cross-cutting data concept.
- Migration design is not only table mapping; it also tracks whether data is structured vs non-structured and what original source master/file drives it.

### Interface / new-system ingestion flow
From `インタフェース一覧_設計`:
- Confirmed new-system collection bucket:
  - `lixil-kinken-collection-{env}`
- High-level ingestion shape is indeed:
  - source systems → structured data to GCS (often PUSH) → new system PULL / process
  - unstructured files referenced via URL or file copy/access → extraction/indexing

#### Structured data flow examples
- 商品: PIM → GCS auto PUSH, scheduled weekdays 8/12/16, diff by 商品コード
- 取説/図面/技術資料/WEBカタログ/CAD: mostly PIM → GCS CSV auto placement → new system PULL
- FAQ / 過去QA: 商品QA system → GCS auto placement → new system PULL
- 商品コードマスタ: MDM via SCP pull, diff by 商品コード
- 電子商品連絡 / 点検修理手順書: new system directly connects to source DB/server, generates current-style CSV, then PULL-type processing

#### Example GCS paths / filenames
- `/product/structure/` → `mpi_product_master-yyyy-mm-dd_hh.mm.ss.csv`
- `/description/structure/` → `mpi_manual_doc-yyyy-mm-dd_hh.mm.ss.csv`
- `/description-product/structure/` → `mpi_product_manual_relation-yyyy-mm-dd_hh.mm.ss.csv`
- `/zumen/structure/` → `mpi_drawing_doc-yyyy-mm-dd_hh.mm.ss_{カテゴリ名}.csv`
- `/technical/structure/` → `mpi_technical_doc-yyyy-mm-dd_hh.mm.ss.csv`
- `/webcatalog/structure/` → `mpi_catalog_data-yyyy-mm-dd_hh.mm.ss.csv`
- `/cad/structure/` → `mpi_cad_bim_data-yyyy-mm-dd_hh.mm.ss.csv`

### Unstructured-data reference patterns relevant for QA/debug
- Source of truth is not always the structured CSV; many tools depend on file access patterns too.
- Important patterns:
  - 取説: DAM URL and some GCS-migrated legacy files
  - 図面: product info DB file server and some GCS-migrated legacy files
  - 技術資料: GCS + spreadsheet + Excel/PPT/image assets; HTML pages are treated via underlying Excel source path inference
  - WEBカタログ: page-unit PDFs in GCS folder by catalog code
  - 電子商品連絡 / 点検修理手順書: file-server PDF access via VPC Connect
- Interface sheet explicitly says OCR/text extraction may require downloading DAM PDFs.

### Strong phase-2 implications
- `物理モデル` is clearly the data-model source of truth for products/documents/relations.
- The actual system map is more concretely:
  - PIM and other upstreams → GCS / direct source access → collection/processing → DB/search index → API/UI
- URLs seen in phase 1 are backed by `documents.type` values and user-segment URL fields, so routing and data model are tightly coupled.
- Visibility/public-scope logic exists both on products and documents; later auth/business-rule reading will be crucial.
- QA/debug on missing documents will likely require checking all of:
  - structured row presence
  - `visibility_level`
  - start date
  - `hidden`
  - relation row in `document_products`
  - actual unstructured file accessibility

### Open questions after phase 2
- Exact column set and semantics of `document_products` and `filter_conditions` still need deeper targeted extraction if used in bug analysis.
- Need phase 3 docs to understand default conditions, sort rules, access control, and `id_type` judgments.
- Need later API/field-definition docs to map interface field names precisely to DB/API payloads.

### Phase 3 — Business rules / access control / feature behavior
- Status: read on 2026-03-26
- Sources:
  - `資料一覧まとめ のコピー.xlsx`
  - `機能一覧_設計 のコピー - 機能一覧.csv`
  - `認証周りの確認結果 のコピー.xlsx`

### Default conditions (very important)
From `資料一覧、商品資料一覧のデフォルト条件`:
- Default conditions apply to both 資料一覧 and 商品資料一覧, except WEBカタログ `ツール種類` filtering which applies only to 資料一覧.
- 取説:
  - use user-segment-specific public start date
  - condition = public start date <= now
  - if target start date is NULL, document is excluded
  - mapping of date field by user:
    - 社内 / LTS ME → 社内
    - パートナー → 流通
    - ビジネス / 一般 → 一般
- WEBカタログ:
  - default tool types restricted to listed values such as 商品カタログ / 総合カタログ / 告知・提案 / 発注・図面・技術資料 / 取説・マニュアル / カタログ種類なし
  - public-date logic branches by 公開状態 (現行版 vs 旧版)
- FAQ:
  - `公開開始日 <= 現在日`
- 過去QA:
  - `商品セグメント = 金属`

### Sort rules
From `一覧の並び順` and feature CSV:
- 商品名一覧:
  - keyword search: score desc, then ID/code asc style tie-break
  - category search/no keyword: product-detail ordering / sales date ordering rules apply
- 商品資料一覧 by tool:
  - 取説: explanation/manual type ordering, then name asc (older more complex sort using 区分 master was later dropped in MTG note)
  - 図面: earlier sort-by-division concept also later simplified; duplicate rows can appear at product-division unit
  - 技術資料: access count desc, then 技術資料ID asc
  - WEBカタログ: publication year-month desc, then catalog code asc
  - FAQ: access desc → likes desc → URL-copy desc → print desc → priority desc → FAQ ID asc
  - 過去QA: updated_at desc → 過去QA ID desc
- Keyword-driven 資料一覧 ignores those per-tool sorts and uses relevance score order instead.

### Filter axes / filter behavior
From `絞り込み条件(商品軸)`:
- 取説 and 図面 have drill-down style product-scoped divisions (`区分1..4`), single-select, cannot jump directly to lower levels.
- For 取説:
  - `バージョン` default = `最新版`
  - when 最新版 selected, `過去版フラグ = 0`
  - version filter visibility differs by user segment:
    - 社内 / パートナー = shown
    - ビジネス / 一般 = hidden
- 図面:
  - `図面種類` behaves more like mandatory tab switch than optional filter
  - some visibility differs by user type
- 技術資料:
  - single-select filters like ブランド / 資料種類 / 窓品種
  - 窓品種 filter shown only when product major category is 窓・シャッター
- WEBカタログ:
  - independent single-select filters, no parent-child relation
- FAQ / 過去QA / 動画:
  - effectively no extra filter conditions in product-scoped view
- Several filter option lists are expected to be built dynamically from current result set / Elasticsearch aggregation.

### Product pickup mode (商品ピックアップモード)
From `機能一覧_設計`:
- Triggered on keyword-searched 資料一覧.
- Uses the same input keyword(s) to do product-name partial matching.
- All keywords are AND-ed.
- If products hit, show picked-up products in product-name ascending order.
- Clicking a product goes to the product-scoped 商品資料一覧.
- There is also a route to product list search using the same keyword.
- Max displayed products = 10.
- Visibility control is the same as 商品名一覧; products not visible there must not appear here.

### Limited mode (商品限定モード)
From `機能一覧_設計`:
- Used when pickup-mode AND search finds no product.
- Then system tries per-keyword partial match against product names.
- If multiple separate keywords each hit products, limited-mode candidates are NOT shown.
  - Example in spec: `サーモス デュオ 互換性`
- When user selects a product candidate, search is re-run with the product-identifying keyword removed and product fixed.
  - Example idea: `サーモスA 取り付け` → choose `サーモスA` → continue searching documents by `取り付け`
- If later the keyword used to identify the selected product is removed/changed, keep only the selected product active and hide old alternative candidates.
- Max displayed products = 10.
- Same product visibility control as 商品名一覧.

### Access control / user-type behavior
From `認証周りの確認結果`, `ツール毎の各ユーザ参照可否整理`, and related sheets:
- Main user groups in practice:
  1. 社内ユーザ
  2. パートナーユーザ
  3. ビジネスユーザ (MyLIXIL)
  4. 一般ユーザ
  5. LTS ME
- URL split:
  - `/i` for internal + partner side
  - `/e` for business + general side
- `id_type` mapping:
  - 社内 = `internal`
  - パートナー = `external ssoid`
  - ビジネス = `mylixil`
  - 一般 = no auth
  - LTS ME = `mylixil` + additional `isME` style handling/flag expectation
- `/e/*` is mostly auth-free, but specific paths like technical docs can require MyLIXIL via EdgeWorker.
- LTS ME mostly follows 社内 access, but for 技術資料 and 図面 only data with public scope `LTS ME` or lower can be seen; `社内`-only docs are not visible.
- Product QA inquiry link display:
  - 社内 = shown
  - パートナー = depends on 商品QA 2次店判定API result
  - ビジネス = hidden
  - 一般 = hidden

### Important document URL / auth nuance
From `資料URLと認証・認可制御`:
- Some `/e/docs/...` files are unauthenticated but app-authorized.
- Technical files/html for business/general side use EdgeWorker + app auth combination.
- User-specific URL switching remains a core rule in both list display and open/download actions.

### Strong QA implications from phase 3
Likely bug hotspots:
- default-condition misses by user-specific public date field selection
- hidden filter/version filter shown to wrong user type
- pickup mode vs limited mode branch confusion
- selected-product carry-over behavior in limited mode
- duplicate/aggregation behavior in 図面 and old sort-rule assumptions
- FAQ/過去QA search result differences versus old QA system because new-system search logic is not identical
- `/e` pages that are mostly public but partially auth-gated (especially technical docs)

### Open questions after phase 3
- Need phase 4 docs to map exact API/field-level names for debugging payload mismatches.
- Need phase 5 skim later for logs/batches/non-functional behavior relevant to testing production issues.

### Phase 4 — API / field definitions / common search platform
- Status: read on 2026-03-26
- Sources:
  - `API List のコピー.xlsx`
  - `インタフェース項目定義 のコピー.xlsx`
  - `商品特定_画面項目定義 _ Product Search - Screen item definition のコピー.xlsx`

### High-level API map
From `API List`:
- KINKEN-facing endpoints include:
  - `GET /documents` → 資料一覧
  - `GET /products` → 商品名一覧
  - `GET /products/{商品カテゴリ名}` → category-based product list
  - `GET /products/{ProductCode}/documents/{DocType}` → 商品資料一覧
  - `GET /documents/{DocumentCode}/products` → 対象商品一覧
  - `GET /documents/{DocumentCode}/download` → download/presigned URL
  - `GET /documents/{DocumentCode}` → document detail / preview
  - `GET /filters` → filter master for UI
  - product-search endpoints under `/product-search/...`
- API List Eng notes indicate data source split:
  - search/list APIs often use ES when keyword search is involved
  - category/no-keyword list scenarios may use RDB
  - product-search APIs are RDB-oriented

### 共通検索基盤 (important)
From `API List` and `インタフェース項目定義`:
- Common search platform endpoints:
  - `GET /search-platform/v1/documents` (also shown via Apigee `/kinken/v1/documents`)
  - `GET /search-platform/v1/products`
  - `GET /search-platform/v1/products/filters`
  - `GET /search-platform/v1/documents/filters`
- A separate API-list overview also shows `/v1/products`, `/v1/documents`, `/v1/documents/count`, etc.; naming differs between KINKEN-side and common-platform-side views, so context matters.
- Common platform uses API-key authentication.
- API keys are issued per external consuming system.
- At initial release:
  - no per-key API restriction by API scope
  - no per-key data access restriction
  - but API-key unit throttling/log monitoring is part of the design intent
- Shared abnormal response shape:
  - `error.errors[]`
  - `error.code`
  - `error.message`

### 共通検索基盤 — document search request model
From `個別 資料一覧検索`:
- Path:
  - KINKEN: `/search-platform/v1/documents`
  - Apigee: `/kinken/v1/documents`
- Main request fields:
  - `q` = keyword (max 100 chars)
  - `document_type` = max one type unless filter-ref API allows specific use
  - `product_code` / product-scoped usage is referenced in examples
  - `filters` = nested JSON / multiple AND conditions
  - `sort` = `score` or `name`
  - `order` = `asc` / `desc`
  - `limit`
  - `page`
- Important rule:
  - if `q` is specified, sort must be score-based; name sort is not allowed
  - default sort:
    - with `q`: `score desc`
    - without `q`: `name asc`

### 共通検索基盤 — document search response model
Key returned fields for `documents[]`:
- common:
  - `id`
  - `name`
  - `type`
  - `number`
  - `visibility_level`
  - `description`
  - `url_lixil`
  - `url_partner`
  - `url_internet`
  - `type_attributes`
- pagination/meta:
  - `total_count`
  - `total_page`
  - `current_page`
- `type_attributes` is the main per-tool expansion bucket.
  - examples seen / confirmed:
    - description: `description_code`, `description_branch`, `description_type`, etc.
    - webcatalog: `webcatalog_total_page`, `webcatalog_current_page`
    - faq: `faq_categories`
    - question: `question_category`
    - product_code: weight / dimensions / launch / abolition dates
- `visibility_level` response note here is `社内 / パートナー / 一般`, which is slightly simplified compared with some earlier business/auth docs; treat with care in debugging.

### 共通検索基盤 — filter reference APIs
#### Document filters
- Path:
  - `/search-platform/v1/documents/filters`
- Request can include `document_type`
- Response shape:
  - `filters[]`
    - `document_type`
    - `label`
    - `value`
    - `method` (`selection` or `exact_match`)
    - `options[]` with `label`, `value`
- Examples / important mappings:
  - 取説: `product_category`, `description_type`
  - 図面: `product_category`, `zumen_type`
  - 技術資料: `product_category`, `document_type` (meaning tool-specific subtype / 資料種類)
  - WEBカタログ: `product_category`, `catalog_type`, `catalog_state`, `metal_water`
  - FAQ: `product_category` exact-match, `visibility_level`, `metal_water`
  - 過去QA: `product_category`, `metal_water`
  - 点検修理手順書 / 商品コード: no extra filters in this definition
- This is important because UI-side filter keys come from this API, not hardcoded assumptions.

#### Product filters
- Path:
  - `/search-platform/v1/products/filters`
- Response filter examples:
  - `sales_type`
  - `brand`
  - `insulation_performance`
  - `fire_certification`

### 商品資料一覧 API shape
From `#3_JP` in API List:
- `GET /v1/products/{ProductCode}/documents/{DocType}`
- Supports:
  - `q`
  - `filters`
  - `document_type`
  - `sort`
  - `order`
  - `page`
  - `limit`
- Response includes:
  - `product`
  - grouped `documents`
  - `document_type_counts`
- Example response shows tool counts can include subtypes like `basic-drawing`, `part-drawing`, indicating UI tab/count logic may be derived rather than 1:1 with base document type names.

### 商品特定_画面項目定義 — what matters in phase 4
This file is mostly screen-to-DB mapping for product-search categories.
Important patterns confirmed:
- Each 商品特定 category sheet maps screen fields to DB columns and exact search logic.
- Search conditions often work as:
  - multiple DB columns OR-ed against one UI input
  - categorical selections matched via code mapping masters
  - numeric dimensions support exact or ±5 range search
- The `±5` tolerance checkbox is often default ON.
- Product name search can be:
  - partial match direct input
  - exact match from grouped dropdown selection
- List/detail navigation commonly uses `product_kbn + kanri_no` to identify the target record.
- Related-documents button commonly uses `product_id` to jump into 商品資料一覧.
- Image/file rendering in 商品特定 often uses dedicated product-search GCS assets.
- Master/source note:
  - product-search master data is managed in spreadsheets as source-of-truth, then imported via CSV.

### Strong QA/debug implications from phase 4
- Need to distinguish carefully between:
  - UI-facing KINKEN routes (`/documents`, `/products`, `/product-search/...`)
  - common search platform APIs (`/search-platform/v1/...` or Apigee `/kinken/v1/...`)
- Filter bugs may come from mismatch between:
  - filter key from `documents/filters`
  - request payload key in search call
  - DB/source field naming in earlier specs
- `type_attributes` is the key place where per-tool field regressions will show up.
- Search behavior can differ depending on keyword presence because backend path may switch between ES and RDB logic.
- 商品特定 bugs are likely to be field-mapping or condition-building bugs rather than full-text search bugs.

### Open questions after phase 4
- Need phase 5 skim for logging/batch timing/non-functional constraints that affect investigation in production.
- If future debugging requires exact payload verification, it may be worth extracting the full `#1_JP`, `#2_JP`, `#3_JP`, and filter sheets into targeted notes.

### Next docs for phase 5
1. `BigQuery 項目定義 _ BigQuery Schema Design のコピー.xlsx`
2. `Batch List のコピー.xlsx`
3. `非機能要件一覧 _ Non-functional requirements Overview のコピー.xlsx`
