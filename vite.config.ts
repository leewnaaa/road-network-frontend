import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // 1-й маршрут: REST API FastAPI (решение проблемы CORS обратным прокси)
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      // статические файлы бэкенда (/static/img/...), если в БД записан такой путь
      '/static': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      // 2-й маршрут: файлы из MinIO (S3). /minio/cities/<файл> -> http://127.0.0.1:9000/cities/<файл>
      '/minio': {
        target: 'http://127.0.0.1:9000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/minio/, ''),
      },
    },
  },
})
