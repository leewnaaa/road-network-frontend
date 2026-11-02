import { useEffect, useState } from 'react'

// Возвращает значение с задержкой: пока ползунок двигают, запросы к API не отправляются
export const useDebounce = <T,>(value: T, delay = 300): T => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
