# GEMINI.md — Yano Life System

> **Gemini entrypoint.** This repo uses a shared cross-AI instruction set. To avoid duplication, the authoritative rules live in two files — read them first:
>
> 1. **`AGENTS.md`** — cross-AI shared instructions (rules summary + workflow orchestration + folder map).
> 2. **`CLAUDE.md`** — full authoritative repo guide (source of truth; follow it when anything conflicts).

## Quick Rules (see AGENTS.md / CLAUDE.md for full)

- **Language:** Talk to user in **Vietnamese** (informal "tui" style when appropriate). Gym exercise names stay English. Don't over-explain.
- **Privacy:** Sensitive personal data (health, mood, body). Never make repo public; never paste sensitive content to external services unless user explicitly asks; don't invent personal data.
- **Logs:** Facts first. Unknown fields stay blank (`(not logged)`), never guessed. Don't estimate health/nutrition numbers.
- **Git:** Repo stays private. Check status/diff before commit. Don't push unless user asks.

## Workflow Orchestration (token-efficient)

Before any multi-step task, **read `workflows/README.md`**. Use the model-tier pattern (Extract → Analyze → Format) to save ~77% tokens while preserving quality on reasoning steps.

**Gemini tier mapping — pick the newest model in each class at runtime, don't hardcode:**
- Lightweight (extract/search/format) → current **Flash-class** model
- Reasoning (analyze/decisions/synthesis) → current **Pro / highest-class** model
- Balanced (generation) → current **Flash/mid-class** model

> ⚠️ Google ships new Gemini versions fast (1.5 → 3.x and beyond). Resolve each tier to whatever Gemini model is best available now — the doc pins *tiers*, not version numbers.

Reference: `workflows/weekly-gym-review.js` + `workflows/README.md` (has self-selection pseudocode).
