import { useEffect, useState } from 'react'
import { getCities } from '../modules/citiesApi'
import { City } from '../modules/types'

export const useCities = (latMax: number) => {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    getCities(latMax, controller.signal)
      .then((result) => {
        setCities(result.data)
        setLoading(false)
      })
      .catch(() => {
      })

    return () => controller.abort()
  }, [latMax])

  return { cities, loading }
}
