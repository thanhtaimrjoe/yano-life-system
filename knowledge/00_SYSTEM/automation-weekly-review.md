# Automation: Weekly Review Auto-Draft

## Purpose

Tự động tạo weekly review draft từ daily logs và gym logs để tiết kiệm thời gian và đảm bảo consistency.

**Skills learned:**
- Weekly Review Auto-Draft
- Smart Search trong repo

**Date learned:** 2026-05-18

---

## Overview

Weekly review aggregates data từ nhiều sources:
- Daily logs (01-daily/YYYY/)
- Gym logs (02-gym/YYYY/)
- Meal logs (03-meals/YYYY/) - optional

Output: Draft file trong 04-weekly-review/YYYY-W##.md

---

## Data Sources & Structure

### Daily Logs (01-daily/YYYY/YYYY-MM-DD.md)

Key fields to extract:
- \sleep_hours:\ - số giờ ngủ
- \mood:\ - tâm trạng (energized, motivated, very-good, etc.)
- \stress:\ - mức độ stress
- \ody_weight_kg:\ - cân nặng
- Health check notes - recovery signals
- Reflection section - wins, struggles

### Gym Logs (02-gym/YYYY/YYYY-MM-DD-dayX.md)

Key fields to extract:
- \date:\ - ngày tập
- \ocus:\ - muscle groups
- \duration_min:\ - thời lượng
- Session summary - overall vibe
- Physical state - DOMS, pain, recovery
- Mental/emotional state - confidence, enjoyment
- Key learnings - MMC progress, technique insights

### Meal Logs (03-meals/YYYY/YYYY-MM-DD.md)

Optional fields:
- Protein intake
- Calorie estimates
- Appetite patterns
- Hydration

---

## Week Calculation

ISO week numbering:
- Week starts Monday
- Week 1 contains first Thursday of year
- Use \Get-Date -UFormat %V\ in PowerShell

Example:
- 2026-05-12 (Mon) to 2026-05-18 (Sun) = W20

---

## Aggregation Process

### Step 1: Identify Week Range

\\\powershell
# For current week
\ = Get-Date -UFormat %V
\ = Get-Date -UFormat %Y

# For specific week, calculate date range
# W20 2026: 2026-05-12 to 2026-05-18
\\\

### Step 2: List Files in Week Range

\\\powershell
# Daily logs
Get-ChildItem -Path "01-daily/\" -Filter "\-05-*.md" | 
  Where-Object { \.Name -ge "2026-05-12.md" -and \.Name -le "2026-05-18.md" }

# Gym logs
Get-ChildItem -Path "02-gym/\" -Filter "\-05-*.md" | 
  Where-Object { \.Name -ge "2026-05-12" -and \.Name -le "2026-05-18" }
\\\

### Step 3: Extract Data from Daily Logs

\\\powershell
# Extract mood, sleep, stress
Get-Content "01-daily/2026/2026-05-12.md" | 
  Select-String -Pattern "mood:|stress:|sleep_hours:"
\\\

### Step 4: Count Gym Sessions

\\\powershell
# Count gym files in week range
(Get-ChildItem -Path "02-gym/2026" -Filter "2026-05-*.md" | 
  Where-Object { \.Name -ge "2026-05-12" -and \.Name -le "2026-05-18" }).Count
\\\

### Step 5: Scan for DOMS/Recovery Patterns

\\\powershell
# Search for DOMS mentions
rg "DOMS|recovery|pain|soreness" 02-gym/2026/2026-05-*.md

# Search for MMC progress
rg "MMC|mind-muscle|activation" 02-gym/2026/2026-05-*.md
\\\

### Step 6: Aggregate Mood Trend

Manual review of mood values:
- energized → motivated → very-good = positive trend
- stable → tired → exhausted = negative trend

### Step 7: Calculate Averages

- Sleep: average of logged values (skip empty)
- Mood: qualitative trend
- Stress: average or trend

