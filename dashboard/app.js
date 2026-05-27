// Global Data Store
let appData = null;
let currentCharts = {};

// Initialize application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  fetchData();
  setupEventListeners();
});

// Fetch compiled data from Server
async function fetchData() {
  try {
    const response = await fetch('/dashboard/data.json');
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.status}`);
    }
    appData = await response.json();
    console.log('App Data loaded successfully:', appData);
    
    // Initialize all dashboards and views
    initDashboard();
    initGymProgress();
    initDailyExplorer();
    initMealsExplorer();
    initWeeklyExplorer();
    initKnowledgeExplorer();
    initProfileExplorer();
    
    // Trigger Lucide icons replacing
    lucide.createIcons();
  } catch (error) {
    console.error('Error loading data:', error);
    alert('Không thể tải dữ liệu từ máy chủ. Hãy đảm bảo bạn đã khởi động server bằng lệnh "node server.js".');
  }
}

// Setup Event Listeners for Tab navigation, Theme toggle, Search filters
function setupEventListeners() {
  // 1. SPA Tab Navigation
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      
      // Update sidebar active class
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      
      // Toggle tab panes
      tabPanes.forEach(pane => {
        if (pane.id === targetTab) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
      
      // Refresh Chart sizing if switching to dashboard or gym
      if (targetTab === 'dashboard-tab') {
        Object.values(currentCharts).forEach(chart => {
          if (chart && chart.ctx.canvas.id !== 'exerciseProgressChart') {
            chart.resize();
          }
        });
      } else if (targetTab === 'gym-tab' && currentCharts.exerciseChart) {
        currentCharts.exerciseChart.resize();
      }
    });
  });
  
  // Dashboard Widget Quick Buttons
  document.getElementById('go-to-gym-tab-btn').addEventListener('click', () => {
    document.querySelector('.sidebar-nav [data-tab="gym-tab"]').click();
  });
  document.getElementById('go-to-daily-tab-btn').addEventListener('click', () => {
    document.querySelector('.sidebar-nav [data-tab="daily-tab"]').click();
  });

  // 2. Theme Toggle (Light / Dark)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme', !isDark);
    
    // Update theme toggle icon
    const icon = themeToggleBtn.querySelector('i');
    if (isDark) {
      themeToggleBtn.innerHTML = '<i data-lucide="sun"></i>';
    } else {
      themeToggleBtn.innerHTML = '<i data-lucide="moon"></i>';
    }
    lucide.createIcons();
    
    // Re-render charts to adjust styles for new theme
    recreateCharts();
  });

  // 3. Current date display
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('current-date-display').textContent = new Date().toLocaleDateString('vi-VN', dateOptions);
}

// Recreate charts on theme change to ensure colors match
function recreateCharts() {
  if (currentCharts.sleepChart) {
    currentCharts.sleepChart.destroy();
    renderSleepChart();
  }
  if (currentCharts.gymChart) {
    currentCharts.gymChart.destroy();
    renderGymWeeklyChart();
  }
  if (currentCharts.exerciseChart) {
    const activeEx = document.getElementById('exercise-select').value;
    if (activeEx) {
      renderExerciseOverload(activeEx);
    }
  }
}

// ==========================================
// 1. TAB: OVERVIEW DASHBOARD
// ==========================================
function initDashboard() {
  if (!appData) return;
  
  // A. Total Gym Sessions
  const totalGym = appData.gym.length;
  document.getElementById('stat-gym-sessions').textContent = totalGym;
  document.getElementById('stat-gym-subtitle').textContent = totalGym > 0 
    ? `Buổi gần nhất: ${appData.gym[0].date}`
    : 'Chưa có buổi tập nào';
  document.getElementById('gym-count-badge').querySelector('span').textContent = `${totalGym} Buổi tập`;
    
  // B. Average Sleep Hours
  let totalSleep = 0;
  let sleepDaysCount = 0;
  const last10Daily = appData.daily.slice(0, 10);
  
  appData.daily.forEach(d => {
    const hrs = parseFloat(d.frontmatter.sleep_hours);
    if (!isNaN(hrs) && hrs > 0) {
      totalSleep += hrs;
      sleepDaysCount++;
    }
  });
  
  const avgSleep = sleepDaysCount > 0 ? (totalSleep / sleepDaysCount).toFixed(1) : 0;
  document.getElementById('stat-sleep-hours').textContent = avgSleep > 0 ? `${avgSleep}h` : 'Chưa log';
  document.getElementById('stat-sleep-subtitle').textContent = sleepDaysCount > 0 
    ? `Tính trung bình trên ${sleepDaysCount} ngày`
    : 'Chưa có dữ liệu giấc ngủ';

  // C. Average Energy
  const energyValues = appData.daily
    .map(d => d.frontmatter.energy)
    .filter(e => e);
  
  let energyStr = 'Ổn định';
  if (energyValues.length > 0) {
    const counts = {};
    let maxVal = energyValues[0], maxCount = 1;
    energyValues.forEach(el => {
      counts[el] = (counts[el] || 0) + 1;
      if (counts[el] > maxCount) {
        maxVal = el;
        maxCount = counts[el];
      }
    });
    energyStr = maxVal.charAt(0).toUpperCase() + maxVal.slice(1);
  }
  document.getElementById('stat-energy').textContent = energyStr;
  document.getElementById('stat-energy-subtitle').textContent = `Năng lượng gần nhất: ${appData.daily[0]?.frontmatter.energy || 'N/A'}`;

  // D. Calculate Streaks (Consecutive days logged)
  const streak = calculateDailyStreak(appData.daily);
  document.getElementById('stat-streak').textContent = `${streak} ngày`;
  document.getElementById('streak-counter').querySelector('span').textContent = `${streak} ngày liên tục`;

  // E. Render Overview Charts
  renderSleepChart();
  renderGymWeeklyChart();

  // F. Render Recent Logs List
  renderRecentGymLogs();
  renderRecentDailyLogs();
}

// Calculate logging streak based on daily log dates
function calculateDailyStreak(dailyLogs) {
  if (dailyLogs.length === 0) return 0;
  
  // Extract unique dates sorted descending
  const dates = [...new Set(dailyLogs.map(d => d.date))].sort((a, b) => b.localeCompare(a));
  
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  
  const formatDate = (date) => date.toISOString().split('T')[0];
  
  // If the latest log is older than yesterday, the streak is 0
  const latestLogDateStr = dates[0];
  if (latestLogDateStr !== formatDate(today) && latestLogDateStr !== formatDate(yesterday)) {
    return 0;
  }
  
  let streak = 0;
  let currentDate = new Date(latestLogDateStr);
  
  for (let i = 0; i < dates.length; i++) {
    const expectedDateStr = formatDate(currentDate);
    const actualDateStr = dates[i];
    
    if (actualDateStr === expectedDateStr) {
      streak++;
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break; // Streak broken
    }
  }
  
  return streak;
}

// Render Sleep Chart
function renderSleepChart() {
  const ctx = document.getElementById('sleepChart').getContext('2d');
  const isDark = document.body.classList.contains('dark-theme');
  
  // Take last 8 daily logs (reversed for chronological order)
  const recentLogs = appData.daily.slice(0, 8).reverse();
  const labels = recentLogs.map(l => {
    const parts = l.date.split('-');
    return `${parts[2]}/${parts[1]}`;
  });
  
  const sleepHours = recentLogs.map(l => {
    const hrs = parseFloat(l.frontmatter.sleep_hours);
    return isNaN(hrs) ? null : hrs;
  });
  
  const energyLevels = recentLogs.map(l => {
    const energy = l.frontmatter.energy || 'medium';
    const mapping = { 'fatigued': 1, 'low': 2, 'medium': 3, 'high': 4 };
    return mapping[energy.toLowerCase()] || 3;
  });

  const textCol = isDark ? '#94a3b8' : '#334155';
  const gridCol = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  currentCharts.sleepChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Giờ ngủ (tiếng)',
          data: sleepHours,
          borderColor: '#a855f7',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.3,
          yAxisID: 'y'
        },
        {
          label: 'Năng lượng (1-4)',
          data: energyLevels,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.3,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: textCol, font: { family: 'Inter', weight: 500 } }
        }
      },
      scales: {
        x: {
          grid: { color: gridCol },
          ticks: { color: textCol }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          min: 0,
          max: 12,
          grid: { color: gridCol },
          ticks: { color: textCol }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          min: 1,
          max: 4,
          grid: { drawOnChartArea: false },
          ticks: {
            color: textCol,
            stepSize: 1,
            callback: function(value) {
              const labels = { 1: 'Mệt', 2: 'Thấp', 3: 'Vừa', 4: 'Khỏe' };
              return labels[value] || value;
            }
          }
        }
      }
    }
  });
}

// Render Gym Weekly completed sessions chart
function renderGymWeeklyChart() {
  const ctx = document.getElementById('gymWeeklyChart').getContext('2d');
  const isDark = document.body.classList.contains('dark-theme');
  
  // Group gym sessions by week number (e.g. W20, W21)
  const weeks = {};
  
  // Sort gym logs chronological first to build weekly groups
  const sortedGym = [...appData.gym].reverse();
  
  sortedGym.forEach(session => {
    // Determine week number based on date
    const d = new Date(session.date);
    const startOfYear = new Date(d.getFullYear(), 0, 1);
    const pastDaysOfYear = (d - startOfYear) / 86400000;
    const weekNum = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    const weekLabel = `Tuần ${weekNum}`;
    
    weeks[weekLabel] = (weeks[weekLabel] || 0) + 1;
  });

  const labels = Object.keys(weeks).slice(-6); // Last 6 weeks
  const data = labels.map(l => weeks[l]);

  const textCol = isDark ? '#94a3b8' : '#334155';
  const gridCol = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  currentCharts.gymChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Số buổi tập',
        data: data,
        backgroundColor: 'rgba(13, 213, 195, 0.4)',
        borderColor: '#0dd5c3',
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textCol }
        },
        y: {
          grid: { color: gridCol },
          ticks: { color: textCol, stepSize: 1 },
          min: 0,
          max: 6
        }
      }
    }
  });
}

// Render recent gym activity logs list
function renderRecentGymLogs() {
  const container = document.getElementById('recent-gym-logs-list');
  const recent = appData.gym.slice(0, 3);
  
  if (recent.length === 0) {
    container.innerHTML = '<p class="sub-text">Chưa có nhật ký gym.</p>';
    return;
  }

  container.innerHTML = recent.map(g => {
    const focus = Array.isArray(g.frontmatter.focus) 
      ? g.frontmatter.focus.slice(0, 2).join(', ').toUpperCase()
      : (g.frontmatter.focus || 'GENERAL');
      
    return `
      <div class="activity-item">
        <div class="activity-info">
          <span class="activity-title">${g.frontmatter.day ? `Day ${g.frontmatter.day}` : 'Buổi tập'} — ${focus}</span>
          <span class="activity-date">${g.date} (${g.frontmatter.duration_min || '??'} phút)</span>
        </div>
        <span class="activity-meta">${g.frontmatter.session_rating || 'N/A Rating'}</span>
      </div>
    `;
  }).join('');
}

// Render recent daily activity logs list
function renderRecentDailyLogs() {
  const container = document.getElementById('recent-daily-logs-list');
  const recent = appData.daily.slice(0, 3);
  
  if (recent.length === 0) {
    container.innerHTML = '<p class="sub-text">Chưa có nhật ký daily.</p>';
    return;
  }

  container.innerHTML = recent.map(d => {
    // Extract a snippet of Priorities or Reflection
    let winStr = 'Xem phản tỉnh...';
    if (d.sections['Reflection']) {
      const wins = d.sections['Reflection'].split('\n').filter(l => l.includes('Win:'));
      if (wins.length > 0) {
        winStr = wins[0].replace(/-\s*Win:\s*/i, 'Win: ');
      }
    } else if (d.sections['Top 3 priorities']) {
      winStr = d.sections['Top 3 priorities'].split('\n')[0].replace(/^-\s*/, '');
    }

    return `
      <div class="activity-item">
        <div class="activity-info">
          <span class="activity-title">${winStr}</span>
          <span class="activity-date">${d.date} (${d.frontmatter.day || 'N/A'})</span>
        </div>
        <span class="activity-meta" style="color: var(--accent-purple);">${d.frontmatter.sleep_hours ? `😴 ${d.frontmatter.sleep_hours}h` : '😴 N/A'}</span>
      </div>
    `;
  }).join('');
}

// ==========================================
// 2. TAB: GYM TRAINING & ANALYTICS
// ==========================================
function initGymProgress() {
  if (!appData) return;
  
  // A. Extract all unique exercises to populate dropdown
  const allExercises = new Set();
  appData.gym.forEach(s => {
    if (s.exercises && Array.isArray(s.exercises)) {
      s.exercises.forEach(ex => {
        if (ex.exercise) {
          allExercises.add(ex.exercise.trim());
        }
      });
    }
  });

  const select = document.getElementById('exercise-select');
  select.innerHTML = '<option value="">-- Chọn bài tập xem tiến trình --</option>' + 
    Array.from(allExercises)
      .sort()
      .map(ex => `<option value="${escapeHtml(ex)}">${escapeHtml(ex)}</option>`)
      .join('');

  // Dropdown change event
  select.addEventListener('change', (e) => {
    const exercise = e.target.value;
    if (exercise) {
      renderExerciseOverload(exercise);
    } else {
      document.getElementById('exercise-stats-strip-container').style.display = 'none';
      if (currentCharts.exerciseChart) {
        currentCharts.exerciseChart.destroy();
        currentCharts.exerciseChart = null;
      }
    }
  });

  // B. Render Gym Session Sidebar List
  renderGymSessionsList(appData.gym);

  // Search filter
  document.getElementById('gym-search').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = appData.gym.filter(s => {
      const focus = String(s.frontmatter.focus || '').toLowerCase();
      const machines = String(s.frontmatter.machines_used || '').toLowerCase();
      const tags = String(s.frontmatter.tags || '').toLowerCase();
      return s.date.includes(query) || focus.includes(query) || machines.includes(query) || tags.includes(query);
    });
    renderGymSessionsList(filtered);
  });
}

// Parse weight value from text (e.g. "10kg" -> 10, "15kg final set" -> 15, "Warm-up + 2x15" -> null)
function parseWeight(weightStr) {
  if (!weightStr) return null;
  const match = weightStr.match(/(\d+(?:\.\d+)?)\s*(?:kg|lbs|kilo)?/i);
  return match ? parseFloat(match[1]) : null;
}

// Parse sets/reps (e.g. "3 x 15" -> 45 total reps)
function parseRepsVolume(setsRepsStr) {
  if (!setsRepsStr) return 0;
  // Look for format like "3 x 15" or "3x15" or "Warm-up + 2 x 15"
  const matches = setsRepsStr.match(/(\d+)\s*x\s*(\d+)/i);
  if (matches) {
    const sets = parseInt(matches[1]);
    const reps = parseInt(matches[2]);
    return sets * reps;
  }
  // Try to find any single number
  const single = setsRepsStr.match(/\b(\d+)\b/);
  return single ? parseInt(single[1]) : 1;
}

// Render Progressive Overload chart for selected exercise
function renderExerciseOverload(exerciseName) {
  const isDark = document.body.classList.contains('dark-theme');
  const selectData = [];

  // Filter gym sessions with this exercise (chronological order)
  const chronologicalGym = [...appData.gym].reverse();
  
  chronologicalGym.forEach(session => {
    if (session.exercises && Array.isArray(session.exercises)) {
      const matchEx = session.exercises.find(e => e.exercise?.trim() === exerciseName);
      if (matchEx) {
        const weightNum = parseWeight(matchEx.weight);
        const repsVolume = parseRepsVolume(matchEx['sets x reps']);
        
        selectData.push({
          date: session.date,
          weightStr: matchEx.weight || 'not logged',
          weightVal: weightNum,
          setsReps: matchEx['sets x reps'] || 'N/A',
          rpe: matchEx.rpe || 'N/A',
          cue: matchEx['form cue / mmc focus'] || matchEx['notes / feel'] || '-'
        });
      }
    }
  });

  if (selectData.length === 0) return;

  // Render Stats Strip
  document.getElementById('exercise-stats-strip-container').style.display = 'flex';
  
  const weights = selectData.map(d => d.weightVal).filter(w => w !== null);
  const maxWeight = weights.length > 0 ? Math.max(...weights) : 'N/A';
  const lastSession = selectData[selectData.length - 1];
  
  document.getElementById('exercise-max-weight').textContent = typeof maxWeight === 'number' ? `${maxWeight} kg` : maxWeight;
  document.getElementById('exercise-last-sets').textContent = lastSession.setsReps;
  document.getElementById('exercise-last-rpe').textContent = lastSession.rpe;
  document.getElementById('exercise-best-cue').textContent = lastSession.cue.length > 35 
    ? lastSession.cue.substring(0, 35) + '...'
    : lastSession.cue;

  // Chart setup
  const ctx = document.getElementById('exerciseProgressChart').getContext('2d');
  if (currentCharts.exerciseChart) {
    currentCharts.exerciseChart.destroy();
  }

  const labels = selectData.map(d => {
    const parts = d.date.split('-');
    return `${parts[2]}/${parts[1]}`;
  });
  
  const weightsDataset = selectData.map(d => d.weightVal);
  const rpeDataset = selectData.map(d => {
    const num = parseFloat(d.rpe);
    return isNaN(num) ? null : num;
  });

  const textCol = isDark ? '#94a3b8' : '#334155';
  const gridCol = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  currentCharts.exerciseChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Mức tạ (kg)',
          data: weightsDataset,
          borderColor: '#0dd5c3',
          backgroundColor: 'rgba(13, 213, 195, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.2,
          yAxisID: 'y'
        },
        {
          label: 'Độ khó (RPE)',
          data: rpeDataset,
          borderColor: '#f59e0b',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [4, 4],
          tension: 0.1,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: textCol }
        },
        tooltip: {
          callbacks: {
            afterBody: function(context) {
              const idx = context[0].dataIndex;
              const item = selectData[idx];
              return `\nSets x Reps: ${item.setsReps}\nCue/Note: ${item.cue}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: gridCol },
          ticks: { color: textCol }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: { color: gridCol },
          ticks: { color: textCol },
          title: { display: true, text: 'Tạ (kg)', color: textCol }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          min: 1,
          max: 10,
          grid: { drawOnChartArea: false },
          ticks: { color: textCol, stepSize: 1 },
          title: { display: true, text: 'RPE', color: textCol }
        }
      }
    }
  });
}

