import { FC, ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { ROUTES } from './Routes'
import { useAppSelector } from './store'
import FeedPage from './pages/FeedPage'
import CitiesPage from './pages/CitiesPage'
import AddCityPage from './pages/AddCityPage'
import LoginPage from './pages/LoginPage'

// «Добавление» — только для авторизованного пользователя, «Вход» — только для гостя
const OnlyUser: FC<{ children: ReactNode }> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />
}

const OnlyGuest: FC<{ children: ReactNode }> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated)
  return isAuthenticated ? <Navigate to={ROUTES.FEED} replace /> : <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.FEED} element={<FeedPage />} />
          <Route path={ROUTES.CITIES} element={<CitiesPage />} />
          <Route
            path={ROUTES.ADD}
            element={
              <OnlyUser>
                <AddCityPage />
              </OnlyUser>
            }
          />
          <Route
            path={ROUTES.LOGIN}
            element={
              <OnlyGuest>
                <LoginPage />
              </OnlyGuest>
            }
          />
          <Route path="*" element={<Navigate to={ROUTES.FEED} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
