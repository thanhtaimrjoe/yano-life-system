---
name: kinken_interview_prep_comprehensive
description: Comprehensive interview prep notes for KINKEN BrSE interview - formatted from NotebookLM answers
type: project
updated: 2026-05-05
---

# KINKEN Interview Prep - Comprehensive Notes

**Updated**: 2026-05-05  
**Source**: NotebookLM analysis of all KINKEN project files

---

## 1. Project Overview

### What is KINKEN?
**KINKEN** là hệ thống duyệt và tìm kiếm tài liệu các sản phẩm nhôm kính cho LIXIL, thay thế cho hệ thống SAGAS cũ.

### Key Objectives
- **Performance**: Tìm kiếm cực nhanh (~3 giây)
- **Accuracy**: Hybrid Search (keyword + semantic) để hiển thị tài liệu chính xác nhất
- **User Experience**: Cải thiện UX so với SAGAS cũ

### Scale
| Metric | Value |
|--------|-------|
| Documents | ~13 triệu |
| Products | ~8.8 triệu mã sản phẩm |
| QA Records | ~1.7 triệu hồ sơ |

### Tech Stack

| Layer | Technology | Why? |
|-------|-----------|------|
| **Backend** | Python 3.13 + FastAPI | Auto-docs, type validation tự động |
| **Frontend** | TypeScript + React + Next.js | SEO support qua SSR/SSG |
| **ETL** | Databricks (PySpark/Pandas) | Tối ưu chi phí cho batch processing |
| **Search** | Elasticsearch 9.x + OpenAI embeddings | Hybrid search (keyword + semantic) |
| **Cloud** | GCP | Elastic Cloud cho ES |

---

## 2. Database Schema Design

### Surrogate Keys vs PIM Codes

**Decision**: Dùng surrogate keys (ID tự tăng/UUID) thay vì PIM codes

**WHY:**
> Tách biệt (decouple) hệ thống định danh nội bộ của KINKEN khỏi mã của hệ thống bên ngoài (PIM). Nếu LIXIL thay đổi định dạng mã sản phẩm, thiết kế cơ sở dữ liệu của KINKEN không bị ảnh hưởng và không làm vỡ các logic liên kết.

**Interview Answer:**
```
"Chúng tôi dùng surrogate keys để decouple internal IDs khỏi external codes. 
Điều này cho phép PIM thay đổi format mã sản phẩm mà không ảnh hưởng đến 
database schema và relationships trong KINKEN."
```

---

### product_labels Table Pattern

**Design**: Key-Value store (e.g., `sash_type` = `sash_door`)

**WHY:**
> Cung cấp sự linh hoạt tuyệt đối cho bộ lọc tìm kiếm. Hệ thống có thể thêm các loại filter mới dễ dàng mà không cần phải thực hiện thay đổi database schema (như thêm cột).

**Interview Answer:**
```
"product_labels là key-value store cho flexible filtering. Thay vì thêm columns 
cho mỗi filter type, chúng tôi dùng generic structure. Điều này cho phép thêm 
label types mới mà không cần schema changes."
```

---

### Access Control via visibility_level

**Design**: Row-level access control qua trường `visibility_level`

**WHY:**
> Giúp hệ thống dễ dàng ẩn/hiện sản phẩm hay tài liệu tùy thuộc vào nhóm người dùng đang đăng nhập (Internal, Partner, hay Business) mà không cần xây dựng module phân quyền rườm rà.

**Interview Answer:**
```
"visibility_level cho phép row-level access control. Chúng tôi có thể ẩn/hiện 
products và documents theo user type (Internal/Partner/Business) mà không cần 
complex role management system."
```

---

### Table Structure

| Category | Count | Notes |
|----------|-------|-------|
| **Core tables** | 12 | Standard tables |
| **Document subtype tables** | 11 | Specialized metadata per document type |

**WHY separate subtype tables:**
> Mỗi loại tài liệu có các metadata đặc thù (như bản vẽ có mã linh kiện, HDSD thì có phiên bản). Tách bảng giúp lưu metadata theo domain cụ thể hiệu quả hơn, tránh việc một bảng chung có quá nhiều cột bị null.

**Interview Answer:**
```
"Chúng tôi có 11 document subtype tables vì mỗi loại có specialized metadata. 
Manuals có version tracking, drawings có part codes, technical docs có file types. 
Generic schema sẽ có quá nhiều null columns."
```

---

## 3. Data Integration Architecture

### GCS Buckets

**3 main buckets:**

| Bucket | Purpose | Access Control |
|--------|---------|----------------|
| `collection` | Dữ liệu cấu trúc thô (CSV) | Internal only |
| `docs` | File phi cấu trúc cần xác thực | Auth required |
| `public-docs` | Tài liệu xem tự do | Public access |