// Render Gym sessions sidebar list
function renderGymSessionsList(sessions) {
  const container = document.getElementById('gym-sessions-list');
  if (sessions.length === 0) {
    container.innerHTML = '<p class="sub-text" style="padding: 12px;">Không tìm thấy buổi tập.</p>';
    return;
  }

  container.innerHTML = sessions.map((s, idx) => {
    const focus = Array.isArray(s.frontmatter.focus) 
      ? s.frontmatter.focus[0].toUpperCase() 
      : String(s.frontmatter.focus || 'GYM').toUpperCase();
    
    const duration = s.frontmatter.duration_min ? `${s.frontmatter.duration_min}p` : '??p';
    const rating = s.frontmatter.session_rating ? `⭐ ${s.frontmatter.session_rating}` : '';

    return `
      <button class="list-item" data-date="${s.date}" id="gym-item-${s.date}">
        <span class="list-item-title">${s.frontmatter.day ? `Day ${s.frontmatter.day}` : 'Buổi tập'} — ${focus}</span>
        <span class="list-item-date">${s.date} | ${duration}</span>
        <span class="list-item-meta">${rating}</span>
      </button>
    `;
  }).join('');

  // Attach click events
  container.querySelectorAll('.list-item').forEach(item => {
    item.addEventListener('click', () => {
      container.querySelectorAll('.list-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const date = item.getAttribute('data-date');
      const session = appData.gym.find(s => s.date === date);
      renderGymSessionDetail(session);
    });
  });

  // Auto-click first item on load if available
  if (sessions.length > 0 && container.querySelector('.list-item')) {
    container.querySelector('.list-item').click();
  }
}

// Render detailed view for a single Gym Session
function renderGymSessionDetail(session) {
  const container = document.getElementById('gym-session-detail');
  if (!session) return;

  // Build Frontmatter metadata
  const metaGrid = `
    <div class="meta-info-grid">
      <div class="meta-info-item">
        <span class="meta-info-label">Ngày</span>
        <span class="meta-info-value">${session.date}</span>
      </div>
      <div class="meta-info-item">
        <span class="meta-info-label">Buổi số</span>
        <span class="meta-info-value">Day ${session.frontmatter.day || 'N/A'}</span>
      </div>
      <div class="meta-info-item">
        <span class="meta-info-label">Thời gian</span>
        <span class="meta-info-value">${session.frontmatter.duration_min || '??'} phút</span>
      </div>
      <div class="meta-info-item">
        <span class="meta-info-label">Đánh giá</span>
        <span class="meta-info-value">${session.frontmatter.session_rating || 'N/A'}</span>
      </div>
      <div class="meta-info-item">
        <span class="meta-info-label">Năng lượng Pre/Post</span>
        <span class="meta-info-value">${session.frontmatter.energy_pre || 'N/A'} / ${session.frontmatter.energy_post || 'N/A'}</span>
      </div>
      <div class="meta-info-item">
        <span class="meta-info-label">Độ phục hồi</span>
        <span class="meta-info-value">${session.frontmatter.recovery_status || 'N/A'}</span>
      </div>
      <div class="meta-info-item">
        <span class="meta-info-label">Bám sát kế hoạch</span>
        <span class="meta-info-value">${session.frontmatter.adherence_to_plan || 'N/A'}</span>
      </div>
      <div class="meta-info-item">
        <span class="meta-info-label">RPE trung bình</span>
        <span class="meta-info-value">${session.frontmatter.rpe_avg || 'N/A'}</span>
      </div>
    </div>
  `;

  // Exercises list or table
  let exercisesTable = '';
  if (session.exercises && session.exercises.length > 0) {
    const rows = session.exercises.map(ex => {
      const name = ex.exercise || 'N/A';
      const setup = ex['machine / setup'] || '-';
      const sets = ex['sets x reps'] || '-';
      const weight = ex.weight || '-';
      const rpe = ex.rpe || '-';
      const tempo = ex.tempo || '-';
      const cue = ex['form cue / mmc focus'] || '-';
      const note = ex['notes / feel'] || '-';
      const learning = ex['key learning'] || '-';

      return `
        <tr>
          <td><strong>${escapeHtml(name)}</strong></td>
          <td><span class="sub-text">${escapeHtml(setup)}</span></td>
          <td>${escapeHtml(sets)}</td>
          <td><span style="color: var(--accent-cyan); font-weight:600;">${escapeHtml(weight)}</span></td>
          <td><span class="badge-rpe">${escapeHtml(rpe)}</span></td>
          <td><span class="sub-text">${escapeHtml(tempo)}</span></td>
          <td><span style="color: var(--accent-purple); font-weight:500;">${escapeHtml(cue)}</span></td>
          <td><span class="sub-text">${escapeHtml(note)}</span></td>
          <td><span class="sub-text" style="color: var(--accent-success);">${escapeHtml(learning)}</span></td>
        </tr>
      `;
    }).join('');

    exercisesTable = `
      <h3>Danh sách bài tập</h3>
      <div style="overflow-x: auto; margin-bottom: 24px;">
        <table class="dashboard-table">
          <thead>
            <tr>
              <th>Bài tập</th>
              <th>Thiết lập / Máy</th>
              <th>Sets x Reps</th>
              <th>Mức tạ</th>
              <th>RPE</th>
              <th>Tempo</th>
              <th>Form Cue / MMC</th>
              <th>Cảm nhận</th>
              <th>Bài học</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  // Other Markdown content
  let bodyContent = '';
  Object.keys(session.sections).forEach(header => {
    if (header.toLowerCase() !== 'exercises' && header.toLowerCase() !== 'introduction') {
      const htmlContent = marked.parse(session.sections[header]);
      bodyContent += `
        <div class="markdown-section">
          <h2>${header}</h2>
          <div class="rendered-markdown">${htmlContent}</div>
        </div>
      `;
    }
  });

  container.innerHTML = `
    <div class="rendered-markdown">
      <h1>Day ${session.frontmatter.day || 'N/A'} — ${session.frontmatter.focus ? session.frontmatter.focus.join(', ').toUpperCase() : 'BUỔI TẬP'}</h1>
      ${metaGrid}
      ${exercisesTable}
      ${bodyContent}
      
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-color);">
        <a href="file:///${escapeHtml(session.filePath)}" class="btn-text" style="font-size: 13px;">
          <i data-lucide="external-link" style="width: 14px; height:14px; vertical-align: middle; margin-right: 4px;"></i>
          Mở file Markdown gốc
        </a>
      </div>
    </div>
  `;
  
  lucide.createIcons();
}

// ==========================================
// 3. TAB: DAILY EXPLORER
// ==========================================
function initDailyExplorer() {
  if (!appData) return;
  
  renderDailyLogsList(appData.daily);

  // Search input
  document.getElementById('daily-search').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = appData.daily.filter(d => {
      const priority = String(d.sections['Top 3 priorities'] || '').toLowerCase();
      const reflection = String(d.sections['Reflection'] || '').toLowerCase();
      const tags = String(d.frontmatter.tags || '').toLowerCase();
      return d.date.includes(query) || priority.includes(query) || reflection.includes(query) || tags.includes(query);
    });
    renderDailyLogsList(filtered);
  });
}

function renderDailyLogsList(logs) {
  const container = document.getElementById('daily-logs-list');
  if (logs.length === 0) {
    container.innerHTML = '<p class="sub-text" style="padding: 12px;">Không tìm thấy nhật ký.</p>';
    return;
  }

  container.innerHTML = logs.map(d => {
    const sleep = d.frontmatter.sleep_hours ? `😴 ${d.frontmatter.sleep_hours}h` : '';
    const energy = d.frontmatter.energy ? `⚡ ${d.frontmatter.energy}` : '';
    
    return `
      <button class="list-item" data-date="${d.date}">
        <span class="list-item-title">${d.date} (${d.frontmatter.day || 'N/A'})</span>
        <span class="list-item-date">${sleep} | ${energy}</span>
      </button>
    `;
  }).join('');

  container.querySelectorAll('.list-item').forEach(item => {
    item.addEventListener('click', () => {
      container.querySelectorAll('.list-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const date = item.getAttribute('data-date');
      const log = appData.daily.find(d => d.date === date);
      renderDailyLogDetail(log);
    });
  });

  if (logs.length > 0 && container.querySelector('.list-item')) {
    container.querySelector('.list-item').click();
  }
}

function renderDailyLogDetail(log) {
  const container = document.getElementById('daily-log-detail');
  if (!log) return;

  const meta = log.frontmatter;
  const metaGrid = `
    <div class="meta-info-grid">
      <div class="meta-info-item">
        <span class="meta-info-label">Ngày</span>
        <span class="meta-info-value">${log.date} (${meta.day || 'N/A'})</span>
      </div>
      <div class="meta-info-item">
        <span class="meta-info-label">Giờ ngủ</span>
        <span class="meta-info-value">${meta.sleep_hours || 'Chưa ghi nhận'}</span>
      </div>
      <div class="meta-info-item">
        <span class="meta-info-label">Chất lượng ngủ</span>
        <span class="meta-info-value">${meta.sleep_quality || 'Chưa ghi nhận'}</span>
      </div>
      <div class="meta-info-item">
        <span class="meta-info-label">Năng lượng</span>
        <span class="meta-info-value">${meta.energy || 'N/A'}</span>
      </div>
      <div class="meta-info-item">
        <span class="meta-info-label">Tâm trạng</span>
        <span class="meta-info-value">${meta.mood || 'N/A'}</span>
      </div>
      <div class="meta-info-item">
        <span class="meta-info-label">Cân nặng</span>
        <span class="meta-info-value">${meta.body_weight_kg ? `${meta.body_weight_kg} kg` : 'Chưa cân'}</span>
      </div>
    </div>
  `;

  let bodyContent = '';
  Object.keys(log.sections).forEach(header => {
    if (header.toLowerCase() !== 'introduction') {
      const html = marked.parse(log.sections[header]);
      bodyContent += `
        <div class="markdown-section">
          <h2>${header}</h2>
          <div class="rendered-markdown">${html}</div>
        </div>
      `;
    }
  });

  container.innerHTML = `
    <div class="rendered-markdown">
      <h1>Nhật ký Ngày ${log.date}</h1>
      ${metaGrid}
      ${bodyContent}
      
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-color);">
        <a href="file:///${escapeHtml(log.filePath)}" class="btn-text" style="font-size: 13px;">
          <i data-lucide="external-link" style="width: 14px; height:14px; vertical-align: middle; margin-right: 4px;"></i>
          Mở file Markdown gốc
        </a>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// ==========================================
// 4. TAB: NUTRITION & MEALS
// ==========================================
function initMealsExplorer() {
  if (!appData) return;
  
  renderMealsLogsList(appData.meals);

  document.getElementById('meals-search').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = appData.meals.filter(m => {
      const body = JSON.stringify(m.sections).toLowerCase();
      return m.date.includes(query) || body.includes(query);
    });
    renderMealsLogsList(filtered);
  });
}

