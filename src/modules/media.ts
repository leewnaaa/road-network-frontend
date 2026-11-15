export const DEFAULT_IMAGE = '/DefaultImage.jpg'
export const DEFAULT_VIDEO = '/DefaultVideo.mp4'

// Бэкенд отдаёт прямые ссылки на MinIO (MINIO_PUBLIC_URL/бакет/файл).
// Переписываем их на второй маршрут proxy Vite: http://localhost:9000/cities/x.jpg -> /minio/cities/x.jpg
const MINIO_URL = (import.meta.env.VITE_MINIO_URL ?? 'http://localhost:9000').replace(/\/$/, '')
const MINIO_PROXY = '/minio'

export const toProxyUrl = (url: string): string => {
  for (const origin of [MINIO_URL, MINIO_URL.replace('localhost', '127.0.0.1')]) {
    if (url.startsWith(`${origin}/`)) return `${MINIO_PROXY}${url.slice(origin.length)}`
  }
  return url
}

export const imageOrDefault = (url: string | null | undefined): string => (url ? toProxyUrl(url) : DEFAULT_IMAGE)
export const videoOrDefault = (url: string | null | undefined): string => (url ? toProxyUrl(url) : DEFAULT_VIDEO)

export const formatCoords = (lat: number | null, lon: number | null): string =>
  lat === null || lon === null ? 'координаты не указаны' : `${lat.toFixed(4)}, ${lon.toFixed(4)}`
