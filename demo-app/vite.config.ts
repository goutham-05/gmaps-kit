import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3001,
    proxy: {
      '/api/places': {
        target: 'https://maps.googleapis.com/maps/api/place',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/places/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Add API key from environment variable
            const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
            if (apiKey) {
              const url = new URL(proxyReq.path, 'https://maps.googleapis.com');
              url.searchParams.set('key', apiKey);
              proxyReq.path = url.pathname + url.search;
            }
          });
        },
      },
      '/api/geocoding': {
        target: 'https://maps.googleapis.com/maps/api/geocode',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/geocoding/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Add API key from environment variable
            const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
            if (apiKey) {
              const url = new URL(proxyReq.path, 'https://maps.googleapis.com');
              url.searchParams.set('key', apiKey);
              proxyReq.path = url.pathname + url.search;
            }
          });
        },
      },
    },
  },
});
