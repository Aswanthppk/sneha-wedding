import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleRsvpPost, readRsvps, renderAdminDashboard } from './server.js';

function rsvpBackendPlugin() {
  return {
    name: 'rsvp-backend-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        if (req.method === 'POST' && url.pathname === '/api/rsvp') {
          return handleRsvpPost(req, res);
        }
        if (req.method === 'GET' && url.pathname === '/api/rsvps') {
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ success: true, rsvps: readRsvps() }));
        }
        if (req.method === 'GET' && (url.pathname === '/admin/rsvps' || url.pathname === '/admin')) {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          return res.end(renderAdminDashboard(readRsvps()));
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
