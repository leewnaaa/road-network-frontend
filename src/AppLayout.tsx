import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { AppHeader } from './components/AppHeader'
import { BottomNav } from './components/BottomNav'

// Оболочка приложения под экран телефона (390px). Состояние не хранит:
// каждая страница сама загружает свои данные (Context и Redux не используются).
export const AppLayout: FC = () => (
  <div className="appShell">
    <AppHeader />
    <main className="appContent">
      <Outlet />
    </main>
    <BottomNav />
  </div>
)
