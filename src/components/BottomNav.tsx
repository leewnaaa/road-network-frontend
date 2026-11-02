import { FC } from 'react'
import { Nav } from 'react-bootstrap'
import { NavLink, useLocation } from 'react-router-dom'
import { ROUTES, ROUTE_LABELS, RouteKey } from '../Routes'

interface NavItem {
  key: RouteKey
  icon: string
  enabled: boolean
}

// 4 пункта: доступны только «Лента» и «Плитка». «Добавление» и «Вход»
// появятся после авторизации в следующих лабораторных.
const ITEMS: NavItem[] = [
  { key: 'FEED', icon: '▶', enabled: true },
  { key: 'ADD', icon: '＋', enabled: false },
  { key: 'CITIES', icon: '▦', enabled: true },
  { key: 'LOGIN', icon: '👤', enabled: false },
]

export const BottomNav: FC = () => {
  const { pathname } = useLocation()

  // «Плитка» подсвечивается и на странице «Подробнее» (/cities/:id)
  const isActive = (key: RouteKey) =>
    key === 'FEED' ? pathname === ROUTES.FEED : pathname.startsWith(ROUTES[key])

  return (
    <Nav as="nav" className="bottomNav" variant="underline" justify>
      {ITEMS.map(({ key, icon, enabled }) => (
        <Nav.Item key={key}>
          {enabled ? (
            <Nav.Link as={NavLink} to={ROUTES[key]} active={isActive(key)} className="bottomNavLink" end>
              <span className="bottomNavIcon">{icon}</span>
              {ROUTE_LABELS[key]}
            </Nav.Link>
          ) : (
            <Nav.Link disabled className="bottomNavLink" title="Доступно после входа">
              <span className="bottomNavIcon">{icon}</span>
              {ROUTE_LABELS[key]}
            </Nav.Link>
          )}
        </Nav.Item>
      ))}
    </Nav>
  )
}
