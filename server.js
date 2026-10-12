import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'rsvps.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}
if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(SETTINGS_FILE, '{}', 'utf8');
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

export function readSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, 'utf8');
      return JSON.parse(raw || '{}');
    }
  } catch (err) {
    console.error('Error reading settings:', err);
  }
  return {};
}

export function saveSettings(settings) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving settings:', err);
    return false;
  }
}

export function getGoogleSheetWebhookUrl() {
  const settings = readSettings();
  if (settings.googleSheetWebhookUrl && typeof settings.googleSheetWebhookUrl === 'string') {
    return settings.googleSheetWebhookUrl.trim();
  }
  return (process.env.GOOGLE_SHEET_WEBHOOK_URL || '').trim();
}

export async function syncRsvpToGoogleSheet(entry) {
  const webhookUrl = getGoogleSheetWebhookUrl();
  if (!webhookUrl || webhookUrl.includes('/macros/library/')) {
    return { success: false, reason: 'Invalid or missing Google Sheet webhook URL' };
  }

  const dateStr = new Date(entry.submittedAt || Date.now()).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const payload = {
    action: 'new_rsvp',
    id: entry.id,
    name: entry.name,
    attending: entry.attending ? 'Yes' : 'No',
    isAttending: entry.attending,
    guestCount: entry.attending ? (entry.guestCount || 1) : 0,
    events: Array.isArray(entry.selectedEvents) && entry.selectedEvents.length > 0
      ? entry.selectedEvents.map(e => e === 'wedding' ? 'Wedding' : e === 'reception' ? 'Reception' : e).join(', ')
      : '—',
    selectedEvents: entry.selectedEvents,
    submittedAt: entry.submittedAt,
    dateStr
  };

  try {
    const resp = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: AbortSignal.timeout(10000)
    });
    return { success: resp.ok, status: resp.status };
  } catch (err) {
    console.error('Google Sheet auto-sync error:', err.message);
    return { success: false, error: err.message };
  }
}

