export const ROUTES = {
  FEED: '/',
  ADD: '/cities/add',
  CITIES: '/cities',
  LOGIN: '/login',
} as const

export type RouteKey = keyof typeof ROUTES

export const ROUTE_LABELS: Record<RouteKey, string> = {
  FEED: 'Лента',
  ADD: 'Добавление',
  CITIES: 'Плитка',
  LOGIN: 'Вход',
}

// Адрес страницы «Подробнее» для конкретного города
export const cityRoute = (id: number) => `${ROUTES.CITIES}/${id}`
// Лента, открытая на конкретном городе
export const feedRoute = (id: number) => `${ROUTES.FEED}?city_id=${id}`
