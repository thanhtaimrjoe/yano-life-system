# Sub-Agent Model Assignment Strategy

## Nguyên tắc

**Token-efficient orchestration**: Assign model tier dựa trên độ phức tạp của task, không phải default hết sang model mạnh nhất.

> ⚠️ **Chọn theo TIER, không pin version.** Các hãng AI ra model mới rất nhanh (Anthropic ra Opus 4.8 ngay sau 4.7; Gemini nhảy 1.5 → 3.x). Tên model cụ thể trong doc này chỉ là **ví dụ minh hoạ** tại thời điểm viết — khi chạy, mỗi AI **tự chọn model tốt nhất hiện có** của tier tương ứng. Trong Claude Code, alias `haiku`/`sonnet`/`opus` tự resolve sang version mới nhất nên không cần sửa script.

## Model Tiers & Use Cases

### Reasoning tier (mạnh nhất — ví dụ: Opus-class)
**Khi nào dùng:**
- Phân tích logic phức tạp, multi-step reasoning
- Architectural decisions, system design
- Code review với security/performance implications
- Synthesizing insights từ nhiều nguồn
- Tasks cần high accuracy, không được sai

**Ví dụ:**
- Phân tích gap narrative cho BrSE interview prep
- Review code architecture trước khi refactor lớn
- Synthesize weekly review từ 7 ngày daily logs
- Design workflow orchestration strategy

### Balanced tier (cân bằng cost/chất lượng — ví dụ: Sonnet-class)
**Khi nào dùng:**
- Code generation, editing, refactoring
- Structured data extraction từ markdown/logs
- Translation tasks (EN ↔ VI)
- Research với scope rõ ràng
- Most general-purpose tasks

**Ví dụ:**
- Normalize gym logs into repo markdown format
- Generate mock interview questions từ KINKEN case study
- Translate technical vocabulary
- Search codebase và summarize findings

### Lightweight tier (nhanh, rẻ — ví dụ: Haiku-class)
**Khi nào dùng:**
- Simple data extraction, formatting
- File operations (copy, move, rename)
- Grep/search tasks với clear pattern
- Template filling
- Validation checks (format, structure)

**Ví dụ:**
- List all gym sessions trong tháng 5
- Extract meal logs và count protein entries
- Validate frontmatter format across files
- Find all TODO comments trong codebase
- Simple text transformations

## Implementation Patterns

### Pattern 1: Agent Tool với Model Override

```javascript
// Main session (reasoning tier) orchestrates
// Delegate simple task to lightweight tier
Agent({
  description: "List gym sessions",
  prompt: "List all gym session files in 02-gym/2026/ with their dates",
  model: "haiku"
})

// Delegate analysis to Opus
Agent({
  description: "Analyze training progression",
  prompt: "Analyze progressive overload trends from gym logs, identify plateaus",
  model: "opus"  // hoặc omit để inherit main session model
})
```

### Pattern 2: Workflow với Mixed Models

```javascript
export const meta = {
  name: 'weekly-review-pipeline',
  description: 'Compile and analyze weekly data',
  phases: [
    { title: 'Extract', detail: 'Haiku extracts raw data', model: 'haiku' },
    { title: 'Analyze', detail: 'Opus analyzes patterns', model: 'opus' },
    { title: 'Format', detail: 'Sonnet formats report', model: 'sonnet' },
  ],
}

phase('Extract')
const rawData = await parallel([
  () => agent('Extract gym sessions', { 
    model: 'haiku',
    schema: GYM_SESSIONS_SCHEMA 
  }),
  () => agent('Extract meal logs', { 
    model: 'haiku',
    schema: MEALS_SCHEMA 
  }),
  () => agent('Extract daily mood/stress', { 
    model: 'haiku',
    schema: DAILY_MOOD_SCHEMA 
  }),
])

phase('Analyze')
const insights = await agent('Analyze weekly patterns and correlations', {
  model: 'opus',
  prompt: `Raw data: ${JSON.stringify(rawData)}. Find patterns, correlations, recommendations.`
})

phase('Format')
const report = await agent('Format weekly review markdown', {
  model: 'sonnet',
  prompt: `Insights: ${insights}. Format theo template 04-weekly-review/`
})
```

