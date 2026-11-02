import { FC } from 'react'
import { Button, Card } from 'react-bootstrap'
import { City } from '../modules/types'
import { formatCoords } from '../modules/media'
import { CityImage } from './CityImage'

interface Props {
  city: City
  onOpen: (id: number) => void // «Подробнее» — страница города
  onWatch: (id: number) => void // «В ленте» — лента на этом городе
}

// Карточка города для страницы «Плитка». Данные и обработчики приходят через props.
export const CityCard: FC<Props> = ({ city, onOpen, onWatch }) => (
  <Card className="cityCard">
    <div className="cityCardImageWrap" onClick={() => onOpen(city.id)}>
      <CityImage src={city.image_url} alt={city.name} className="cityCardImage" />
    </div>
    <Card.Body className="cityCardBody">
      <Card.Title className="cityCardTitle">{city.name}</Card.Title>
      <Card.Text className="cityCardMeta">📍 {formatCoords(city.lat, city.lon)}</Card.Text>
      <Card.Text className="cityCardMeta">❤️ {city.likes_count}</Card.Text>
      <div className="cityCardActions">
        <Button size="sm" variant="dark" onClick={() => onOpen(city.id)}>
          Подробнее
        </Button>
        <Button size="sm" variant="outline-dark" onClick={() => onWatch(city.id)} title="Открыть в ленте">
          ▶
        </Button>
      </div>
    </Card.Body>
  </Card>
)
