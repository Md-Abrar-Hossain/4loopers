import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split big third-party libraries into their own cacheable chunks.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('firebase') || id.includes('@firebase')) return 'firebase';
          if (id.includes('tsparticles')) return 'particles';
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/')) return 'react';
        },
      },
    },
  },
})
