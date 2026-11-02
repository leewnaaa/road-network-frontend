import { FC } from 'react'
import { Card } from 'react-bootstrap'
import { City } from '../modules/types'
import { formatCoords } from '../modules/media'
import { CityImage } from './CityImage'

interface Props {
  city: City // данные карточки
  onOpen: (id: number) => void // переход на страницу «Подробнее»
}

// Карточка города для страницы «Плитка» (вёрстка как в ЛР1). Данные и обработчик приходят через props.
export const CityCard: FC<Props> = ({ city, onOpen }) => (
  <Card className="card" onClick={() => onOpen(city.id)}>
    <CityImage src={city.image_url} alt={city.name} />
    <Card.Body className="card-body">
      <Card.Title as="h3">{city.name}</Card.Title>
      <p className="card-coords">📍 {formatCoords(city.lat, city.lon)}</p>
      <p className="card-likes">❤️ {city.likes_count}</p>
      <span className="cost-badge">Подробнее</span>
    </Card.Body>
  </Card>
)
