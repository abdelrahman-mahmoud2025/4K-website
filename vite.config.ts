import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          // Only proxy non-JSON API endpoints to Express server
          // Static JSON files in public/api/ will be served directly by Vite
          '^/api/(?!.*\\.json$).*': {
            target: 'http://localhost:3002',
            changeOrigin: true,
            rewrite: (path) => path,
          },
        },
      },
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom', 'react-router-dom'],
              animations: ['framer-motion'],
              utils: ['fuse.js', 'lucide-react', 'react-hot-toast']
            }
          }
        }
      }
    };
});
