export const meta = {
  name: 'weekly-gym-review',
  description: 'Generate a weekly gym review from 02-gym logs using mixed model tiers',
  whenToUse: 'End of a training week to synthesize gym sessions, analyze patterns, and write the 04-weekly-review file',
  phases: [
    { title: 'Extract', detail: 'Lightweight tier extracts gym sessions for the week', model: 'haiku' },
    { title: 'Analyze', detail: 'Reasoning tier analyzes progression, recovery, form', model: 'opus' },
    { title: 'Format', detail: 'Balanced tier writes the weekly review markdown', model: 'sonnet' },
  ],
}

// --- args -------------------------------------------------------------------
// Invoke with args: { week: 22, year: 2026, dateRange: '2026-05-26 to 2026-06-01' }
//
// MODEL TIERS: 'haiku' | 'opus' | 'sonnet' are TIER ALIASES in Claude Code —
// they auto-resolve to the latest model in each tier. Do not hardcode a version.
// See workflows/README.md (repo root) for cross-AI adaptation.
//
// DATES: Date.now()/new Date() are unavailable in workflow scripts (would break
// resume). The date range is passed via args instead of computed.
const week = args?.week ?? 22
const year = args?.year ?? 2026
const dateRange = args?.dateRange ?? `W${week} ${year}`

const GYM_SESSIONS_SCHEMA = {
  type: 'object',
  properties: {
    sessions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          date: { type: 'string' },
          day: { type: 'string' },
          focus: { type: 'string' },
          duration: { type: 'string' },
          exercises: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                sets: { type: 'array', items: { type: 'string' } },
                weight: { type: 'string' },
                rpe: { type: 'string' },
                notes: { type: 'string' },
              },
            },
          },
          doms: { type: 'string' },
          notes: { type: 'string' },
        },
      },
    },
    weekRange: { type: 'string' },
    totalSessions: { type: 'number' },
  },
  required: ['sessions', 'totalSessions'],
}

const ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    progressiveOverload: { type: 'string' },
    volumeTrend: { type: 'string' },
    recoveryStatus: { type: 'string' },
    formIssues: { type: 'array', items: { type: 'string' } },
    strengths: { type: 'array', items: { type: 'string' } },
    recommendations: { type: 'array', items: { type: 'string' } },
    nextWeekAdjustments: { type: 'string' },
  },
  required: ['progressiveOverload', 'recoveryStatus', 'recommendations', 'nextWeekAdjustments'],
}

// --- Phase 1: Extract (lightweight tier) ------------------------------------
phase('Extract')
log(`Extracting gym sessions for W${week} (${dateRange})...`)

const gymData = await agent(
  `Read the gym session files in 02-gym/${year}/ that fall within week W${week} (${dateRange}).
Extract every session. For each: date, day label, focus, duration, all exercises with
sets/reps/weight/RPE, DOMS notes, form notes, pain/discomfort, next-session adjustments.
Return structured data. If a field is not logged, leave it empty — do not guess.`,
  { label: `Extract W${week} sessions`, phase: 'Extract', model: 'haiku', schema: GYM_SESSIONS_SCHEMA }
)

log(`Extracted ${gymData.totalSessions} sessions`)

// --- Phase 2: Analyze (reasoning tier) --------------------------------------
phase('Analyze')
log('Analyzing training patterns...')

const analysis = await agent(
  `Analyze this week's gym training. Data:
${JSON.stringify(gymData, null, 2)}

Assess: (1) progressive overload — appropriate or not, (2) volume trend — sustainable or
aggressive, (3) recovery status from DOMS patterns, (4) recurring form issues / pain signals,
(5) what's working, (6) concrete recommendations, (7) next-week adjustments.

Context: beginner comeback phase, form + MMC first, no ego lifting, watch overtraining.
Conservative and safe advice. No medical diagnosis. Return structured analysis.`,
  { label: 'Analyze patterns', phase: 'Analyze', model: 'opus', schema: ANALYSIS_SCHEMA }
)

log('Analysis complete')

// --- Phase 3: Format (balanced tier) ----------------------------------------
phase('Format')
log('Formatting weekly review markdown...')

const reviewMarkdown = await agent(
  `Write the weekly gym review markdown for W${week} ${year}.

Gym data:
${JSON.stringify(gymData, null, 2)}

Analysis:
${JSON.stringify(analysis, null, 2)}

Follow the structure of 99-templates/weekly-review-template.md: frontmatter (week, year,
date_range, gym_count, recovery_status), Summary, Gym (per-session breakdown with the
standard table Exercise | Set x Rep | Weight | RPE | Notes), Recovery, What Worked,
What Failed, Next Week Adjustments.

Write in Vietnamese; keep gym exercise names in English. Concise and actionable.
Return ONLY the markdown content, ready to write to 04-weekly-review/${year}-W${week}.md`,
  { label: 'Format review', phase: 'Format', model: 'sonnet' }
)

log('Weekly review formatted')

return {
  week,
  year,
  dateRange,
  totalSessions: gymData.totalSessions,
  outputPath: `04-weekly-review/${year}-W${week}.md`,
  analysis,
  markdown: reviewMarkdown,
}