export async function syncAllToGoogleSheet(rsvps) {
  const webhookUrl = getGoogleSheetWebhookUrl();
  if (!webhookUrl) {
    return { success: false, error: 'No Google Sheet webhook URL configured' };
  }

  if (webhookUrl.includes('/macros/library/')) {
    return {
      success: false,
      error: 'This is a "Library" URL, not a "Web app" URL. Please deploy as a Web app (Deploy > New deployment > Web app > set access to "Anyone") and use the URL ending in "/exec".'
    };
  }

  const formattedRsvps = rsvps.map(entry => {
    const dateStr = new Date(entry.submittedAt || Date.now()).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    return {
      id: entry.id,
      name: entry.name,
      attending: entry.attending ? 'Yes' : 'No',
      isAttending: entry.attending,
      guestCount: entry.attending ? (entry.guestCount || 1) : 0,
      events: Array.isArray(entry.selectedEvents) && entry.selectedEvents.length > 0
        ? entry.selectedEvents.map(e => e === 'wedding' ? 'Wedding' : e === 'reception' ? 'Reception' : e).join(', ')
        : '—',
      selectedEvents: entry.selectedEvents,
      submittedAt: entry.submittedAt,
      dateStr
    };
  });

  try {
    const resp = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'batch_sync', rsvps: formattedRsvps }),
      redirect: 'follow',
      signal: AbortSignal.timeout(15000)
    });
    if (!resp.ok) {
      return { success: false, error: `Google returned HTTP ${resp.status}. Ensure "Who has access" is set to "Anyone".` };
    }
    return { success: resp.ok, status: resp.status, count: formattedRsvps.length };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function testGoogleSheetWebhook(testUrl) {
  const webhookUrl = testUrl || getGoogleSheetWebhookUrl();
  if (!webhookUrl) {
    return { success: false, error: 'No Google Sheet webhook URL provided' };
  }

  if (webhookUrl.includes('/macros/library/')) {
    return {
      success: false,
      error: 'This is a Google Apps Script "Library" URL, not a "Web app" URL. In Google Apps Script, click Deploy > New deployment > click the gear icon next to "Select type" > choose "Web app" > set "Who has access" to "Anyone" > Deploy. The webhook URL must end in "/exec".'
    };
  }

  const testPayload = {
    action: 'test_connection',
    id: 'test_' + Date.now(),
    name: 'Sample Test Guest',
    attending: 'Yes',
    isAttending: true,
    guestCount: 2,
    events: 'Wedding',
    selectedEvents: ['wedding'],
    submittedAt: new Date().toISOString(),
    dateStr: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  };

  try {
    const resp = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
      redirect: 'follow',
      signal: AbortSignal.timeout(10000)
    });

    if (resp.status === 401 || resp.status === 403) {
      return {
        success: false,
        error: 'Google returned 401/403 Unauthorized. In Apps Script deployment, ensure "Who has access" is set to "Anyone", not "Only myself".'
      };
    }

    if (!resp.ok) {
      return {
        success: false,
        error: `Google returned HTTP ${resp.status}. Please check your deployment settings.`
      };
    }

    return { success: true, status: resp.status };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export function handleGoogleSheetApi(req, res, pathname) {
  if (!isAuthenticated(req)) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: false, error: 'Unauthorized' }));
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', async () => {
    try {
      const data = body ? JSON.parse(body) : {};

      if (pathname === '/api/admin/google-sheet/save') {
        const url = (data.url || '').trim();
        const settings = readSettings();
        settings.googleSheetWebhookUrl = url;
        saveSettings(settings);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, url }));
      }

      if (pathname === '/api/admin/google-sheet/test') {
        const result = await testGoogleSheetWebhook(data.url);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(result));
      }

      if (pathname === '/api/admin/google-sheet/sync-all') {
        const result = await syncAllToGoogleSheet(readRsvps());
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(result));
      }

      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Not found' }));
    } catch (err) {
      console.error('Google Sheet API error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  });
}

export function handleHealthCheck(req, res) {
  const payload = {
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'wedding-invitation',
    env: process.env.NODE_ENV || 'production'
  };

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });

  if (req.method === 'HEAD') {
    return res.end();
  }

  return res.end(JSON.stringify(payload, null, 2));
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

      // Trigger automatic background sync to online Google Sheet
      syncRsvpToGoogleSheet(newEntry).catch(err => {
        console.error('Background Google Sheet sync error:', err);
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, id: newEntry.id, message: 'RSVP recorded successfully' }));
    } catch (err) {
      console.error('RSVP parsing error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Server error processing RSVP' }));
    }
  });
}

import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'sneha-vaishnav-wedding-admin-secret-2026';

export function getAdminToken() {
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'sneha@2026';
  return crypto.createHmac('sha256', SESSION_SECRET).update(`${adminUser}:${adminPass}`).digest('hex');
}

export function isAuthenticated(req) {
  // 1. Check HttpOnly session cookie
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(c => {
        const [k, ...v] = c.trim().split('=');
        return [k, decodeURIComponent(v.join('='))];
      })
    );
    if (cookies.admin_session && cookies.admin_session === getAdminToken()) {
      return true;
    }
  }

  // 2. Allow fallback Basic auth for CLI/API scripts without triggering browser popup
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Basic ')) {
    try {
      const b64 = authHeader.split(' ')[1] || '';
      const decoded = Buffer.from(b64, 'base64').toString('utf8');
      const separatorIdx = decoded.indexOf(':');
      const user = separatorIdx !== -1 ? decoded.substring(0, separatorIdx) : '';
      const pass = separatorIdx !== -1 ? decoded.substring(separatorIdx + 1) : '';
      const adminUser = process.env.ADMIN_USER || 'admin';
      const adminPass = process.env.ADMIN_PASSWORD || 'sneha@2026';
      if (user === adminUser && pass === adminPass) {
        return true;
      }
    } catch (_) {}
  }

  return false;
}

export function checkAdminAuth(req, res) {
  if (isAuthenticated(req)) return true;
  res.writeHead(302, { Location: '/admin/login' });
  res.end();
  return false;
}

