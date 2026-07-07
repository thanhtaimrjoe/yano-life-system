# Opencode Adapter

Use this adapter when running workflows through Opencode (CLI tool by anomalyco, https://opencode.ai).

## Tier Mapping

| Shared tier | Opencode mapping |
|---|---|
| Lightweight | Inline tools (`grep`, `glob`, `read`) + `task` with `subagent_type: explore` for broad scans |
| Balanced | `task` with `subagent_type: general` for markdown/code generation |
| Reasoning | `task` with `subagent_type: general` + detailed reasoning prompt for synthesis and decisions |

## Key Tools

| Tool | Use in pipeline |
|---|---|
| `grep` | Content search across files (Lightweight) |
| `glob` | File discovery by pattern (Lightweight) |
| `read` | Read specific files (Lightweight) |
| `task` with `subagent_type: explore` | Fan-out extraction across multiple directories (Lightweight) |
| `task` with `subagent_type: general` | Heavy analysis, synthesis, and formatting (Reasoning / Balanced) |
| `edit` / `write` | Write final output (Balanced) |

## Typical Workflow Shape

Phase separation is done via sequential `task` calls. Each phase gets a focused prompt and returns compact structured data, not raw dumps.

```
Extract (Lightweight)  →  Analyze (Reasoning)  →  Format (Balanced)
```

### Phase 1: Extract

Use inline tools or `task` with `explore` subagent:

```text
task(description="Extract facts from logs", subagent_type="explore",
     prompt="Search X/Y/ for files matching pattern P, read them, and return structured JSON")
```

Output: compact JSON or markdown list of facts. No analysis.

### Phase 2: Analyze

Feed extracted facts into a reasoning subagent:

```text
task(description="Analyze patterns in extracted data", subagent_type="general",
     prompt="[structured facts from Phase 1] + analysis instructions")
```

Output: decisions, recommendations, plan.

### Phase 3: Format

Generate final markdown/code using a general subagent:

```text
task(description="Generate final markdown report", subagent_type="general",
     prompt="[analysis from Phase 2] + formatting rules")
```

Output: ready-to-write file content.

## Rules

- Use `task` with `explore` for broad, independent file searches. This maps to the Lightweight tier.
- Use `task` with `general` for reasoning and generation. This maps to both Reasoning and Balanced tiers — differentiate by prompt complexity, not agent type.
- Keep phase outputs compact (JSON or structured markdown). Never pass raw 1000-line dumps between phases.
- Inline tools are cheaper than delegation for small tasks. Only delegate when fan-out is real.
- Adhere to repo AGENTS.md privacy rules before sending sensitive content to any subagent.
- This file is part of the cross-AI portable workflow layer. Other AIs (Codex, Claude Code, Gemini) should read this to understand how Opencode fits into the orchestration.