function renderMealsLogsList(meals) {
  const container = document.getElementById('meals-logs-list');
  if (meals.length === 0) {
    container.innerHTML = '<p class="sub-text" style="padding: 12px;">Không có nhật ký ăn uống.</p>';
    return;
  }

  container.innerHTML = meals.map(m => {
    // Find highlights in Daily Summary
    let summaryText = 'Xem chi tiết bữa ăn...';
    if (m.sections['Daily Summary']) {
      const oil = m.sections['Daily Summary'].split('\n').find(l => l.includes('Oil'));
      const protein = m.sections['Daily Summary'].split('\n').find(l => l.includes('Protein'));
      if (oil || protein) {
        summaryText = [protein, oil].filter(x => x).map(x => x.replace(/^-\s*/, '')).join(' | ');
      }
    }
    
    return `
      <button class="list-item" data-date="${m.date}">
        <span class="list-item-title">Ăn uống Ngày ${m.date}</span>
        <span class="list-item-date">${summaryText}</span>
      </button>
    `;
  }).join('');

  container.querySelectorAll('.list-item').forEach(item => {
    item.addEventListener('click', () => {
      container.querySelectorAll('.list-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const date = item.getAttribute('data-date');
      const meal = appData.meals.find(m => m.date === date);
      renderMealsLogDetail(meal);
    });
  });

  if (meals.length > 0 && container.querySelector('.list-item')) {
    container.querySelector('.list-item').click();
  }
}

function renderMealsLogDetail(meal) {
  const container = document.getElementById('meals-log-detail');
  if (!meal) return;

  const mealBlocks = ['Breakfast', 'Lunch', 'Afternoon Snack / Early Dinner', 'Dinner', 'Snacks / Other'];
  let blocksHtml = '';

  mealBlocks.forEach(block => {
    if (meal.sections[block]) {
      const classMap = {
        'Breakfast': 'breakfast',
        'Lunch': 'lunch',
        'Afternoon Snack / Early Dinner': 'snack',
        'Dinner': 'dinner',
        'Snacks / Other': 'snack'
      };
      
      const htmlContent = marked.parse(meal.sections[block]);
      blocksHtml += `
        <div class="meal-block ${classMap[block] || ''}">
          <div class="meal-title">${block}</div>
          <div class="rendered-markdown">${htmlContent}</div>
        </div>
      `;
    }
  });

  // Render rest of the sections like Daily Summary or Reflection
  let extraHtml = '';
  Object.keys(meal.sections).forEach(h => {
    if (!mealBlocks.includes(h) && h !== 'Introduction') {
      const content = marked.parse(meal.sections[h]);
      extraHtml += `
        <div class="markdown-section" style="margin-top: 24px;">
          <h2>${h}</h2>
          <div class="rendered-markdown">${content}</div>
        </div>
      `;
    }
  });

  container.innerHTML = `
    <div class="rendered-markdown">
      <h1>Nhật ký Ăn uống Ngày ${meal.date}</h1>
      <div class="meals-container" style="margin-top: 20px;">
        ${blocksHtml}
      </div>
      ${extraHtml}
      
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-color);">
        <a href="file:///${escapeHtml(meal.filePath)}" class="btn-text" style="font-size: 13px;">
          <i data-lucide="external-link" style="width: 14px; height:14px; vertical-align: middle; margin-right: 4px;"></i>
          Mở file Markdown gốc
        </a>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// ==========================================
// 5. TAB: WEEKLY REVIEWS
// ==========================================
function initWeeklyExplorer() {
  if (!appData) return;
  
  renderWeeklyList(appData.weeklyReview);
}

function renderWeeklyList(weeks) {
  const container = document.getElementById('weekly-reviews-list');
  if (weeks.length === 0) {
    container.innerHTML = '<p class="sub-text" style="padding: 12px;">Không có báo cáo tuần.</p>';
    return;
  }

  container.innerHTML = weeks.map(w => {
    const weekLabel = w.week.toUpperCase();
    return `
      <button class="list-item" data-week="${w.week}">
        <span class="list-item-title">Báo cáo ${weekLabel}</span>
        <span class="list-item-date">Tóm tắt tiến trình tuần</span>
      </button>
    `;
  }).join('');

  container.querySelectorAll('.list-item').forEach(item => {
    item.addEventListener('click', () => {
      container.querySelectorAll('.list-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const week = item.getAttribute('data-week');
      const report = appData.weeklyReview.find(w => w.week === week);
      renderWeeklyDetail(report);
    });
  });

  if (weeks.length > 0 && container.querySelector('.list-item')) {
    container.querySelector('.list-item').click();
  }
}

function renderWeeklyDetail(report) {
  const container = document.getElementById('weekly-review-detail');
  if (!report) return;

  let bodyContent = '';
  Object.keys(report.sections).forEach(h => {
    if (h !== 'Introduction') {
      const content = marked.parse(report.sections[h]);
      bodyContent += `
        <div class="markdown-section">
          <h2>${h}</h2>
          <div class="rendered-markdown">${content}</div>
        </div>
      `;
    }
  });

  container.innerHTML = `
    <div class="rendered-markdown">
      <h1>Weekly Review — ${report.week.toUpperCase()}</h1>
      <div style="margin-top: 20px;">
        ${bodyContent}
      </div>
      
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-color);">
        <a href="file:///${escapeHtml(report.filePath)}" class="btn-text" style="font-size: 13px;">
          <i data-lucide="external-link" style="width: 14px; height:14px; vertical-align: middle; margin-right: 4px;"></i>
          Mở file Markdown gốc
        </a>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// ==========================================
// 6. TAB: KNOWLEDGE BASE EXPLORER
// ==========================================
let activeCategory = '';

function initKnowledgeExplorer() {
  if (!appData) return;

  // A. Extract all categories
  const categories = new Set(appData.knowledge.map(k => k.category));
  
  // Render category buttons bar
  const categoriesBar = document.getElementById('knowledge-categories-bar');
  const catButtons = Array.from(categories).map(cat => {
    const formattedCat = cat.replace(/^\d+_/, '').toUpperCase();
    return `<button class="category-btn" data-category="${escapeHtml(cat)}">${escapeHtml(formattedCat)}</button>`;
  });
  
  categoriesBar.innerHTML = '<button class="category-btn active" data-category="">TẤT CẢ</button>' + catButtons.join('');

  // Hook category click events
  categoriesBar.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      categoriesBar.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      activeCategory = btn.getAttribute('data-category');
      filterKnowledgeNotes();
    });
  });

  // B. Render Notes List
  filterKnowledgeNotes();

  // Hook Search Event
  document.getElementById('knowledge-search').addEventListener('input', () => {
    filterKnowledgeNotes();
  });
}

