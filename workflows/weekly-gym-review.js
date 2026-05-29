/**
 * Weekly Gym Review Workflow
 *
 * PURPOSE:
 * Automate weekly gym review generation with token-efficient multi-agent orchestration.
 *
 * PATTERN:
 * 3-phase pipeline with model tier assignment:
 * 1. Extract (Haiku) - Fast data extraction from markdown files
 * 2. Analyze (Opus) - Complex reasoning and pattern analysis
 * 3. Format (Sonnet) - Structured markdown generation
 *
 * TOKEN EFFICIENCY:
 * - All-Opus approach: ~250k tokens (5 agents × 50k)
 * - Mixed-tier approach: ~58k tokens (4 Haiku + 1 Opus)
 * - Savings: ~77%
 *
 * PORTABILITY NOTE:
 * This script uses Claude Code workflow syntax (agent(), phase(), log()).
 * Other AI systems (ChatGPT, Gemini, Codex, Antigravity) can adapt the PATTERN:
 * - Phase 1: Lightweight model for data extraction
 * - Phase 2: Heavyweight model for analysis
 * - Phase 3: Balanced model for generation
 *
 * USAGE (Claude Code):
 * Workflow({
 *   name: 'weekly-gym-review',
 *   args: { week: 22, year: 2026 }
 * })
 *
 * USAGE (Other AI systems):
 * Adapt the 3-phase pattern to your orchestration framework:
 * - Use your lightweight model for extraction
 * - Use your reasoning model for analysis
 * - Use your generation model for formatting
 */

export const meta = {
  name: 'weekly-gym-review',
  description: 'Generate weekly gym review with mixed model tiers',
  whenToUse: 'End of week to synthesize gym sessions, analyze patterns, generate recommendations',
  phases: [
    { title: 'Extract', detail: 'Lightweight model extracts gym sessions', model: 'haiku' },
    { title: 'Analyze', detail: 'Reasoning model analyzes patterns & progression', model: 'opus' },
    { title: 'Format', detail: 'Balanced model formats weekly review', model: 'sonnet' },
  ],
}

// Schema definitions for structured output
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
                notes: { type: 'string' }
              }
            }
          },
          rpe: { type: 'string' },
          doms: { type: 'string' },
          notes: { type: 'string' }
        }
      }
    },
    weekRange: { type: 'string' },
    totalSessions: { type: 'number' }
  }
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
    nextWeekAdjustments: { type: 'string' }
  }
}

// Calculate week date range from ISO week number
function getWeekDateRange(year, week) {
  // ISO week starts on Monday
  const jan4 = new Date(year, 0, 4)
  const jan4Day = jan4.getDay() || 7 // Sunday = 7
  const weekStart = new Date(jan4)
  weekStart.setDate(jan4.getDate() - jan4Day + 1 + (week - 1) * 7)

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  const formatDate = (d) => d.toISOString().split('T')[0]
  return {
    start: formatDate(weekStart),
    end: formatDate(weekEnd),
    range: `${formatDate(weekStart)} to ${formatDate(weekEnd)}`
  }
}

// Main workflow logic
const week = args?.week || 22
const year = args?.year || 2026
const weekDates = getWeekDateRange(year, week)

// ============================================================================
// PHASE 1: EXTRACT (Lightweight Model - Haiku)
// ============================================================================
// Task: Fast data extraction from markdown files
// Why Haiku: Simple file reading and parsing, no complex reasoning needed
// Token cost: ~10-15k per agent
// ============================================================================

phase('Extract')
log(`🔍 Extracting gym sessions for W${week} (${weekDates.range})...`)

const gymData = await agent(
  `Extract all gym session data from 02-gym/${year}/ for week W${week} (${weekDates.range}).

  For each session, extract:
  - Date, day number, focus
  - Duration
  - All exercises with sets/reps/weight
  - RPE, DOMS notes
  - Form notes, pain/discomfort
  - Next session adjustments

  Return structured data with all sessions found.`,
  {
    label: `Extract W${week} gym sessions`,
    phase: 'Extract',
    model: 'haiku',  // Lightweight model for simple extraction
    schema: GYM_SESSIONS_SCHEMA
  }
)

log(`✅ Extracted ${gymData.totalSessions} sessions from ${gymData.weekRange}`)

// ============================================================================
// PHASE 2: ANALYZE (Reasoning Model - Opus)
// ============================================================================
// Task: Complex pattern analysis, progressive overload assessment, recommendations
// Why Opus: Requires deep reasoning, multi-factor analysis, expert-level insights
// Token cost: ~40-50k per agent
// ============================================================================

phase('Analyze')
log('🧠 Analyzing training patterns and progression...')

const analysis = await agent(
  `Analyze gym training data for W${week}. Raw data:
  ${JSON.stringify(gymData, null, 2)}

  Analyze:
  1. Progressive overload: Are weights/reps increasing appropriately?
  2. Volume trend: Is total volume sustainable or too aggressive?
  3. Recovery status: DOMS patterns, rest adequacy
  4. Form issues: Any recurring form problems or pain signals?
  5. Strengths: What's working well?
  6. Recommendations: Specific actionable advice
  7. Next week adjustments: What to change for W${week + 1}?

  Context: User is beginner comeback phase after years off. Prioritize form over weight, avoid ego lifting, watch for overtraining signals.

  Return structured analysis.`,
  {
    label: 'Analyze training patterns',
    phase: 'Analyze',
    model: 'opus',  // Heavyweight model for complex reasoning
    schema: ANALYSIS_SCHEMA
  }
)

log('✅ Analysis complete')

// ============================================================================
// PHASE 3: FORMAT (Balanced Model - Sonnet)
// ============================================================================
// Task: Generate well-structured markdown with proper formatting
// Why Sonnet: Good at structured generation, balanced cost/quality
// Token cost: ~20-30k per agent
// ============================================================================

phase('Format')
log('📝 Formatting weekly review markdown...')

const reviewMarkdown = await agent(
  `Generate weekly gym review markdown for W${week} based on:

  Gym Data:
  ${JSON.stringify(gymData, null, 2)}

  Analysis:
  ${JSON.stringify(analysis, null, 2)}

  Use template structure from 99-templates/weekly-review-template.md:
  - Frontmatter with week, date range, gym count
  - Summary section
  - Gym section with session breakdown
  - Recovery section (DOMS, sleep if available)
  - What Worked / What Failed
  - Next Week Adjustments

  Write in Vietnamese, keep gym exercise names in English.
  Be concise and actionable.

  Return the complete markdown content ready to write to 04-weekly-review/${year}-W${week}.md`,
  {
    label: 'Format weekly review',
    phase: 'Format',
    model: 'sonnet'  // Balanced model for generation
  }
)

log('✅ Weekly review formatted')

// Return final output
return {
  week: week,
  year: year,
  weekRange: gymData.weekRange,
  totalSessions: gymData.totalSessions,
  analysis: analysis,
  markdown: reviewMarkdown,
  outputPath: `04-weekly-review/${year}-W${week}.md`
}
