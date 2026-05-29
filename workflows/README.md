# Workflows — Multi-Agent Orchestration Patterns

This folder contains reusable workflow scripts demonstrating **token-efficient multi-agent orchestration** patterns.

## Philosophy

**Token efficiency through model tier assignment:**
- Use lightweight models (Haiku, GPT-3.5, Gemini Flash) for simple tasks (extraction, formatting)
- Use reasoning models (Opus, GPT-4, Gemini Pro) for complex analysis
- Use balanced models (Sonnet, GPT-4-turbo) for structured generation

**Typical savings: 60-80% token reduction** compared to using heavyweight models for everything.

## Pattern: 3-Phase Pipeline

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   EXTRACT   │────▶│   ANALYZE   │────▶│   FORMAT    │
│  (Haiku)    │     │   (Opus)    │     │  (Sonnet)   │
│  ~10-15k    │     │  ~40-50k    │     │  ~20-30k    │
└─────────────┘     └─────────────┘     └─────────────┘
     Fast              Deep              Balanced
   extraction        reasoning         generation
```

**Total: ~70-95k tokens** vs **~250k tokens** (all-Opus)

## Available Workflows

### `weekly-gym-review.js`
**Purpose:** Generate weekly gym review with pattern analysis and recommendations.

**Phases:**
1. **Extract (Haiku)** — Parse gym session markdown files, extract structured data
2. **Analyze (Opus)** — Analyze progressive overload, recovery, form issues, generate recommendations
3. **Format (Sonnet)** — Generate markdown weekly review

**Usage (Claude Code):**
```javascript
Workflow({
  name: 'weekly-gym-review',
  args: { week: 22, year: 2026 }
})
```

**Token efficiency:**
- All-Opus: ~250k tokens
- Mixed-tier: ~58k tokens
- **Savings: 77%**

## Adapting to Other AI Systems

These workflows use **Claude Code syntax** (`agent()`, `phase()`, `log()`), but the **orchestration pattern** is portable:

### For ChatGPT (OpenAI)
```python
# Phase 1: Extract (GPT-3.5-turbo)
gym_data = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": extract_prompt}]
)

# Phase 2: Analyze (GPT-4)
analysis = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": analyze_prompt}]
)

# Phase 3: Format (GPT-4-turbo)
markdown = openai.ChatCompletion.create(
    model="gpt-4-turbo",
    messages=[{"role": "user", "content": format_prompt}]
)
```

### For Gemini (Google)
```python
# Phase 1: Extract (Gemini Flash)
gym_data = genai.GenerativeModel('gemini-1.5-flash').generate_content(extract_prompt)

# Phase 2: Analyze (Gemini Pro)
analysis = genai.GenerativeModel('gemini-1.5-pro').generate_content(analyze_prompt)

# Phase 3: Format (Gemini Flash)
markdown = genai.GenerativeModel('gemini-1.5-flash').generate_content(format_prompt)
```

### For Custom AI Systems (Codex, Antigravity, etc.)
1. **Identify your model tiers:**
   - Lightweight: fast, cheap, good for extraction/formatting
   - Reasoning: slow, expensive, good for analysis/decisions
   - Balanced: middle ground for generation

2. **Map phases to tiers:**
   - Extract → Lightweight
   - Analyze → Reasoning
   - Format → Balanced

3. **Implement pipeline:**
   - Sequential: Phase 1 → Phase 2 → Phase 3
   - Parallel: Multiple Phase 1 agents → Single Phase 2 synthesis

## Design Principles

### 1. Breadth-First with Lightweight Models
Use cheap models to scan broadly, then expensive models to analyze deeply.

**Example:**
```javascript
// Bad: Opus scans 100 files (expensive)
const analysis = await agent('Analyze all gym files', {model: 'opus'})

