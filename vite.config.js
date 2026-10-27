import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodeMiddleware } from './server.js';

function rsvpBackendPlugin() {
  return {
    name: 'rsvp-backend-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
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
        nodeMiddleware(req, res, next);
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
