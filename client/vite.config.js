import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use a fallback in case VITE_API_URL is not set
const API = process.env.VITE_API_URL || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: API,
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
