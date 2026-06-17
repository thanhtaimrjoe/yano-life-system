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
      
      // Initialize an empty config template for user convenience
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

    // Try checking/updating the sheet
    console.log(`🚀 Checking Google Spreadsheet ID: ${spreadsheetId}...`);
    
    // First, verify if we can access the sheet, and check if Gym Logs sheet exists
    const sheetInfoResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const sheetInfo = await sheetInfoResponse.json();
    if (!sheetInfoResponse.ok) {
      if (sheetInfo.error && sheetInfo.error.status === 'PERMISSION_DENIED') {
        throw new Error(`Permission Denied: ${sheetInfo.error.message}\nBạn đã Share Google Sheet với email Robot "${clientEmail}" chưa?`);
      }
      throw new Error(`Failed to access spreadsheet: ${JSON.stringify(sheetInfo)}`);
    }

    const sheets = sheetInfo.sheets || [];
    const hasGymLogsSheet = sheets.some(s => s.properties.title === 'Gym Logs');

    if (!hasGymLogsSheet) {
      console.log('🆕 Creating "Gym Logs" tab inside the spreadsheet...');
      const addSheetResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [
            {
              addSheet: {
                properties: {
                  title: 'Gym Logs',
                  gridProperties: { frozenRowCount: 1 }
                }
              }
            }
          ]
        })
      });

      const addSheetResult = await addSheetResponse.json();
      if (!addSheetResponse.ok) {
        throw new Error(`Failed to create "Gym Logs" tab: ${JSON.stringify(addSheetResult)}`);
      }

      // Initialize headers
      console.log('✍️ Initializing headers...');
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

    // Append the rows
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

    const appendResult = await appendResponse.json();
    if (!appendResponse.ok) {
      throw new Error(`Failed to append rows: ${JSON.stringify(appendResult)}`);
    }

    console.log('\n======================================================');
    console.log('🎉  ĐỒNG BỘ DỮ LIỆU THÀNH CÔNG RỒI NHA!');
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

