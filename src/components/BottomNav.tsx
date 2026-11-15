import { FC, useState } from 'react'
import { Nav } from 'react-bootstrap'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { logoutRequest } from '../modules/authApi'
import { ROUTES, ROUTE_LABELS, RouteKey } from '../Routes'
import { logout } from '../slices/userSlice'
import { useAppDispatch, useAppSelector } from '../store'

export const BottomNav: FC = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated)
  const [leaving, setLeaving] = useState(false)

  const isActive = (key: RouteKey) => pathname === ROUTES[key]

  // Выход: axios-запрос без thunk, затем состояние вручную передаётся в Redux.
  // Сброс фильтра пользователя — в citiesSlice по действию logout.
  const handleLogout = async () => {
    setLeaving(true)
    try {
      await logoutRequest()
    } catch {
      // сессия уже истекла или сервер недоступен — интерфейс всё равно возвращаем в состояние гостя
    }
    dispatch(logout())
    setLeaving(false)
    navigate(ROUTES.FEED)
  }

  const link = (key: RouteKey) => (
    <Nav.Link key={key} as={NavLink} to={ROUTES[key]} end className={`bottom-nav-link ${isActive(key) ? 'active' : ''}`}>
      {ROUTE_LABELS[key]}
    </Nav.Link>
  )

  return (
    <Nav as="nav" className="bottom-nav">
      {link('FEED')}
      {isAuthenticated ? (
        link('ADD')
      ) : (
        <Nav.Link disabled className="bottom-nav-link" title="Доступно после входа">
          {ROUTE_LABELS.ADD}
        </Nav.Link>
      )}
      {link('CITIES')}
      {isAuthenticated ? (
        <Nav.Link as="button" type="button" className="bottom-nav-link" onClick={handleLogout} disabled={leaving}>
          Выход
        </Nav.Link>
      ) : (
        link('LOGIN')
      )}
    </Nav>
  )
}
