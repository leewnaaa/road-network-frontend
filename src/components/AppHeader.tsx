import { FC } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../Routes'
import { useAppSelector } from '../store'

export const AppHeader: FC = () => {
  const { isAuthenticated, username } = useAppSelector((state) => state.user)

  return (
    <header className="main-header">
      <Link to={ROUTES.FEED} className="logo">
        ДОРСЕТЬ
      </Link>
      <span className="header-user">{isAuthenticated ? `👤 ${username}` : 'Гость'}</span>
    </header>
  )
}
