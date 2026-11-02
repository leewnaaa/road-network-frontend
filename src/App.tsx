import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { ROUTES } from './Routes'
import FeedPage from './pages/FeedPage'
import CitiesPage from './pages/CitiesPage'
import CityPage from './pages/CityPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Общая оболочка: шапка + страница + нижняя навигация */}
        <Route element={<AppLayout />}>
          <Route path={ROUTES.FEED} element={<FeedPage />} />
          <Route path={ROUTES.CITIES} element={<CitiesPage />} />
          <Route path={`${ROUTES.CITIES}/:id`} element={<CityPage />} />
          {/* «Добавление» и «Вход» в этой лабораторной недоступны */}
          <Route path="*" element={<Navigate to={ROUTES.FEED} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
