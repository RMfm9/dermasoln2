import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // ✅ This loads .env variables

  return {
    plugins: [react()],
    server: {
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000', // ✅ Safe fallback
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});
