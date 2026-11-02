import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { AppHeader } from './components/AppHeader'
import { BottomNav } from './components/BottomNav'

// Оболочка приложения в виде экрана телефона (как в ЛР1). Состояние не хранит:
// каждая страница сама загружает свои данные (Context и Redux не используются).
export const AppLayout: FC = () => (
  <div className="app-container">
    <AppHeader />
    <main className="app-content">
      <Outlet />
    </main>
    <BottomNav />
  </div>
)
