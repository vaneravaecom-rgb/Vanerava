
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { vtexProxyPlugin } from './src/vtex-proxy';

export default defineConfig({
  plugins: [react(), vtexProxyPlugin()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  server: {
    host: '0.0.0.0',
    proxy: {
      '/graphql': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});