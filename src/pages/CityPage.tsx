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
      <div className="pageLoader">
        <Spinner animation="border" />
      </div>
    )
  }

  if (!city) {
    return (
      <div className="page">
        <p className="emptyText">Город не найден.</p>
        <Button variant="dark" onClick={() => navigate(ROUTES.CITIES)}>
          К списку городов
        </Button>
      </div>
    )
  }

  return (
    <div className="page">
      <Breadcrumb className="crumbs">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: ROUTES.CITIES }}>
          {ROUTE_LABELS.CITIES}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{city.name}</Breadcrumb.Item>
      </Breadcrumb>

      <CityImage src={city.image_url} alt={city.name} className="cityHero" />

      <div className="pageHead">
        <h1 className="pageTitle">{city.name}</h1>
        <SourceBadge source={source} />
      </div>

      {city.description && <p className="cityDescription">{city.description}</p>}

      <ListGroup className="cityFacts">
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
          <b>❤️ {city.likes_count}</b>
        </ListGroup.Item>
      </ListGroup>

      <div className="cityButtons">
        <Button variant="dark" onClick={() => navigate(feedRoute(city.id))}>
          ▶ Смотреть в ленте
        </Button>
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </div>
    </div>
  )
}

export default CityPage
