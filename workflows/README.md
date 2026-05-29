# Workflows — Multi-Agent Orchestration Patterns

This folder contains reusable workflow scripts demonstrating **token-efficient multi-agent orchestration** patterns.

## Philosophy

**Token efficiency through model tier assignment** — match each step to a *capability tier*, not a pinned model version:
- **Lightweight tier** (fast, cheap) → simple tasks: extraction, search, formatting
- **Reasoning tier** (deep, expensive) → complex analysis, decisions, synthesis
- **Balanced tier** (mid-cost) → structured generation (code, markdown)

**Typical savings: 60-80% token reduction** compared to using a heavyweight model for everything.

> ⚠️ **Pick models by tier, not by name. Self-select the best currently-available model.**
> AI vendors ship new models constantly (e.g. Anthropic released Opus 4.8 shortly after 4.7; Google moved from Gemini 1.5 → 3.x quickly). Any specific model name in this doc goes stale fast. **At runtime, each AI should choose the best model its provider currently offers in each tier** — do not hardcode a version. Specific names below are illustrative examples only, not requirements.

## Pattern: 3-Phase Pipeline

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   EXTRACT    │────▶│   ANALYZE    │────▶│   FORMAT     │
│ Lightweight  │     │  Reasoning   │     │  Balanced    │
│  ~10-15k     │     │  ~40-50k     │     │  ~20-30k     │
└──────────────┘     └──────────────┘     └──────────────┘
   Fast/cheap          Deep reasoning       Mid-cost gen
   extraction          (quality matters)    structured out
```

**Total: ~70-95k tokens** vs **~250k tokens** (all-heavyweight)

## Available Workflows

### `weekly-gym-review.js`
**Purpose:** Generate weekly gym review with pattern analysis and recommendations.

**Phases:**
1. **Extract (lightweight tier)** — Parse gym session markdown files, extract structured data
2. **Analyze (reasoning tier)** — Analyze progressive overload, recovery, form issues, generate recommendations
3. **Format (balanced tier)** — Generate markdown weekly review

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

These workflows use **Claude Code syntax** (`agent()`, `phase()`, `log()`), but the **orchestration pattern** is portable. The key rule everywhere: **resolve each tier to the best model your provider currently offers** — don't pin a version.

### Self-selecting the model (recommended)
Keep a small tier→model map you can update in one place, or query the provider's model list at runtime and pick by capability/cost. Pseudocode:

```python
# Define tiers by ROLE, resolve to whatever is best/newest right now.
# Update this map (or fetch it dynamically) as new models ship.
TIERS = {
    "lightweight": pick_cheapest_fast_model(provider),   # extraction/format
    "reasoning":   pick_strongest_model(provider),        # analysis/decisions
    "balanced":    pick_mid_tier_model(provider),         # generation
}

gym_data = call(TIERS["lightweight"], extract_prompt)
analysis = call(TIERS["reasoning"],   analyze_prompt)
markdown = call(TIERS["balanced"],    format_prompt)
```

### Per-provider notes (model names are EXAMPLES — verify the current best before using)

**OpenAI / ChatGPT / Codex**
- Lightweight → current cheapest fast model (e.g. a "mini"/"nano"/turbo-class model)
- Reasoning → current strongest reasoning model (e.g. a frontier GPT or `o`-series model)
- Balanced → current mid-tier general model

**Google / Gemini**
- Lightweight → current "Flash"-class model
- Reasoning → current "Pro"-class (or highest) model
- Balanced → current Flash/mid-class model

**Anthropic / Claude**
- Lightweight → current Haiku-class model
- Reasoning → current Opus-class model (latest Opus, whatever the newest version is)
- Balanced → current Sonnet-class model

> Always check the provider's latest lineup at runtime. The names above rotate frequently; the **tier roles** do not.

### For Custom AI Systems (Antigravity, etc.)
1. **Identify your model tiers:** lightweight (fast/cheap), reasoning (slow/expensive/smart), balanced (mid).
2. **Map phases to tiers:** Extract → Lightweight, Analyze → Reasoning, Format → Balanced.
3. **Resolve tier → newest available model** at runtime; don't hardcode.
4. **Implement pipeline:** Sequential (Phase 1→2→3) or parallel (many extractors → one synthesizer).

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
- Use the **lightweight tier** for extraction, search, formatting
- Use the **reasoning tier** for analysis, decisions, synthesis
- Use the **balanced tier** for code generation, structured output
- Run independent extractions in parallel
- Document the *tier* (not a pinned version) in workflow `meta.phases`
- Measure token usage to validate efficiency

> **Claude Code note:** the `model: 'haiku' | 'sonnet' | 'opus'` aliases are *tier* aliases — they auto-resolve to the latest version of each tier. So `weekly-gym-review.js` already self-updates when Anthropic ships a new Opus/Sonnet/Haiku; no edit needed. Other providers: resolve the tier yourself (see "Self-selecting the model" above).

### ❌ Don't
- Use the reasoning tier for simple file reading or grep tasks
- Use the lightweight tier for complex reasoning or critical decisions
- Run sequential tasks in parallel (creates race conditions)
- **Hardcode a specific model version** — pick by tier, resolve to newest available
- Override the tier without a clear reason
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
