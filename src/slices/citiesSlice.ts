import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { api } from '../api'
import { errorMessage, isBackendDown } from '../modules/errors'
import { mockCityList } from '../modules/mockQueries'
import { City, CityFilters, DataSource } from '../modules/types'
import type { RootState } from '../store'
import { logout } from './userSlice'
import { likeCity } from './feedSlice'

export const LAT_MIN = 40
export const LAT_MAX = 70

const DEFAULT_FILTERS: CityFilters = { latMax: LAT_MAX }

interface CitiesState {
  filters: CityFilters // фильтр пользователя на странице «Плитка»
  list: City[]
  source: DataSource
  error: string | null
}

const initialState: CitiesState = {
  filters: DEFAULT_FILTERS,
  list: [],
  source: 'api',
  error: null,
}

// GET /api/cities?lat_max= — список городов с фильтром из Redux.
// Если бэкенд недоступен и пользователь гость — берём коллекцию mock-объектов.
export const fetchCities = createAsyncThunk<
  { data: City[]; source: DataSource },
  void,
  { state: RootState; rejectValue: string }
>('cities/fetchCities', async (_, { getState, signal, rejectWithValue }) => {
  const { cities, user } = getState()
  const latMax = cities.filters.latMax < LAT_MAX ? cities.filters.latMax : undefined
  try {
    const { data } = await api.cities.listCities({ lat_max: latMax }, { signal })
    return { data, source: 'api' as const }
  } catch (error) {
    if (!user.isAuthenticated && isBackendDown(error)) {
      return { data: mockCityList(latMax), source: 'mock' as const }
    }
    return rejectWithValue(errorMessage(error, 'Не удалось загрузить города'))
  }
})

// DELETE /api/cities/{id} — мягкое удаление своего города
export const deleteCity = createAsyncThunk<number, number, { rejectValue: string }>(
  'cities/deleteCity',
  async (cityId, { rejectWithValue }) => {
    try {
      await api.cities.deleteCity(cityId)
      return cityId
    } catch (error) {
      return rejectWithValue(errorMessage(error, 'Не удалось удалить город'))
    }
  },
)

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    setLatMax(state, action: PayloadAction<number>) {
      state.filters.latMax = action.payload
    },
    resetFilters(state) {
      state.filters = DEFAULT_FILTERS
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.error = null
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.list = action.payload.data
        state.source = action.payload.source
      })
      .addCase(fetchCities.rejected, (state, action) => {
        if (action.meta.aborted) return
        state.error = action.payload ?? 'Не удалось загрузить города'
      })
      .addCase(deleteCity.fulfilled, (state, action) => {
        state.list = state.list.filter((city) => city.id !== action.payload)
      })
      .addCase(deleteCity.rejected, (state, action) => {
        state.error = action.payload ?? 'Не удалось удалить город'
      })
      // лайк в ленте обновляет счётчик и на плитке
      .addCase(likeCity.fulfilled, (state, action) => {
        const city = state.list.find((item) => item.id === action.payload.city_id)
        if (city) city.likes_count = action.payload.likes_count
      })
      // при выходе фильтр пользователя сбрасывается
      .addCase(logout, (state) => {
        state.filters = DEFAULT_FILTERS
        state.error = null
      })
  },
})

export const { setLatMax, resetFilters } = citiesSlice.actions
export default citiesSlice.reducer
