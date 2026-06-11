# Workflows - Cross-AI Orchestration

This folder defines reusable workflow patterns for Yano Life System. The goal is to let Codex, Gemini/GCP, Claude Code, ChatGPT, and other AI tools follow the same workflow contract without pinning the repo to one vendor.

## Core Rule

Configure workflows by capability tier, not by model version.

| Tier | Use for | Runtime choice |
| --- | --- | --- |
| Lightweight | search, extraction, validation, simple formatting | cheapest fast model/tool available |
| Balanced | markdown generation, code generation, structured rewriting | mid-tier general model |
| Reasoning | analysis, decisions, synthesis, recommendations | strongest reasoning model available |

Model names change quickly. Keep repo docs version-agnostic. Provider-specific adapters should resolve the current best model at runtime.

## Standard Pipeline

```text
Extract -> Analyze -> Format
   |          |          |
   |          |          +-- Balanced tier
   |          +------------- Reasoning tier
   +------------------------ Lightweight tier
```

Typical use:

1. Extract raw facts from local markdown files.
2. Analyze patterns only after the facts are structured.
3. Format the final output using repo templates and folder rules.

## Shared Contracts

Provider implementations should share the same contracts:

- Input source rules from `AGENTS.md`.
- Output paths and frontmatter rules from repo templates.
- Structured schemas in `workflows/schemas/`.
- Provider notes in `workflows/adapters/`.
- No invented personal, health, sleep, mood, or nutrition data.
- Unknown fields must remain blank or be written as `(not logged)`.

## Provider Adapters

Read the adapter matching the AI/runtime being used:

- [Codex adapter](adapters/codex.md)
- [Gemini/GCP adapter](adapters/gemini-gcp.md)
- [Claude Code adapter](adapters/claude-code.md)
- [Generic AI adapter](adapters/generic-ai.md)

Adapters explain how each provider maps the shared tiers to its own tools and model families. The workflow logic stays the same.

## Available Implementations

### `gym-notion-migration.md`

Connector workflow for keeping `02-gym/YYYY/` markdown logs synced into the Notion database `Gym Sessions 2026`.

Use after creating or updating any gym log, including rest days:

- verify local day numbering and source file paths first
- upsert Notion by `Source File` and `Date`
- map only to properties that exist in the fetched Notion database schema

### `weekly-gym-review.js`

Standalone Gemini Vertex AI implementation for weekly gym review.

```bash
node workflows/weekly-gym-review.js
node workflows/weekly-gym-review.js --week 22 --year 2026
```

Current behavior:

- Extract: Gemini Flash-class model
- Analyze: Gemini Pro/highest-class model
- Format: Gemini Flash/mid-class model
- Writes a weekly review into `04-weekly-review/`

Important: this script is provider-specific. Other AIs should reuse the pattern and shared schemas, not the GCP auth/client code.

## Weekly Gym Review Contract

When any AI creates a weekly gym review:

1. Read gym logs from `02-gym/YYYY/`.
2. Read recovery, sleep, mood, and stress signals from `01-daily/YYYY/` when needed.
3. Read meal logs from `03-meals/YYYY/` only if nutrition is part of the review.
4. Preserve exercise names in English.
5. Keep recommendations conservative because the user is in a beginner comeback phase.
6. Do not estimate sleep, calories, protein, mood, or recovery if not logged.
7. Search for an existing `04-weekly-review/YYYY-W##.md` before creating or overwriting.
8. Use zero-padded ISO week numbers, for example `2026-W05.md`.

Recommended schemas:

- `workflows/schemas/gym-session.schema.json`
- `workflows/schemas/weekly-analysis.schema.json`

## Design Principles

### Breadth First, Depth Later

Use lightweight tools/models for broad file scanning. Use the reasoning tier only after the raw facts are compact.

### Structured Data Before Advice

Extraction should produce structured JSON or equivalent notes before analysis starts. This reduces hallucination and makes missing data visible.

### Parallel Extraction, Sequential Analysis

Independent extraction tasks can run in parallel. Analysis should usually be sequential because it needs the full extracted picture.

### Local First

This repo contains private life data. Prefer local file reads and local parsing before external APIs. Do not paste sensitive content to external services unless the user explicitly asks.

## New Workflow Checklist

1. Define the user-facing purpose.
2. Define input folders and source-of-truth rules.
3. Split work into Extract, Analyze, and Format phases.
4. Assign each phase to a tier, not a model version.
5. Add or reuse schemas under `workflows/schemas/`.
6. Add provider-specific notes only under `workflows/adapters/`.
7. Document output paths and overwrite/update behavior.
8. Test with local files and verify `git status`.

## References

- `AGENTS.md` - repo operating rules
- `CLAUDE.md` - Claude-oriented context
- `00-profile/sub-agent-model-strategy.md` - model tier strategy
- `knowledge/00_SYSTEM/Workflows.md` - durable workflow knowledge
