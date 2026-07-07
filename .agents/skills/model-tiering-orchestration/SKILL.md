---
name: model-tiering-orchestration
description: "Orchestrate heavy tasks using a cost-efficient, high-quality, token-saving Extract -> Analyze -> Format pipeline across different model tiers (Lightweight, Balanced, Reasoning)."
---

# Model-Tiering & Cross-AI Orchestration

This skill teaches Opencode how to run heavy, context-hungry, or complex tasks (such as full codebase audits, major refactoring, documentation syncs, weekly summaries, or batch generation) across *any* repository.

By applying a structured **Extract -> Analyze -> Format** pipeline, reduce token costs by up to ~77%, prevent context bloat, eliminate hallucinations, and ensure high-fidelity reasoning.

This skill is **cross-repo portable** — it works in any project, regardless of domain or folder structure. It does not reference any specific repo layout.

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
* **Tools**: `glob` for file discovery, `grep` for content search, `read` for reading specific files. For large fan-out use `task` with `subagent_type: explore`.
* **Output**: Compact structured data (JSON or markdown list of facts). Save to a variable, not a file — keep it in conversation context for the next phase.
* **Rule**: *Strictly facts only.* No analysis, no suggestions, no fluff.

### Phase B: Analyze (Reasoning Tier)
* **Goal**: Process the extracted facts, identify patterns, make architectural decisions, plan code modifications, or form recommendations.
* **Tools**: `task` with `subagent_type: general` and a detailed reasoning prompt.
* **Input**: *Only* the structured facts from Phase A. Do not feed raw, massive logs or irrelevant file code blocks.
* **Output**: A clear, logic-heavy plan, decision set, or analysis report.

### Phase C: Format / Generate (Balanced Tier)
* **Goal**: Write the final code modifications, templates, or markdown logs.
* **Tools**: `task` with `subagent_type: general` for generation, then `edit` / `write` to apply the output.
* **Output**: The final user-facing files or implementation commits.

---

## 2. Triggering & Orchestration Steps

When the user requests a heavy task in any repository:

### Step 1: Detect & Plan
* Check if the task is heavy (spans multiple files, requires broad codebase scans, or reads large text files).
* Map out the inputs, target outputs, and the schema of the intermediate structured data.

### Step 2: Delegate Fact Extraction
* Use inline tools (`glob`, `grep`, `read`) for small extraction tasks.
* For large fan-out (multiple directories, many files), use `task` with `subagent_type: explore`. Pass a focused prompt describing exactly what to search for and what format to return.
* Compile findings into a structured variable (JSON or markdown list).
* **Anti-Hallucination Guard**: If some data points or fields are missing, keep them blank or mark them as `(not logged)` or `Unknown`. Never estimate or invent details.

### Step 3: Run Deep Reasoning
* Feed the structured facts from Phase A into a `task` with `subagent_type: general`.
* The prompt should contain: the structured facts + clear analysis instructions + decision criteria.
* Keep the prompt focused — no raw file contents, just the extracted data.

### Step 4: Generate & Apply
* Use the analysis from Phase B to generate the final output.
* For code/markdown generation, use `task` with `subagent_type: general`.
* Apply changes using `edit` or `write` tools.
* Verify changes (run compile checks, linting, or tests where applicable).
* Keep commit messages concise and clean if committing.

---

## 3. Opencode Tool Mapping

| Tool | Tier | When to use |
|---|---|---|
| `grep` | Lightweight | Content search across files |
| `glob` | Lightweight | File discovery by pattern |
| `read` | Lightweight | Reading specific files |
| `task` with `subagent_type: explore` | Lightweight | Broad independent scans across multiple directories |
| `task` with `subagent_type: general` | Reasoning | Heavy analysis, synthesis, decisions |
| `task` with `subagent_type: general` | Balanced | Code/markdown generation, formatting |
| `edit` / `write` | (apply) | Writing final output |

**Rule of thumb:** Inline tools (`grep`/`glob`/`read`) are cheaper than `task` delegation. Only use `task` when you need to fan-out across many files or run a multi-step sub-search.

---

## 4. Pipeline Discipline (Anti-Waste)

### Separate phases strictly
Do not combine Extract and Analyze in one subagent call. Each phase has a different goal and model tier requirement.

### Pass compact data between phases
Phase A output should be JSON or structured markdown, not raw file dumps. This is the single most important token-saving practice.

### Do not re-extract
Once facts are extracted in Phase A, reuse them. Do not re-read source files in Phase B or C.

### Know when NOT to pipeline
Small tasks (single-file edit, simple question, one grep search) are cheaper inline. The pipeline pays off when:
- 3+ files need reading
- Search spans multiple directories
- Analysis requires synthesis across sources
- Output needs formatting from a template

---

## 5. Best Practices & Rules

> [!IMPORTANT]
> **Factual Grounding First**
> Always complete the extraction phase before starting the analysis phase. Never guess or jump to conclusions without structured facts.

> [!IMPORTANT]
> **Cross-Repo Portable**
> This skill does not assume any specific folder layout. Adapt the extraction paths and schemas to match the current repo's structure. Read the repo's AGENTS.md or equivalent for domain-specific rules.

> [!TIP]
> **Local-First Privacy**
> Ensure private data (credentials, secret keys, sensitive health or personal records) remains strictly local. Do not pipe raw, sensitive, unstructured contents to external endpoints. When using `task` subagents, they operate within the same session — use the same caution.

> [!CAUTION]
> **Keep Context Clean**
> Avoid dumping entire 1000-line files into the active main conversation. Use subagents or local tools to extract only the target segments.

---

## 6. Example: Codebase Audit Walkthrough

Here is how to execute a massive codebase audit using this skill:

1. **Extract (Lightweight)**:
   * Use `grep` to search across the project for API key patterns, legacy imports, or outdated APIs.
   * Use `glob` to find relevant file types.
   * Compile findings into a structured JSON object with file paths, line numbers, and match snippets.
   * For very broad searches, delegate to `task(explore)` with a focused extraction prompt.
2. **Analyze (Reasoning)**:
   * Pass the structured findings to `task(general)` with instructions to group by severity and recommend replacements.
3. **Format (Balanced)**:
   * Pass the analysis results to `task(general)` to generate a formatted report, then use `write` to save it.
   * Or apply fixes directly using `edit` based on the analysis plan.
