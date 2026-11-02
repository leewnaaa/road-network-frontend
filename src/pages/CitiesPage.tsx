import { FC, useMemo } from 'react'
import { Spinner } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CityCard } from '../components/CityCard'
import { CityFilter, LAT_MAX } from '../components/CityFilter'
import { useCities } from '../hooks/useCities'
import { useDebounce } from '../hooks/useDebounce'
import { City, CityFilters, SortKey } from '../modules/types'
import { cityRoute } from '../Routes'

const DEFAULT_FILTERS: CityFilters = { latMax: LAT_MAX, sort: 'name' }

const sorters: Record<SortKey, (a: City, b: City) => number> = {
  name: (a, b) => a.name.localeCompare(b.name, 'ru'),
  date: (a, b) => (b.published_at ?? '').localeCompare(a.published_at ?? '') || b.id - a.id,
  likes: (a, b) => b.likes_count - a.likes_count,
}

// Страница «Плитка»: фильтр + сетка карточек в 2 колонки
const CitiesPage: FC = () => {
  const navigate = useNavigate()

  // Фильтр хранится в адресной строке (?lat_max=&sort=), поэтому сохраняется
  // при возврате со страницы «Подробнее» и при обновлении страницы
  const [params, setParams] = useSearchParams()
  const filters: CityFilters = {
    latMax: Number(params.get('lat_max') ?? DEFAULT_FILTERS.latMax),
    sort: (params.get('sort') as SortKey) ?? DEFAULT_FILTERS.sort,
  }

  const setFilters = (next: CityFilters) => {
    const query: Record<string, string> = {}
    if (next.latMax !== DEFAULT_FILTERS.latMax) query.lat_max = String(next.latMax)
    if (next.sort !== DEFAULT_FILTERS.sort) query.sort = next.sort
    setParams(query, { replace: true })
  }

  // широта — как lat_max на бэкенде; список обновляется после паузы в движении ползунка
  const debouncedLat = useDebounce(filters.latMax)
  const { cities, loading } = useCities(debouncedLat)

  // сортировка — пересчёт только при изменении данных или выбранного порядка
  const visible = useMemo(() => [...cities].sort(sorters[filters.sort]), [cities, filters.sort])

  return (
    <div className="grid-page">
      <div className="page-head">
        <h1 className="page-title">Города сети</h1>
      </div>

      <CityFilter
        value={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        found={visible.length}
      />

      {loading ? (
        <div className="page-loader">
          <Spinner animation="border" />
        </div>
      ) : visible.length === 0 ? (
        <p className="page-subtitle">По заданному фильтру городов не найдено.</p>
      ) : (
        <div className="grid-container">
          {visible.map((city) => (
            <CityCard key={city.id} city={city} onOpen={(id) => navigate(cityRoute(id))} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CitiesPage
