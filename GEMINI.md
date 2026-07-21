# Yano Life System (Event Sourcing Architecture)

This repository uses an **Event Sourcing** architecture for life-tracking.
Do NOT look for old folders like `01-daily` or `02-gym`.

## Core Documentation (Must Read)
1. `system/context.yaml` - Tier 1: Immutable context and agent rules.
2. `agents/RULES.md` - The SSOT contract for all agent interactions.
3. `log/` - Append-only JSONL event stream.
4. `knowledge/` - Durable knowledge base.

Read `agents/RULES.md` before taking any action.
