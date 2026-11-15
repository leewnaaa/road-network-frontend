import { FC } from 'react'
import { Button, Form } from 'react-bootstrap'
import { LAT_MAX, LAT_MIN, resetFilters, setLatMax } from '../slices/citiesSlice'
import { useAppDispatch, useAppSelector } from '../store'

interface Props {
  found: number
}

// Фильтр по широте. Значение хранится в Redux (citiesSlice.filters), поэтому
// сохраняется при переходах между страницами и сбрасывается при выходе.
export const CityFilter: FC<Props> = ({ found }) => {
  const dispatch = useAppDispatch()
  const latMax = useAppSelector((state) => state.cities.filters.latMax)

  return (
    <Form className="filter-slider" onSubmit={(event) => event.preventDefault()}>
      <Form.Label>
        <span>Широта до: {latMax.toFixed(1)}°</span>
        <span className="filter-found">найдено: {found}</span>
      </Form.Label>
      <Form.Range
        min={LAT_MIN}
        max={LAT_MAX}
        step={0.5}
        value={latMax}
        onChange={(event) => dispatch(setLatMax(Number(event.target.value)))}
      />
      <Button className="filter-apply-btn" onClick={() => dispatch(resetFilters())}>
        Сбросить фильтр
      </Button>
    </Form>
  )
}
