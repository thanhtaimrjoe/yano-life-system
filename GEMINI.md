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

### Standalone GCP Gemini Workflow (Active)
In this repository, the main weekly review workflow `workflows/weekly-gym-review.js` has been customized as a fully functional, zero-dependency Node.js script that runs locally on your machine and communicates directly with GCP Vertex AI's Gemini endpoints.

- **GCP Project:** `yano-brse-ai-api`
- **Region:** `us-central1`
- **Models Used:**
  - **Lightweight (Extract/Format):** `gemini-2.5-flash`
  - **Reasoning (Analyze):** `gemini-2.5-pro` (Provides deep progressive overload reasoning & adjustments)

- **How to execute:**
  Run the script directly using Node.js:
  ```bash
  # Run for the current week and year
  node workflows/weekly-gym-review.js

  # Run for a specific week and year (e.g., Week 22 of 2026)
  node workflows/weekly-gym-review.js --week 22 --year 2026
  ```

- **Authentication:**
  The script automatically uses your local `gcloud` CLI credentials. Ensure you have run:
  ```bash
  gcloud auth application-default login
  # and/or
  gcloud config set project yano-brse-ai-api
  ```
  The script retrieves the active access token via `gcloud auth print-access-token` dynamically.

Reference: [weekly-gym-review.js](file:///Users/taiht/Documents/yano-life-system/workflows/weekly-gym-review.js) + [workflows/README.md](file:///Users/taiht/Documents/yano-life-system/workflows/README.md).

