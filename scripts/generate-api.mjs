import { resolve } from 'path'

import { generateApi } from 'swagger-typescript-api'

// Кодогенерация клиента API из Swagger (OpenAPI) бэкенда FastAPI.
// Запуск: npm run generate-api (бэкенд должен работать на http://127.0.0.1:8000).
generateApi({
  name: 'Api.ts',
  output: resolve(process.cwd(), './src/api'),
  url: 'http://127.0.0.1:8000/openapi.json',
  httpClientType: 'axios',
  // /api/cities/... -> api.cities.*, /api/users/... -> api.users.*
  moduleNameIndex: 1,
})
