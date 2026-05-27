const fs = require('fs');
const path = require('path');

// Helper to check if a directory exists
function dirExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (e) {
    return false;
  }
}

// Recursively find all markdown files in a folder
function getMarkdownFiles(dir, fileList = []) {
  if (!dirExists(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getMarkdownFiles(filePath, fileList);
    } else if (stat.isFile() && file.endsWith('.md')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Custom parser for YAML-like frontmatter and body
function parseMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let inFrontmatter = false;
  let frontmatterLines = [];
  let bodyLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '---') {
      if (!inFrontmatter && frontmatterLines.length === 0 && i === 0) {
        inFrontmatter = true;
        continue;
      } else if (inFrontmatter) {
        inFrontmatter = false;
        bodyLines = lines.slice(i + 1);
        break;
      }
    }
    if (inFrontmatter) {
      frontmatterLines.push(line);
    } else {
      bodyLines.push(line);
    }
  }

  // If we broke out and found frontmatter, parse it
  const data = {};
  if (frontmatterLines.length > 0) {
    let currentKey = null;
    for (const line of frontmatterLines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      // Check if it's an array element under a key: e.g. - item
      if (trimmed.startsWith('-') && currentKey) {
        const val = trimmed.substring(1).trim().replace(/^['"]|['"]$/g, '');
        if (!data[currentKey]) data[currentKey] = [];
        if (Array.isArray(data[currentKey])) {
          data[currentKey].push(val);
        }
        continue;
      }

      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        const key = line.substring(0, colonIdx).trim();
        let value = line.substring(colonIdx + 1).trim();

        // Check if inline array: [a, b, c]
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.substring(1, value.length - 1)
            .split(',')
            .map(v => v.trim().replace(/^['"]|['"]$/g, ''))
            .filter(v => v);
        } else if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        } else if (value === 'true') {
          value = true;
        } else if (value === 'false') {
          value = false;
        } else if (value === 'null' || value === '~') {
          value = null;
        } else if (!isNaN(value) && value !== '') {
          value = Number(value);
        }
        data[key] = value;
        currentKey = key;
      }
    }
  }

  const body = bodyLines.join('\n');
  return { frontmatter: data, body };
}

// Parse markdown sections by ## headers
function parseSections(body) {
  const sections = {};
  const lines = body.split('\n');
  let currentHeader = 'Introduction';
  let currentContent = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentContent.length > 0) {
        sections[currentHeader] = currentContent.join('\n').trim();
      }
      currentHeader = line.substring(3).trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  if (currentContent.length > 0) {
    sections[currentHeader] = currentContent.join('\n').trim();
  }
  return sections;
}

// Parse gym markdown table for exercises
function parseGymTable(markdown) {
  const exercises = [];
  const lines = markdown.split('\n');
  let tableHeaderFound = false;
  let headers = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed
        .split('|')
        .map(c => c.trim())
        .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

      // Check if separator line (e.g. |---|---|)
      if (cells.every(c => c.startsWith('-'))) {
        continue;
      }

      if (!tableHeaderFound) {
        headers = cells.map(h => h.toLowerCase().trim());
        tableHeaderFound = true;
      } else {
        const row = {};
        cells.forEach((cell, idx) => {
          const header = headers[idx] || `col_${idx}`;
          row[header] = cell;
        });
        if (row.exercise && row.exercise !== 'Exercise') {
          exercises.push(row);
        }
      }
    } else {
      if (trimmed && !trimmed.startsWith('|')) {
        // Table segment might have ended, let's keep searching for another table
        tableHeaderFound = false;
      }
    }
  }
  return exercises;
}

