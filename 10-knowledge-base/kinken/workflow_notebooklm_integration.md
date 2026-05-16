---
name: workflow_notebooklm_integration
description: Workflow for extracting KINKEN specs from NotebookLM
type: project
---

# NotebookLM Integration Workflow

## Overview
Workflow để extract thông tin từ NotebookLM (Google Notebook) vào KINKEN project documentation.

## Workflow Steps

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│  NotebookLM │────▶│  Copy-paste │────▶│   Claude    │
│  (Query)    │     │  (Answer)   │     │   (Result)  │     │  (Process)  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                               │
                                                               ▼
                                                      ┌─────────────┐
                                                      │  KINKEN     │
                                                      │  Project    │
                                                      │  Folder     │
                                                      └─────────────┘
```

## Detailed Steps

### Step 1: Query NotebookLM
User query NotebookLM với prompt cụ thể:
```
NotebookLM: Lấy thông tin về [topic] từ notebook [name]
```

### Step 2: Copy-paste Result
User copy-paste kết quả từ NotebookLM vào Claude chat.

### Step 3: Claude Process & Save
Claude:
1. Extract key information
2. Format the content (Markdown)
3. Save vào đúng folder trong `projects/kinken/`

## Content Mapping

| NotebookLM Content | Output File | Purpose |
|-------------------|-------------|---------|
| 機能一覧 (Function List) | `03_features/function_list.md` | Feature specifications |
| 物理モデル項目整理 | `02_architecture/physical_model.md` | Database schema |
| API仕様 | `03_features/api_specs.md` | API documentation |
| データフロー詳細 | `02_architecture/data_flow.md` | Data pipeline |
| テストケース | `05_interview/test_cases.md` | Test reference |
| インデックス設計 | `02_architecture/index_design.md` | ES index config |

## Prompt Templates

### For Function List
```
NotebookLM: Lấy toàn bộ nội dung từ file 機能一覧, bao gồm:
- Function name
- Description
- Input/Output parameters
- Business logic
```

### For Physical Model
```
NotebookLM: Lấy thông tin từ 物理モデル項目整理:
- Table names
- Column definitions
- Data types
- Relationships
```

### For API Specs
```
NotebookLM: Lấy thông tin từ API仕様:
- Endpoint URL
- Method (GET/POST)
- Request body
- Response format
- Error codes
```

## Notes

- User control: User quyết định nội dung nào cần extract
- Claude focus: Processing và organization, không đọc tài liệu thừa
- Token efficient: Chỉ xử lý content được copy-paste
