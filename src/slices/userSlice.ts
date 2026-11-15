import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UserOut } from '../api/Api'

// Состояние интерфейса после авторизации. Заполняется вручную из компонента
// после axios-запроса (без thunk и кодогенерации), см. modules/authApi.ts.
// В localStorage не сохраняется: после F5 приложение снова в состоянии гостя,
// а сессионная кука session_id остаётся в браузере (вкладка Application).
interface UserState {
  isAuthenticated: boolean
  id: number | null
  username: string
}

const initialState: UserState = {
  isAuthenticated: false,
  id: null,
  username: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<UserOut>) {
      state.isAuthenticated = true
      state.id = action.payload.id
      state.username = action.payload.username
    },
    logout() {
      return initialState
    },
  },
})

export const { loginSuccess, logout } = userSlice.actions
export default userSlice.reducer
