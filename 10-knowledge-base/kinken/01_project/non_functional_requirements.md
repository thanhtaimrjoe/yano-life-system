---
name: project_kinken_non_functional_requirements
description: KINKEN non-functional requirements including availability, performance, operations, security.
type: project
updated: 2026-05-05
---

# KINKEN Non-Functional Requirements

**Updated**: 2026-05-05  
**Source**: Non-functional requirements list.csv from workspace

---

## 1. Availability (可用性)

| # | Requirement | Target |
|---|-------------|--------|
| 1 | **Uptime** | 99.9% annually (allows several hours downtime excluding planned maintenance) |
| 2 | **Service Switch Time** | Several hours downtime acceptable for planned maintenance |
| 3 | **Recovery Target** | Within 1 business day for recovery with data restore |
| 4 | **Disaster Recovery** | Redundancy across multiple data centers in Tokyo region. Recovery within 1 day if one data center fails. **Note**: Large-scale disaster affecting entire Tokyo region is NOT covered. |

---

## 2. Performance & Scalability (性能・拡張性)

| # | Requirement | Target |
|---|-------------|--------|
| 5 | **Performance Target** | See "Baseline Metrics" sheet for detailed targets |
| 6 | **Scalability Strategy** | **Database**: Scale-up (spec increase)<br>**Application**: Scale-out (server/container increase)<br>**ElasticCloud**: Scale-up (node spec) + Scale-out (node count, shard count) |

---

## 3. Operations & Maintenance (運用・保守性)

| # | Requirement | Target |
|---|-------------|--------|
| 7 | **Operating Hours** | 24/7 uptime except planned maintenance |
| 8 | **Backup** | Daily nightly database backup. **Retention**: 7 days |
| 9 | **Monitoring** | Monitor resource usage and detect resource shortages |
| 10 | **Environment Separation** | Production fully separated from dev/test. Dev/test may have lower specs and nighttime shutdown for cost efficiency, but environment isolation maintained via instance separation. |
| 11 | **User Manual** | Created by LIXIL担当者. Guildworks provides support. |
| 12 | **Maintenance** | System shutdown required if maintenance impacts daytime operations. Announce 1 week in advance. Schedule during low-traffic hours (nighttime/early morning). If no impact, maintenance can proceed without shutdown/announcement. **Note**: Display maintenance screen during system shutdown. |
| 13 | **Supported Environments** | **OS/Browser combinations**:<br>- Windows 11 (Chrome/Edge)<br>- Mac (Chrome/Safari)<br>- iOS (Safari)<br>- Android (Chrome)<br><br>**Testing**: Both teams share testing responsibility. Fix bugs found in supported browsers. |
| 14 | **Smartphone Support** | Responsive web design.<br>**Breakpoints**:<br>- PC: ≥769px<br>- SP: ≤768px<br><br>**Reference**: [Slack discussion](https://guildworks.slack.com/archives/C07MXPMQ16U/p1759910221703359?thread_ts=1759908442.926359&cid=C07MXPMQ16U) |

---

## 4. Migration (移行性)

| # | Requirement | Target |
|---|-------------|--------|
| 15 | **Migration Method** | Defined separately in migration plan |
| 16 | **Migration Schedule** | TBD |
| 17 | **Equipment & Data** | TBD |

---

## 5. Security (セキュリティ)

| # | Requirement | Target |
|---|-------------|--------|
| 18 | **Vulnerability Testing** | Before public release, undergo LIXIL-designated application vulnerability assessment and platform vulnerability assessment. Address findings based on severity, schedule, and budget. |

---

## Interview Talking Points

### Availability Strategy
> "We target 99.9% uptime with multi-datacenter redundancy in Tokyo region. Planned maintenance windows are allowed, but we aim for minimal disruption by scheduling during low-traffic hours."

### Performance Approach
> "We use different scaling strategies per layer: database scales up (vertical), application scales out (horizontal), and Elasticsearch uses both. This gives us flexibility to optimize cost vs performance."

### Environment Strategy
> "Production is fully isolated. Dev/test environments use lower specs and nighttime shutdown for cost savings, but maintain proper separation via instance-level isolation."

### Security Posture
> "Before public release, we undergo both application and platform vulnerability assessments designated by LIXIL. Findings are prioritized and addressed based on severity and project constraints."

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| 99.9% uptime target | Balances availability needs with cost and maintenance flexibility |
| 7-day backup retention | Sufficient for most recovery scenarios while managing storage costs |
| Responsive design (769px breakpoint) | Standard breakpoint for PC/mobile distinction |
| Manual creation by LIXIL | LIXIL knows their users best; GW provides technical support |
| Vulnerability testing before public release | Risk mitigation for external-facing system |

---

## Related Documents
- [Baseline Metrics](baseline_metrics.md) - Performance targets and scale
- [Tech Stack](../02_architecture/tech_stack.md) - Infrastructure details
- [System Overview](system_overview.md) - High-level architecture