---

## Generation Steps

### Template Structure

Use \99-templates/weekly-review-template.md\ as base.

### Fill Scoreboard

- Gym sessions: count from Step 4
- Avg sleep: calculate from Step 3
- Avg mood: trend from Step 6
- Avg stress: from Step 3
- Weight trend: compare first vs last day

### Fill What Worked

Review:
- Consistency patterns
- MMC progression notes
- Form improvements
- Recovery quality

### Fill What Failed

Identify:
- Missing logs
- Skipped tracking
- Incomplete data

### Fill Movement/Recovery Signals

Extract from gym logs:
- DOMS patterns
- Pain watch
- Movement quality notes
- Confidence changes

### Fill Honest Summary

Synthesize:
- No-hype progress (facts only)
- Main risks (fatigue, overtraining)
- Keep doing (what worked)
- Stop/reduce (what failed)

### Fill Adjustments

Recommend:
- Training changes (volume, intensity, rest days)
- Nutrition focus
- Sleep improvements
- Stress management

---

## Smart Search Tips

### Use ripgrep (rg) for Speed

\\\powershell
# Search all gym logs for keyword
rg "leg press" 02-gym/

# Search with context (3 lines before/after)
rg -C 3 "MMC" 02-gym/2026/

# Search multiple patterns
rg "DOMS|recovery|pain" 02-gym/

# Case insensitive
rg -i "chest" 02-gym/
\\\

### Search by Date Range

\\\powershell
# List files in date range, then search
Get-ChildItem -Path "02-gym/2026" -Filter "2026-05-*.md" | 
  Where-Object { \.Name -ge "2026-05-12" } | 
  ForEach-Object { rg "pattern" \.FullName }
\\\

### Search Across Domains

\\\powershell
# Search all daily logs
rg "mood: very-good" 01-daily/

# Search all gym logs for exercise
rg "Leg Curl" 02-gym/

# Search knowledge base
rg "progressive overload" knowledge/
\\\

### Extract Specific Fields

\\\powershell
# Extract frontmatter fields
rg "^mood:" 01-daily/2026/

# Extract section headers
rg "^## " 02-gym/2026/2026-05-15-day5.md
\\\

---

## Example: Generate W20 Draft

\\\powershell
# 1. Count gym sessions
\ = (Get-ChildItem -Path "02-gym/2026" -Filter "2026-05-*.md" | 
  Where-Object { \.Name -ge "2026-05-12" -and \.Name -le "2026-05-17" }).Count
# Result: 6

# 2. Extract mood trend
Get-Content "01-daily/2026/2026-05-12.md" | Select-String "mood:"
Get-Content "01-daily/2026/2026-05-13.md" | Select-String "mood:"
Get-Content "01-daily/2026/2026-05-15.md" | Select-String "mood:"
# Result: energized → motivated → very-good

# 3. Scan for MMC progress
rg "MMC|activation" 02-gym/2026/2026-05-15-day5.md
# Result: quad, hamstring, calf activation improved

# 4. Generate draft
# Create 04-weekly-review/2026-W20.md with aggregated data
\\\

---

## Automation Workflow Summary

1. **Identify week range** (Mon-Sun)
2. **List files** in date range (daily + gym logs)
3. **Extract data** (mood, sleep, stress, gym count)
4. **Scan patterns** (DOMS, MMC, recovery)
5. **Aggregate** (averages, trends, insights)
6. **Generate draft** using template
7. **Review & refine** manually

---

## Future Improvements

- Script to automate Steps 1-6
- Auto-detect missing logs
- Calculate sleep average automatically
- Extract nutrition data from meal logs
- Generate charts/visualizations
- Suggest adjustments based on patterns

---

## Notes

- This is a **draft generation** tool, not final review
- Always review and add personal insights
- Automation saves time on data aggregation
- Human judgment needed for "what worked" and "adjustments"
