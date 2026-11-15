import { FC, useEffect } from 'react'
import { Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { CityCard } from '../components/CityCard'
import { CityFilter } from '../components/CityFilter'
import { useDebounce } from '../hooks/useDebounce'
import { feedRoute } from '../Routes'
import { deleteCity, fetchCities } from '../slices/citiesSlice'
import { useAppDispatch, useAppSelector } from '../store'

const CitiesPage: FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { list, filters, error } = useAppSelector((state) => state.cities)
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated)

  // Запрос уходит через 300 мс после остановки ползунка; фильтр берётся из Redux внутри thunk
  const debouncedLat = useDebounce(filters.latMax)

  useEffect(() => {
    const request = dispatch(fetchCities())
    return () => request.abort()
  }, [dispatch, debouncedLat, isAuthenticated])

  const handleDelete = (id: number) => {
    dispatch(deleteCity(id))
  }

  return (
    <div className="grid-page">
      <div className="page-head">
        <h1 className="page-title">Города сети</h1>
      </div>

      <CityFilter found={list.length} />

      {error && (
        <Alert variant="danger" className="page-alert">
          {error}
        </Alert>
      )}

      {list.length === 0 ? (
        <p className="page-subtitle">По заданному фильтру городов не найдено.</p>
      ) : (
        <div className="grid-container">
          {list.map((city) => (
            <CityCard
              key={city.id}
              city={city}
              onOpen={(id) => navigate(feedRoute(id))}
              onDelete={isAuthenticated && city.is_mine === 1 ? handleDelete : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CitiesPage
