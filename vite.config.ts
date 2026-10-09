import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks: they rarely change, so browsers keep them cached.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          i18n: ['i18next', 'react-i18next'],
        },
      },
    },
  },
  server: {
    // `npm run dev` + `npm run cf:dev` (wrangler on :8787) -> the admin panel
    // talks to the local Worker/KV during development.
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})
