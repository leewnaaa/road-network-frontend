import { FC, useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
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

  // «Дальше»: следующий по порядку публикации город (после последнего — снова первый)
  const handleNext = async () => {
    if (!city) return
    const result = await getFeed(city.id, true)
    if (result.data) navigate(feedRoute(result.data.id))
  }

  if (loading) {
    return (
      <div className="page-loader feed-loader">
        <Spinner animation="border" variant="light" />
      </div>
    )
  }

  if (!city) {
    return <p className="page-subtitle">Опубликованных городов пока нет.</p>
  }

  return (
    <div className="feed-page">
      <div className="reels-player">
        <CityVideo src={city.video_url} poster={city.image_url} />

        <SourceBadge source={source} />

        <div className="reels-actions">
          <div className="action-item" title="Войдите, чтобы ставить лайки">
            <span className="action-circle">{city.liked_by_me ? '❤️' : '🤍'}</span>
            <span className="action-label">{city.likes_count}</span>
          </div>
          <div className="action-item">
            <button type="button" className="action-circle" onClick={() => navigate(cityRoute(city.id))}>
              i
            </button>
            <span className="action-label">Подробнее</span>
          </div>
          <div className="action-item">
            <button type="button" className="action-circle" onClick={handleNext}>
              →
            </button>
            <span className="action-label">Дальше</span>
          </div>
        </div>

        <div className="reels-overlay">
          <h2>{city.name}</h2>
          <p>📍 {formatCoords(city.lat, city.lon)}</p>
          {city.description && (
            <div className="reels-desc-wrap">
              <p className={`description-text ${expanded ? 'expanded' : ''}`}>{city.description}</p>
              {city.description.length > 90 && (
                <button type="button" className="desc-more-inline" onClick={() => setExpanded((value) => !value)}>
                  {expanded ? 'Свернуть' : 'Ещё...'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FeedPage
