import { FC } from 'react'
import { Badge } from 'react-bootstrap'
import { DataSource } from '../modules/types'

interface Props {
  source: DataSource
}

// Показывает, откуда взяты данные: из mock-коллекции или с бэкенда
export const SourceBadge: FC<Props> = ({ source }) => (
  <Badge bg="" className={`source-badge ${source === 'api' ? 'source-api' : 'source-mock'}`}>
    {source === 'api' ? 'данные: API' : 'данные: mock'}
  </Badge>
)
