// Услуга — город дорожной сети. Поля совпадают с ответом GET /api/cities бэкенда (CityCardOut).
export interface City {
  id: number
  name: string
  description: string | null
  lat: number | null
  lon: number | null
  image_url: string | null
  video_url: string | null
  likes_count: number
  is_mine: 0 | 1
  published_at?: string // ISO-дата публикации (есть в mock; задаёт порядок ленты)
}

// Элемент ленты: плюс признак лайка текущего пользователя (для гостя всегда 0)
export interface CityFeed extends City {
  liked_by_me: 0 | 1
}

// Откуда пришли данные: с бэкенда или из коллекции mock-объектов
export type DataSource = 'api' | 'mock'

export interface ApiResult<T> {
  data: T
  source: DataSource
}

// Значения фильтра на странице «Плитка»
export interface CityFilters {
  latMax: number // максимальная широта (как lat_max на бэкенде)
}
