---
name: project_kinken_auth_model
description: Authentication and authorization model for different user types in KINKEN.
type: project
---

# KINKEN Authentication Model

## User Types and Access

| User Type | Authentication | Data Visibility |
|-----------|---------------|-----------------|
| Internal users | Azure/EntraID | Full access based on role |
| Partner users | EAA (External Access) | Limited to partner-relevant data |
| Business users | MyLIXIL | Business-specific documents |
| General users | None (public) | Limited browsing; detail/preview/download requires MyLIXIL |

## API Authentication

| API Type | Auth Method |
|----------|-------------|
| UI API | API key header via Apigee |
| Search Platform API | API key header via Apigee |

## Access Control Flow

```
User Request → API Gateway (Apigee) → Auth Validation → Backend API → Data
```

## Key Security Points

| Layer | Security Measure |
|-------|-----------------|
| API Gateway | Rate limiting, API key validation, routing |
| Authentication | Azure/EntraID for internal, MyLIXIL for external |
| Authorization | Role-based access control (RBAC) |
| Data | Visibility flags from PIM control what users can see |

## Domain Strategy

To separate traffic and apply specific security/routing rules, the system uses split domains:

| Environment | Purpose | URL / Strategy |
|-------------|---------|----------------|
| **PROD (Internal)** | Employees / Partners | `https://kinken.lixil.co.jp/i/` |
| **PROD (External)** | Business / General | `https://kinken.lixil.co.jp/e/` |
| **DEV** | Development / Testing | `https://dev-kinken.lixil.co.jp` |

**Security Notes**:
- **DEV Environment**: Requires **Basic Authentication** (configured via AkamaiWAF).
- **AkamaiWAF**: Used for domain mapping and WAF protection. EdgeWorker setup pending for advanced routing.

## General User Limitations

- Can browse product listings and basic information
- **Cannot** access:
  - Technical document details
  - Document preview
  - Document download
- Requires MyLIXIL authentication for full access
