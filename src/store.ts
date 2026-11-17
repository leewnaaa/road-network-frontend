import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import citiesReducer from './slices/citiesSlice'
import feedReducer from './slices/feedSlice'
import cityDraftReducer from './slices/cityDraftSlice'
import userReducer from './slices/userSlice'
import loadingReducer from './slices/loadingSlice'

export const store = configureStore({
  reducer: {
    cities: citiesReducer, // фильтр и список городов (плитка)
    feed: feedReducer, // текущий город ленты, лайк
    cityDraft: cityDraftReducer, // черновик на странице «Добавление»
    user: userReducer, // гость / авторизованный пользователь
    loading: loadingReducer, // число выполняющихся thunk-запросов (анимация загрузки)
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
