# Yano Life System

Personal markdown knowledge base for gym, meals, health, routines, stress, and weekly review.

## Purpose

This repo tracks daily life signals in a simple format that AI can read, summarize, and update.

Main goals:
- Build sustainable gym habit after long break
- Track workout, meals, sleep, mood, stress, and recovery
- Review patterns weekly
- Keep logs private, structured, and easy to search

## Folder Structure

```text
00-profile/          Personal context, goals, routines
01-daily/            Daily logs by year
02-gym/              Gym session logs by year
03-meals/            Meal logs by year
04-weekly-review/   Weekly summary and adjustment
99-templates/        Reusable markdown templates
```

## Daily Workflow

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

- `01-daily/2026/2026-04-23.md`
- `02-gym/2026/2026-04-23-day1.md`
- `03-meals/2026/2026-04-23.md`

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
