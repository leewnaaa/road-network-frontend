// Изображение и видео по умолчанию лежат в public/ и доступны по корневому пути
export const DEFAULT_IMAGE = '/DefaultImage.jpg'
export const DEFAULT_VIDEO = '/DefaultVideo.mp4'

// Пустое поле или null → файл по умолчанию
export const imageOrDefault = (url: string | null | undefined): string => url || DEFAULT_IMAGE
export const videoOrDefault = (url: string | null | undefined): string => url || DEFAULT_VIDEO

export const formatCoords = (lat: number | null, lon: number | null): string =>
  lat === null || lon === null ? 'координаты не указаны' : `${lat.toFixed(4)}, ${lon.toFixed(4)}`
