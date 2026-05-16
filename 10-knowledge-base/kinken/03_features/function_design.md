---
name: project_kinken_function_design
description: KINKEN core functional design including search flows, pickup/limited mode UX.
type: project
originSessionId: b37d84e1-f8b9-48d3-b090-b3afc2a6deca
---

# KINKEN Function Design

## Main Functional Pillars

1. Authentication and authorization by user type
2. Product search
3. Document search
4. Product-specific document browsing
5. Product identification flows for 7 exterior categories
6. Data collection, indexing, analytics, and external integrations

## User Types and Access

| User Type | Authentication | Data Visibility |
|-----------|---------------|-----------------|
| Internal | Azure/EntraID | Full access based on role |
| Partner | EAA | Partner-relevant data only |
| Business | MyLIXIL | Business-specific documents |
| General | None | Browse only; detail/preview/download requires MyLIXIL |

## Search Behavior

### Product Search

- Keyword search with autocomplete
- Category filtering (7 exterior categories)
- Sales-term filters
- Visibility control from PIM flags

### Document Search

- Cross-tool and per-tool tabs
- Score-based ordering (hybrid: morphological + semantic)
- Filters: document type, category, date range
- Preview, download, and detail transitions
- Product-document lists (documents related to specific product)

### Product-Limited Mode Cross-Document Search (SPRINT 18)

**Overview**: When a specific product is selected, users can search documents across multiple types.

**Document Types & Search Methods**:

| Document Type | Search Method | Status |
|---------------|---------------|--------|
| 取説 (Description) | PIM product code | ✅ Logic implemented, display fix needed |
| 図面 (Zumen/Drawings) | PIM product code | ✅ Logic implemented, display fix needed |
| 技術資料 (Technical) | PIM product code | ✅ Logic implemented, display fix needed |
| WEBカタログ (Web Catalog) | PIM product code | ✅ Logic implemented, display fix needed |
| FAQ | Category path from category ID | ✅ Logic implemented, display fix needed |
| 過去QA (Past QA) | Category path from category ID | ✅ Logic implemented, display fix needed |

**Tab "すべて" (All) Implementation**:
- **Pattern 1 (PIM-linked)**: Tab for 4 document types (取説, 図面, 技術資料, WEBカタログ) - ✅ Planned
- **Pattern 2 (Category-based)**: Tab for 2 document types (FAQ, 過去QA) - 🔄 Under consideration
- **Pattern 3 (All 6 types)**: Unified tab across all types - ❌ Likely not implemented (different search methods)

**Challenge**: PIM-linked documents use product code, while category-based documents use category path. Unified search across both types is complex.

## Pickup Mode

**Trigger**: When document keyword search matches product names using all valid keywords together.

**Behavior**:
- Matching products are highlighted above search results
- Only keywords separated by spaces that have 2 or more characters are used for mode evaluation (e.g., "サーモス△H" only uses "サーモス")
- Clicking a product moves user into product-filtered document list
- The product document list tab is fixed to "Description/Manual" (取説)

**Example**:
```
User searches: "アルミサッシ 窓"
→ System finds products matching both keywords
→ Shows products in pickup section
→ User clicks product → filtered document list
```

## Limited Mode

**Trigger**: When full AND matching does not find a product, but exactly one keyword finds product candidates.

**Behavior**:
- Matching products are highlighted above search results
- Only keywords separated by spaces that have 2 or more characters are used for mode evaluation (e.g., "サーモス△H" only uses "サーモス")
- Clicking a product moves user into product-filtered document list
- The product document list tab is fixed to "Description/Manual" (取説)
- One-character keywords are ignored for mode detection

**Example**:
```
User searches: "アルミ 窓 修理"
→ Full match: no products
→ "アルミ" alone: finds products
→ Enter limited mode with "アルミ" products
→ User can refine search
```

## Advanced Search Precision Strategy

### Search Keywords Length Control (Planned/Evaluation)
**Rationale**: For very short keywords (<= 3 characters), semantic/vector search accuracy tends to be poor because there is not enough context for the model to find high-precision matches.

**Proposed Strategy**:
- **Keyword-only mode**: If input keyword is <= 3 characters, disable Vector search and perform only Keyword search (Morpheme analysis).
- **Fallback Mechanism**: Perform Keyword search first; if results = 0, then trigger Vector search to ensure users don't get an empty result page.
- **Prefix match control**: Establish a minimum character limit before triggering prefix matching (e.g. for codes like "ACL-100A") to prevent noise in search results.

## Interpretation

These modes improve UX when users search for documents using terms that are actually product names or partially product-oriented queries. The system intelligently detects product context and guides users to relevant documents.

## Interview Talking Points

| Feature | BrSE Explanation |
|---------|------------------|
| Pickup mode | "When users search for documents but use product names, we show matching products first to help them narrow down quickly." |
| Limited mode | "If partial keywords match products, we guide users into a product-filtered view instead of showing irrelevant results." |
| Hybrid search | "We combine morphological analysis (kuromoji) with semantic search (OpenAI embeddings) and rerank with RRF for best results." |
