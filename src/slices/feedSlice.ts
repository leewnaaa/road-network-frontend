import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../api'
import type { LikeOut } from '../api/Api'
import { errorMessage, isBackendDown, isNotFound } from '../modules/errors'
import { mockCityFeed } from '../modules/mockQueries'
import { CityFeed, DataSource } from '../modules/types'
import type { RootState } from '../store'
import { logout } from './userSlice'

interface FeedState {
  current: CityFeed | null // город, показанный в ленте
  source: DataSource
  error: string | null
}

const initialState: FeedState = {
  current: null,
  source: 'api',
  error: null,
}

// GET /api/cities/feed, /api/cities/feed/{id}, /api/cities/feed/{id}?next=true
export const fetchFeedCity = createAsyncThunk<
  { data: CityFeed | null; source: DataSource },
  { cityId?: number; next?: boolean },
  { state: RootState; rejectValue: string }
>('feed/fetchFeedCity', async ({ cityId, next = false }, { getState, signal, rejectWithValue }) => {
  try {
    const { data } =
      cityId === undefined
        ? await api.cities.feedFirst({ signal })
        : await api.cities.feedById(cityId, next ? { next: true } : undefined, { signal })
    return { data, source: 'api' as const }
  } catch (error) {
    if (isNotFound(error)) return { data: null, source: 'api' as const }
    if (!getState().user.isAuthenticated && isBackendDown(error)) {
      return { data: mockCityFeed(cityId, next), source: 'mock' as const }
    }
    return rejectWithValue(errorMessage(error, 'Не удалось загрузить ленту'))
  }
})

// POST /api/cities/{id}/like — поставить (1) или снять (0) лайк
export const likeCity = createAsyncThunk<LikeOut, { cityId: number; like: 0 | 1 }, { rejectValue: string }>(
  'feed/likeCity',
  async ({ cityId, like }, { rejectWithValue }) => {
    try {
      const { data } = await api.cities.likeCity(cityId, { like })
      return data
    } catch (error) {
      return rejectWithValue(errorMessage(error, 'Не удалось поставить лайк'))
    }
  },
)

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedCity.pending, (state) => {
        state.error = null
      })
      .addCase(fetchFeedCity.fulfilled, (state, action) => {
        state.current = action.payload.data
        state.source = action.payload.source
      })
      .addCase(fetchFeedCity.rejected, (state, action) => {
        if (action.meta.aborted) return
        state.error = action.payload ?? 'Не удалось загрузить ленту'
      })
      .addCase(likeCity.fulfilled, (state, action) => {
        if (state.current?.id === action.payload.city_id) {
          state.current.likes_count = action.payload.likes_count
          state.current.liked_by_me = action.payload.like
        }
      })
      .addCase(likeCity.rejected, (state, action) => {
        state.error = action.payload ?? 'Не удалось поставить лайк'
      })
      .addCase(logout, (state) => {
        if (state.current) state.current.liked_by_me = 0
      })
  },
})

export default feedSlice.reducer