**WHY separate buckets:**
> Tách biệt rõ quyền hạn truy cập (Access Control) và tối ưu hóa chi phí/tốc độ cho các file tài liệu public.

**Interview Answer:**
```
"Chúng tôi dùng 3 GCS buckets để separate concerns: collection cho raw data, 
docs cho auth-protected files, public-docs cho freely accessible content. 
Điều này đảm bảo proper access control và performance optimization."
```

---

### Data Sources

**13 data sources** tích hợp vào KINKEN:
- PIM (products, manuals, drawings, technical docs, web catalogs, CAD)
- Product QA (FAQs, past Q&A)
- Product Update DB
- Maintenance DB
- LIXIL-X (videos)
- Parts Search Pro
- MDM (product codes)

---

### PUSH vs PULL Pattern

| Pattern | How | When | Why |
|---------|-----|------|-----|
| **PUSH** | Source system exports & pushes to GCS | PIM, Product QA | Dễ nhất cho KINKEN - source tự lo logic timing |
| **PULL** | KINKEN connects to source DB/file server | Product Update, Maintenance | Legacy systems không thể thay đổi |

**Interview Answer:**
```
"Chúng tôi dùng PUSH cho systems có thể export (PIM, QA) vì source controls timing. 
PULL cho legacy systems (Product Update, Maintenance) không thể modify để support 
push. Điều này balances control với implementation complexity."
```

---

### OCR Processing for Technical Documents

**Process:**
1. Quét cấu trúc thư mục hoặc file HTML
2. Dùng URL Pattern Matching để bóc tách ID
3. Tìm các file Excel ẩn dưới các HTML
4. Đọc OCR từ Excel files

**WHY:**
> Giải quyết đặc thù các tài liệu kỹ thuật cũ thường được host dưới dạng HTML link tới các file Excel.

**Interview Answer:**
```
"Technical documents có complex pattern - HTML pages reference Excel sources. 
Chúng tôi dùng pattern matching để extract tech_doc_id từ URL, sau đó tìm Excel 
files trong subfolders hoặc root directory. Điều này handles legacy document 
structure từ old system."
```

---

### URL Mapping Rules

**Fallback strategy:**
1. Ưu tiên dùng tên file gốc
2. Nếu không có → Dùng ID để tạo URL
3. Cắt bỏ URL gốc cũ → Nối với URL format mới

**Interview Answer:**
```
"URL mapping dùng fallback strategy: filename first, then document ID. 
Chúng tôi remove old system URL patterns và append new KINKEN patterns. 
Điều này ensures seamless transition từ old URLs sang new system."
```

---

## 4. Search System

### Search Modes

| Mode | Trigger | Behavior | Why |
|------|---------|----------|-----|
| **Pickup Mode** | TẤT CẢ keywords khớp với 1 product | Highlight products above results | User đang tìm product cụ thể |
| **Limited Mode** | CHÍNH XÁC 1 keyword khớp product | Guide to product-filtered view | User có ý định về product |
| **Normal Mode** | Không có keyword nào khớp product | Standard search results | General search |

**WHY:**
> Cải thiện UX bằng cách bắt được "ý đồ" người dùng đang tìm kiếm liên quan đến sản phẩm, tự động hướng họ vào danh sách tài liệu đã được filter bằng sản phẩm đó thay vì trả ra những tài liệu không liên quan (giảm search friction).

**Interview Answer:**
```
"Search modes capture user intent. Pickup Mode khi all keywords match một product - 
chúng tôi highlight product đó. Limited Mode khi chỉ 1 keyword match - guide user 
to product-filtered view. Điều này reduces search friction và improves relevance."
```

---

### Elasticsearch Configuration

**Hybrid Search:**
- **Keyword search**: Kuromoji tokenizer (Japanese morphological analysis)
- **Semantic search**: OpenAI embeddings (`text-embedding-3-large`)
- **Ranking**: Reciprocal Rank Fusion (RRF)

**WHY:**
> Kết hợp cả việc cắt từ tiếng Nhật chính xác (cho keyword) và hiểu ngữ cảnh của từ khóa.

**Zero-downtime reindex:**
- Dùng Index Alias

**Interview Answer:**
```
"Chúng tôi dùng Hybrid Search - kết hợp kuromoji tokenizer cho accurate Japanese 
word segmentation và OpenAI embeddings cho semantic understanding. RRF algorithm 
combines scores từ cả hai. Index Alias supports zero-downtime reindex."
```

---

### Search APIs

| API Type | Method | Use Case | Why |
|----------|--------|----------|-----|
| **UI API** | GET | Frontend calls | Simple params trên URL |
| **Search Platform API** | POST | Internal systems | Complex JSON body, API Key auth |

**Interview Answer:**
```
"Chúng tôi có 2 API types: UI API (GET) cho frontend với simple params, 
Search Platform API (POST) cho internal systems với complex queries. 
Điều này separates concerns - simple cho UI, powerful cho system integration."
```

