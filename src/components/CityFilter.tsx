import { FC } from 'react'
import { Button, Form } from 'react-bootstrap'
import { CityFilters, SortKey } from '../modules/types'

export const LAT_MIN = 40
export const LAT_MAX = 70

interface Props {
  value: CityFilters // текущие значения фильтра (хранятся в родителе — CitiesPage)
  onChange: (value: CityFilters) => void // родитель обновляет своё состояние
  onReset: () => void
  found: number // сколько городов осталось после фильтрации
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'name', label: 'По названию (А–Я)' },
  { value: 'date', label: 'Сначала новые' },
  { value: 'likes', label: 'По числу лайков' },
]

// Управляемый компонент фильтра: своего состояния не имеет,
// всё получает через props и сообщает об изменениях через onChange.
export const CityFilter: FC<Props> = ({ value, onChange, onReset, found }) => (
  <Form className="filter-form" onSubmit={(event) => event.preventDefault()}>
    <div className="filters">
      <Form.Select
        value={value.sort}
        onChange={(event) => onChange({ ...value, sort: event.target.value as SortKey })}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
    </div>

    <div className="filters">
      <Form.Control
        type="search"
        placeholder="Поиск по названию"
        value={value.search}
        onChange={(event) => onChange({ ...value, search: event.target.value })}
      />
    </div>

    <div className="filter-slider">
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
    </div>
  </Form>
)
