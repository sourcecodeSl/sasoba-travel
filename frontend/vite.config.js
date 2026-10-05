import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// The PHP backend runs under XAMPP's Apache. Dev/preview servers forward /api and /uploads to it,
// so the browser only ever talks to one origin. Override with BACKEND_URL if your path differs.
const BACKEND = process.env.BACKEND_URL || 'http://localhost/sasoba%20travel/backend';
const backendProxy = {
  target: new URL(BACKEND).origin,
  changeOrigin: true,
  rewrite: (path) => new URL(BACKEND).pathname.replace(/\/$/, '') + path,
};

const proxy = { '/api': backendProxy, '/uploads': backendProxy };

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy },
  preview: { proxy },
});
