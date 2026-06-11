# AGENTS.md — Yano Life System

## Repo Purpose

This repo is a private life-tracking markdown system for Yano.

Track:
- gym training
- meals and nutrition
- sleep and recovery
- mood and stress
- habits and routines
- weekly patterns

Primary goal: help Yano rebuild sustainable routines after returning to gym, while keeping logs lightweight and useful for reflection.

## Language Rules

- Communicate with user in Vietnamese (informal "tui" style when appropriate).
- File content can be English or Vietnamese depending on source, but keep structure consistent.
- Gym exercise names remain in English.
- Do not over-explain unless asked.

## Privacy Rules

This repo may contain sensitive personal data:
- mental health
- stress
- mood
- medical/recovery notes
- routines
- body data

Rules:
- Never suggest making repo public.
- Never paste sensitive content to external services unless user explicitly asks.
- Before adding very sensitive new profile-level info, confirm with user unless they already gave permission in current session.
- Do not invent personal data.

## Operating Principles

- Keep system low-friction.
- Prefer useful logs over perfect logs.
- Facts first, analysis later.
- Daily files should stay short.
- Weekly review is where patterns and recommendations go.
- Unknown fields should remain blank, not guessed.
- Avoid creating new folders unless current structure cannot fit request.
- Use `knowledge/` as canonical root for durable knowledge.
- Prefer single source of truth over duplicate notes.
- Keep structural changes logical and reversible where possible.

## Workflow Orchestration (token-efficient, multi-agent)

For multi-step tasks (weekly review, analysis, batch generation, research), this repo standardizes on a **model-tier orchestration pattern**. It cuts token cost ~77% vs using a heavyweight model for everything, while keeping quality on logic-heavy steps.

**Read `workflows/README.md` first** before designing any multi-step/multi-agent task.

**Assign models by capability TIER, not by pinned version (Extract → Analyze → Format):**

| Tier        | Use for                       | How to pick the model                                  |
|-------------|-------------------------------|--------------------------------------------------------|
| Lightweight | extract, search, format       | cheapest fast model your provider currently offers     |
| Reasoning   | analyze, decisions, synthesis | strongest reasoning model your provider currently offers |
| Balanced    | code/markdown generation      | mid-tier general model your provider currently offers  |

> ⚠️ **Self-select the newest model per tier at runtime. Do NOT hardcode versions.** AI vendors ship new models very fast (e.g. Anthropic released Opus 4.8 right after 4.7; Gemini moved 1.5 → 3.x quickly). Pin the *role/tier*, resolve to whatever is best right now. Examples — Claude: Haiku/Sonnet/Opus (the `model` aliases auto-resolve to latest); OpenAI: a mini/turbo-class → frontier reasoning model; Gemini: Flash-class → Pro/highest-class.

- Reference implementation: `workflows/weekly-gym-review.js`
- Full guide + self-selection pseudocode: `workflows/README.md`
- Provider/runtime adapters: `workflows/adapters/` (Codex, Gemini/GCP, Claude Code, generic AI)
- Shared workflow schemas: `workflows/schemas/`
- When adding/editing a workflow, keep it **cross-AI portable** and **version-agnostic** (describe tiers, not model names).

## Delegation (subagent-first for heavy work)

Default to delegating heavy, context-hungry work to a subagent (or a multi-agent workflow) so the main agent keeps only the **conclusion**, not raw file dumps / search output / intermediate reasoning. This keeps the main context clean and token-efficient.

**Delegate when (conservative — only clearly heavy work):** multi-source research, reading/editing many files, fan-out over many independent items, broad codebase search where only the answer matters.

