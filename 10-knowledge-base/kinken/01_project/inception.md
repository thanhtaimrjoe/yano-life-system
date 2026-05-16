---
name: project_kinken_inception
description: KINKEN project purpose, product vision, scope, stakeholders, schedule, risks, and priorities.
type: project
originSessionId: b37d84e1-f8b9-48d3-b090-b3afc2a6deca
updated: 2026-05-05
---

# KINKEN Inception Deck (プロジェクト方針)

**Updated**: 2026-05-05

---

## 1. Project Purpose (我々はなぜここにいるのか)

### Three Core Objectives

#### ① Enable Self-Service Information Access
- Centralize and organize information for easy discovery
- Allow users of all skill levels to quickly find what they need
- Empower users to solve problems independently

#### ② Seamless Integration with Internal Systems
- Connect smoothly with sales management and inquiry systems
- Align with user workflows and business processes
- Enable uninterrupted work progression

#### ③ Serve as LIXIL Product Information Platform
- Standardize product information across systems
- Provide reusable search APIs for other services
- Optimize development/operation/maintenance costs while improving functionality

---

## 2. Product Vision - Elevator Pitch

### For End Users (Contractors, Dealers, LIXIL Internal)

**Target**: Users who need to find information about LIXIL metal products

**Product**: "Metal Product Information Search" service

**Value**: 
- Centralized and organized metal product information
- Intuitive search for anyone to find needed information
- Seamless connection to downstream work

**Advantage over current system**: 
- Find information even without knowing where it lives
- Visually clear and intent-aligned search results

### For Other Systems/Services

**Target**: LIXIL internal systems wanting to leverage product information

**Product**: "LIXIL Product Information Platform" - unified database with generic search API

**Value**:
- Integrated product-related information
- Easy-to-use generic interface

**Advantage over building separately**:
- Improved development efficiency and reduced costs
- High-performance, high-quality search across various product information

---

## 3. Project Priorities (トレードオフスライダー)

| Category | Item | Priority | Zone |
|----------|------|----------|------|
| **Quality** | Minimum quality (no critical bugs) | ◆◆◆◆◆ | MUST |
| | Better UX than existing system | ◆◆◆◆ | MUST |
| | Maintainability & future extensibility | ◆◆◆◆ | MUST |
| | Search quality: at least current level | ◆◆◆ | MUST (baseline) |
| | Search quality: above PoC expectation | ◆◆◆ | Adjustable |
| **Budget** | | ◆◆◆◆◆ | MUST |
| **Schedule** | | ◆ | Adjustable (low priority) |
| **Scope** | Existing MUST functions | ◆◆◆◆ | Adjustable |
| | Low-frequency existing functions | ◆◆ | Adjustable (low priority) |
| | Additional features - MUST | ◆◆◆◆ | Adjustable |
| | Additional features - NEED | ◆◆◆ | Adjustable |
| | Additional features - WANT | ◆◆◆ | Adjustable |

> **Success Line**: Items to the right of center line = MUST achieve

---

## 4. Scope (やらないことリスト)

### ✅ In Scope
- Existing KINKEN/SAGAS MUST functions (from requirements list)

### ❌ Out of Scope
- LLM integration
- Direct integration with dealer ordering systems
- Non-QA inquiry channels (phone, email)
- Search by sales period (OK if accessible via interior product info/catalog)
- Additional development on current system

### 🔲 Decide Later
- Existing NEED/WANT functions
- Integration with Parts Search Pro
- Integration with Product QA System

---

## 5. Stakeholders (プロジェクトコミュニティ)

### End Users
- **Contractors** → SR → Contact Center
- **Partners** (High Impact) → Sales → LTS (Repair) → Kumamoto CC/Transcosmos (High Impact) → Operations (High Impact)

### Information Management
- Product Information Management Dept - Metal Products Group
- Building Business Dept - Special Direct Development
- Development

### Digital Division
- Security & Infrastructure
- Design & Wireframe
- Authentication

### PIM Team
- PIM担当

### Connected Systems
- Product QA System
- Parts Search Pro
- LIXIL-X Video
- Web Catalog
- CAD Data Service
- Narebo (Search Engine)
- Electronic Product Communication
- Inspection/Repair Manual
- Business Information Site (for Contractors)
- Water Product Information Search (current SAGAS)

### Execution Structure

```
Steering Committee: Yasui, Akatsuka, Sakurai, Murai
         ↓
PO: Morita Yusuke (Product Info Mgmt Dept)
PL: Fukuda Satoru (Product Info Mgmt Dept)
PMO: Hirako
         ↓
    ┌────┴────┐
Data Prep/Ops    System Build
    ↓                ↓
Product Info    Digital    System Dev
Committee       Committee  (Guildworks)
```

---

## 6. Schedule (期間を見極める)

| Phase | Timeline |
|-------|----------|
| Requirements Definition | 2025/04 - 2025/06 |
| Design | 2025/07 - 2025/08 |
| Development | 2025/08 - 2026/01 |
| System Test | 2026/02 - 2026/03 |
| Acceptance Test | 2026/03 - 2026/04 |
| Migration | 2026/01 - 2026/04 |
| **▼ Release** | **2026/05** |

---

## 7. Project Risks (夜も眠れなくなるような問題)

### Quality / User Experience Risks

| # | Risk |
|---|------|
| 1 | Unclear operation → increased inquiries |
| 2 | Cannot find target documents |
| 3 | Slow search response time |
| 4 | Poor search accuracy (expected documents not found) |
| 5 | Incorrect information → dealer離れ from LIXIL |
| 6 | Users prefer old system (current SAGAS/KINKEN) |

### Quality / System Failure Risks

| # | Risk |
|---|------|
| 7 | High load → system delay/downtime |
| 8 | Connected system failures impact this system |
| 9 | Frequent failures → user complaints |
| 10 | Infrastructure changes needed post-launch → system renewal required |

### Security Risks

| # | Risk |
|---|------|
| 11 | Information leakage to competitors |
| 12 | Security vulnerabilities or malicious users → personal information leakage |

### Schedule Risks

| # | Risk |
|---|------|
| 13 | Schedule delays → missed deadline |
| 14 | Delays extend existing system (SAGAS/KINKEN) usage period |
| 15 | Poor team coordination → duplicate work |

### Project Management Risks

| # | Risk |
|---|------|
| 16 | Unclear or incorrect AI adoption purpose |
| 17 | Impact from other system replacements |
| 18 | Insufficient cooperation from other departments |
| 19 | Conflicting opinions → unclear direction |

### Platform / Data Risks

| # | Risk |
|---|------|
| 20 | Insufficient search platform standardization → per-system modifications needed |
| 21 | Cannot proceed with downstream system integration |
| 22 | Insufficient data preparation/migration with connected systems |
| 23 | Screen-first approach → data doesn't fit screens |

---

## Interview Talking Points

### Elevator Pitch (2 minutes)
> "KINKEN is a document search system for LIXIL metal products with 13M documents and 8.8M product records. It replaces the legacy SAGAS system and serves two purposes: (1) end-user search for contractors and dealers, and (2) a shared product information platform for other LIXIL systems. The project prioritizes quality and maintainability over schedule, with a phased release starting May 2026."

### Key Decision Points
- **Scope management**: Clear "do/don't/decide later" list prevents scope creep
- **Risk-driven planning**: 23 identified risks with mitigation strategies
- **Dual product vision**: Both end-user tool and platform API
- **Stakeholder alignment**: Multiple committees ensure cross-functional buy-in
