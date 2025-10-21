import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/widget/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
    // Generate assets with consistent names
    assetsInlineLimit: 0,
  },
  server: {
    port: 5173,
  },
});