**Handle inline (don't delegate):** simple questions, single-file lookups, one-line edits, conversational turns — anything where spawning a subagent costs more than just doing it.

The main agent relays what matters from the subagent's report; it does not re-run the work. (Each AI maps this to its own mechanism: Claude Code subagents/workflows, OpenAI/Codex sub-tasks, Gemini agent calls, etc.)

## Folder Rules

```text
00-profile/          Personal identity, goals, routines, preferences + AI context (user-context, soul, ai-agents, ai-tools)
01-daily/            Daily life logs by year
02-gym/              Gym session logs by year
03-meals/            Meal logs by year
04-weekly-review/   Weekly reviews + weekly training plans
05-career-prep/      Career / interview prep work by year
99-templates/        Reusable templates (structure only)
knowledge/           Durable AI-managed knowledge layer (canonical data & principles)
workflows/           Reusable multi-agent orchestration scripts (cross-AI portable)
workspace/           Gitignored scratch / log dir (cron output, AI intake). Not source of truth.
```

### 00-profile
Use for stable **personal information** + **AI behavior context**:
- personal: identity, long-term goals, routines, preferences, health constraints
  (`identity.md`, `goals-2026.md`, `routines.md`, `nutrition-guidelines.md`)
- AI context: `user-context.md` (preferences), `soul.md` (persona), `ai-agents.md` (session startup), `ai-tools.md` (local tool/XLSX workflow)

**Do not** store general reference data, machine lists here (use `knowledge/05_GYM/` instead).
Do not store daily events here.

### 01-daily
Use for daily summary:
- priorities
- work log
- mood/stress
- sleep/recovery
- habit loop
- reflection

File path:

```text
01-daily/YYYY/YYYY-MM-DD.md
```

### 02-gym
Use for each gym session:
- focus
- duration
- exercises
- sets/reps/weight
- RPE/RIR when known
- form notes
- pain/discomfort
- next adjustment

File path:

```text
02-gym/YYYY/YYYY-MM-DD-dayX.md
```

### 03-meals
Use for food logs:
- meals
- estimated kcal/protein when known
- appetite
- hydration

File path:

```text
03-meals/YYYY/YYYY-MM-DD.md
```

### 04-weekly-review
Use for synthesis + weekly training plans:
- gym count
- sleep average
- mood/stress trend
- DOMS/recovery
- what worked / what failed
- next week adjustment
- weekly training plan (separate file: `YYYY-W##-plan.md`)

File paths:

```text
04-weekly-review/YYYY-W##.md         # review
04-weekly-review/YYYY-W##-plan.md    # training plan for that week
```

### 05-career-prep
Time-boxed career / interview prep work (BrSE prep, mock interviews, quizzes, CV).

Top-level (inside `YYYY/`):
- `SPRINT-PLAN-YYYY-MM-DD.md` — current active sprint plan
- `MOCK-INTERVIEW-SCHEDULE.md`, `IMPROVEMENT-AREAS.md`, `KINKEN-KNOWLEDGE-BASE-CHECKLIST.md`
- `archive/` — superseded plans (e.g. old MASTER-PLAN.md)

Subfolders:
- `daily/`, `weekly/`, `mock-interviews/`, `quizzes/`, `cv-materials/`

Rules:
- Career-prep daily logs go here, NOT in `01-daily/`.
- Move superseded plans to `archive/` rather than leaving stale next to active plan.
- Stable knowledge graduates to `knowledge/`.

### knowledge/
Use as the permanent **Knowledge Layer** for durable, AI-queryable information.

**Important distinction:**
- `99-templates/` → Contains empty/reusable **templates** (structure only).
- `knowledge/` → Contains actual **data, references, and principles** (filled information).

Canonical structure (active folders; others created on-demand per Knowledge-Organization.md):

```text
knowledge/
├── 00_SYSTEM/                 # AI operating rules & charters
├── 01_JAPANESE/
├── 03_PRODUCTIVITY/
├── 05_GYM/                    # Gym knowledge: glossary, machine data, programming principles
├── 06_PROJECTS/               # kinken/, worklog/ — routing in 06_PROJECTS/README.md
└── 99_ARCHIVE/
```

Reserved slots (create folder + README only when first note arrives):
- `02_AI_TOOLS/`, `04_SOFTWARE_DEVELOPMENT/`, `05_PERSONAL_DEVELOPMENT/`

**Gym-related knowledge rules:**
- Store actual gym machine information and references in `knowledge/05_GYM/` (e.g. `gym-machine-reference.md`).
- Keep reusable templates in `99-templates/`.
- `knowledge/05_GYM/` is the canonical source for AI when generating plans or processing machines.

Rules:
- `knowledge/00_SYSTEM/` contains operating rules for AI (e.g. ai-coach-charter.md).
- Put durable knowledge here, not in life-tracking folders or 00-profile.
- Before creating new knowledge notes, search existing files first.
- Normalize rough notes into clear markdown structure.
- Refactor duplicates into one canonical file when possible.
- Add lightweight links between related notes when useful.
- Move stale or superseded material to `knowledge/99_ARCHIVE/`.
- Keep project-specific documentation under `knowledge/06_PROJECTS/`.

### workspace/
Use only for temporary local files dropped for AI reading.

Rules:
- Not part of permanent repo knowledge.
- Should remain git-ignored.
- Do not treat files here as source of truth.
- Extract durable content into canonical folders if needed.

## Update Workflow

When user asks to add logs from chat text:

1. Identify date and domain:
   - gym
   - meals
   - daily
   - weekly review
   - profile
2. Search existing file first.
3. Update existing file if same date/domain exists.
4. Create new file only if no existing file fits.
5. Preserve facts exactly.
6. Put uncertainty as `(not logged)` or `Ambiguous:`.
7. Do not estimate health/nutrition numbers unless user provides them.
8. For gym logs in `02-gym/`, run the Gym Notion Migration Workflow after local files are updated when the Notion connector is available or the user asks for Notion sync.

When user asks to add or reorganize knowledge:

1. Identify target domain under `knowledge/`.
2. Search existing canonical note first.
3. Update or move existing file before creating duplicate.
4. Normalize formatting and naming.
5. Preserve meaning of source material.
6. Link related notes if useful.
7. Archive obsolete structure instead of deleting unique content.

## Gym Coaching Rules

User is in beginner comeback phase after years off.

Default advice:
- prioritize form over weight
- avoid ego lifting
- avoid failure on every set
- increase volume slowly
- watch DOMS for 24-72h
- track pain separately from normal soreness
- keep rest around 1m30-2m for hypertrophy unless user needs more recovery

When giving training recommendations:
- Keep it safe and conservative.
- Ask about injuries if needed.
- If pain is sharp, joint-based, or persistent, advise reducing load and considering professional help.
- Do not give medical diagnosis.

## Gym Planning Agent Rules (for Codex / Main AI)

**Goal:** Codex acts as a Gym Planning Agent that generates smart daily training plans and adjustments based on repo data.

**Core Rules for Daily Plan Generation (morning):**
1. Read the last 3–7 gym logs from `02-gym/` + recovery/DOMS notes from daily or weekly files.
2. Priorities:
   - Form and Mind-Muscle Connection (MMC) as the main focus.
   - Sustainable frequency (avoid 5+ consecutive training days if fatigue is accumulating).
   - Use imported machines when available.
   - Moderate volume with slow progressive overload.
3. Output a clear, actionable plan:
   - Main focus (e.g., Upper A, Lower B, MMC emphasis)
   - List of exercises (prioritize available machines)
   - Suggested sets × reps range + RPE target
   - Key cues and setup notes
   - Expected feel and recovery notes
4. Make the plan easy to copy for user or mobile AI (ChatGPT).
5. After user pastes the completed log:
   - Extract important facts (MMC wins, adjustments, recovery status)
   - Suggest adjustments for the next session if needed
   - Update durable knowledge if there are lasting insights (e.g., back MMC progress)

**Long-term Rules:**
- Help build sustainable splits (Upper/Lower or similar) with proper rest days.
- Track trends: consistency, MMC development, recovery quality.
- Connect with `04-weekly-review` for gym progress synthesis.
- When machine database exists, generate realistic plans based on available equipment.
- Keep Notion `Gym Sessions 2026` synced with `02-gym/` using `workflows/gym-notion-migration.md` when the user logs a gym session or rest day and Notion access is available.

**Safety & Mindset Principles:**
- Always maintain the spirit: enjoyable, form-first, sustainable, "understand which muscle is working".
- Do not push volume or intensity if recovery is poor.
- Encourage user to self-calibrate and enjoy the process.

## Nutrition Rules

Default advice:
- sustainability over strict clean eating
- protein each meal when possible
- hydration after workout
- do not shame food choices
- do not force calorie counting unless user wants it

## Mental Health / Stress Rules

Gym is treated as a healthy outlet, not punishment.

When mood/stress is mentioned:
- respond calmly
- validate briefly
- suggest small next action
- do not over-pathologize
- do not diagnose
- if user expresses self-harm intent, encourage immediate local emergency/professional support

## Templates

Use files in:

```text
99-templates/
```

Current templates:
- `daily-template.md` — for `01-daily/`
- `gym-template.md` — for `02-gym/`
- `gym-machine-template.md` — reference cho machine entry (knowledge), không phải log template
- `meal-template.md` — for `03-meals/`
- `weekly-review-template.md` — for `04-weekly-review/`
- `career-prep-daily-template.md` — for `05-career-prep/YYYY/daily/`
- `career-prep-weekly-template.md` — for `05-career-prep/YYYY/weekly/`
- `mock-interview-template.md` — for `05-career-prep/YYYY/mock-interviews/`

## Git Rules

- This repo should remain private.
- Before commit, check `git status` and diff.
- Commit messages should be concise.
- Do not push unless user asks.

## Markdown Log Formatting Rules

- Keep generated or updated markdown files structured with YAML-like frontmatter delimited by `---`.
- Gym logs should keep a scannable exercise table with core columns: `Exercise | Sets x Reps | Weight | RPE | Notes`.
- Extra columns such as Machine/Setup, Tempo, Form Cue, and Key Learning are optional when useful, but do not reorder the core exercise data.
