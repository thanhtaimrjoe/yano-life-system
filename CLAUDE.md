# CLAUDE.md — Yano Life System

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

- Talk to user in Vietnamese.
- File content can be English or Vietnamese depending on source, but keep structure consistent.
- Gym exercise names can stay English.
- Do not over-explain unless user asks.

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

## Folder Rules

```text
00-profile/          Personal identity, goals, routines
01-daily/            Daily life logs by year
02-gym/              Gym session logs by year
03-meals/            Meal logs by year
04-weekly-review/   Weekly reviews
99-templates/        Reusable templates
```

### 00-profile
Use for stable info:
- identity
- long-term goals
- routines
- preferences
- health constraints user wants kept

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
Use for synthesis:
- gym count
- sleep average
- mood/stress trend
- DOMS/recovery
- what worked
- what failed
- next week adjustment

File path:

```text
04-weekly-review/YYYY-W##.md
```

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

## Nutrition Rules

Default advice:
- sustainability over strict clean eating
- protein each meal when possible
- hydration after workout
- do not shame food choices
- do not force calorie counting unless user wants it

## Mental Health / Stress Rules

Gym is treated as healthy outlet, not punishment.

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
- `daily-template.md`
- `gym-template.md`
- `meal-template.md`
- `weekly-review-template.md`

## Git Rules

- This repo should remain private.
- Before commit, check `git status` and diff.
- Commit messages should be concise.
- Do not push unless user asks.

## Yano Life Dashboard Development Guidelines

This repo now features a lightweight, zero-dependency **Yano Life Dashboard** located in `dashboard/` to visualize the tracking data.

### Architecture & Data Flow
1. **Source Data**: Markdown files in `00-profile/`, `01-daily/`, `02-gym/`, `03-meals/`, `04-weekly-review/`, and `knowledge/`.
2. **Compilation**: `build-data.js` scans these folders recursively, parses YAML frontmatter using a custom regex parser, groups markdown sections, extracts tabular gym sets/reps/weights, and compiles everything into a single, unified JSON file: `dashboard/data.json`.
3. **Local Server**: `server.js` is a native Node.js HTTP server. It listens on port `3000` and automatically runs `build-data.js` every time a client requests `/data.json` or `/dashboard/data.json` (providing real-time "hot-reload" when F5 is pressed).
4. **Frontend View**: `dashboard/index.html`, `style.css`, and `app.js` form a Single Page Application (SPA) displaying interactive charts (Chart.js), formatting markdown articles (Marked.js), and showing clean timelines.

### Commands for AI & Developers
* **Start local server**: `node server.js` (starts server on `http://localhost:3000` and triggers initial build).
* **Compile data manually**: `node build-data.js` (compiles and writes `dashboard/data.json`).

### Rules for Future AI Maintainers
- **Zero-Dependency Constraint**: Do NOT install or introduce any external NPM packages (like `express`, `js-yaml`, etc.) to the project root. Keep the server native and clean to avoid bloated `node_modules` and ensure instant zero-setup start for the user.
- **Frontmatter Preservation**: Always ensure any generated or updated markdown files adhere strictly to the YAML-like frontmatter block style (delimited by `---` at lines 1-11) so that `build-data.js` can parse it reliably.
- **Gym Table Format**: Gym logs MUST keep the Markdown table headers (`Exercise | Machine / Setup | Sets x Reps | Weight | RPE | Tempo | Form Cue / MMC Focus | Notes / Feel | Key Learning`) consistent to preserve progressive overload tracking in the analytics view.
- **Extending the Web View**:
  - Update `dashboard/index.html` to add new tabs or widgets.
  - Add styles to `dashboard/style.css` matching the Cyberpunk dark glassmorphism system variables.
  - Implement parsing & chart binding inside `dashboard/app.js`.

