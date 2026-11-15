import { FC, useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CityVideo } from '../components/CityVideo'
import { formatCoords } from '../modules/media'
import { feedRoute } from '../Routes'
import { fetchFeedCity, likeCity } from '../slices/feedSlice'
import { useAppDispatch, useAppSelector } from '../store'

const FeedPage: FC = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const idParam = params.get('city_id')
  const cityId = idParam ? Number(idParam) : undefined

  const { current: city, error } = useAppSelector((state) => state.feed)
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated)
  const pending = useAppSelector((state) => state.loading.pending > 0)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setExpanded(false)
    const request = dispatch(fetchFeedCity({ cityId }))
    return () => request.abort()
  }, [dispatch, cityId, isAuthenticated])

  const handleNext = async () => {
    if (!city) return
    try {
      const result = await dispatch(fetchFeedCity({ cityId: city.id, next: true })).unwrap()
      if (result.data) navigate(feedRoute(result.data.id))
    } catch {
      // ошибка уже лежит в state.feed.error
    }
  }

  const handleLike = () => {
    if (!city || !isAuthenticated) return
    dispatch(likeCity({ cityId: city.id, like: city.liked_by_me ? 0 : 1 }))
  }

  if (!city) {
    return pending ? (
      <div className="feed-page reels-player" />
    ) : (
      <p className="page-subtitle">{error ?? 'Опубликованных городов пока нет.'}</p>
    )
  }

  return (
    <div className="feed-page">
      <div className="reels-player">
        <CityVideo src={city.video_url} poster={city.image_url} />

        {error && (
          <Alert variant="danger" className="feed-alert">
            {error}
          </Alert>
        )}

        <div className="reels-actions">
          <div className="action-item">
            <button
              type="button"
              className={`action-circle ${isAuthenticated ? '' : 'action-disabled'}`}
              onClick={handleLike}
              disabled={!isAuthenticated}
              title={isAuthenticated ? (city.liked_by_me ? 'Убрать лайк' : 'Поставить лайк') : 'Войдите, чтобы ставить лайки'}
            >
              {city.liked_by_me ? '❤️' : '🤍'}
            </button>
            <span className="action-label">{city.likes_count}</span>
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
