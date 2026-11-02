import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Запросы /api/* проксируются на FastAPI-бэкенд (решение проблемы CORS).
    // Если бэкенд не запущен, фронтенд берёт данные из mock-объектов.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
