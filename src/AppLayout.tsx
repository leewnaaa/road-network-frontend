import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { AppHeader } from './components/AppHeader'
import { BottomNav } from './components/BottomNav'
import { LoadingOverlay } from './components/LoadingOverlay'

// Оболочка приложения в виде экрана телефона (как в ЛР1). Данные страниц — в Redux.
export const AppLayout: FC = () => (
  <div className="app-container">
    <AppHeader />
    <main className="app-content">
      <Outlet />
    </main>
    <BottomNav />
    <LoadingOverlay />
  </div>
)