---

## 5. Project Status (SPRINT 25 - Đầu T5/2026)

### Current Phase
**SPRINT 25** - PROD Release Preparation

### Timeline

| Date | Milestone | Status |
|------|-----------|--------|
| 27/04/2026 | Beta Release | ✅ Completed |
| 13/05/2026 | Release 1 (Internal users) | 🔄 In 8 days |
| 13-15/05 | Emergency support | 📅 Planned |
| Jun 2026 | Release 2 (Public/Partners) | 📅 Planned |

### Recent Achievements
- ✅ Beta release với feedback cực kỳ tích cực
- ✅ Tốc độ duyệt nhanh
- ✅ Giải quyết vấn đề 10 năm của LIXIL

### Current Work
- 🔄 Tối ưu hóa tốc độ xem trước (preview) tài liệu
- 🔄 Xác định phương án dùng "cờ thay đổi" (flag) để tối ưu xử lý tài liệu phi cấu trúc

### Next Steps
- Release Lần 1: 13/05 (internal users)
- Emergency support: 13-15/05
- Release Lần 2: Tháng 6 (public/partners)

---

## 6. Key Design Decisions

### 3 Types of URLs (internet/intranet/extranet)

**WHY:**
> Phục vụ Access Control ở mức đường dẫn. Bằng cách lưu 3 URL khác nhau, người dùng Internet, Partner, hay Internal sẽ đi theo luồng chứng thực riêng. Nếu URL của một loại bị rỗng, tài liệu tự động ẩn đi đối với loại user đó.

**Interview Answer:**
```
"Mỗi document có 3 URLs cho different user types. Điều này enables path-level 
access control - Internet users, Partners, và Internal users đi theo different 
authentication flows. Empty URL cho một type means document hidden cho type đó."
```

---

### Priority-based Access Control

**Logic**: Internet → Partner → Internal (First match wins)

**WHY:**
> Cách tiếp cận này giúp logic cực kỳ đơn giản và dự đoán được (deterministic), tránh phải quản lý một ma trận phân quyền người dùng phức tạp.

**Interview Answer:**
```
"Access control dùng priority-based evaluation: check Internet flag first, 
then Partner, then Internal. First match wins. Điều này makes logic simple 
và deterministic, avoiding complex role management matrix."
```

---

### Version Management for Manuals

**Process:**
1. Version mới ra mắt (e.g., bản D) → Tạo record mới
2. Qua field `document_manual_previous_varsion` → Update `past_version=1` ở bản cũ (e.g., bản C)

**WHY:**
> Đảm bảo vẫn giữ lại tài liệu cũ (history) nhưng không làm tài liệu đó "làm loãng" kết quả ưu tiên trong tìm kiếm chính.

**Interview Answer:**
```
"Manual versioning tracks evolution: khi MAK-897D arrives, chúng tôi create new 
record và mark MAK-897C as past_version=1. Điều này keeps history accessible 
nhưng doesn't dilute primary search results với outdated manuals."
```

---

### Pipe-delimited Multi-values

**Pattern**: `LIXIL|TOSTEM|TOEX`

**WHY:**
> Việc gom chuỗi giúp tránh phải tạo quá nhiều các bảng trung gian (join tables) phức tạp. Đối với một hệ thống ưu tiên cho Full-text search như KINKEN, việc này duy trì cấu trúc dữ liệu phẳng linh hoạt mà hệ thống filter Elasticsearch vẫn bóc tách và xử lý tốt.

**Interview Answer:**
```
"Chúng tôi dùng pipe-delimited strings cho multi-values để avoid join tables. 
Với full-text search system như KINKEN, flat data structure này maintains 
flexibility mà Elasticsearch filters vẫn parse và process efficiently."
```

---

## Quick Reference Card

### Top 10 Interview Points

1. **KINKEN replaces SAGAS** - 13M docs, ~3s search time, hybrid search
2. **Surrogate keys** - Decouple internal IDs from external codes
3. **product_labels** - Key-value store for flexible filtering
4. **3 GCS buckets** - Separate access control boundaries
5. **PUSH vs PULL** - Balance control with implementation complexity
6. **Hybrid Search** - Kuromoji + OpenAI embeddings + RRF
7. **Search Modes** - Pickup/Limited/Normal capture user intent
8. **Priority-based access** - First match wins, simple & deterministic
9. **Version management** - Track history without diluting search
10. **Pipe-delimited** - Avoid join tables, maintain flat structure

---

## Related Documents

- [Physical Model Schema](physical_model_schema.md)
- [Data Integration Overview](data_integration_overview.md)
- [Interface Item Patterns](interface_item_patterns.md)
- [Sprint Tracking](../04_progress/sprint_tracking.md)