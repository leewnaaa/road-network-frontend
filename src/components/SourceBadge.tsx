import { FC } from 'react'
import { Badge } from 'react-bootstrap'
import { DataSource } from '../modules/types'

interface Props {
  source: DataSource
}

// Показывает, откуда взяты данные: с бэкенда или из mock-коллекции
export const SourceBadge: FC<Props> = ({ source }) =>
  source === 'api' ? (
    <Badge bg="success" className="sourceBadge">данные: API</Badge>
  ) : (
    <Badge bg="warning" text="dark" className="sourceBadge">данные: mock</Badge>
  )