function filterKnowledgeNotes() {
  const query = document.getElementById('knowledge-search').value.toLowerCase();
  
  const filtered = appData.knowledge.filter(note => {
    const matchCat = activeCategory === '' || note.category === activeCategory;
    const matchQuery = note.title.toLowerCase().includes(query) || note.body.toLowerCase().includes(query);
    return matchCat && matchQuery;
  });

  renderKnowledgeNotesList(filtered);
}

function renderKnowledgeNotesList(notes) {
  const container = document.getElementById('knowledge-notes-list');
  if (notes.length === 0) {
    container.innerHTML = '<p class="sub-text" style="padding: 12px;">Không tìm thấy bài viết nào.</p>';
    return;
  }

  container.innerHTML = notes.map(n => {
    const prettyCat = n.category.replace(/^\d+_/, '').toUpperCase();
    return `
      <button class="list-item" data-path="${escapeHtml(n.relativePath)}">
        <span class="list-item-title">${escapeHtml(n.title)}</span>
        <span class="list-item-date" style="color: var(--primary); font-size:10px; font-weight:600; text-transform:uppercase;">${escapeHtml(prettyCat)}</span>
      </button>
    `;
  }).join('');

  container.querySelectorAll('.list-item').forEach(item => {
    item.addEventListener('click', () => {
      container.querySelectorAll('.list-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const path = item.getAttribute('data-path');
      const note = appData.knowledge.find(n => n.relativePath === path);
      renderKnowledgeNoteDetail(note);
    });
  });

  if (notes.length > 0 && container.querySelector('.list-item')) {
    container.querySelector('.list-item').click();
  }
}

function renderKnowledgeNoteDetail(note) {
  const container = document.getElementById('knowledge-note-detail');
  if (!note) return;

  const prettyCat = note.category.replace(/^\d+_/, '').toUpperCase();
  const htmlContent = marked.parse(note.body);

  container.innerHTML = `
    <div class="rendered-markdown">
      <span class="sub-text" style="color: var(--accent-cyan); font-weight:700; text-transform:uppercase; font-size:11px;">KIẾN THỨC / ${escapeHtml(prettyCat)}</span>
      <h1 style="margin-top: 4px;">${escapeHtml(note.title)}</h1>
      
      <div style="margin-top: 20px;">
        ${htmlContent}
      </div>
      
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-color);">
        <a href="file:///${escapeHtml(note.filePath)}" class="btn-text" style="font-size: 13px;">
          <i data-lucide="external-link" style="width: 14px; height:14px; vertical-align: middle; margin-right: 4px;"></i>
          Mở file Markdown gốc
        </a>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// ==========================================
// 7. TAB: PROFILE & ROUTINES
// ==========================================
function initProfileExplorer() {
  if (!appData || !appData.profile) return;

  const container = document.getElementById('profile-cards-container');
  const profileKeys = Object.keys(appData.profile);
  
  if (profileKeys.length === 0) {
    container.innerHTML = '<p class="sub-text">Chưa cấu hình hồ sơ cá nhân.</p>';
    return;
  }

  container.innerHTML = profileKeys.map(key => {
    const prof = appData.profile[key];
    const title = key.replace(/-/g, ' ').toUpperCase();
    
    // Custom Icon for each profile type
    let icon = 'user';
    if (key.includes('goals')) icon = 'target';
    else if (key.includes('nutrition')) icon = 'utensils';
    else if (key.includes('routines')) icon = 'refresh-cw';

    let listItems = '';
    
    // Format basic markdown list items beautifully
    if (prof.sections['Basic']) {
      listItems = marked.parse(prof.sections['Basic']);
    } else if (prof.sections['Routines']) {
      listItems = marked.parse(prof.sections['Routines']);
    } else {
      // Just render the first section found or raw body
      const firstSec = Object.keys(prof.sections)[0];
      if (firstSec) {
        listItems = `<h3>${firstSec}</h3>` + marked.parse(prof.sections[firstSec]);
      } else {
        listItems = marked.parse(prof.rawBody);
      }
    }

    // Build rest of the sections inside an expandable drawer or cards
    let moreSections = '';
    Object.keys(prof.sections).forEach(s => {
      if (s !== 'Basic' && s !== 'Routines' && s !== 'Introduction') {
        moreSections += `
          <div class="profile-sub-section" style="margin-top: 16px; border-top: 1px dashed var(--border-color); padding-top: 12px;">
            <h4 style="color: var(--accent-cyan); margin-bottom: 6px; font-size:14px;">${s}</h4>
            <div class="sub-text" style="font-size:13.5px;">${marked.parse(prof.sections[s])}</div>
          </div>
        `;
      }
    });

    return `
      <div class="profile-card glass">
        <div class="profile-card-header">
          <div class="profile-card-icon"><i data-lucide="${icon}"></i></div>
          <div class="profile-card-title">
            <h3>${escapeHtml(title)}</h3>
            <span>Cập nhật ngày: ${prof.frontmatter.updated || 'N/A'}</span>
          </div>
        </div>
        <div class="profile-card-content">
          <div class="rendered-markdown">${listItems}</div>
          ${moreSections}
        </div>
        <div style="margin-top: 20px; padding-top: 12px; border-top: 1px solid var(--border-color); font-size:12px;">
          <a href="file:///${escapeHtml(prof.filePath || `00-profile/${key}.md`)}" class="btn-text" style="font-size: 12px;">
            <i data-lucide="external-link" style="width: 12px; height:12px; vertical-align: middle; margin-right: 4px;"></i>
            Chỉnh sửa file
          </a>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
