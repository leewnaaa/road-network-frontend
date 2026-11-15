import { CITIES_MOCK } from './mock'
import { City, CityFeed } from './types'

// Запросы к коллекции mock-объектов, повторяющие логику бэкенда.
// Используются в thunk, когда бэкенд недоступен и пользователь — гость.

const byPublishedDesc = (a: City, b: City) => (b.published_at ?? '').localeCompare(a.published_at ?? '')

// GET /api/cities?lat_max=
export const mockCityList = (latMax?: number): City[] =>
  CITIES_MOCK.filter((city) => latMax === undefined || (city.lat ?? 0) <= latMax).sort((a, b) =>
    a.name.localeCompare(b.name, 'ru'),
  )

// GET /api/cities/feed и /api/cities/feed/{id}?next=true
export const mockCityFeed = (cityId?: number, next = false): CityFeed | null => {
  const ordered = [...CITIES_MOCK].sort(byPublishedDesc)
  if (!ordered.length) return null
  if (cityId === undefined) return { ...ordered[0], liked_by_me: 0 }

  const index = ordered.findIndex((city) => city.id === cityId)
  if (index === -1) return null
  const city = next ? ordered[(index + 1) % ordered.length] : ordered[index]
  return { ...city, liked_by_me: 0 }
}
