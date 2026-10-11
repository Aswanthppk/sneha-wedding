import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'rsvps.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

export function readRsvps() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error reading RSVPs:', err);
    return [];
  }
}

export function saveRsvps(rsvps) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(rsvps, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving RSVPs:', err);
    return false;
  }
}

export function handleRsvpPost(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', () => {
    try {
      const data = JSON.parse(body || '{}');
      if (!data.name || typeof data.attending !== 'boolean') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'Name and attending status are required' }));
      }

      const rsvps = readRsvps();
      const newEntry = {
        id: 'rsvp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        name: data.name.trim(),
        attending: data.attending,
        guestCount: data.attending ? (parseInt(data.guestCount, 10) || 1) : 0,
        selectedEvents: Array.isArray(data.selectedEvents) ? data.selectedEvents : [],
        submittedAt: new Date().toISOString()
      };

      rsvps.unshift(newEntry);
      saveRsvps(rsvps);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, id: newEntry.id, message: 'RSVP recorded successfully' }));
    } catch (err) {
      console.error('RSVP parsing error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Server error processing RSVP' }));
    }
  });
}

export function renderAdminDashboard(rsvps) {
  const total = rsvps.length;
  const attendingCount = rsvps.filter(r => r.attending).length;
  const declinedCount = rsvps.filter(r => !r.attending).length;
  const totalGuests = rsvps.reduce((acc, r) => acc + (r.attending ? (r.guestCount || 1) : 0), 0);

  const rows = rsvps.map(r => {
    const dateStr = new Date(r.submittedAt).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    const statusBadge = r.attending
      ? '<span style="background:#e6f4ea; color:#137333; padding:4px 10px; border-radius:12px; font-weight:600; font-size:12px;">Attending</span>'
      : '<span style="background:#fce8e6; color:#c5221f; padding:4px 10px; border-radius:12px; font-weight:600; font-size:12px;">Declined</span>';
    
    const eventsStr = r.attending && r.selectedEvents.length > 0
      ? r.selectedEvents.map(e => e === 'wedding' ? 'Wedding' : e === 'reception' ? 'Reception' : e).join(', ')
      : '—';

    return `
      <tr style="border-bottom:1px solid #e5e7eb;">
        <td style="padding:12px 16px; color:#6b7280; font-size:13px;">${dateStr}</td>
        <td style="padding:12px 16px; font-weight:600; color:#111827;">${escapeHtml(r.name)}</td>
        <td style="padding:12px 16px;">${statusBadge}</td>
        <td style="padding:12px 16px; text-align:center; font-weight:600; color:#1e293b;">${r.attending ? r.guestCount : 0}</td>
        <td style="padding:12px 16px; color:#475569; font-size:13px;">${eventsStr}</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Wedding RSVP Dashboard — Vaishnav & Sneha</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background:#f8fafc; color:#0f172a; margin:0; padding:24px; }
        .container { max-width: 960px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        h1 { margin: 0; font-size: 24px; color: #1e293b; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .stat-card { background: #fff; padding: 18px 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .stat-val { font-size: 28px; font-weight: bold; margin-top: 4px; color: #0f172a; }
        .stat-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 600; }
        table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        th { background: #f1f5f9; padding: 12px 16px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; }
        .btn { background: #1e293b; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
        .btn:hover { background: #0f172a; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <h1>💍 Vaishnav & Sneha — RSVP Responses</h1>
            <p style="margin:4px 0 0 0; color:#64748b; font-size:14px;">Real-time guest attendance records</p>
          </div>
          <div>
            <a href="/" class="btn" style="background:#fff; color:#1e293b; border:1px solid #cbd5e1; margin-right:8px;">← View Website</a>
            <button onclick="window.location.reload()" class="btn">↻ Refresh</button>
          </div>
        </div>

        <div class="stats">
          <div class="stat-card">
            <div class="stat-label">Total Responses</div>
            <div class="stat-val">${total}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Joyfully Attending</div>
            <div class="stat-val" style="color:#16a34a;">${attendingCount}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Declined</div>
            <div class="stat-val" style="color:#dc2626;">${declinedCount}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Guest Headcount</div>
            <div class="stat-val" style="color:#2563eb;">${totalGuests}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date / Time</th>
              <th>Guest Name</th>
              <th>Status</th>
              <th style="text-align:center;">Guests</th>
              <th>Events Joining</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="5" style="text-align:center; padding:32px; color:#94a3b8;">No RSVP responses received yet.</td></tr>'}
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// If run directly via `node server.js`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    if (req.method === 'POST' && pathname === '/api/rsvp') {
      return handleRsvpPost(req, res);
    }
    if (req.method === 'GET' && pathname === '/api/rsvps') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, rsvps: readRsvps() }));
    }
    if (req.method === 'GET' && (pathname === '/admin/rsvps' || pathname === '/admin')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(renderAdminDashboard(readRsvps()));
    }

    // Static files fallback
    let decodedPath = decodeURIComponent(pathname);
    let filePath = path.join(__dirname, 'dist', decodedPath === '/' ? 'index.html' : decodedPath.replace(/^\//, ''));
    
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      // Also check root directory for public assets (assets, s, __l5e)
      const rootPath = path.join(__dirname, decodedPath.replace(/^\//, ''));
      if (fs.existsSync(rootPath) && fs.statSync(rootPath).isFile()) {
        filePath = rootPath;
      } else if (!pathname.startsWith('/api/') && !path.extname(pathname)) {
        filePath = path.join(__dirname, 'dist', 'index.html');
      }
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const stat = fs.statSync(filePath);
      const fileSize = stat.size;
      const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.webp': 'image/webp',
        '.mp4': 'video/mp4',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2'
      };
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      // Support HTTP Range requests (crucial for mobile iOS Safari & Chrome video streaming)
      const range = req.headers.range;
      if (range && (ext === '.mp4' || ext === '.mp3')) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const fileStream = fs.createReadStream(filePath, { start, end });
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType,
        });
        fileStream.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes'
        });
        fs.createReadStream(filePath).pipe(res);
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on http://0.0.0.0:${PORT}`);
    console.log(`RSVP Admin dashboard: http://localhost:${PORT}/admin/rsvps`);
  });
}