// Main compiler function
function buildData() {
  console.log('Starting compilation of markdown logs into JSON...');
  const baseDir = __dirname;
  const outputDir = path.join(baseDir, 'dashboard');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const result = {
    profile: {},
    daily: [],
    gym: [],
    meals: [],
    weeklyReview: [],
    knowledge: []
  };

  // 1. Parse Profile files (00-profile)
  const profileFiles = getMarkdownFiles(path.join(baseDir, '00-profile'));
  for (const file of profileFiles) {
    const name = path.basename(file, '.md');
    try {
      const { frontmatter, body } = parseMarkdown(file);
      const sections = parseSections(body);
      result.profile[name] = {
        frontmatter,
        sections,
        rawBody: body
      };
    } catch (e) {
      console.error(`Error parsing profile file ${file}:`, e);
    }
  }

  // 2. Parse Daily Logs (01-daily)
  const dailyFiles = getMarkdownFiles(path.join(baseDir, '01-daily'));
  for (const file of dailyFiles) {
    try {
      const { frontmatter, body } = parseMarkdown(file);
      const sections = parseSections(body);
      result.daily.push({
        date: frontmatter.date || path.basename(file, '.md'),
        frontmatter,
        sections,
        filePath: path.relative(baseDir, file).replace(/\\/g, '/')
      });
    } catch (e) {
      console.error(`Error parsing daily file ${file}:`, e);
    }
  }
  // Sort daily logs descending
  result.daily.sort((a, b) => b.date.localeCompare(a.date));

  // 3. Parse Gym Logs (02-gym)
  const gymFiles = getMarkdownFiles(path.join(baseDir, '02-gym'));
  for (const file of gymFiles) {
    try {
      const { frontmatter, body } = parseMarkdown(file);
      const sections = parseSections(body);
      
      // Try to parse the exercise table
      let exercises = [];
      for (const sectionName of Object.keys(sections)) {
        if (sectionName.toLowerCase().includes('exercise') || sectionName.toLowerCase().includes('main session')) {
          const parsedTable = parseGymTable(sections[sectionName]);
          if (parsedTable.length > 0) {
            exercises = exercises.concat(parsedTable);
          }
        }
      }

      result.gym.push({
        date: frontmatter.date || path.basename(file, '.md').split('-day')[0],
        dayNumber: frontmatter.day || null,
        frontmatter,
        sections,
        exercises,
        filePath: path.relative(baseDir, file).replace(/\\/g, '/')
      });
    } catch (e) {
      console.error(`Error parsing gym file ${file}:`, e);
    }
  }
  result.gym.sort((a, b) => b.date.localeCompare(a.date));

  // 4. Parse Meals Logs (03-meals)
  const mealsFiles = getMarkdownFiles(path.join(baseDir, '03-meals'));
  for (const file of mealsFiles) {
    try {
      const { frontmatter, body } = parseMarkdown(file);
      const sections = parseSections(body);
      result.meals.push({
        date: frontmatter.date || path.basename(file, '.md'),
        frontmatter,
        sections,
        filePath: path.relative(baseDir, file).replace(/\\/g, '/')
      });
    } catch (e) {
      console.error(`Error parsing meals file ${file}:`, e);
    }
  }
  result.meals.sort((a, b) => b.date.localeCompare(a.date));

  // 5. Parse Weekly Reviews (04-weekly-review)
  const weeklyFiles = getMarkdownFiles(path.join(baseDir, '04-weekly-review'));
  for (const file of weeklyFiles) {
    try {
      const { frontmatter, body } = parseMarkdown(file);
      const sections = parseSections(body);
      result.weeklyReview.push({
        week: frontmatter.week || path.basename(file, '.md'),
        frontmatter,
        sections,
        filePath: path.relative(baseDir, file).replace(/\\/g, '/')
      });
    } catch (e) {
      console.error(`Error parsing weekly review ${file}:`, e);
    }
  }
  result.weeklyReview.sort((a, b) => b.week.localeCompare(a.week));

  // 6. Parse Knowledge Layer (knowledge)
  const knowledgeFiles = getMarkdownFiles(path.join(baseDir, 'knowledge'));
  for (const file of knowledgeFiles) {
    try {
      const { frontmatter, body } = parseMarkdown(file);
      const relativePath = path.relative(path.join(baseDir, 'knowledge'), file).replace(/\\/g, '/');
      const parts = relativePath.split('/');
      const category = parts[0] || 'Uncategorized';
      const title = path.basename(file, '.md').replace(/-/g, ' ');

      result.knowledge.push({
        title: title.charAt(0).toUpperCase() + title.slice(1),
        category: category,
        relativePath: relativePath,
        frontmatter,
        body,
        filePath: path.relative(baseDir, file).replace(/\\/g, '/')
      });
    } catch (e) {
      console.error(`Error parsing knowledge file ${file}:`, e);
    }
  }
  result.knowledge.sort((a, b) => a.title.localeCompare(b.title));

  // Write compilation outputs
  const outputPath = path.join(outputDir, 'data.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`Compilation complete! Written dashboard/data.json (${fs.statSync(outputPath).size} bytes)`);
}

// Run compilation if run directly
if (require.main === module) {
  buildData();
}

module.exports = buildData;
