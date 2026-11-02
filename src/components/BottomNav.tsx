import { FC } from 'react'
import { Nav } from 'react-bootstrap'
import { NavLink, useLocation } from 'react-router-dom'
import { ROUTES, ROUTE_LABELS, RouteKey } from '../Routes'

// 4 пункта: доступны только «Лента» и «Плитка». «Добавление» и «Вход»
// появятся после авторизации в следующих лабораторных.
const ITEMS: { key: RouteKey; enabled: boolean }[] = [
  { key: 'FEED', enabled: true },
  { key: 'ADD', enabled: false },
  { key: 'CITIES', enabled: true },
  { key: 'LOGIN', enabled: false },
]

export const BottomNav: FC = () => {
  const { pathname } = useLocation()

  // «Плитка» подсвечивается и на странице «Подробнее» (/cities/:id)
  const isActive = (key: RouteKey) =>
    key === 'FEED' ? pathname === ROUTES.FEED : pathname.startsWith(ROUTES[key])

  return (
    <Nav as="nav" className="bottom-nav">
      {ITEMS.map(({ key, enabled }) =>
        enabled ? (
          <Nav.Link
            key={key}
            as={NavLink}
            to={ROUTES[key]}
            end
            className={`bottom-nav-link ${isActive(key) ? 'active' : ''}`}
          >
            {ROUTE_LABELS[key]}
          </Nav.Link>
        ) : (
          <Nav.Link key={key} disabled className="bottom-nav-link" title="Доступно после входа">
            {ROUTE_LABELS[key]}
          </Nav.Link>
        ),
      )}
    </Nav>
  )
}
