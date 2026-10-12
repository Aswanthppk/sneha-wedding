import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {
  handleRsvpPost,
  readRsvps,
  renderAdminDashboard,
  renderAdminLogin,
  handleAdminLogin,
  handleAdminLogout,
  isAuthenticated
} from './server.js';

function rsvpBackendPlugin() {
  return {
    name: 'rsvp-backend-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        if (req.method === 'POST' && url.pathname === '/api/rsvp') {
          return handleRsvpPost(req, res);
        }
        if (url.pathname === '/admin/login') {
          if (req.method === 'POST') {
            return handleAdminLogin(req, res);
          }
          if (req.method === 'GET') {
            if (isAuthenticated(req)) {
              res.writeHead(302, { Location: '/admin/rsvps' });
              return res.end();
            }
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.end(renderAdminLogin('', url.searchParams.get('redirect') || '/admin/rsvps'));
          }
        }
        if (req.method === 'GET' && url.pathname === '/admin/logout') {
          return handleAdminLogout(req, res);
        }
        if (req.method === 'GET' && url.pathname === '/api/rsvps') {
          if (!isAuthenticated(req)) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: false, error: 'Unauthorized' }));
          }
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ success: true, rsvps: readRsvps() }));
        }
        if (req.method === 'GET' && (url.pathname === '/admin/rsvps' || url.pathname === '/admin/rvsps' || url.pathname === '/admin')) {
          if (!isAuthenticated(req)) {
            res.writeHead(302, { Location: '/admin/login?redirect=' + encodeURIComponent(url.pathname) });
            return res.end();
          }
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          return res.end(renderAdminDashboard(readRsvps()));
        }
        if (req.method === 'POST' && url.pathname === '/api/save-poster') {
          let body = '';
          req.on('data', c => { body += c; });
          req.on('end', () => {
            const data = JSON.parse(body);
            const base64Data = data.image.replace(/^data:image\/\w+;base64,/, '');
            import('fs').then(fs => {
              fs.writeFileSync('./public/assets/envelope-poster.jpg', Buffer.from(base64Data, 'base64'));
              fs.writeFileSync('./dist/assets/envelope-poster.jpg', Buffer.from(base64Data, 'base64'));
              res.end('saved');
            });
          });
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), rsvpBackendPlugin()],
  server: {
    port: 3000,
    host: true
  }
});
