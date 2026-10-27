import { handleRequest } from '../../server.js';

export default async (request, context) => {
  const response = await handleRequest(request, context);
  return response || new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
};

// Keep in sync with the routes in handleRequest() in server.js
export const config = {
  path: [
    '/health',
    '/api/health',
    '/api/rsvp',
    '/api/rsvps',
    '/api/admin/google-sheet/*',
    '/admin/login',
    '/admin/logout',
    '/admin',
    '/admin/rsvps',
    '/admin/rvsps'
  ]
};
