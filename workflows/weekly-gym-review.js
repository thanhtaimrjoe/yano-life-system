#!/usr/bin/env node

/**
 * Weekly Gym Review — Standalone Gemini Pipeline (Zero-Dependency)
 * 
 * SYSTEM PROJECT: yano-brse-ai-api
 * LOCATION: us-central1
 * 
 * PATTERN:
 * 1. Extract (Gemini 2.5 Flash) - Fast extraction of session data from markdown logs
 * 2. Analyze (Gemini 2.5 Pro) - Deep pattern analysis and progressive overload assessment
 * 3. Format (Gemini 2.5 Flash) - Generation of beautiful markdown review
 * 
 * DESCRIPTION:
 * This script runs entirely locally with ZERO external npm dependencies.
 * It uses the native `child_process` module to fetch gcloud OAuth2 tokens,
 * parses local markdown gym logs, and makes HTTPS requests directly to
 * Google Cloud Vertex AI's Gemini endpoint using native Node.js `fetch`.
 * 
 * USAGE:
 * node workflows/weekly-gym-review.js --week 22 --year 2026
 * node workflows/weekly-gym-review.js (Runs on current week/year)
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Parse arguments
const args = process.argv.slice(2);
let week = null;
let year = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--week' || args[i] === '-w') {
    week = parseInt(args[i + 1], 10);
  }
  if (args[i] === '--year' || args[i] === '-y') {
    year = parseInt(args[i + 1], 10);
  }
}

// Fallback to current week/year
if (week === null || year === null) {
  const today = new Date();
  const d = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  
  if (week === null) week = weekNo;
  if (year === null) year = d.getUTCFullYear();
}

console.log(`\n===============================================================`);
console.log(`🏋️  YANO GYM WEEKLY REVIEW PIPELINE (GEMINI ON GCP)`);
console.log(`📅 Target Week: W${week} — Year: ${year}`);
console.log(`===============================================================\n`);

// ----------------------------------------------------------------------------
// GCP HELPER FUNCTIONS
// ----------------------------------------------------------------------------

/**
 * Fetch OAuth2 Access Token from gcloud CLI
 */
function getGcpAccessToken() {
  try {
    return execSync('gcloud auth print-access-token', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error('❌ Lỗi: Không thể lấy GCP Access Token. Vui lòng kiểm tra lại gcloud CLI!');
    process.exit(1);
  }
}

/**
 * Fetch current active GCP Project ID
 */
function getGcpProjectId() {
  try {
    const project = execSync('gcloud config get-value project', { encoding: 'utf8' }).trim();
    if (!project) throw new Error('Project is empty');
    return project;
  } catch (error) {
    // Default to the requested project
    return 'yano-brse-ai-api';
  }
}

/**
 * Call Vertex AI Gemini API endpoint
 */
async function callVertexGemini(projectId, model, payload) {
  const accessToken = getGcpAccessToken();
  const region = 'us-central1';
  const url = `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/google/models/${model}:generateContent`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(payload)
  });

  const resJson = await response.json();
  if (resJson.error) {
    throw new Error(`GCP API Error: [${resJson.error.code}] ${resJson.error.message}`);
  }

  // Extract model output
  try {
    return resJson.candidates[0].content.parts[0].text;
  } catch (e) {
    throw new Error('❌ Không thể trích xuất kết quả từ Vertex AI Response. Cấu hình phản hồi không hợp lệ.');
  }
}

// ----------------------------------------------------------------------------
// LOCAL FILE HELPER FUNCTIONS
// ----------------------------------------------------------------------------

/**
 * Get the 7 dates of the ISO week (Monday to Sunday) in YYYY-MM-DD format
 */
