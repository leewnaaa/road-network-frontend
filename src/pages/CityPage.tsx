import { FC, useEffect, useState } from 'react'
import { Breadcrumb, Button, ListGroup, Spinner } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CityImage } from '../components/CityImage'
import { SourceBadge } from '../components/SourceBadge'
import { getCityById } from '../modules/citiesApi'
import { formatCoords, formatDate } from '../modules/media'
import { CityFeed, DataSource } from '../modules/types'
import { ROUTES, ROUTE_LABELS, feedRoute } from '../Routes'

// Страница «Подробнее»: фото, координаты, описание и переход в ленту
const CityPage: FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [city, setCity] = useState<CityFeed | null>(null)
  const [source, setSource] = useState<DataSource>('mock')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    getCityById(Number(id), controller.signal)
      .then((result) => {
        setCity(result.data)
        setSource(result.source)
        setLoading(false)
      })
      .catch(() => {})

    return () => controller.abort()
  }, [id])

  if (loading) {
    return (
      <div className="page-loader">
        <Spinner animation="border" />
      </div>
    )
  }

  if (!city) {
    return (
      <div className="detail-page">
        <p className="page-subtitle">Город не найден.</p>
        <Button className="filter-apply-btn" onClick={() => navigate(ROUTES.CITIES)}>
          К списку городов
        </Button>
      </div>
    )
  }

  return (
    <div className="detail-page">
      <Breadcrumb className="crumbs">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: ROUTES.CITIES }}>
          {ROUTE_LABELS.CITIES}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{city.name}</Breadcrumb.Item>
      </Breadcrumb>

      <CityImage src={city.image_url} alt={city.name} className="detail-image" />

      <div className="page-head detail-head">
        <h1 className="page-title">{city.name}</h1>
        <SourceBadge source={source} />
      </div>

      {city.description && <p className="detail-description">{city.description}</p>}

      <ListGroup className="detail-facts">
        <ListGroup.Item>
          <span>Координаты</span>
          <b>{formatCoords(city.lat, city.lon)}</b>
        </ListGroup.Item>
        {city.published_at && (
          <ListGroup.Item>
            <span>Опубликован</span>
            <b>{formatDate(city.published_at)}</b>
          </ListGroup.Item>
        )}
        <ListGroup.Item>
          <span>Лайки</span>
          <b className="detail-likes">❤️ {city.likes_count}</b>
        </ListGroup.Item>
      </ListGroup>

      <div className="detail-buttons">
        <Button className="filter-apply-btn" onClick={() => navigate(feedRoute(city.id))}>
          Смотреть в ленте
        </Button>
        <Button className="outline-btn" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </div>
    </div>
  )
}

export default CityPage
