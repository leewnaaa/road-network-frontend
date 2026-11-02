import { FC } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../Routes'

export const AppHeader: FC = () => (
  <header className="main-header">
    <Link to={ROUTES.FEED} className="logo">
      ДОРСЕТЬ
    </Link>
  </header>
)
