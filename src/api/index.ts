import { Api } from './Api'

// Экземпляр сгенерированного клиента (swagger-typescript-api, httpClientType: 'axios').
// Пути в Api.ts уже начинаются с /api/..., поэтому baseURL пустой: запрос уходит на тот же
// origin (http://localhost:3000), а proxy Vite пересылает его на FastAPI — CORS не нужен.
// withCredentials — браузер отправляет сессионную куку session_id.
export const api = new Api({
  baseURL: '',
  withCredentials: true,
})