### Pattern 3: Pipeline với Model Tiers

```javascript
// Breadth-first search (Haiku) → Deep analysis (Opus)
const candidates = await agent('Find all files mentioning "KINKEN"', {
  model: 'haiku',
  agentType: 'Explore'
})

const analysis = await agent('Deep analysis of KINKEN project structure', {
  model: 'opus',
  prompt: `Files: ${candidates}. Analyze architecture, identify gaps.`
})
```

## Decision Tree

```
Task complexity?
├─ Simple extraction/formatting/search
│  └─ Haiku (fast, cheap)
├─ Code generation, translation, structured research
│  └─ Sonnet (balanced)
└─ Complex reasoning, synthesis, critical decisions
   └─ Opus (accurate, thorough)

Parallel work?
├─ Many simple tasks → Haiku fleet
├─ Mixed complexity → Assign per task
└─ All critical → Opus (hoặc Sonnet nếu code-heavy)

Budget constraint?
├─ Tight → Haiku for breadth, Opus for final synthesis only
└─ Generous → Sonnet default, Opus for critical paths
```

## Cost Efficiency Examples

### ❌ Inefficient (all Opus)
```javascript
// 5 Opus agents @ ~50k tokens each = 250k tokens
await parallel([
  () => agent('List gym files'),           // Opus overkill
  () => agent('List meal files'),          // Opus overkill
  () => agent('List daily files'),         // Opus overkill
  () => agent('Extract dates'),            // Opus overkill
  () => agent('Analyze patterns'),         // Opus appropriate
])
```

### ✅ Efficient (mixed tiers)
```javascript
// 4 Haiku @ ~10k + 1 Opus @ ~50k = 90k tokens (64% savings)
const files = await parallel([
  () => agent('List gym files', {model: 'haiku'}),
  () => agent('List meal files', {model: 'haiku'}),
  () => agent('List daily files', {model: 'haiku'}),
  () => agent('Extract dates', {model: 'haiku'}),
])

const analysis = await agent('Analyze patterns', {
  model: 'opus',
  prompt: `Files: ${JSON.stringify(files)}. Analyze.`
})
```

## Integration với Yano Life System

### Use Case 1: Weekly Review Automation (Active: GCP Vertex AI)
- **Script**: `node workflows/weekly-gym-review.js`
- **Gemini 2.5 Flash** (Lightweight): Extract raw data từ 7 ngày daily logs, gym logs, meal logs, và Format báo cáo cuối cùng
- **Gemini 2.5 Pro** (Reasoning): Analyze deep patterns, progressive overload, recovery và đưa ra recommendations/adjustments


### Use Case 2: BrSE Interview Prep
- **Haiku**: Extract KINKEN case study facts, list vocabulary
- **Opus**: Generate STAR-method answers, analyze gap narrative
- **Sonnet**: Format mock interview questions, translate technical terms

### Use Case 3: Gym Notion Sync
- **Haiku**: Verify filenames, frontmatter, and day sequence
- **Sonnet**: Format Notion-ready summaries and map schema fields
- **Opus**: (not needed for routine sync)

## Rules for AI Maintainers

1. **Default to Sonnet** nếu không chắc → balanced choice
2. **Haiku cho breadth** (search, list, extract) → save tokens for depth
3. **Opus cho critical paths** (decisions, synthesis, complex reasoning)
4. **Omit model param** để inherit main session model (thường đúng)
5. **Document model choice** trong workflow meta.phases khi override
6. **Measure token usage** qua /workflows hoặc budget.spent() để optimize

## References

- Agent tool: `model` parameter (sonnet | opus | haiku)
- Workflow agent(): `opts.model` parameter
- Main session model: inherited by default nếu không override
- Token budget: `budget.total`, `budget.spent()`, `budget.remaining()`
