const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = '/Users/taiht/Documents/yano-life-system';
const CONFIG_PATH = path.join(REPO_ROOT, 'workspace', 'sheets-config.json');
const CRED_PATH = path.join(REPO_ROOT, 'workspace', 'credentials.json');

// Get Service Account Email if credentials exist
function getServiceAccountEmail() {
  if (fs.existsSync(CRED_PATH)) {
    try {
      const creds = JSON.parse(fs.readFileSync(CRED_PATH, 'utf8'));
      return creds.client_email;
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Get active access token
function getAccessToken() {
  try {
    if (fs.existsSync(CRED_PATH)) {
      console.log('🤖 Detected Service Account credentials.json. Activating Robot Mode!');
      // Get token for Service Account using GOOGLE_APPLICATION_CREDENTIALS
      return execSync(`GOOGLE_APPLICATION_CREDENTIALS="${CRED_PATH}" gcloud auth application-default print-access-token --scopes=https://www.googleapis.com/auth/spreadsheets`, { encoding: 'utf8' }).trim();
    } else {
      console.log('👤 No Service Account found. Falling back to User Credentials...');
      return execSync('gcloud auth application-default print-access-token --scopes=openid,https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/spreadsheets', { encoding: 'utf8' }).trim();
    }
  } catch (error) {
    throw new Error('Could not retrieve access token. Please ensure gcloud is installed and authenticated.');
  }
}

// Find the latest gym log file
function getLatestGymLog() {
  const gymDir = path.join(REPO_ROOT, '02-gym', '2026');
  if (!fs.existsSync(gymDir)) {
    throw new Error(`Gym directory not found at: ${gymDir}`);
  }

  const files = fs.readdirSync(gymDir)
    .filter(f => f.endsWith('.md'))
    .sort() // alphabetically sorted, latest date will be last
    .reverse();

  if (files.length === 0) {
    throw new Error('No gym logs found in 02-gym/2026');
  }

  return path.join(gymDir, files[0]);
}

// Parse markdown gym log into clean structured rows
function parseGymLog(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath);
  
  // Extract date and focus from YAML frontmatter
  let date = filename.substring(0, 10); // YYYY-MM-DD
  let focus = 'Workout';
  
  const yamlMatch = content.match(/^---([\s\S]*?)---/);
  if (yamlMatch) {
    const yaml = yamlMatch[1];
    const focusMatch = yaml.match(/focus:\s*\[?([^\]\n]+)\]?/);
    if (focusMatch) {
      focus = focusMatch[1].replace(/['"]/g, '').trim();
    }
  }

  // Find exercise table rows
  const rows = [];
  const lines = content.split('\n');
  let inTable = false;

  for (const line of lines) {
    if (line.includes('| Exercise |') || line.includes('|Exercise|')) {
      inTable = true;
      continue;
    }
    if (inTable) {
      if (!line.trim().startsWith('|')) {
        inTable = false;
        continue;
      }
      // Skip alignment rows |---|---|
      if (line.includes('---|') || line.includes(':---|')) {
        continue;
      }
      
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 6) {
        const exercise = parts[1];
        const setsReps = parts[2];
        const weight = parts[3];
        const rpe = parts[4];
        const notes = parts[5];
        
        if (exercise && exercise !== 'Exercise') {
          rows.push({
            date,
            focus,
            exercise,
            setsReps,
            weight,
            rpe,
            notes
          });
        }
      }
    }
  }

  return rows;
}

// Write sheets-config.json
function saveConfig(config) {
  if (!fs.existsSync(path.dirname(CONFIG_PATH))) {
    fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
  }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
}

// Read sheets-config.json
function loadConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  }
  return {};
}

