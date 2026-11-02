import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { ROUTES } from './Routes'
import FeedPage from './pages/FeedPage'
import CitiesPage from './pages/CitiesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Общая оболочка: шапка + страница + нижняя навигация */}
        <Route element={<AppLayout />}>
          <Route path={ROUTES.FEED} element={<FeedPage />} />
          <Route path={ROUTES.CITIES} element={<CitiesPage />} />
          {/* «Добавление» и «Вход» в этой лабораторной недоступны */}
          <Route path="*" element={<Navigate to={ROUTES.FEED} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
