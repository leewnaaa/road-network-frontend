import type { CityCardOut, CityFeedOut } from '../api/Api'

// Услуга — город дорожной сети. Тип сгенерирован из Swagger (CityCardOut);
// published_at есть только у mock-объектов и задаёт порядок их ленты.
export type City = CityCardOut & { published_at?: string }

// Элемент ленты: плюс признак лайка текущего пользователя (для гостя всегда 0)
export type CityFeed = CityFeedOut & { published_at?: string }

// Откуда пришли данные: с бэкенда или из коллекции mock-объектов
export type DataSource = 'api' | 'mock'

// Значения фильтра на странице «Плитка» (хранятся в Redux)
export interface CityFilters {
  latMax: number // максимальная широта (как lat_max на бэкенде)
}
