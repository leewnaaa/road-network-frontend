import { createSlice, isFulfilled, isPending, isRejected, isAnyOf } from '@reduxjs/toolkit'

// Счётчик выполняющихся thunk-запросов. Пока он больше 0, AppLayout показывает
// анимацию загрузки поверх экрана и блокирует кнопки пользователя.
const loadingSlice = createSlice({
  name: 'loading',
  initialState: { pending: 0 },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending(), (state) => {
        state.pending += 1
      })
      .addMatcher(isAnyOf(isFulfilled(), isRejected()), (state) => {
        state.pending = Math.max(0, state.pending - 1)
      })
  },
})

export default loadingSlice.reducer
