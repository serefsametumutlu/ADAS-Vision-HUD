import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react-dom') || id.includes('react/')) return 'react';
          if (id.includes('@react-three') || id.includes('/three/')) return 'three';
          if (id.includes('framer-motion')) return 'motion';
        },
      },
    },
  },
});
