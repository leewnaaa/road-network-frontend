import { FC } from 'react'
import { Button, Form } from 'react-bootstrap'
import { CityFilters } from '../modules/types'

export const LAT_MIN = 40
export const LAT_MAX = 70

interface Props {
  value: CityFilters // текущее значение фильтра (хранится в родителе — CitiesPage)
  onChange: (value: CityFilters) => void // родитель обновляет своё состояние
  onReset: () => void
  found: number // сколько городов осталось после фильтрации
}

// Управляемый компонент фильтра по широте: своего состояния не имеет,
// значение получает через props и сообщает об изменениях через onChange.
export const CityFilter: FC<Props> = ({ value, onChange, onReset, found }) => (
  <Form className="filter-slider" onSubmit={(event) => event.preventDefault()}>
    <Form.Label>
      <span>Широта до: {value.latMax.toFixed(1)}°</span>
      <span className="filter-found">найдено: {found}</span>
    </Form.Label>
    <Form.Range
      min={LAT_MIN}
      max={LAT_MAX}
      step={0.5}
      value={value.latMax}
      onChange={(event) => onChange({ ...value, latMax: Number(event.target.value) })}
    />
    <Button className="filter-apply-btn" onClick={onReset}>
      Сбросить фильтр
    </Button>
  </Form>
)
