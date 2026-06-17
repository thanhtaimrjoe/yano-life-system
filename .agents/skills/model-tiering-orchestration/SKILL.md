---
name: model-tiering-orchestration
description: "Orchestrate heavy tasks using a cost-efficient, high-quality, token-saving Extract -> Analyze -> Format pipeline across different model tiers (Lightweight, Balanced, Reasoning)."
---

# Model-Tiering & Cross-AI Orchestration

This skill teaches Antigravity agents how to run heavy, context-hungry, or complex tasks (such as full codebase audits, major refactoring, documentation syncs, weekly summaries, or batch test generation) across *any* repository on the host machine. 

By applying a structured **Extract -> Analyze -> Format** pipeline, agents reduce token costs by up to ~77%, prevent context bloat, eliminate hallucinations, and ensure high-fidelity reasoning.

---

## 1. Core Architecture: The Pipeline

For any complex, multi-file task, do NOT try to read all files and write the solution in a single conversational turn. Instead, orchestrate the task using the following three phases:

```text
Extract (Lightweight) ---> Analyze (Reasoning) ---> Format (Balanced)
        |                          |                         |
        v                          v                         v
  Broad scans &              Deep synthesis &         Final markdown/
  raw fact-finding            logical decisions        code generation
```

### Phase A: Extract (Lightweight Tier)
* **Goal**: Scan files, search codebases, and extract *only* relevant raw facts, code blocks, or data.
* **Model Class**: Use the fastest, cheapest model available (e.g., Flash-class, mini-class, or lightweight subagents like `research`).
* **Output**: A highly structured temporary document (JSON or markdown list of facts) saved in a scratch space (e.g., `<appDataDir>/brain/<id>/scratch/` or `.gitignored` workspace folder). 
* **Rule**: *Strictly facts only.* No analysis, no suggestions, no fluff.

### Phase B: Analyze (Reasoning Tier)
* **Goal**: Process the extracted facts, identify patterns, make architectural decisions, plan code modifications, or form recommendations.
* **Model Class**: Use the highest-capability reasoning model available (e.g., Pro-class, frontier-reasoning class models).
* **Input**: *Only* the structured facts extracted in Phase A. Do not feed raw, massive logs or irrelevant file code blocks here.
* **Output**: A clear, logic-heavy plan, design document, or decision set.

### Phase C: Format / Generate (Balanced Tier)
* **Goal**: Write the final code modifications, templates, or markdown logs.
* **Model Class**: Use general/mid-tier models optimized for code/markdown generation.
* **Output**: The final user-facing files or implementation commits.

---

## 2. Triggering & Orchestration Steps

When the user requests a heavy task in any repository:

### Step 1: Detect & Plan
* Check if the task is heavy (spans multiple files, requires broad codebase scans, or reads large text files).
* Map out the inputs, target outputs, and the schema of the intermediate structured data.

### Step 2: Delegate Fact Extraction
* Define a specialized subagent (e.g., using `define_subagent` and `invoke_subagent`) or run local terminal scripts to scan the codebase.
* Compile the findings into a structured, localized format.
* **Anti-Hallucination Guard**: If some data points or fields are missing, keep them blank or mark them as `(not logged)` or `Unknown`. Never estimate or invent details.

### Step 3: Run Deep Reasoning
* Evaluate the compiled findings using high-level logical reasoning.
* If performing a code refactoring or architectural modification, write out a formal `implementation_plan.md` artifact first for the user to review.

### Step 4: Generate & Commit
* Apply the proposed changes to the targeted files.
* Verify the changes (run compile checks, linting, or tests where available).
* Keep commit messages concise and clean.

---

## 3. Best Practices & Rules

> [!IMPORTANT]
> **Factual Grounding First**
> Always complete the extraction phase before starting the analysis phase. Never guess or jump to conclusions without structured facts.

> [!TIP]
> **Local-First Privacy**
> Ensure private data (credentials, secret keys, sensitive health or personal records) remains strictly local on the host machine. Do not pipe raw, sensitive, unstructured contents to external public endpoints.

> [!CAUTION]
> **Keep Context Clean**
> Avoid dumping entire 1000-line files into the active main conversation chat. Use subagents or local tools to extract only the target segments.

---

## 4. Example: Codebase Audit Walkthrough

Here is how an agent should execute a massive codebase audit for security or standard violations using this skill:

1. **Extract (Lightweight)**:
   * Spawn a `research` subagent to run grep searches across the project looking for API key hardcodings, legacy library imports, or outdated standard patterns.
   * Write the output to `<appDataDir>/brain/<conversation_id>/scratch/audit_raw_findings.json`.
2. **Analyze (Reasoning)**:
   * Read the structured JSON file.
   * Group findings by severity (High, Medium, Low).
   * Evaluate which architectural patterns should replace the violations.
3. **Format (Balanced)**:
   * Generate an `audit_results.md` artifact showing a beautiful, clear markdown table of the findings and step-by-step remediation steps.
