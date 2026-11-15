import axios from 'axios'
import type { MessageOut, UserOut } from '../api/Api'

// Авторизация и деавторизация — только axios, без кодогенерации и thunk.
// Результат компонент сам передаёт в Redux: dispatch(loginSuccess(user)) / dispatch(logout()).
// Бэкенд ставит HttpOnly-куку session_id; через proxy Vite она сохраняется для localhost:3000.
const http = axios.create({ baseURL: '/api/users', withCredentials: true })

export const loginRequest = async (username: string, password: string): Promise<UserOut> => {
  const { data } = await http.post<UserOut>('/login', { username, password })
  return data
}

export const registerRequest = async (username: string, password: string): Promise<UserOut> => {
  const { data } = await http.post<UserOut>('', { username, password })
  return data
}

export const logoutRequest = async (): Promise<MessageOut> => {
  const { data } = await http.post<MessageOut>('/logout')
  return data
}
