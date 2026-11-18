import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': '/src' } },
  server: {
    port: 5173,
    // Запросы /api/* в режиме разработки уходят на FastAPI. Для браузера это тот же адрес,
    // поэтому cookie с refresh token работает без настройки CORS.
    proxy: { '/api': 'http://localhost:8000' },
  },
});
