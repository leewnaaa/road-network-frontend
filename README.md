# ДОРСЕТЬ — фронтенд (лабораторная 6)

SPA на **React + TypeScript + Vite + React-Bootstrap** с менеджером состояний **Redux Toolkit**, запросами через **axios** и клиентом API, сгенерированным из **Swagger** бэкенда. Тема — строительство дорожной сети, услуги — города с координатами.

Бэкенд: [road-network-backend](https://github.com/leewnaaa/road-network-backend) (FastAPI, ветка `feature/frontend-codegen`).

## Что добавлено в ЛР6

| Требование | Где сделано |
|---|---|
| Redux Toolkit: фильтр услуг в store | `src/slices/citiesSlice.ts` (`filters.latMax`), `src/components/CityFilter.tsx` |
| Данные карточек с бэкенда, фильтр в запросе | thunk `fetchCities` → `GET /api/cities?lat_max=` |
| Mock-объекты при недоступном бэкенде (только гость) | `fetchCities`, `fetchFeedCity` → `src/modules/mockQueries.ts` |
| Кодогенерация из Swagger, axios | `scripts/generate-api.mjs`, `src/api/Api.ts`, `src/api/index.ts` |
| redux-thunk для методов домена услуг | `src/slices/citiesSlice.ts`, `feedSlice.ts`, `cityDraftSlice.ts` |
| Анимация загрузки, блокирующая кнопки | `src/slices/loadingSlice.ts` + `src/components/LoadingOverlay.tsx` |
| Страница авторизации | `src/pages/LoginPage.tsx` (`/login`) |
| Вход/выход только через axios, состояние в Redux вручную | `src/pages/LoginPage.tsx`, `src/components/BottomNav.tsx`, `src/slices/userSlice.ts` (`loginSuccess`, `logout`) |
| Вход ↔ Выход в меню, сброс фильтра при выходе | `src/components/BottomNav.tsx`, `citiesSlice` → `addCase(logout)` |
| Страница добавления услуги | `src/pages/AddCityPage.tsx` (`/cities/add`) |
| Кнопки удаления и лайков | «Удалить» на карточке своего города (`is_mine = 1`), ❤️ в ленте |
| CORS: proxy Vite, второй маршрут для S3 | `vite.config.ts`: `/api` → `:8000`, `/minio` → `:9000` |

## Запуск

```bash
# бэкенд (в road-network-backend, ветка feature/frontend-codegen)
docker compose up -d
alembic upgrade head
python main.py               # http://127.0.0.1:8000/docs

# фронтенд
npm install
npm run generate-api         # перегенерировать src/api/Api.ts из http://127.0.0.1:8000/openapi.json
npm run dev                  # http://localhost:3000
```

Без запущенного бэкенда фронтенд тоже работает: гость видит ленту и плитку из коллекции mock-объектов.

## Проксирование (CORS)

Браузер ходит только на `http://localhost:3000`, Vite пересылает запросы дальше:

| Маршрут фронтенда | Куда уходит | Для чего |
|---|---|---|
| `/api/...` | `http://127.0.0.1:8000/api/...` | REST API FastAPI |
| `/minio/cities/<файл>` | `http://127.0.0.1:9000/cities/<файл>` | фото и видео из MinIO (S3) |

Бэкенд отдаёт ссылки вида `http://localhost:9000/cities/<uuid>.jpg`; функция `toProxyUrl` (`src/modules/media.ts`) превращает их в `/minio/cities/<uuid>.jpg`. Во вкладке **Network** видны запросы `/api/cities?lat_max=...` и `/minio/cities/...`.

Сессионная кука `session_id` (HttpOnly) ставится на `localhost:3000`, поэтому браузер сам отправляет её во все запросы `/api`.

## Кодогенерация

`scripts/generate-api.mjs` запускает `swagger-typescript-api` с `httpClientType: 'axios'` и `moduleNameIndex: 1`. В бэкенде `operationId` равен имени функции-обработчика (`generate_unique_id_function=lambda route: route.name` в `main.py`), поэтому методы названы по теме:

| Метод клиента | Запрос | Thunk |
|---|---|---|
| `api.cities.listCities({ lat_max })` | `GET /api/cities` | `fetchCities` |
| `api.cities.feedFirst()` | `GET /api/cities/feed` | `fetchFeedCity` |
| `api.cities.feedById(id, { next })` | `GET /api/cities/feed/{id}` | `fetchFeedCity` |
| `api.cities.likeCity(id, { like })` | `POST /api/cities/{id}/like` | `likeCity` |
| `api.cities.deleteCity(id)` | `DELETE /api/cities/{id}` | `deleteCity` |
| `api.cities.getDraft()` | `GET /api/cities/draft` | `fetchCityDraft` |
| `api.cities.createCity({ name, photo, video })` | `POST /api/cities` (multipart) | `createCityDraft` |
| `api.cities.publishCity(id, data)` | `PUT /api/cities/{id}/publish` | `publishCity` |

Авторизация — без кодогенерации и thunk: `axios.post` вызывается прямо в обработчике кнопки, ответ вручную передаётся в Redux:

| Кнопка | Где | Запрос | Затем |
|---|---|---|---|
| «Войти» | `LoginPage.tsx`, `handleSubmit` | `axios.post('/api/users/login', { username, password })` | `dispatch(loginSuccess(data))`, переход в ленту |
| «Выход» | `BottomNav.tsx`, `handleLogout` | `axios.post('/api/users/logout')` | `dispatch(logout())` — сброс пользователя и фильтра |

## Состояние Redux

```
store
├── cities     { filters: { latMax }, list: City[], source: 'api'|'mock', error }
├── feed       { current: CityFeed|null, source, error }
├── cityDraft  { draft: CityOut|null, error }
├── user       { isAuthenticated, id, username }
└── loading    { pending }   // число выполняющихся thunk
```

| Слайс | reducers (синхронные) | thunk (extraReducers) |
|---|---|---|
| `cities` | `setLatMax`, `resetFilters` | `fetchCities`, `deleteCity`; реагирует на `likeCity.fulfilled` и `logout` (сброс фильтра) |
| `feed` | — | `fetchFeedCity`, `likeCity`; на `logout` снимает «мой лайк» |
| `cityDraft` | `clearDraftError` | `fetchCityDraft`, `createCityDraft`, `publishCity`; на `logout` очищается |
| `user` | `loginSuccess`, `logout` | — (вход/выход только axios) |
| `loading` | — | `addMatcher(isPending())` +1, `addMatcher(isAnyOf(isFulfilled(), isRejected()))` −1 |

`user` не сохраняется в localStorage: после **F5** интерфейс снова гостевой, а кука `session_id` остаётся во вкладке **Application → Cookies**. С ней в Insomnia/Postman `GET /api/cities` возвращает `is_mine: 1` у своих городов — это признак для кнопки удаления.

Для отладки подходит расширение браузера **Redux DevTools** — `configureStore` подключает его автоматически.

## Страницы

| № | Пункт меню | Адрес | Гость | Пользователь |
|---|---|---|---|---|
| 1 | Лента | `/`, `/?city_id=<id>` | просмотр, «Дальше» | + лайк ❤️ / снятие лайка |
| 2 | Добавление | `/cities/add` | недоступна (→ `/login`) | шаг 1: название, фото, видео → черновик; шаг 2: описание, координаты → публикация |
| 3 | Плитка | `/cities` | список с фильтром по широте | + «Удалить» на своих карточках |
| 4 | Вход / Выход | `/login` | форма входа | в меню «Выход»: сброс состояния и фильтра |

## Структура

```
scripts/generate-api.mjs        кодогенерация клиента из Swagger
src/
  main.tsx                      Provider store
  store.ts                      configureStore, RootState, useAppDispatch/useAppSelector
  App.tsx                       роутинг, доступ к «Добавлению» и «Входу»
  AppLayout.tsx                 шапка + страница + меню + анимация загрузки
  api/Api.ts                    сгенерированный клиент (axios)
  api/index.ts                  экземпляр api
  slices/                       citiesSlice, feedSlice, cityDraftSlice, userSlice, loadingSlice
  components/                   AppHeader, BottomNav, CityCard, CityFilter, CityImage, CityVideo, LoadingOverlay
  pages/                        FeedPage, CitiesPage, AddCityPage, LoginPage
  modules/
    errors.ts                   разбор ошибок axios, «бэкенд недоступен»
    media.ts                    файлы по умолчанию, переписывание ссылок MinIO на /minio
    mock.ts, mockQueries.ts     коллекция mock-объектов и запросы к ней
    types.ts                    City, CityFeed (на основе сгенерированных типов)
  hooks/useDebounce.ts          задержка запроса при движении ползунка
```
