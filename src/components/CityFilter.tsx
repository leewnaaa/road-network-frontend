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
  <Form className="cityFilter" onSubmit={(event) => event.preventDefault()}>
    <Form.Control
      type="search"
      placeholder="Поиск по названию города"
      value={value.search}
      onChange={(event) => onChange({ ...value, search: event.target.value })}
    />

    <Form.Group>
      <Form.Label className="cityFilterLabel">
        Широта до: <b>{value.latMax.toFixed(1)}°</b>
      </Form.Label>
      <Form.Range
        min={LAT_MIN}
        max={LAT_MAX}
        step={0.5}
        value={value.latMax}
        onChange={(event) => onChange({ ...value, latMax: Number(event.target.value) })}
      />
    </Form.Group>

    <div className="cityFilterRow">
      <Form.Select
        size="sm"
        value={value.sort}
        onChange={(event) => onChange({ ...value, sort: event.target.value as SortKey })}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
      <Button size="sm" variant="outline-secondary" onClick={onReset}>
        Сбросить
      </Button>
    </div>

    <div className="cityFilterFound">Найдено городов: {found}</div>
  </Form>
)
