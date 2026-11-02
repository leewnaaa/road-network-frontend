import { FC, useEffect, useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CityVideo } from '../components/CityVideo'
import { SourceBadge } from '../components/SourceBadge'
import { getFeed } from '../modules/citiesApi'
import { formatCoords } from '../modules/media'
import { CityFeed, DataSource } from '../modules/types'
import { cityRoute, feedRoute } from '../Routes'

// Страница «Лента»: полноэкранное видео города в стиле reels.
// ?city_id= задаёт город; без параметра показывается самый новый.
const FeedPage: FC = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const idParam = params.get('city_id')
  const cityId = idParam ? Number(idParam) : undefined

  const [city, setCity] = useState<CityFeed | null>(null)
  const [source, setSource] = useState<DataSource>('mock')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  // загрузка при монтировании и при каждом изменении city_id в адресе
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setExpanded(false)

    getFeed(cityId, false, controller.signal)
      .then((result) => {
        setCity(result.data)
        setSource(result.source)
        setLoading(false)
      })
      .catch(() => {})

    return () => controller.abort()
  }, [cityId])

  // «Дальше»: бэкенд (или mock) возвращает следующий по порядку публикации город
  const handleNext = async () => {
    if (!city) return
    const result = await getFeed(city.id, true)
    if (result.data) navigate(feedRoute(result.data.id))
  }

  if (loading) {
    return (
      <div className="pageLoader feedLoader">
        <Spinner animation="border" variant="light" />
      </div>
    )
  }

  if (!city) {
    return <p className="emptyText">Опубликованных городов пока нет.</p>
  }

  return (
    <div className="reels">
      <CityVideo src={city.video_url} poster={city.image_url} />

      <SourceBadge source={source} />

      <div className="reelsActions">
        <div className="reelsAction" title="Войдите, чтобы ставить лайки">
          <span className="reelsCircle">{city.liked_by_me ? '❤️' : '🤍'}</span>
          <span className="reelsActionLabel">{city.likes_count}</span>
        </div>
        <button type="button" className="reelsAction" onClick={handleNext}>
          <span className="reelsCircle">→</span>
          <span className="reelsActionLabel">Дальше</span>
        </button>
      </div>

      <div className="reelsOverlay">
        <h2 className="reelsTitle">{city.name}</h2>
        <p className="reelsCoords">📍 {formatCoords(city.lat, city.lon)}</p>
        {city.description && (
          <p className={`reelsDesc ${expanded ? 'reelsDescOpen' : ''}`}>
            {city.description}{' '}
          </p>
        )}
        {city.description && city.description.length > 90 && (
          <button type="button" className="reelsMore" onClick={() => setExpanded((value) => !value)}>
            {expanded ? 'Свернуть' : 'Ещё...'}
          </button>
        )}
        <Button variant="light" size="sm" className="reelsDetailBtn" onClick={() => navigate(cityRoute(city.id))}>
          Подробнее о городе
        </Button>
      </div>
    </div>
  )
}

export default FeedPage
