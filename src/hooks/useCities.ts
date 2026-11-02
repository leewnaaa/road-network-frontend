import { useEffect, useState } from 'react'
import { getCities } from '../modules/citiesApi'
import { City, DataSource } from '../modules/types'

// Пользовательский хук: загружает список городов с фильтром по широте.
// Запрос повторяется при каждом изменении latMax; предыдущий запрос отменяется.
export const useCities = (latMax: number) => {
  const [cities, setCities] = useState<City[]>([])
  const [source, setSource] = useState<DataSource>('mock')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    getCities(latMax, controller.signal)
      .then((result) => {
        setCities(result.data)
        setSource(result.source)
        setLoading(false)
      })
      .catch(() => {
        // запрос отменён при размонтировании или смене фильтра — ничего не делаем
      })

    // cleanup: срабатывает перед следующим запуском эффекта и при размонтировании
    return () => controller.abort()
  }, [latMax])

  return { cities, source, loading }
}
