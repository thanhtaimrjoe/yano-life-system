# Yano Life System

Private markdown Second Brain for life tracking and durable knowledge.

## Purpose

This repo has 2 layers:
- **Life Tracking Layer**: gym, meals, health, routines, stress, and weekly review
- **Knowledge Layer**: durable notes, project knowledge, AI workflows, and reusable concepts

Main goals:
- Build sustainable gym habit after long break
- Track workout, meals, sleep, mood, stress, and recovery
- Maintain an AI-native knowledge system under `knowledge/`
- Review patterns weekly
- Keep logs private, structured, and easy to search

## AI Coach Charter

Use `00-profile/ai-coach-charter.md` as the stable guidance file for gym and recovery coaching.

It defines:
- calm, sustainable coaching tone
- recovery-first training principles
- anti-toxic gym culture rules
- nutrition stance around whey, digestion, and realistic protein habits
- honest progress analysis without fake positivity or exaggerated results

When AI reviews gym logs, weekly patterns, or progress photos, it should follow this charter before giving recommendations.

## Repository Structure

```text
Life Tracking Layer
00-profile/          Personal context, goals, routines
01-daily/            Daily logs by year
02-gym/              Gym session logs by year
03-meals/            Meal logs by year
04-weekly-review/   Weekly summary and adjustment
99-templates/        Reusable markdown templates

Knowledge Layer
knowledge/           AI-managed durable knowledge

Temporary Workspace
workspace/           Temporary local files for AI intake; ignored by git
```

## Knowledge Layer

`knowledge/` is the canonical root for long-lived knowledge.

```text
knowledge/
├── 00_SYSTEM/                 AI operating rules and workflows
├── 01_JAPANESE/               Japanese learning knowledge
├── 02_AI_TOOLS/               AI tools, prompting, agent workflows
├── 03_PRODUCTIVITY/           Productivity and execution systems
├── 04_SOFTWARE_DEVELOPMENT/   Reusable software engineering knowledge
├── 05_PERSONAL_DEVELOPMENT/   Mindset, communication, growth frameworks
├── 06_PROJECTS/               Project-specific knowledge
└── 99_ARCHIVE/                Inactive or superseded materials
```

Start with:
- `knowledge/00_SYSTEM/CORE.md`
- `knowledge/00_SYSTEM/Knowledge-Organization.md`
- `knowledge/00_SYSTEM/Workflows.md`

Current project knowledge:
- `knowledge/06_PROJECTS/kinken/`

## Life Tracking Workflow

### 1. Daily log
Create file:

```text
01-daily/YYYY/YYYY-MM-DD.md
```

Use:

```text
99-templates/daily-template.md
```

Track only key signals. Do not overfill.

### 2. Gym log
After each workout, create:

```text
02-gym/YYYY/YYYY-MM-DD-dayX.md
```

Use:

```text
99-templates/gym-template.md
```

Minimum required fields:
- exercises
- sets x reps
- weight if known
- fatigue/form notes
- recovery notes

### 3. Meal log
Create:

```text
03-meals/YYYY/YYYY-MM-DD.md
```

Use:

```text
99-templates/meal-template.md
```

Estimate calories/protein only when available. Blank is okay.

### 4. Weekly review
Once per week, create:

```text
04-weekly-review/YYYY-W##.md
```

Use:

```text
99-templates/weekly-review-template.md
```

Focus on patterns, not perfection.

## Logging Rules

- Facts first, interpretation later.
- Keep daily logs short.
- Use weekly review for insights and adjustments.
- Unknown data can stay blank.
- Do not invent calories, protein, HR, body weight, or sleep numbers.
- Sensitive data stays in this private repo only.

## Common Tags

```text
[daily]
[gym]
[meals]
[weekly-review]
[recovery]
[stress]
[mood]
[sleep]
```

## Current Starting Point

Initial logs were created from first gym comeback session:

- `01-daily/2026/2026-05-11.md`
- `02-gym/2026/2026-05-11-day1.md`
- `03-meals/2026/2026-05-11.md`

## Suggested Mobile Capture Format

When logging during gym on phone, use short lines:

```text
Gym log YYYY-MM-DD dayX
Exercise: Bench press
Set 1: 15 reps, weight ?, note: ok
Set 2: 15 reps, weight ?, note: triceps fatigue
Set 3: 15 reps, weight ?, note: last rep unstable
Mood pre: 3/5
Mood post: 4/5
Energy pre: 3/5
Energy post: 4/5
Pain: none / shoulder / elbow / back
```

Paste this into AI later and ask it to normalize into repo files.

## Workspace Rule

`workspace/` is temporary scratch space only.

Use it to drop local files for AI reading. Durable knowledge should be extracted into `knowledge/` or life logs, then treated from canonical folders only.
