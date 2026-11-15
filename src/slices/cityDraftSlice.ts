import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../api'
import type { CityOut, CityPublishIn } from '../api/Api'
import { errorMessage, isNotFound } from '../modules/errors'
import { logout } from './userSlice'

// Страница «Добавление»: шаг 1 — черновик с названием, фото и видео; шаг 2 — публикация.
interface CityDraftState {
  draft: CityOut | null
  error: string | null
}

const initialState: CityDraftState = {
  draft: null,
  error: null,
}

// GET /api/cities/draft — черновик текущего пользователя (404 — черновика нет)
export const fetchCityDraft = createAsyncThunk<CityOut | null, void, { rejectValue: string }>(
  'cityDraft/fetchCityDraft',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.cities.getDraft()
      return data
    } catch (error) {
      if (isNotFound(error)) return null
      return rejectWithValue(errorMessage(error, 'Не удалось загрузить черновик'))
    }
  },
)

// POST /api/cities (multipart/form-data) — создание черновика, файлы уходят в MinIO
export const createCityDraft = createAsyncThunk<
  CityOut,
  { name: string; photo: File; video: File },
  { rejectValue: string }
>('cityDraft/createCityDraft', async (form, { rejectWithValue }) => {
  try {
    const { data } = await api.cities.createCity(form)
    return data
  } catch (error) {
    return rejectWithValue(errorMessage(error, 'Не удалось создать черновик'))
  }
})

// PUT /api/cities/{id}/publish — публикация черновика
export const publishCity = createAsyncThunk<CityOut, { cityId: number; data: CityPublishIn }, { rejectValue: string }>(
  'cityDraft/publishCity',
  async ({ cityId, data }, { rejectWithValue }) => {
    try {
      const response = await api.cities.publishCity(cityId, data)
      return response.data
    } catch (error) {
      return rejectWithValue(errorMessage(error, 'Не удалось опубликовать город'))
    }
  },
)

const cityDraftSlice = createSlice({
  name: 'cityDraft',
  initialState,
  reducers: {
    clearDraftError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCityDraft.pending, (state) => {
        state.error = null
      })
      .addCase(fetchCityDraft.fulfilled, (state, action) => {
        state.draft = action.payload
      })
      .addCase(fetchCityDraft.rejected, (state, action) => {
        state.error = action.payload ?? 'Не удалось загрузить черновик'
      })
      .addCase(createCityDraft.pending, (state) => {
        state.error = null
      })
      .addCase(createCityDraft.fulfilled, (state, action) => {
        state.draft = action.payload
      })
      .addCase(createCityDraft.rejected, (state, action) => {
        state.error = action.payload ?? 'Не удалось создать черновик'
      })
      .addCase(publishCity.pending, (state) => {
        state.error = null
      })
      .addCase(publishCity.fulfilled, (state) => {
        state.draft = null
      })
      .addCase(publishCity.rejected, (state, action) => {
        state.error = action.payload ?? 'Не удалось опубликовать город'
      })
      .addCase(logout, () => initialState)
  },
})

export const { clearDraftError } = cityDraftSlice.actions
export default cityDraftSlice.reducer