async function runSync() {
  try {
    const clientEmail = getServiceAccountEmail();
    let config = loadConfig();
    let spreadsheetId = config.spreadsheetId;

    // Guard: Check if spreadsheetId is configured
    if (!spreadsheetId || spreadsheetId.includes('YOUR_SPREADSHEET_ID_HERE')) {
      console.log('\n======================================================');
      console.log('⚠️  SPREADSHEET ID IS NOT CONFIGURED YET!');
      console.log('======================================================');
      console.log('Để Robot của bạn có thể ghi dữ liệu tập luyện, hãy làm theo các bước sau:');
      console.log('\n1️⃣  Tạo một file Google Sheet mới tinh trên Google Drive của bạn.');
      console.log('2️⃣  Bấm nút "Share/Chia sẻ" file đó, cấp quyền "Editor/Người chỉnh sửa" cho Robot email này:');
      console.log(`   👉  \x1b[36m${clientEmail || 'Không tìm thấy credentials.json'}\x1b[0m`);
      console.log('3️⃣  Copy ID của Google Sheet đó (chuỗi ký tự dài trên URL trình duyệt của bạn).');
      console.log('4️⃣  Dán cái ID đó vào file cấu hình dưới đây và lưu lại:');
      console.log(`   📂  \x1b[33m${CONFIG_PATH}\x1b[0m`);
      console.log('\n   Cấu trúc file sheets-config.json:');
      console.log('   {');
      console.log('     "spreadsheetId": "ĐIỀN_ID_GOOGLE_SHEET_VÀO_ĐÂY"');
      console.log('   }');
      console.log('======================================================\n');
      
      if (!spreadsheetId) {
        saveConfig({ spreadsheetId: "YOUR_SPREADSHEET_ID_HERE" });
        console.log('📝 Khởi tạo sẵn file sheets-config.json trống cho bạn rồi nhé!');
      }
      return;
    }

    console.log('🔄 Loading latest gym log...');
    const latestLogPath = getLatestGymLog();
    console.log(`📝 Found latest log: ${path.basename(latestLogPath)}`);
    
    const parsedRows = parseGymLog(latestLogPath);
    if (parsedRows.length === 0) {
      console.log('⚠️ No exercises found in the log table to sync.');
      return;
    }
    console.log(`📊 Parsed ${parsedRows.length} exercises from the log.`);

    console.log('🔑 Authenticating with Google Sheets API...');
    const token = getAccessToken();

    console.log(`🚀 Checking Google Spreadsheet: ${spreadsheetId}...`);
    
    // 1. Fetch initial spreadsheet metadata
    let metaResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    let spreadsheet = await metaResponse.json();
    if (!metaResponse.ok) {
      if (spreadsheet.error && spreadsheet.error.status === 'PERMISSION_DENIED') {
        throw new Error(`Permission Denied: ${spreadsheet.error.message}\nBạn đã Share Google Sheet với email Robot "${clientEmail}" chưa?`);
      }
      throw new Error(`Failed to access spreadsheet: ${JSON.stringify(spreadsheet)}`);
    }

    let sheets = spreadsheet.sheets || [];
    let gymLogsSheetId = null;
    let dashboardSheetId = null;

    for (const s of sheets) {
      if (s.properties.title === 'Gym Logs') gymLogsSheetId = s.properties.sheetId;
      if (s.properties.title === 'Dashboard') dashboardSheetId = s.properties.sheetId;
    }

    // 2. Create missing tabs if needed
    const initialRequests = [];
    if (gymLogsSheetId === null) {
      console.log('🆕 Creating "Gym Logs" tab...');
      gymLogsSheetId = 111922024; // Use a fixed sheetId for predictability
      initialRequests.push({
        addSheet: {
          properties: {
            sheetId: gymLogsSheetId,
            title: 'Gym Logs',
            index: 1,
            gridProperties: { frozenRowCount: 1 }
          }
        }
      });
    }

    if (dashboardSheetId === null) {
      console.log('🆕 Creating "Dashboard" tab...');
      dashboardSheetId = 88888888; // Use a fixed sheetId for predictability
      initialRequests.push({
        addSheet: {
          properties: {
            sheetId: dashboardSheetId,
            title: 'Dashboard',
            index: 0, // Dashboard will be the first tab
            gridProperties: { rowCount: 100, columnCount: 15 }
          }
        }
      });
    }

    if (initialRequests.length > 0) {
      console.log('🚀 Setting up sheet tabs...');
      const createRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requests: initialRequests })
      });
      if (!createRes.ok) {
        throw new Error(`Failed to initialize tabs: ${JSON.stringify(await createRes.json())}`);
      }
      
      // If we just created Gym Logs, initialize headers
      if (sheets.every(s => s.properties.title !== 'Gym Logs')) {
        console.log('✍️ Initializing Gym Logs headers...');
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Gym%20Logs!A1:G1?valueInputOption=USER_ENTERED`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: [
              ['Date', 'Focus Area', 'Exercise', 'Sets x Reps', 'Weight', 'RPE', 'Notes / MMC Wins']
            ]
          })
        });
      }
    }

    // 3. Append the rows to "Gym Logs"
    console.log(`🚀 Appending workout data...`);
    const valuesToAppend = parsedRows.map(row => [
      row.date,
      row.focus,
      row.exercise,
      row.setsReps,
      row.weight,
      row.rpe,
      row.notes
    ]);

    const appendResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Gym%20Logs!A1:G1:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: valuesToAppend
      })
    });

    if (!appendResponse.ok) {
      throw new Error(`Failed to append rows: ${JSON.stringify(await appendResponse.json())}`);
    }

    // 4. Re-fetch sheet metadata to inspect charts (avoid duplicates)
    metaResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    spreadsheet = await metaResponse.json();
    const dashboardSheet = (spreadsheet.sheets || []).find(s => s.properties.title === 'Dashboard');
    const hasChart = dashboardSheet && dashboardSheet.charts && dashboardSheet.charts.length > 0;

    // 5. Build massive styling and layout batch update
    console.log('🎨 Applying premium theme, styling, and Dashboard content...');
    const formattingRequests = [];

    // --- AESTHETICS FOR "GYM LOGS" SHEET ---
    formattingRequests.push({
      repeatCell: {
        range: { sheetId: gymLogsSheetId },
        cell: { userEnteredFormat: { textFormat: { fontFamily: 'Inter' } } },
        fields: 'userEnteredFormat.textFormat.fontFamily'
      }
    });

    formattingRequests.push({
      repeatCell: {
        range: { sheetId: gymLogsSheetId, startRowIndex: 0, endRowIndex: 1 },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 15/255, green: 23/255, blue: 42/255 }, // Dark Slate
            textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 10, fontFamily: 'Inter' },
            horizontalAlignment: 'CENTER',
            verticalAlignment: 'MIDDLE'
          }
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)'
      }
    });

    const centerAlignColumns = [0, 1, 3, 4, 5];
    for (const colIndex of centerAlignColumns) {
      formattingRequests.push({
        repeatCell: {
          range: { sheetId: gymLogsSheetId, startColumnIndex: colIndex, endColumnIndex: colIndex + 1, startRowIndex: 1 },
          cell: { userEnteredFormat: { horizontalAlignment: 'CENTER' } },
          fields: 'userEnteredFormat.horizontalAlignment'
        }
      });
    }

    const leftAlignColumns = [2, 6];
    for (const colIndex of leftAlignColumns) {
      formattingRequests.push({
        repeatCell: {
          range: { sheetId: gymLogsSheetId, startColumnIndex: colIndex, endColumnIndex: colIndex + 1, startRowIndex: 1 },
          cell: { userEnteredFormat: { horizontalAlignment: 'LEFT' } },
          fields: 'userEnteredFormat.horizontalAlignment'
        }
      });
    }

    const colWidths = [
      { start: 0, end: 1, size: 90 },   // Date
      { start: 1, end: 2, size: 160 },  // Focus Area
      { start: 2, end: 3, size: 220 },  // Exercise
      { start: 3, end: 4, size: 100 },  // Sets x Reps
      { start: 4, end: 5, size: 80 },   // Weight
      { start: 5, end: 6, size: 70 },   // RPE
      { start: 6, end: 7, size: 450 }   // Notes
    ];
    for (const cw of colWidths) {
      formattingRequests.push({
        updateDimensionProperties: {
          range: { sheetId: gymLogsSheetId, dimension: 'COLUMNS', startIndex: cw.start, endIndex: cw.end },
          properties: { pixelSize: cw.size },
          fields: 'pixelSize'
        }
      });
    }

    // Soft color scale: RPE 1-5 (Green-Yellow), RPE 6-10 (Yellow-Red)
    formattingRequests.push({
      addConditionalFormatRule: {
        rule: {
          ranges: [{ sheetId: gymLogsSheetId, startColumnIndex: 5, endColumnIndex: 6, startRowIndex: 1 }],
          gradientRule: {
            minpoint: { color: { red: 209/255, green: 250/255, blue: 229/255 }, type: 'NUMBER', value: '1' }, // Soft Emerald
            midpoint: { color: { red: 254/255, green: 243/255, blue: 199/255 }, type: 'NUMBER', value: '6' }, // Soft Amber
            maxpoint: { color: { red: 254/255, green: 226/255, blue: 226/255 }, type: 'NUMBER', value: '10' } // Soft Red
          }
        },
        index: 0
      }
    });

    // --- DASHBOARD CREATION & FORMULAS ---
    formattingRequests.push({
      repeatCell: {
        range: { sheetId: dashboardSheetId },
        cell: { userEnteredFormat: { textFormat: { fontFamily: 'Inter' } } },
        fields: 'userEnteredFormat.textFormat.fontFamily'
      }
    });

    const dashWidths = [
      { start: 0, end: 1, size: 120 }, // Date
      { start: 1, end: 2, size: 120 }, // Exercises count
      { start: 2, end: 3, size: 40 },  // Gap
      { start: 3, end: 4, size: 150 }, // KPI Side
      { start: 4, end: 5, size: 150 },
      { start: 5, end: 6, size: 150 },
      { start: 6, end: 7, size: 150 }
    ];
    for (const dw of dashWidths) {
      formattingRequests.push({
        updateDimensionProperties: {
          range: { sheetId: dashboardSheetId, dimension: 'COLUMNS', startIndex: dw.start, endIndex: dw.end },
          properties: { pixelSize: dw.size },
          fields: 'pixelSize'
        }
      });
    }

    const merges = [
      { sheetId: dashboardSheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 7 }, // Title A1:G1
      { sheetId: dashboardSheetId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 2 }, // KPI 1 A3:B3
      { sheetId: dashboardSheetId, startRowIndex: 3, endRowIndex: 4, startColumnIndex: 0, endColumnIndex: 2 }, // KPI 1 Value A4:B4
      { sheetId: dashboardSheetId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 3, endColumnIndex: 5 }, // KPI 2 D3:E3
      { sheetId: dashboardSheetId, startRowIndex: 3, endRowIndex: 4, startColumnIndex: 3, endColumnIndex: 5 }, // KPI 2 Value D4:E4
      { sheetId: dashboardSheetId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 5, endColumnIndex: 7 }, // KPI 3 F3:G3
      { sheetId: dashboardSheetId, startRowIndex: 3, endRowIndex: 4, startColumnIndex: 5, endColumnIndex: 7 }, // KPI 3 Value F4:G4
      { sheetId: dashboardSheetId, startRowIndex: 5, endRowIndex: 6, startColumnIndex: 0, endColumnIndex: 7 }  // Title A6:G6
    ];
    for (const m of merges) {
      formattingRequests.push({ mergeCells: { range: m, mergeType: 'MERGE_ALL' } });
    }

    // Title banner
    formattingRequests.push({
      updateCells: {
        range: { sheetId: dashboardSheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 7 },
        rows: [{
          values: [{
            userEnteredValue: { stringValue: 'YANO LIFE SYSTEM - PROGRESS DASHBOARD' },
            userEnteredFormat: {
              backgroundColor: { red: 30/255, green: 27/255, blue: 75/255 }, // Dark Indigo
              textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 13, fontFamily: 'Inter' },
              horizontalAlignment: 'CENTER',
              verticalAlignment: 'MIDDLE'
            }
          }]
        }],
        fields: 'userEnteredValue,userEnteredFormat'
      }
    });

    // KPI 1: Tổng buổi tập
    formattingRequests.push({
      updateCells: {
        range: { sheetId: dashboardSheetId, startRowIndex: 2, endRowIndex: 4, startColumnIndex: 0, endColumnIndex: 2 },
        rows: [
          {
            values: [{
              userEnteredValue: { stringValue: '👟 TỔNG SỐ BUỔI TẬP' },
              userEnteredFormat: {
                backgroundColor: { red: 241/255, green: 245/255, blue: 249/255 },
                textFormat: { foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 }, bold: true, fontSize: 9, fontFamily: 'Inter' },
                horizontalAlignment: 'CENTER',
                verticalAlignment: 'MIDDLE'
              }
            }]
          },
          {
            values: [{
              userEnteredValue: { formulaValue: "=COUNTA(UNIQUE('Gym Logs'!A2:A))" },
              userEnteredFormat: {
                backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                textFormat: { foregroundColor: { red: 15/255, green: 23/255, blue: 42/255 }, bold: true, fontSize: 18, fontFamily: 'Inter' },
                horizontalAlignment: 'CENTER',
                verticalAlignment: 'MIDDLE'
              }
            }]
          }
        ],
        fields: 'userEnteredValue,userEnteredFormat'
      }
    });

    // KPI 2: Tổng số set tập
    formattingRequests.push({
      updateCells: {
        range: { sheetId: dashboardSheetId, startRowIndex: 2, endRowIndex: 4, startColumnIndex: 3, endColumnIndex: 5 },
        rows: [
          {
            values: [{
              userEnteredValue: { stringValue: '🔥 TỔNG SỐ SET TẬP' },
              userEnteredFormat: {
                backgroundColor: { red: 241/255, green: 245/255, blue: 249/255 },
                textFormat: { foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 }, bold: true, fontSize: 9, fontFamily: 'Inter' },
                horizontalAlignment: 'CENTER',
                verticalAlignment: 'MIDDLE'
              }
            }]
          },
          {
            values: [{
              userEnteredValue: { formulaValue: "=COUNTA('Gym Logs'!C2:C)" },
              userEnteredFormat: {
                backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                textFormat: { foregroundColor: { red: 15/255, green: 23/255, blue: 42/255 }, bold: true, fontSize: 18, fontFamily: 'Inter' },
                horizontalAlignment: 'CENTER',
                verticalAlignment: 'MIDDLE'
              }
            }]
          }
        ],
        fields: 'userEnteredValue,userEnteredFormat'
      }
    });

    // KPI 3: Bài tập chăm nhất
    formattingRequests.push({
      updateCells: {
        range: { sheetId: dashboardSheetId, startRowIndex: 2, endRowIndex: 4, startColumnIndex: 5, endColumnIndex: 7 },
        rows: [
          {
            values: [{
              userEnteredValue: { stringValue: '🏆 BÀI TẬP CHĂM NHẤT' },
              userEnteredFormat: {
                backgroundColor: { red: 241/255, green: 245/255, blue: 249/255 },
                textFormat: { foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 }, bold: true, fontSize: 9, fontFamily: 'Inter' },
                horizontalAlignment: 'CENTER',
                verticalAlignment: 'MIDDLE'
              }
            }]
          },
          {
            values: [{
              userEnteredValue: { formulaValue: "=INDEX(QUERY('Gym Logs'!C2:G, \"SELECT C, COUNT(C) GROUP BY C ORDER BY COUNT(C) DESC LIMIT 1 LABEL COUNT(C) ''\"), 1, 1)" },
              userEnteredFormat: {
                backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                textFormat: { foregroundColor: { red: 15/255, green: 23/255, blue: 42/255 }, bold: true, fontSize: 11, fontFamily: 'Inter' },
                horizontalAlignment: 'CENTER',
                verticalAlignment: 'MIDDLE'
              }
            }]
          }
        ],
        fields: 'userEnteredValue,userEnteredFormat'
      }
    });

    // Section header
    formattingRequests.push({
      updateCells: {
        range: { sheetId: dashboardSheetId, startRowIndex: 5, endRowIndex: 6, startColumnIndex: 0, endColumnIndex: 7 },
        rows: [{
          values: [{
            userEnteredValue: { stringValue: '📈 XU HƯỚNG TẬP LUYỆN (SỐ BÀI TẬP THEO NGÀY)' },
            userEnteredFormat: {
              textFormat: { foregroundColor: { red: 30/255, green: 27/255, blue: 75/255 }, bold: true, fontSize: 11, fontFamily: 'Inter' },
              verticalAlignment: 'MIDDLE'
            }
          }]
        }],
        fields: 'userEnteredValue,userEnteredFormat'
      }
    });

    // Table headers (A8:B8)
    formattingRequests.push({
      updateCells: {
        range: { sheetId: dashboardSheetId, startRowIndex: 7, endRowIndex: 8, startColumnIndex: 0, endColumnIndex: 2 },
        rows: [{
          values: [
            {
              userEnteredValue: { stringValue: 'Ngày' },
              userEnteredFormat: {
                backgroundColor: { red: 79/255, green: 70/255, blue: 229/255 },
                textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 10, fontFamily: 'Inter' },
                horizontalAlignment: 'CENTER',
                verticalAlignment: 'MIDDLE'
              }
            },
            {
              userEnteredValue: { stringValue: 'Số bài tập' },
              userEnteredFormat: {
                backgroundColor: { red: 79/255, green: 70/255, blue: 229/255 },
                textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 10, fontFamily: 'Inter' },
                horizontalAlignment: 'CENTER',
                verticalAlignment: 'MIDDLE'
              }
            }
          ]
        }],
        fields: 'userEnteredValue,userEnteredFormat'
      }
    });

    // Table dynamic Query formula in A9
    formattingRequests.push({
      updateCells: {
        range: { sheetId: dashboardSheetId, startRowIndex: 8, endRowIndex: 9, startColumnIndex: 0, endColumnIndex: 1 },
        rows: [{
          values: [{
            userEnteredValue: { formulaValue: "=QUERY('Gym Logs'!A2:C, \"SELECT A, COUNT(C) WHERE A IS NOT NULL GROUP BY A ORDER BY A LABEL A '', COUNT(C) '' \")" },
            userEnteredFormat: { horizontalAlignment: 'CENTER', verticalAlignment: 'MIDDLE', textFormat: { fontFamily: 'Inter' } }
          }]
        }],
        fields: 'userEnteredValue,userEnteredFormat'
      }
    });

    // Align formatting for A9:B100
    formattingRequests.push({
      repeatCell: {
        range: { sheetId: dashboardSheetId, startRowIndex: 8, endRowIndex: 100, startColumnIndex: 0, endColumnIndex: 2 },
        cell: {
          userEnteredFormat: { horizontalAlignment: 'CENTER', verticalAlignment: 'MIDDLE', textFormat: { fontFamily: 'Inter' } }
        },
        fields: 'userEnteredFormat.horizontalAlignment,userEnteredFormat.verticalAlignment,userEnteredFormat.textFormat.fontFamily'
      }
    });

    // Append Chart ONLY if it's missing (prevent chart duplication)
    if (!hasChart) {
      console.log('📊 Chart is missing. Adding chart generation to batch update...');
      formattingRequests.push({
        addChart: {
          chart: {
            spec: {
              title: 'Số Bài Tập Đã Hoàn Thành Qua Các Ngày',
              titleTextFormat: {
                fontFamily: 'Inter',
                fontSize: 11,
                bold: true,
                foregroundColor: { red: 15/255, green: 23/255, blue: 42/255 }
              },
              basicChart: {
                chartType: 'COLUMN',
                legendPosition: 'NO_LEGEND',
                axis: [
                  { position: 'BOTTOM_AXIS', title: 'Ngày' },
                  { position: 'LEFT_AXIS', title: 'Số lượng bài tập' }
                ],
                domains: [
                  {
                    domain: {
                      sourceRange: {
                        sources: [{
                          sheetId: dashboardSheetId,
                          startRowIndex: 8,
                          endRowIndex: 100,
                          startColumnIndex: 0,
                          endColumnIndex: 1
                        }]
                      }
                    }
                  }
                ],
                series: [{
                  series: {
                    sourceRange: {
                      sources: [{
                        sheetId: dashboardSheetId,
                        startRowIndex: 8,
                        endRowIndex: 100,
                        startColumnIndex: 1,
                        endColumnIndex: 2
                      }]
                    }
                  },
                  targetAxis: 'LEFT_AXIS',
                  colorStyle: {
                    rgbColor: { red: 79/255, green: 70/255, blue: 229/255 } // Indigo-600
                  }
                }]
              }
            },
            position: {
              overlayPosition: {
                anchorCell: {
                  sheetId: dashboardSheetId,
                  rowIndex: 7, // Row 8
                  columnIndex: 3 // Column D
                },
                offsetXPixels: 15,
                offsetYPixels: 0,
                widthPixels: 450,
                heightPixels: 280
              }
            }
          }
        }
      });
    }

    console.log(`🚀 Sending batchUpdate for premium layout, conditional formatting, and dashboard...`);
    const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ requests: formattingRequests })
    });

    if (!updateRes.ok) {
      throw new Error(`Failed to apply styling: ${JSON.stringify(await updateRes.json())}`);
    }

    console.log('\n======================================================');
    console.log('🎉  ĐỒNG BỘ & THIẾT KẾ DỰ LIỆU THÀNH CÔNG RỒI NHA!');
    console.log('======================================================');
    console.log(`🔗  Mở Google Sheet của bạn ở đây:`);
    console.log(`\x1b[32mhttps://docs.google.com/spreadsheets/d/${spreadsheetId}/edit\x1b[0m`);
    console.log('======================================================\n');

  } catch (error) {
    console.error('\n❌ ERROR DURING SYNC PROCESS:');
    console.error(error.message);
  }
}

runSync();

