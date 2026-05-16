---
name: project_kinken_pickup_limited_mode
description: KINKEN Pickup Mode and Limited Mode logic for intelligent product suggestion during document search.
type: project
updated: 2026-05-05
---

# KINKEN Pickup Mode & Limited Mode

**Updated**: 2026-05-05  
**Source**: Function List - Pickup Mode and Limited Mode.csv from workspace

---

## Overview

When users search for documents using keywords that match product names, KINKEN intelligently detects this and offers product suggestions. This improves UX by guiding users to product-filtered document lists.

---

## 1. Pickup Mode (ピックアップモード)

### Trigger Condition

**All keywords (AND logic) match product names**

- User searches with multiple keywords separated by spaces
- All keywords (2+ characters each) together find matching products
- System enters Pickup Mode

### Behavior

1. **Display**: Show matching products above search results (max 10 products)
2. **Sorting**: Products sorted by name (昇順)
3. **User Action**: Click product → filtered document list for that product
4. **Tab Lock**: Document list tab fixed to "Description/Manual" (取説)
5. **Access Control**: Only show products user has permission to view

### Example

```
User searches: "サーモス 防火戸"
↓
System finds products matching BOTH keywords
↓
Pickup Mode activated
↓
Shows matching products above results
↓
User clicks product → filtered document list
```

### Keyword Filtering Rules

- **Minimum length**: 2+ characters per keyword
- **Separator**: Space character
- **Example**: "サーモス△H" → only "サーモス" used (H is 1 char)

---

## 2. Limited Mode (限定モード)

### Trigger Condition

**Full AND match fails, but exactly ONE keyword matches products**

- User searches with multiple keywords
- All keywords together find 0 products (Pickup Mode fails)
- Exactly 1 keyword (when tested individually) finds products
- System enters Limited Mode

### Behavior

1. **Display**: Show matching products above search results (max 10 products)
2. **Sorting**: Products sorted by name (昇順)
3. **User Action**: Click product → filtered document list
4. **Keyword Refinement**: Remaining keywords used to filter documents
5. **Tab Lock**: Document list tab fixed to "Description/Manual" (取説)
6. **Access Control**: Only show products user has permission to view

### Example

```
User searches: "サーモス 交換"
↓
Full match (both keywords): 0 products → Pickup Mode fails
↓
Individual keyword test:
  - "サーモス": 1+ products ✓
  - "交換": 1+ products ✓
↓
Result: 2 keywords match → Limited Mode NOT triggered
(Limited Mode only if exactly 1 keyword matches)
```

### Another Example

```
User searches: "サーモス 交換 料金"
↓
Full match (all 3 keywords): 0 products → Pickup Mode fails
↓
Individual keyword test:
  - "サーモス": 1+ products ✓
  - "交換": 1+ products ✓
  - "料金": 0 products ✗
↓
Result: 2 keywords match → Limited Mode NOT triggered
```

### Correct Limited Mode Example

```
User searches: "アルミ 窓 修理"
↓
Full match (all 3 keywords): 0 products → Pickup Mode fails
↓
Individual keyword test:
  - "アルミ": 1+ products ✓
  - "窓": 0 products ✗
  - "修理": 0 products ✗
↓
Result: Exactly 1 keyword matches → Limited Mode activated
↓
Shows products matching "アルミ"
↓
User clicks product → filtered document list
↓
Document search uses remaining keywords: "窓 修理"
```

---

## 3. Processing Flow (処理フローのイメージ)

```
1. Split keywords by space, exclude 1-character keywords
   Example: "サーモス 交換 H" → ["サーモス", "交換"]

2. Search products using ALL keywords (AND logic)
   If 1+ results → PICKUP MODE ✓

3. If 0 results, count how many keywords individually find products
   - 0 keywords match → NO MODE (normal search)
   - 1 keyword matches → LIMITED MODE ✓
   - 2+ keywords match → NO MODE (ambiguous)
```

---

## 4. Test Cases

| Keywords | Full Match | Individual Matches | Mode | Reason |
|----------|-----------|-------------------|------|--------|
| サーモス | 1+ | N/A | Pickup | Single keyword matches |
| サーモス 防火戸 | 1+ | N/A | Pickup | All keywords match together |
| サーモス H | 1+ | N/A | Pickup | "H" excluded (1 char), only "サーモス" used |
| サーモス 交換 | 0 | サーモス:1+, 交換:1+ | None | 2 keywords match individually |
| サーモス 交換 料金 | 0 | サーモス:1+, 交換:1+, 料金:0 | None | 2 keywords match individually |
| アルミ 窓 修理 | 0 | アルミ:1+, 窓:0, 修理:0 | Limited | Exactly 1 keyword matches |

---

## 5. Interview Talking Points

### User Experience Benefit
> "Pickup and Limited modes intelligently detect when users search for documents using product names. Instead of showing irrelevant results, we guide them to product-filtered views, reducing search friction."

### Implementation Complexity
> "The logic is straightforward: Pickup Mode triggers on full AND match, Limited Mode on exactly one keyword match. We exclude single-character keywords to avoid noise from common particles."

### Access Control
> "Both modes respect user permissions. We only show products the user has access to, maintaining security while improving discoverability."

### Edge Cases
> "We handle several edge cases: single-character keywords are ignored, multiple matching keywords trigger no mode (ambiguous), and the document list tab is locked to prevent confusion."

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| 2-character minimum | Avoid noise from single-char particles (H, A, etc.) |
| Max 10 products | Balance visibility with screen real estate |
| Exactly 1 keyword for Limited Mode | Avoid ambiguity when multiple keywords match |
| Tab lock to 取説 | Simplify UX by defaulting to most common document type |
| AND logic for Pickup | Ensure high-confidence product matches |

---

## Related Documents
- [Function Design](function_design.md) - Full feature specifications
- [Search APIs](search_apis.md) - API implementation details
- [Elasticsearch](elasticsearch.md) - Search engine configuration
