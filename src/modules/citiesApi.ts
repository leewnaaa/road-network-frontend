import { ApiResult, City, CityFeed } from './types'
import { CITIES_MOCK } from './mock'

// В лабораторной 5 данные берутся только из mock-коллекции: запросов к бэкенду нет,
// поэтому в Network нет ошибок. Чтобы подключить FastAPI (ЛР6), запустите
// фронтенд с VITE_USE_MOCK=false — запросы пойдут на /api/... через proxy Vite.
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const API = '/api/cities'

const fetchJson = async <T>(url: string, signal?: AbortSignal): Promise<T> => {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json() as Promise<T>
}

const isAbort = (error: unknown) => error instanceof DOMException && error.name === 'AbortError'

// ---------- mock-реализации, повторяющие логику бэкенда ----------

const byPublishedDesc = (a: City, b: City) => (b.published_at ?? '').localeCompare(a.published_at ?? '')

const mockList = (latMax?: number): City[] =>
  CITIES_MOCK.filter((city) => latMax === undefined || (city.lat ?? 0) <= latMax).sort((a, b) =>
    a.name.localeCompare(b.name, 'ru'),
  )

// Лента: без id — самая новая; с id — эта услуга; с next — следующая (более старая), после последней — снова первая
const mockFeed = (cityId?: number, next = false): CityFeed | null => {
  const ordered = [...CITIES_MOCK].sort(byPublishedDesc)
  if (!ordered.length) return null
  if (cityId === undefined) return { ...ordered[0], liked_by_me: 0 }

  const index = ordered.findIndex((city) => city.id === cityId)
  if (index === -1) return null
  const city = next ? ordered[(index + 1) % ordered.length] : ordered[index]
  return { ...city, liked_by_me: 0 }
}

// ---------- публичные функции модуля ----------

// GET /api/cities?lat_max=
export const getCities = async (latMax?: number, signal?: AbortSignal): Promise<ApiResult<City[]>> => {
  if (USE_MOCK) return { data: mockList(latMax), source: 'mock' }
  const query = latMax === undefined ? '' : `?lat_max=${latMax}`
  try {
    const data = await fetchJson<City[]>(`${API}${query}`, signal)
    return { data, source: 'api' }
  } catch (error) {
    if (isAbort(error)) throw error
    return { data: mockList(latMax), source: 'mock' }
  }
}

// GET /api/cities/feed  и  GET /api/cities/feed/{id}?next=true
export const getFeed = async (
  cityId?: number,
  next = false,
  signal?: AbortSignal,
): Promise<ApiResult<CityFeed | null>> => {
  if (USE_MOCK) return { data: mockFeed(cityId, next), source: 'mock' }
  const url = cityId === undefined ? `${API}/feed` : `${API}/feed/${cityId}${next ? '?next=true' : ''}`
  try {
    const data = await fetchJson<CityFeed>(url, signal)
    return { data, source: 'api' }
  } catch (error) {
    if (isAbort(error)) throw error
    return { data: mockFeed(cityId, next), source: 'mock' }
  }
}