function getWeekDates(year, week) {
  const jan4 = new Date(year, 0, 4);
  const jan4Day = jan4.getDay() || 7;
  const weekStart = new Date(jan4);
  weekStart.setDate(jan4.getDate() - jan4Day + 1 + (week - 1) * 7);

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    
    // Format date in local timezone to avoid UTC shifting
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${day}`);
  }
  return dates;
}

// ----------------------------------------------------------------------------
// STRUCTURED SCHEMA DEFINITIONS (Uppercase for Vertex AI)
// ----------------------------------------------------------------------------

const GYM_SESSIONS_SCHEMA = {
  type: "OBJECT",
  properties: {
    sessions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          date: { type: "STRING" },
          day: { type: "STRING" },
          focus: { type: "STRING" },
          duration: { type: "STRING" },
          exercises: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING" },
                sets: { type: "ARRAY", items: { type: "STRING" } },
                notes: { type: "STRING" }
              }
            }
          },
          rpe: { type: "STRING" },
          doms: { type: "STRING" },
          notes: { type: "STRING" }
        }
      }
    },
    weekRange: { type: "STRING" },
    totalSessions: { type: "NUMBER" }
  },
  required: ["sessions", "weekRange", "totalSessions"]
};

const ANALYSIS_SCHEMA = {
  type: "OBJECT",
  properties: {
    progressiveOverload: { type: "STRING" },
    volumeTrend: { type: "STRING" },
    recoveryStatus: { type: "STRING" },
    formIssues: { type: "ARRAY", items: { type: "STRING" } },
    strengths: { type: "ARRAY", items: { type: "STRING" } },
    recommendations: { type: "ARRAY", items: { type: "STRING" } },
    nextWeekAdjustments: { type: "STRING" }
  },
  required: ["progressiveOverload", "volumeTrend", "recoveryStatus", "formIssues", "strengths", "recommendations", "nextWeekAdjustments"]
};

// ----------------------------------------------------------------------------
// MAIN PIPELINE EXECUTION
// ----------------------------------------------------------------------------

async function main() {
  const projectId = getGcpProjectId();
  console.log(`🔗 GCP Active Project: \x1b[36m${projectId}\x1b[0m`);
  
  // Calculate ISO week date range
  const weekDates = getWeekDates(year, week);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];
  const weekRangeStr = `${weekStart} → ${weekEnd}`;
  console.log(`📅 Phạm vi tuần: \x1b[33m${weekRangeStr}\x1b[0m\n`);

  // Scan and load gym log files corresponding to these dates
  const gymDir = `02-gym/${year}`;
  if (!fs.existsSync(gymDir)) {
    console.error(`❌ Thư mục ${gymDir} không tồn tại!`);
    process.exit(1);
  }

  const allFiles = fs.readdirSync(gymDir);
  const weekLogs = [];

  for (const dateStr of weekDates) {
    // Look for files starting with YYYY-MM-DD
    const matchingFile = allFiles.find(f => f.startsWith(dateStr) && f.endsWith('.md'));
    if (matchingFile) {
      const filePath = `${gymDir}/${matchingFile}`;
      const content = fs.readFileSync(filePath, 'utf8');
      weekLogs.push({
        fileName: matchingFile,
        date: dateStr,
        content: content
      });
    }
  }

  if (weekLogs.length === 0) {
    console.warn(`⚠️  Cảnh báo: Không tìm thấy file log gym nào cho tuần W${week} (${weekRangeStr}).`);
    console.log(`Tui sẽ dừng pipeline tại đây nhé.`);
    process.exit(0);
  }

  console.log(`📁 Đã tìm thấy \x1b[32m${weekLogs.length}\x1b[0m file log gym trong tuần này:`);
  weekLogs.forEach(log => console.log(`   - ${log.fileName}`));
  console.log('');

  // Combine raw logs
  let rawLogsPayload = "";
  weekLogs.forEach(log => {
    rawLogsPayload += `\n\n=== START_FILE: ${log.fileName} ===\n${log.content}\n=== END_FILE: ${log.fileName} ===\n`;
  });

  // ============================================================================
  // PHASE 1: EXTRACT (Gemini 2.5 Flash)
  // ============================================================================
  console.log(`🔍 [Phase 1/3] Trích xuất dữ liệu thô bằng \x1b[35mgemini-2.5-flash\x1b[0m...`);
  
  const extractPrompt = `Extract all gym session data from the following raw logs for week W${week} (${weekRangeStr}).
  
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

  const extractPayload = {
    contents: [
      {
        role: "user",
        parts: [
          { text: extractPrompt }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: GYM_SESSIONS_SCHEMA
    }
  };

  const extractResultStr = await callVertexGemini(projectId, 'gemini-2.5-flash', extractPayload);
  const gymData = JSON.parse(extractResultStr);
  
  console.log(`   ✅ Trích xuất thành công! Đã phân tích ${gymData.totalSessions} buổi tập từ chuỗi ngày ${gymData.weekRange}.\n`);

  // ============================================================================
  // PHASE 2: ANALYZE (Gemini 2.5 Pro - Deep Reasoning)
  // ============================================================================
  console.log(`🧠 [Phase 2/3] Phân tích xu hướng & sự tiến bộ bằng \x1b[35mgemini-2.5-pro\x1b[0m (Reasoning)...`);
  
  const analyzePrompt = `Analyze gym training data for W${week}. Raw data:
  ${JSON.stringify(gymData, null, 2)}

  Analyze:
  1. Progressive overload: Are weights/reps increasing appropriately?
  2. Volume trend: Is total volume sustainable or too aggressive?
  3. Recovery status: DOMS patterns, rest adequacy
  4. Form issues: Any recurring form problems or pain signals?
  5. Strengths: What's working well?
  6. Recommendations: Specific actionable advice
  7. Next week adjustments: What to change for W${week + 1}?

  Context: User is beginner comeback phase after years off. Prioritize form over weight, avoid ego lifting, watch for overtraining signals and joints.

  Return structured analysis conformant to the requested JSON schema.`;

  const analyzePayload = {
    contents: [
      {
        role: "user",
        parts: [
          { text: analyzePrompt }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA
    }
  };

  const analyzeResultStr = await callVertexGemini(projectId, 'gemini-2.5-pro', analyzePayload);
  const analysis = JSON.parse(analyzeResultStr);
  
  console.log(`   ✅ Phân tích hoàn tất! Đã tổng hợp các điểm cốt lõi, progressive overload, và kế hoạch điều chỉnh.\n`);

  // ============================================================================
  // PHASE 3: FORMAT (Gemini 2.5 Flash)
  // ============================================================================
  console.log(`📝 [Phase 3/3] Tạo file Markdown báo cáo tuần bằng \x1b[35mgemini-2.5-flash\x1b[0m...`);

  // Read template if exists to give prompt some context
  let templateContent = "";
  const templatePath = '99-templates/weekly-review-template.md';
  if (fs.existsSync(templatePath)) {
    templateContent = fs.readFileSync(templatePath, 'utf8');
  }

  const formatPrompt = `Generate weekly gym review markdown for W${week} (${weekRangeStr}) based on:

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
  
  Return the complete, raw markdown file content ONLY. Do not wrap it in markdown code blocks (\`\`\`markdown ... \`\`\`). Ready to be written to a file.`;

  const formatPayload = {
    contents: [
      {
        role: "user",
        parts: [
          { text: formatPrompt }
        ]
      }
    ]
  };

  // Regular text generation for Markdown formatting
  let finalMarkdown = await callVertexGemini(projectId, 'gemini-2.5-flash', formatPayload);
  
  // Clean markdown wrapping if model accidentally added it
  if (finalMarkdown.trim().startsWith('```markdown')) {
    finalMarkdown = finalMarkdown.trim().substring(11);
    if (finalMarkdown.endsWith('```')) {
      finalMarkdown = finalMarkdown.substring(0, finalMarkdown.length - 3);
    }
  } else if (finalMarkdown.trim().startsWith('```')) {
    finalMarkdown = finalMarkdown.trim().substring(3);
    if (finalMarkdown.endsWith('```')) {
      finalMarkdown = finalMarkdown.substring(0, finalMarkdown.length - 3);
    }
  }

  // Ensure output directory exists
  const reviewDir = '04-weekly-review';
  if (!fs.existsSync(reviewDir)) {
    fs.mkdirSync(reviewDir, { recursive: true });
  }

  const outputPath = `${reviewDir}/${year}-W${week}.md`;
  fs.writeFileSync(outputPath, finalMarkdown.trim());

  console.log(`\n🎉 \x1b[32mBáo cáo tuần hoàn tất thành công!\x1b[0m`);
  console.log(`📂 Kết quả lưu tại: \x1b[36m${outputPath}\x1b[0m\n`);

  // Run build-data.js to update dashboard
  try {
    console.log(`⚙️  Đang chạy build-data.js để cập nhật Dashboard...`);
    execSync('node build-data.js');
    console.log(`📊 Dashboard đã được đồng bộ hóa thành công!`);
  } catch (err) {
    console.warn(`⚠️  Cảnh báo: Không thể tự động chạy build-data.js. Bạn hãy chạy thủ công nha.`);
  }
}

main().catch(error => {
  console.error(`\n❌ Lỗi thực thi Pipeline:`);
  console.error(error.message);
  process.exit(1);
});
