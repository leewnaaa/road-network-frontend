import { FC } from 'react'
import { Button, Card } from 'react-bootstrap'
import { City } from '../modules/types'
import { formatCoords } from '../modules/media'
import { CityImage } from './CityImage'

interface Props {
  city: City
  onOpen: (id: number) => void
  onDelete?: (id: number) => void // есть только у своих городов авторизованного пользователя
}

export const CityCard: FC<Props> = ({ city, onOpen, onDelete }) => (
  <Card className="card" onClick={() => onOpen(city.id)}>
    <CityImage src={city.image_url} alt={city.name} />
    <Card.Body className="card-body">
      <Card.Title as="h3">{city.name}</Card.Title>
      <p className="card-coords">📍 {formatCoords(city.lat, city.lon)}</p>
      <p className="card-likes">❤️ {city.likes_count}</p>
      <div className="card-actions">
        <span className="cost-badge">Подробнее</span>
        {onDelete && (
          <Button
            className="delete-btn"
            title="Удалить город"
            onClick={(event) => {
              event.stopPropagation()
              onDelete(city.id)
            }}
          >
            Удалить
          </Button>
        )}
      </div>
    </Card.Body>
  </Card>
)
