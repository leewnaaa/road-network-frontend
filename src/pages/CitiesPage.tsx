import { FC } from 'react'
import { Spinner } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CityCard } from '../components/CityCard'
import { CityFilter, LAT_MAX } from '../components/CityFilter'
import { useCities } from '../hooks/useCities'
import { useDebounce } from '../hooks/useDebounce'
import { CityFilters } from '../modules/types'
import { cityRoute } from '../Routes'

const DEFAULT_FILTERS: CityFilters = { latMax: LAT_MAX }

// Страница «Плитка»: фильтр по широте + сетка карточек в 2 колонки
const CitiesPage: FC = () => {
  const navigate = useNavigate()

  // Фильтр хранится в адресной строке (?lat_max=), поэтому сохраняется
  // при возврате со страницы «Подробнее» и при обновлении страницы
  const [params, setParams] = useSearchParams()
  const filters: CityFilters = {
    latMax: Number(params.get('lat_max') ?? DEFAULT_FILTERS.latMax),
  }

  const setFilters = (next: CityFilters) => {
    const query: Record<string, string> = {}
    if (next.latMax !== DEFAULT_FILTERS.latMax) query.lat_max = String(next.latMax)
    setParams(query, { replace: true })
  }

  // широта — как lat_max на бэкенде; список обновляется после паузы в движении ползунка
  const debouncedLat = useDebounce(filters.latMax)
  const { cities, loading } = useCities(debouncedLat)

  return (
    <div className="grid-page">
      <div className="page-head">
        <h1 className="page-title">Города сети</h1>
      </div>

      <CityFilter
        value={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        found={cities.length}
      />

      {loading ? (
        <div className="page-loader">
          <Spinner animation="border" />
        </div>
      ) : cities.length === 0 ? (
        <p className="page-subtitle">По заданному фильтру городов не найдено.</p>
      ) : (
        <div className="grid-container">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} onOpen={(id) => navigate(cityRoute(id))} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CitiesPage
