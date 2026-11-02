import { FC } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../Routes'

export const AppHeader: FC = () => (
  <header className="appHeader">
    <Link to={ROUTES.FEED} className="appLogo">
      ДОРСЕТЬ
    </Link>
    <span className="appRole">гость</span>
  </header>
)
