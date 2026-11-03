import { FC } from 'react'
import { Button, Form } from 'react-bootstrap'
import { CityFilters } from '../modules/types'

export const LAT_MIN = 40
export const LAT_MAX = 70

interface Props {
  value: CityFilters
  onChange: (value: CityFilters) => void
  onReset: () => void
  found: number
}

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