// Good: Haiku scans 100 files, Opus analyzes summary
const files = await agent('List all gym files', {model: 'haiku'})
const analysis = await agent(`Analyze: ${files}`, {model: 'opus'})
```

### 2. Structured Output with Schemas
Force structured output to avoid parsing errors and enable type-safe pipelines.

```javascript
const data = await agent(prompt, {
  schema: {
    type: 'object',
    properties: {
      sessions: { type: 'array' },
      totalCount: { type: 'number' }
    }
  }
})
// data is validated JSON, not free-form text
```

### 3. Parallel Extraction, Sequential Analysis
Extract data in parallel (independent tasks), analyze sequentially (needs all data).

```javascript
// Parallel: 3 Haiku agents run concurrently
const [gym, meals, sleep] = await parallel([
  () => agent('Extract gym', {model: 'haiku'}),
  () => agent('Extract meals', {model: 'haiku'}),
  () => agent('Extract sleep', {model: 'haiku'}),
])

// Sequential: 1 Opus agent analyzes combined data
const analysis = await agent(`Analyze: ${gym}, ${meals}, ${sleep}`, {model: 'opus'})
```

### 4. Model Override Only When Confident
Default to inheriting main session model. Override only when you're certain a different tier fits.

```javascript
// Default: inherit main session model (usually correct)
await agent('Generate report')

// Override: only when task clearly needs different tier
await agent('Extract raw data', {model: 'haiku'})  // Simple extraction
await agent('Analyze patterns', {model: 'opus'})   // Complex reasoning
```

## Token Budget Management

When user sets token budget (e.g., `+500k`), use `budget` global:

```javascript
// Check remaining budget before expensive operation
if (budget.remaining() < 50_000) {
  log('⚠️ Low budget, skipping optional analysis')
} else {
  await agent('Deep analysis', {model: 'opus'})
}

// Dynamic scaling based on budget
const agentCount = budget.total ? Math.floor(budget.total / 100_000) : 5
log(`Spawning ${agentCount} agents based on budget`)
```

## Best Practices

### ✅ Do
- Use Haiku/lightweight for extraction, search, formatting
- Use Opus/reasoning for analysis, decisions, synthesis
- Use Sonnet/balanced for code generation, structured output
- Run independent extractions in parallel
- Document model choice in workflow meta.phases
- Measure token usage to validate efficiency

### ❌ Don't
- Use Opus for simple file reading or grep tasks
- Use Haiku for complex reasoning or critical decisions
- Run sequential tasks in parallel (creates race conditions)
- Override model without clear reason
- Forget to handle agent errors (use `.filter(Boolean)` after parallel)

## Extending This Pattern

### New Workflow Checklist
1. **Identify phases:** What are the distinct steps?
2. **Assign models:** Which tier fits each phase?
3. **Define schemas:** What structured output do you need?
4. **Estimate tokens:** Calculate expected cost per phase
5. **Test efficiency:** Compare mixed-tier vs all-heavyweight
6. **Document:** Add to this README with usage example

### Example: BrSE Interview Prep Workflow
```javascript
// Phase 1: Extract (Haiku) - List KINKEN case studies
const cases = await agent('List case studies', {model: 'haiku'})

// Phase 2: Analyze (Opus) - Generate STAR answers
const answers = await agent('Generate STAR answers', {model: 'opus'})

// Phase 3: Format (Sonnet) - Format mock interview script
const script = await agent('Format interview script', {model: 'sonnet'})
```

## References

- [sub-agent-model-strategy.md](../00-profile/sub-agent-model-strategy.md) — Detailed model assignment strategy
- [CLAUDE.md](../CLAUDE.md) — Repo structure and workflow integration
- [knowledge/00_SYSTEM/Workflows.md](../knowledge/00_SYSTEM/Workflows.md) — Knowledge base workflow patterns

## Contributing

When adding new workflows:
1. Follow 3-phase pattern (Extract → Analyze → Format)
2. Document token efficiency gains
3. Add portability notes for other AI systems
4. Include usage examples
5. Update this README
