import { FC, useMemo } from 'react'
import { Spinner } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CityCard } from '../components/CityCard'
import { CityFilter, LAT_MAX } from '../components/CityFilter'
import { SourceBadge } from '../components/SourceBadge'
import { useCities } from '../hooks/useCities'
import { useDebounce } from '../hooks/useDebounce'
import { City, CityFilters, SortKey } from '../modules/types'
import { cityRoute, feedRoute } from '../Routes'

const DEFAULT_FILTERS: CityFilters = { search: '', latMax: LAT_MAX, sort: 'name' }

const sorters: Record<SortKey, (a: City, b: City) => number> = {
  name: (a, b) => a.name.localeCompare(b.name, 'ru'),
  date: (a, b) => (b.published_at ?? '').localeCompare(a.published_at ?? '') || b.id - a.id,
  likes: (a, b) => b.likes_count - a.likes_count,
}

// Страница «Плитка»: фильтр + сетка карточек в 2 колонки
const CitiesPage: FC = () => {
  const navigate = useNavigate()

  // Фильтр хранится в адресной строке (?q=&lat_max=&sort=), поэтому сохраняется
  // при возврате со страницы «Подробнее» и при обновлении страницы
  const [params, setParams] = useSearchParams()
  const filters: CityFilters = {
    search: params.get('q') ?? DEFAULT_FILTERS.search,
    latMax: Number(params.get('lat_max') ?? DEFAULT_FILTERS.latMax),
    sort: (params.get('sort') as SortKey) ?? DEFAULT_FILTERS.sort,
  }

  const setFilters = (next: CityFilters) => {
    const query: Record<string, string> = {}
    if (next.search) query.q = next.search
    if (next.latMax !== DEFAULT_FILTERS.latMax) query.lat_max = String(next.latMax)
    if (next.sort !== DEFAULT_FILTERS.sort) query.sort = next.sort
    setParams(query, { replace: true })
  }

  // широта фильтруется на бэкенде (lat_max), запрос — после паузы в движении ползунка
  const debouncedLat = useDebounce(filters.latMax)
  const { cities, source, loading } = useCities(debouncedLat)

  // название и сортировка — на клиенте, пересчёт только при изменении данных или фильтра
  const visible = useMemo(() => {
    const search = filters.search.trim().toLowerCase()
    return cities
      .filter((city) => city.name.toLowerCase().includes(search))
      .sort(sorters[filters.sort])
  }, [cities, filters.search, filters.sort])

  return (
    <div className="page">
      <div className="pageHead">
        <h1 className="pageTitle">Города сети</h1>
        <SourceBadge source={source} />
      </div>

      <CityFilter
        value={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        found={visible.length}
      />

      {loading ? (
        <div className="pageLoader">
          <Spinner animation="border" />
        </div>
      ) : visible.length === 0 ? (
        <p className="emptyText">По заданному фильтру городов не найдено.</p>
      ) : (
        <div className="cityGrid">
          {visible.map((city) => (
            <CityCard
              key={city.id}
              city={city}
              onOpen={(id) => navigate(cityRoute(id))}
              onWatch={(id) => navigate(feedRoute(id))}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CitiesPage
