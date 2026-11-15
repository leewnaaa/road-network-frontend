import { FC } from 'react'
import { Spinner } from 'react-bootstrap'
import { useAppSelector } from '../store'

// Анимация загрузки поверх экрана: пока выполняется хотя бы один thunk-запрос,
// полупрозрачный слой перекрывает страницу и кнопки пользователя недоступны.
export const LoadingOverlay: FC = () => {
  const pending = useAppSelector((state) => state.loading.pending > 0)
  if (!pending) return null

  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <Spinner animation="border" />
      <span className="loading-text">Загрузка…</span>
    </div>
  )
}
