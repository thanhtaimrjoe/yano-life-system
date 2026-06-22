#!/usr/bin/env node

/**
 * Weekly Gym Review — local-first, privacy-gated Vertex AI pipeline.
 *
 * Pattern: Extract (lightweight tier) -> Analyze (reasoning tier) -> Format (balanced/lightweight tier).
 * Model IDs are configurable via CLI/env so repo docs stay tier-based and version-agnostic.
 *
 * Usage:
 *   node workflows/weekly-gym-review.js --week 22 --year 2026 --dry-run
 *   node workflows/weekly-gym-review.js --week 22 --year 2026 --yes
 *   node workflows/weekly-gym-review.js --week 22 --year 2026 --yes --force
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = process.env.YANO_REPO_ROOT || path.resolve(__dirname, '..');

const DEFAULTS = {
  region: process.env.VERTEX_REGION || 'us-central1',
  project: process.env.VERTEX_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || 'yano-brse-ai-api',
  extractModel: process.env.YANO_WEEKLY_EXTRACT_MODEL || 'gemini-2.5-flash',
  analyzeModel: process.env.YANO_WEEKLY_ANALYZE_MODEL || 'gemini-2.5-pro',
  formatModel: process.env.YANO_WEEKLY_FORMAT_MODEL || 'gemini-2.5-flash'
};

function printUsageAndExit(message, code = 1) {
  if (message) console.error(`❌ ${message}\n`);
  console.error(`Usage:
  node workflows/weekly-gym-review.js [--week 1-53] [--year YYYY] [--dry-run] [--yes] [--force]

Privacy:
  This repo contains personal second-brain data. External Vertex AI calls are blocked unless
  you pass --yes or confirm interactively. Use --dry-run to inspect local inputs only.

Options:
  --week, -w             ISO week number (1-53). Defaults to current ISO week.
  --year, -y             ISO week year. Defaults to current ISO year.
  --dry-run              Local-only: list files/output path, no GCP calls, no writes.
  --yes                  Explicitly allow sending selected gym logs to Vertex AI.
  --force                Allow overwriting existing weekly review file.
  --project PROJECT      GCP project id. Default env/current fallback: ${DEFAULTS.project}
  --region REGION        Vertex AI region. Default: ${DEFAULTS.region}
  --extract-model MODEL  Lightweight tier model. Default: ${DEFAULTS.extractModel}
  --analyze-model MODEL  Reasoning tier model. Default: ${DEFAULTS.analyzeModel}
  --format-model MODEL   Formatting tier model. Default: ${DEFAULTS.formatModel}
`);
  process.exit(code);
}

function parseArgs(argv) {
  const opts = {
    week: null,
    year: null,
    dryRun: false,
    yes: false,
    force: false,
    project: DEFAULTS.project,
    region: DEFAULTS.region,
    extractModel: DEFAULTS.extractModel,
    analyzeModel: DEFAULTS.analyzeModel,
    formatModel: DEFAULTS.formatModel
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const requireValue = (name) => {
      const value = argv[++i];
      if (!value || value.startsWith('--')) printUsageAndExit(`${name} cần value.`);
      return value;
    };

    switch (arg) {
      case '--week':
      case '-w':
        opts.week = Number.parseInt(requireValue(arg), 10);
        break;
      case '--year':
      case '-y':
        opts.year = Number.parseInt(requireValue(arg), 10);
        break;
      case '--dry-run':
        opts.dryRun = true;
        break;
      case '--yes':
      case '-yolo':
        opts.yes = true;
        break;
      case '--force':
        opts.force = true;
        break;
      case '--project':
        opts.project = requireValue(arg);
        break;
      case '--region':
        opts.region = requireValue(arg);
        break;
      case '--extract-model':
        opts.extractModel = requireValue(arg);
        break;
      case '--analyze-model':
        opts.analyzeModel = requireValue(arg);
        break;
      case '--format-model':
        opts.formatModel = requireValue(arg);
        break;
      case '--help':
      case '-h':
        printUsageAndExit('', 0);
        break;
      default:
        printUsageAndExit(`Unknown option: ${arg}`);
    }
  }

  if (opts.week === null || opts.year === null) {
    const current = getCurrentIsoWeekYear();
    if (opts.week === null) opts.week = current.week;
    if (opts.year === null) opts.year = current.year;
  }

  if (!Number.isInteger(opts.week) || opts.week < 1 || opts.week > 53) {
    printUsageAndExit(`Week không hợp lệ: ${opts.week}. Dùng 1-53.`);
  }
  if (!Number.isInteger(opts.year) || opts.year < 2000 || opts.year > 2100) {
    printUsageAndExit(`Year không hợp lệ: ${opts.year}.`);
  }

  return opts;
}

function getCurrentIsoWeekYear() {
  const today = new Date();
  const d = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return {
    week: Math.ceil((((d - yearStart) / 86400000) + 1) / 7),
    year: d.getUTCFullYear()
  };
}

function getGcpAccessToken() {
  try {
    return execSync('gcloud auth print-access-token', { encoding: 'utf8' }).trim();
  } catch (error) {
    throw new Error('Không thể lấy GCP Access Token. Vui lòng kiểm tra gcloud CLI/auth.');
  }
}

function getGcpProjectId(fallbackProject) {
  try {
    const project = execSync('gcloud config get-value project', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return project || fallbackProject;
  } catch (error) {
    return fallbackProject;
  }
}

async function callVertexGemini({ projectId, region, model, payload }) {
  const accessToken = getGcpAccessToken();
  const url = `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/google/models/${model}:generateContent`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(payload)
  });

  const resJson = await response.json().catch(() => ({}));
  if (!response.ok || resJson.error) {
    const err = resJson.error || resJson;
    throw new Error(`GCP API Error: ${JSON.stringify(err)}`);
  }

  try {
    return resJson.candidates[0].content.parts[0].text;
  } catch (e) {
    throw new Error('Không thể trích xuất kết quả từ Vertex AI response.');
  }
}

function getWeekDates(year, week) {
  const jan4 = new Date(year, 0, 4);
  const jan4Day = jan4.getDay() || 7;
  const weekStart = new Date(jan4);
  weekStart.setDate(jan4.getDate() - jan4Day + 1 + (week - 1) * 7);

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${day}`);
  }
  return dates;
}

async function confirmExternalCall({ week, year, weekRangeStr, weekLogs }) {
  console.log('🔒 Privacy gate: workflow này sẽ gửi nội dung gym logs cá nhân lên Vertex AI/GCP.');
  console.log(`   Week: ${year}-W${String(week).padStart(2, '0')} (${weekRangeStr})`);
  console.log(`   Files: ${weekLogs.map(log => log.fileName).join(', ')}`);

  if (!process.stdin.isTTY) {
    throw new Error('Non-interactive mode: thêm --yes để xác nhận gửi private logs ra Vertex AI, hoặc --dry-run để chỉ kiểm tra local.');
  }

  const rl = readline.createInterface({ input, output });
  const answer = await rl.question('Gõ YES để tiếp tục gửi dữ liệu lên Vertex AI: ');
  rl.close();
  if (answer !== 'YES') {
    throw new Error('Đã hủy trước khi gửi dữ liệu ra ngoài.');
  }
}

const GYM_SESSIONS_SCHEMA = {
  type: 'OBJECT',
  properties: {
    sessions: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          date: { type: 'STRING' },
          day: { type: 'STRING' },
          focus: { type: 'STRING' },
          duration: { type: 'STRING' },
          exercises: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                name: { type: 'STRING' },
                sets: { type: 'ARRAY', items: { type: 'STRING' } },
                notes: { type: 'STRING' }
              }
            }
          },
          rpe: { type: 'STRING' },
          doms: { type: 'STRING' },
          notes: { type: 'STRING' }
        }
      }
    },
    weekRange: { type: 'STRING' },
    totalSessions: { type: 'NUMBER' }
  },
  required: ['sessions', 'weekRange', 'totalSessions']
};

const ANALYSIS_SCHEMA = {
  type: 'OBJECT',
  properties: {
    progressiveOverload: { type: 'STRING' },
    volumeTrend: { type: 'STRING' },
    recoveryStatus: { type: 'STRING' },
    formIssues: { type: 'ARRAY', items: { type: 'STRING' } },
    strengths: { type: 'ARRAY', items: { type: 'STRING' } },
    recommendations: { type: 'ARRAY', items: { type: 'STRING' } },
    nextWeekAdjustments: { type: 'STRING' }
  },
  required: ['progressiveOverload', 'volumeTrend', 'recoveryStatus', 'formIssues', 'strengths', 'recommendations', 'nextWeekAdjustments']
};

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const weekLabel = `${opts.year}-W${String(opts.week).padStart(2, '0')}`;

  console.log(`\n===============================================================`);
  console.log(`🏋️  YANO GYM WEEKLY REVIEW PIPELINE (PRIVACY-GATED)`);
  console.log(`📅 Target Week: ${weekLabel}`);
  console.log(`===============================================================\n`);

  const weekDates = getWeekDates(opts.year, opts.week);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];
  const weekRangeStr = `${weekStart} → ${weekEnd}`;
  console.log(`📅 Phạm vi tuần: \x1b[33m${weekRangeStr}\x1b[0m`);

  const gymDir = path.join(REPO_ROOT, '02-gym', String(opts.year));
  if (!fs.existsSync(gymDir)) {
    console.warn(`⚠️  Thư mục ${path.relative(REPO_ROOT, gymDir)} không tồn tại. Dừng pipeline.`);
    process.exit(0);
  }

  const allFiles = fs.readdirSync(gymDir);
  const weekLogs = [];

  for (const dateStr of weekDates) {
    const matchingFile = allFiles.find(f => f.startsWith(dateStr) && f.endsWith('.md'));
    if (matchingFile) {
      const filePath = path.join(gymDir, matchingFile);
      const content = fs.readFileSync(filePath, 'utf8');
      weekLogs.push({ fileName: matchingFile, date: dateStr, filePath, content });
    }
  }

  if (weekLogs.length === 0) {
    console.warn(`⚠️  Không tìm thấy file log gym nào cho ${weekLabel} (${weekRangeStr}).`);
    process.exit(0);
  }

  const reviewDir = path.join(REPO_ROOT, '04-weekly-review');
  const outputPath = path.join(reviewDir, `${weekLabel}.md`);

  console.log(`📁 Đã tìm thấy \x1b[32m${weekLogs.length}\x1b[0m file log gym:`);
  weekLogs.forEach(log => console.log(`   - ${path.relative(REPO_ROOT, log.filePath)}`));
  console.log(`📂 Output: ${path.relative(REPO_ROOT, outputPath)}`);

  if (opts.dryRun) {
    if (fs.existsSync(outputPath)) {
      console.log('ℹ️  Output đã tồn tại; dry-run không overwrite gì hết.');
    }
    console.log('\n🧪 Dry-run: không gọi GCP/Vertex AI, không ghi file.');
    process.exit(0);
  }

  if (fs.existsSync(outputPath) && !opts.force) {
    throw new Error(`Output đã tồn tại: ${path.relative(REPO_ROOT, outputPath)}. Thêm --force nếu muốn overwrite.`);
  }

  if (!opts.yes) {
    await confirmExternalCall({ week: opts.week, year: opts.year, weekRangeStr, weekLogs });
  }

  const projectId = getGcpProjectId(opts.project);
  console.log(`🔗 GCP Project: \x1b[36m${projectId}\x1b[0m`);
  console.log(`🧩 Models by tier: extract=${opts.extractModel}, analyze=${opts.analyzeModel}, format=${opts.formatModel}\n`);

  let rawLogsPayload = '';
  weekLogs.forEach(log => {
    rawLogsPayload += `\n\n=== START_FILE: ${log.fileName} ===\n${log.content}\n=== END_FILE: ${log.fileName} ===\n`;
  });

  console.log(`🔍 [Phase 1/3] Extract bằng lightweight tier (${opts.extractModel})...`);
  const extractPrompt = `Extract all gym session data from the following raw logs for week W${opts.week} (${weekRangeStr}).

Raw Logs:
${rawLogsPayload}

For each session, extract:
- Date, day number, focus
- Duration
- All exercises with sets/reps/weight
- RPE, DOMS notes
- Form notes, pain/discomfort
- Next session adjustments

Return structured data conformant to the requested JSON schema.`;

  const extractResultStr = await callVertexGemini({
    projectId,
    region: opts.region,
    model: opts.extractModel,
    payload: {
      contents: [{ role: 'user', parts: [{ text: extractPrompt }] }],
      generationConfig: { responseMimeType: 'application/json', responseSchema: GYM_SESSIONS_SCHEMA }
    }
  });
  const gymData = JSON.parse(extractResultStr);
  console.log(`   ✅ Extract xong: ${gymData.totalSessions} buổi (${gymData.weekRange}).\n`);

  console.log(`🧠 [Phase 2/3] Analyze bằng reasoning tier (${opts.analyzeModel})...`);
  const analyzePrompt = `Analyze gym training data for W${opts.week}. Raw data:
${JSON.stringify(gymData, null, 2)}

Analyze:
1. Progressive overload: Are weights/reps increasing appropriately?
2. Volume trend: Is total volume sustainable or too aggressive?
3. Recovery status: DOMS patterns, rest adequacy
4. Form issues: Any recurring form problems or pain signals?
5. Strengths: What's working well?
6. Recommendations: Specific actionable advice
7. Next week adjustments: What to change for W${opts.week + 1}?

Context: User is beginner comeback phase after years off. Prioritize form over weight, avoid ego lifting, watch for overtraining signals and joints.

Return structured analysis conformant to the requested JSON schema.`;

  const analyzeResultStr = await callVertexGemini({
    projectId,
    region: opts.region,
    model: opts.analyzeModel,
    payload: {
      contents: [{ role: 'user', parts: [{ text: analyzePrompt }] }],
      generationConfig: { responseMimeType: 'application/json', responseSchema: ANALYSIS_SCHEMA }
    }
  });
  const analysis = JSON.parse(analyzeResultStr);
  console.log('   ✅ Analyze xong.\n');

  console.log(`📝 [Phase 3/3] Format markdown bằng formatting tier (${opts.formatModel})...`);
  const templatePath = path.join(REPO_ROOT, '99-templates', 'weekly-review-template.md');
  const templateContent = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, 'utf8') : '';

  const formatPrompt = `Generate weekly gym review markdown for ${weekLabel} (${weekRangeStr}) based on:

Gym Data:
${JSON.stringify(gymData, null, 2)}

Analysis:
${JSON.stringify(analysis, null, 2)}

Template / Structure constraints:
${templateContent ? `Use this structure:\n${templateContent}` : 'Ensure it has Frontmatter (yaml), Summary, Gym, Recovery, What Worked/Failed, and Next Week Adjustments.'}

Rules:
- Write in Vietnamese.
- Keep gym exercise names in English.
- Be concise and highly actionable.
- Frontmatter must contain: week, year, date_range, gym_count, sleep_avg, mood_trend, recovery_status.
- For each day, include a nice markdown table showing: Exercise | Sets x Reps | Weight | RPE | Notes.

Return the complete, raw markdown file content ONLY. Do not wrap it in markdown code blocks. Ready to be written to a file.`;

  let finalMarkdown = await callVertexGemini({
    projectId,
    region: opts.region,
    model: opts.formatModel,
    payload: { contents: [{ role: 'user', parts: [{ text: formatPrompt }] }] }
  });

  finalMarkdown = finalMarkdown.trim();
  if (finalMarkdown.startsWith('```markdown')) finalMarkdown = finalMarkdown.slice(11).trim();
  else if (finalMarkdown.startsWith('```')) finalMarkdown = finalMarkdown.slice(3).trim();
  if (finalMarkdown.endsWith('```')) finalMarkdown = finalMarkdown.slice(0, -3).trim();

  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${finalMarkdown}\n`, 'utf8');

  console.log(`\n🎉 Báo cáo tuần hoàn tất: \x1b[36m${path.relative(REPO_ROOT, outputPath)}\x1b[0m\n`);
}

main().catch(error => {
  console.error(`\n❌ Lỗi thực thi Pipeline:`);
  console.error(error.message);
  process.exit(1);
});
