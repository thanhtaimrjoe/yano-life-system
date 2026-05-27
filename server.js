const http = require('http');
const fs = require('fs');
const path = require('path');
const buildData = require('./build-data.js');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'dashboard');

// MIME types mapping
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // Clear console log spam on icon requests
  if (req.url !== '/favicon.ico') {
    console.log(`[HTTP] ${req.method} ${req.url}`);
  }

  // Handle root route
  let urlPath = req.url === '/' ? '/index.html' : req.url;

  // Split query parameters if any
  urlPath = urlPath.split('?')[0];

  // If requesting dashboard/data.json or if reloading, rebuild data on the fly!
  if (urlPath === '/data.json' || urlPath === '/dashboard/data.json') {
    try {
      buildData();
    } catch (e) {
      console.error('Error rebuilding data.json:', e);
    }
  }

  // Determine physical file path
  let filePath;
  // If requesting files outside dashboard folder (like 01-daily, 02-gym, or knowledge), serve from project root
  if (
    urlPath.startsWith('/01-daily') ||
    urlPath.startsWith('/02-gym') ||
    urlPath.startsWith('/03-meals') ||
    urlPath.startsWith('/04-weekly-review') ||
    urlPath.startsWith('/00-profile') ||
    urlPath.startsWith('/knowledge')
  ) {
    filePath = path.join(__dirname, urlPath);
  } else {
    // Serve from dashboard directory
    filePath = path.join(PUBLIC_DIR, urlPath.replace(/^\/dashboard/, ''));
  }

  // Check if file exists and serve
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If file not found in dashboard, check root for assets
      const alternativePath = path.join(__dirname, urlPath);
      fs.stat(alternativePath, (altErr, altStats) => {
        if (altErr || !altStats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found - Yano Life Dashboard');
          return;
        }
        serveFile(alternativePath, res);
      });
      return;
    }
    serveFile(filePath, res);
  });
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`500 Server Error: ${err.code}`);
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf-8');
  });
}

// Initial build on startup
try {
  buildData();
} catch (e) {
  console.error('Initial data build failed:', e);
}

// Listen to port
server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Yano Life Dashboard is up and running!`);
  console.log(`👉 Access dashboard locally: http://localhost:${PORT}`);
  console.log(`======================================================`);
  console.log(`Press Ctrl+C to stop the server.\n`);
});
