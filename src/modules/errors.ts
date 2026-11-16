import axios from 'axios'

// Бэкенд недоступен: нет ответа или proxy Vite вернул 5xx (FastAPI не запущен).
// Только в этом случае гостю показываются mock-объекты.
export const isBackendDown = (error: unknown): boolean => {
  if (axios.isCancel(error)) return false
  if (!axios.isAxiosError(error)) return false
  return !error.response || error.response.status >= 500
}

export const isNotFound = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.status === 404

// Текст ошибки из ответа FastAPI: {"detail": "..."} или список ошибок валидации (422)
export const errorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    if (isBackendDown(error)) return 'Сервер недоступен'
    const detail = (error.response?.data as { detail?: unknown } | undefined)?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail.length) {
      return detail.map((item: { msg?: string }) => item.msg ?? '').filter(Boolean).join('; ') || fallback
    }
  }
  return fallback
}