export function handleAdminLogin(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', () => {
    try {
      let username = '';
      let password = '';
      let redirect = '/admin/rsvps';

      const contentType = req.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        const json = JSON.parse(body || '{}');
        username = json.username || '';
        password = json.password || '';
        if (json.redirect) redirect = json.redirect;
      } else {
        const params = new URLSearchParams(body);
        username = params.get('username') || '';
        password = params.get('password') || '';
        if (params.get('redirect')) redirect = params.get('redirect');
      }

      const adminUser = process.env.ADMIN_USER || 'admin';
      const adminPass = process.env.ADMIN_PASSWORD || 'sneha@2026';

      if (username.trim() === adminUser && password === adminPass) {
        const token = getAdminToken();
        const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
        const cookieVal = `admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;

        if (contentType.includes('application/json')) {
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': cookieVal
          });
          return res.end(JSON.stringify({ success: true, redirect }));
        }

        res.writeHead(302, {
          'Location': redirect || '/admin/rsvps',
          'Set-Cookie': cookieVal
        });
        return res.end();
      }

      // Invalid credentials
      if (contentType.includes('application/json')) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'Invalid username or password' }));
      }

      res.writeHead(401, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(renderAdminLogin('Invalid username or password. Please try again.', redirect, username));
    } catch (err) {
      console.error('Login processing error:', err);
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(renderAdminLogin('An unexpected error occurred. Please try again.'));
    }
  });
}

export function handleAdminLogout(req, res) {
  const cookieVal = 'admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
  res.writeHead(302, {
    'Location': '/admin/login',
    'Set-Cookie': cookieVal
  });
  return res.end();
}

export function renderAdminLogin(error = '', redirectTo = '/admin/rsvps', initialUsername = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Admin Login — Sneha & Vaishnav Wedding</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: radial-gradient(circle at 50% 15%, #18283e 0%, #0d1726 55%, #060a12 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      color: #e2e8f0;
      position: relative;
      overflow-x: hidden;
    }
    body::before {
      content: "";
      position: absolute;
      top: 25%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(197, 160, 89, 0.12) 0%, rgba(197, 160, 89, 0) 70%);
      pointer-events: none;
      z-index: 0;
    }
    .login-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 420px;
    }
    .login-card {
      background: rgba(14, 23, 38, 0.88);
      border: 1px solid rgba(197, 160, 89, 0.35);
      border-radius: 20px;
      padding: 38px 32px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7),
                  0 0 35px rgba(197, 160, 89, 0.12);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    .emblem-wrap {
      display: flex;
      justify-content: center;
      margin-bottom: 18px;
    }
    .emblem {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(197, 160, 89, 0.2) 0%, rgba(197, 160, 89, 0.05) 70%);
      border: 1px solid rgba(197, 160, 89, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(197, 160, 89, 0.25);
    }
    .title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 30px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 4px;
      background: linear-gradient(135deg, #fcebc5 0%, #dfba73 50%, #c5a059 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 0.02em;
    }
    .subtitle {
      text-align: center;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2.5px;
      color: #94a3b8;
      font-weight: 500;
      margin-bottom: 22px;
    }
    .divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 24px;
    }
    .divider::before, .divider::after {
      content: "";
      height: 1px;
      flex: 1;
      background: linear-gradient(90deg, transparent, rgba(197, 160, 89, 0.35), transparent);
    }
    .divider span {
      color: #dfba73;
      font-size: 11px;
    }
    .error-alert {
      background: rgba(239, 68, 68, 0.14);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
      padding: 12px 14px;
      border-radius: 10px;
      font-size: 13px;
      line-height: 1.4;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: shake 0.4s ease;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-4px); }
      40%, 80% { transform: translateX(4px); }
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: #dfba73;
      margin-bottom: 8px;
    }
    .input-container {
      position: relative;
      display: flex;
      align-items: center;
    }
    .field-icon {
      position: absolute;
      left: 14px;
      color: #64748b;
      pointer-events: none;
      display: flex;
      align-items: center;
      transition: color 0.2s;
    }
    input[type="text"],
    input[type="password"] {
      width: 100%;
      background: rgba(7, 12, 20, 0.7);
      border: 1px solid rgba(148, 163, 184, 0.25);
      border-radius: 10px;
      padding: 13px 42px 13px 44px;
      font-size: 14px;
      color: #ffffff;
      font-family: inherit;
      transition: all 0.25s ease;
      outline: none;
    }
    input[type="text"]:focus,
    input[type="password"]:focus {
      border-color: #dfba73;
      background: rgba(7, 12, 20, 0.92);
      box-shadow: 0 0 0 3px rgba(197, 160, 89, 0.22);
    }
    .input-container:focus-within .field-icon {
      color: #dfba73;
    }
    .toggle-password {
      position: absolute;
      right: 10px;
      background: transparent;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: color 0.2s;
    }
    .toggle-password:hover {
      color: #dfba73;
    }
    .btn-submit {
      width: 100%;
      background: linear-gradient(135deg, #c5a059 0%, #dfba73 50%, #b88a3b 100%);
      color: #0c1929;
      border: none;
      padding: 14px 20px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      border-radius: 10px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(197, 160, 89, 0.25);
      transition: all 0.25s ease;
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .btn-submit:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(197, 160, 89, 0.4);
      filter: brightness(1.05);
    }
    .btn-submit:active {
      transform: translateY(0);
    }
    .btn-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
    .back-wrap {
      text-align: center;
      margin-top: 24px;
    }
    .back-link {
      color: #94a3b8;
      text-decoration: none;
      font-size: 12px;
      letter-spacing: 0.5px;
      transition: color 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .back-link:hover {
      color: #dfba73;
    }
    @media (max-width: 480px) {
      .login-card {
        padding: 30px 22px;
        border-radius: 16px;
      }
      .title {
        font-size: 26px;
      }
    }
  </style>
</head>
<body>
  <div class="login-container">
    <div class="login-card">
      <div class="emblem-wrap">
        <div class="emblem">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#dfba73" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
      </div>

      <h1 class="title">Sneha &amp; Vaishnav</h1>
      <p class="subtitle">RSVP Administration Portal</p>

      <div class="divider"><span>✦</span></div>

      ${error ? `
        <div class="error-alert">
          <span>⚠️</span>
          <span>${escapeHtml(error)}</span>
        </div>
      ` : ''}

      <form method="POST" action="/admin/login" id="loginForm">
        <input type="hidden" name="redirect" value="${escapeHtml(redirectTo)}" />

        <div class="form-group">
          <label for="username">Username</label>
          <div class="input-container">
            <span class="field-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            <input
              type="text"
              id="username"
              name="username"
              required
              autocomplete="username"
              placeholder="Enter username"
              value="${escapeHtml(initialUsername)}"
              ${initialUsername ? '' : 'autofocus'}
              spellcheck="false"
              autocapitalize="none"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-container">
            <span class="field-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <input
              type="password"
              id="password"
              name="password"
              required
              autocomplete="current-password"
              placeholder="Enter password"
              ${initialUsername ? 'autofocus' : ''}
            />
            <button type="button" class="toggle-password" id="togglePw" aria-label="Toggle password visibility" title="Show / Hide Password">
              <svg id="eyeIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
        </div>

        <button type="submit" class="btn-submit" id="submitBtn">
          <span>Sign In to Dashboard</span>
          <span>→</span>
        </button>
      </form>

      <div class="back-wrap">
        <a href="/" class="back-link">
          <span>←</span>
          <span>Return to Wedding Invitation</span>
        </a>
      </div>
    </div>
  </div>

  <script>
    const pwInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePw');
    const eyeIcon = document.getElementById('eyeIcon');
    const form = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');

    toggleBtn.addEventListener('click', () => {
      const isPassword = pwInput.type === 'password';
      pwInput.type = isPassword ? 'text' : 'password';
      eyeIcon.innerHTML = isPassword
        ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>'
        : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
    });

    form.addEventListener('submit', () => {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Verifying credentials...</span>';
    });
  </script>
</body>
</html>`;
}

export function renderAdminDashboard(rsvps) {
  const total = rsvps.length;
  const attendingCount = rsvps.filter(r => r.attending).length;
  const declinedCount = rsvps.filter(r => !r.attending).length;
  const totalGuests = rsvps.reduce((acc, r) => acc + (r.attending ? (r.guestCount || 1) : 0), 0);
  const webhookUrl = getGoogleSheetWebhookUrl();

  const googleAppsScriptCode = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Initialize header row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Submission Time (IST)",
        "Guest Name",
        "Attendance Status",
        "Guest Count",
        "Events Joining",
        "RSVP ID"
      ]);
      var headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0c1929");
      headerRange.setFontColor("#dfba73");
      sheet.setFrozenRows(1);
    }

    if (data.action === "batch_sync" && Array.isArray(data.rsvps)) {
      data.rsvps.forEach(function(r) {
        appendRsvpRow(sheet, r);
      });
      return ContentService.createTextOutput(JSON.stringify({ success: true, count: data.rsvps.length }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    appendRsvpRow(sheet, data);
    return ContentService.createTextOutput(JSON.stringify({ success: true, id: data.id }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function appendRsvpRow(sheet, r) {
  var dateStr = r.dateStr || (r.submittedAt ? new Date(r.submittedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
  var status = (r.isAttending || r.attending === true || r.attending === "Yes") ? "Attending" : "Declined";
  var guests = (status === "Attending") ? (r.guestCount || 1) : 0;
  var events = r.events || (Array.isArray(r.selectedEvents) ? r.selectedEvents.join(", ") : "—");

  sheet.appendRow([
    dateStr,
    r.name,
    status,
    guests,
    events,
    r.id || ""
  ]);
}`;

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
      <title>Wedding RSVP Dashboard — Sneha & Vaishnav</title>
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
        .sync-card { background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; margin-bottom: 24px; }
        .badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
        .badge-active { background: #e6f4ea; color: #137333; }
        .badge-inactive { background: #fef3c7; color: #92400e; }
        .input-sheet { flex: 1; min-width: 280px; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .input-sheet:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }
        table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        th { background: #f1f5f9; padding: 12px 16px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; }
        .btn { background: #1e293b; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: background 0.2s, opacity 0.2s; }
        .btn:hover { opacity: 0.92; }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <h1>💍 Sneha & Vaishnav — RSVP Responses</h1>
            <p style="margin:4px 0 0 0; color:#64748b; font-size:14px;">Real-time guest attendance records</p>
          </div>
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <a href="/" class="btn" style="background:#fff; color:#1e293b; border:1px solid #cbd5e1;">← View Website</a>
            <button onclick="window.location.reload()" class="btn">↻ Refresh</button>
            <a href="/admin/logout" class="btn" style="background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;">🚪 Sign Out</a>
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

        <div class="sync-card">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:14px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:22px;">📊</span>
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <h3 style="margin:0; font-size:16px; color:#1e293b; font-weight:700;">Google Sheets Live Auto-Sync</h3>
                  <span id="syncBadge" class="badge ${webhookUrl ? 'badge-active' : 'badge-inactive'}">
                    ${webhookUrl ? '● Auto-Sync Active' : '○ Not Configured'}
                  </span>
                </div>
                <p style="margin:2px 0 0 0; color:#64748b; font-size:12px;">Every new RSVP automatically appends a new row in your online Google Sheet</p>
              </div>
            </div>
            <div>
              <button onclick="toggleInstructions()" class="btn" style="background:#f1f5f9; color:#334155; border:1px solid #cbd5e1; font-size:12px; padding:6px 12px;">
                ℹ️ Setup Guide (2 mins)
              </button>
            </div>
          </div>

          <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
            <input
              type="url"
              id="sheetUrlInput"
              value="${escapeHtml(webhookUrl)}"
              placeholder="Paste Google Apps Script Web App URL (https://script.google.com/macros/s/.../exec)"
              class="input-sheet"
            />
            <button onclick="saveSheetUrl()" class="btn" id="btnSave">💾 Save URL</button>
            <button onclick="testSheetConnection()" class="btn" style="background:#f8fafc; color:#1e293b; border:1px solid #cbd5e1;" id="btnTest">🧪 Test Sync</button>
            <button onclick="syncAllRsvps()" class="btn" style="background:#0f766e; color:#fff;" id="btnSyncAll" ${total === 0 ? 'disabled' : ''}>🔄 Sync All RSVPs (${total})</button>
          </div>

          <div id="syncFeedback" style="display:none; margin-top:12px; font-size:13px; padding:10px 14px; border-radius:8px;"></div>

          <div id="instructionsPanel" style="display:none; margin-top:16px; padding:16px; background:#f8fafc; border-radius:10px; border:1px solid #e2e8f0; font-size:13px; color:#334155; line-height:1.6;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <h4 style="margin:0; color:#0f172a; font-size:14px; font-weight:700;">Quick 2-Minute Google Sheet Setup:</h4>
              <button onclick="toggleInstructions()" style="background:none; border:none; color:#64748b; cursor:pointer; font-size:16px;">✕</button>
            </div>
            <ol style="margin:0 0 12px 20px; padding:0;">
              <li>Open a new spreadsheet at <a href="https://sheets.new" target="_blank" style="color:#2563eb; font-weight:600; text-decoration:underline;">sheets.new</a>.</li>
              <li>In the top menu, go to <b>Extensions</b> &gt; <b>Apps Script</b>.</li>
              <li>Delete any existing code in the editor, paste the script below, and click the floppy disk icon (<b>Save</b>).</li>
              <li>Click the blue <b>Deploy</b> button (top right) &gt; <b>New deployment</b>.</li>
              <li>Click the gear icon next to <i>Select type</i> and choose <b>Web app</b>.</li>
              <li>Under <i>Execute as</i>: select <b>Me</b>. Under <i>Who has access</i>: select <b>Anyone</b> (required so your website can send RSVPs).</li>
              <li>Click <b>Deploy</b>, authorize permissions, copy the <b>Web app URL</b>, and paste it into the box above!</li>
            </ol>
            <div style="position:relative; margin-top:8px;">
              <pre id="scriptCode" style="background:#0f172a; color:#f8fafc; padding:14px; border-radius:8px; font-size:12px; overflow-x:auto; margin:0; line-height:1.45; font-family:Consolas, monospace;">${escapeHtml(googleAppsScriptCode)}</pre>
              <button onclick="copyScriptCode()" id="btnCopyCode" class="btn" style="position:absolute; top:8px; right:8px; font-size:11px; padding:5px 10px; background:#334155; color:#fff;">📋 Copy Code</button>
            </div>
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

      <script>
        function toggleInstructions() {
          const panel = document.getElementById('instructionsPanel');
          panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }

        function showFeedback(msg, isSuccess) {
          const box = document.getElementById('syncFeedback');
          box.style.display = 'block';
          box.style.background = isSuccess ? '#e6f4ea' : '#fce8e6';
          box.style.color = isSuccess ? '#137333' : '#c5221f';
          box.style.border = isSuccess ? '1px solid #a8dab5' : '1px solid #f5c2c0';
          box.textContent = msg;
        }

        async function saveSheetUrl() {
          const input = document.getElementById('sheetUrlInput');
          const url = input.value.trim();
          if (url && url.includes('/macros/library/')) {
            showFeedback('⚠️ This is a Library URL, not a Web app URL. In Google Apps Script, click Deploy > New deployment > gear icon > choose "Web app" > set access to "Anyone" > Deploy. The URL must end in /exec.', false);
            return;
          }
          const btn = document.getElementById('btnSave');
          btn.disabled = true;
          btn.textContent = 'Saving...';
          try {
            const res = await fetch('/api/admin/google-sheet/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url })
            });
            const data = await res.json();
            if (data.success) {
              showFeedback(url ? '✅ Webhook URL saved! Future RSVPs will automatically sync to Google Sheets.' : 'ℹ️ Webhook URL cleared.', true);
              const badge = document.getElementById('syncBadge');
              if (url) {
                badge.className = 'badge badge-active';
                badge.textContent = '● Auto-Sync Active';
              } else {
                badge.className = 'badge badge-inactive';
                badge.textContent = '○ Not Configured';
              }
            } else {
              showFeedback('❌ Failed to save URL: ' + (data.error || 'Unknown error'), false);
            }
          } catch (err) {
            showFeedback('❌ Network error: ' + err.message, false);
          } finally {
            btn.disabled = false;
            btn.textContent = '💾 Save URL';
          }
        }

        async function testSheetConnection() {
          const input = document.getElementById('sheetUrlInput');
          const url = input.value.trim();
          if (!url) {
            showFeedback('⚠️ Please paste a Google Apps Script Web App URL first.', false);
            return;
          }
          if (url.includes('/macros/library/')) {
            showFeedback('⚠️ This is a Library URL, not a Web app URL. In Google Apps Script, click Deploy > New deployment > gear icon > choose "Web app" > set access to "Anyone" > Deploy. The URL must end in /exec.', false);
            return;
          }
          const btn = document.getElementById('btnTest');
          btn.disabled = true;
          btn.textContent = 'Testing...';
          try {
            const res = await fetch('/api/admin/google-sheet/test', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url })
            });
            const data = await res.json();
            if (data.success) {
              showFeedback('🎉 Test successful! A sample test row was added to your Google Sheet.', true);
            } else {
              showFeedback('❌ Test failed: ' + (data.error || 'Could not connect. Verify your deployment is set to "Anyone".'), false);
            }
          } catch (err) {
            showFeedback('❌ Connection error: ' + err.message, false);
          } finally {
            btn.disabled = false;
            btn.textContent = '🧪 Test Sync';
          }
        }

        async function syncAllRsvps() {
          const btn = document.getElementById('btnSyncAll');
          btn.disabled = true;
          btn.textContent = 'Syncing...';
          try {
            const res = await fetch('/api/admin/google-sheet/sync-all', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
              showFeedback('🎉 Successfully synced ' + (data.count || 0) + ' RSVP responses to Google Sheet!', true);
            } else {
              showFeedback('❌ Sync failed: ' + (data.error || 'Unknown error'), false);
            }
          } catch (err) {
            showFeedback('❌ Network error: ' + err.message, false);
          } finally {
            btn.disabled = false;
            btn.textContent = '🔄 Sync All RSVPs (${total})';
          }
        }

        function copyScriptCode() {
          const code = document.getElementById('scriptCode').innerText;
          navigator.clipboard.writeText(code).then(() => {
            const btn = document.getElementById('btnCopyCode');
            btn.textContent = '✓ Copied!';
            setTimeout(() => { btn.textContent = '📋 Copy Code'; }, 2000);
          });
        }
      </script>
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
    if ((req.method === 'GET' || req.method === 'HEAD') && (pathname === '/health' || pathname === '/api/health')) {
      return handleHealthCheck(req, res);
    }

    if (req.method === 'POST' && pathname === '/api/rsvp') {
      return handleRsvpPost(req, res);
    }

    if (pathname.startsWith('/api/admin/google-sheet/')) {
      return handleGoogleSheetApi(req, res, pathname);
    }

    if (pathname === '/admin/login') {
      if (req.method === 'POST') {
        return handleAdminLogin(req, res);
      }
      if (req.method === 'GET') {
        if (isAuthenticated(req)) {
          res.writeHead(302, { Location: '/admin/rsvps' });
          return res.end();
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(renderAdminLogin('', parsedUrl.searchParams.get('redirect') || '/admin/rsvps'));
      }
    }

    if (req.method === 'GET' && pathname === '/admin/logout') {
      return handleAdminLogout(req, res);
    }

    if (req.method === 'GET' && pathname === '/api/rsvps') {
      if (!isAuthenticated(req)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'Unauthorized' }));
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, rsvps: readRsvps() }));
    }

    if (req.method === 'GET' && (pathname === '/admin/rsvps' || pathname === '/admin/rvsps' || pathname === '/admin')) {
      if (!isAuthenticated(req)) {
        res.writeHead(302, { Location: '/admin/login?redirect=' + encodeURIComponent(pathname) });
        return res.end();
      }
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

      const isMedia = ['.mp4', '.mp3', '.webp', '.jpg', '.png', '.woff', '.woff2', '.ttf'].includes(ext);
      const cacheControl = isMedia ? 'public, max-age=31536000, immutable' : 'public, max-age=3600';

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
          'Cache-Control': cacheControl,
        });
        fileStream.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes',
          'Cache-Control': cacheControl,
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
