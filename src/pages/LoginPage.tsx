import { FC, FormEvent, useState } from 'react'
import { Alert, Button, Form, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import type { UserOut } from '../api/Api'
import { errorMessage } from '../modules/errors'
import { ROUTES } from '../Routes'
import { loginSuccess } from '../slices/userSlice'
import { useAppDispatch } from '../store'

// Авторизация: запрос через axios прямо в обработчике кнопки «Войти» (без thunk и кодогенерации),
// ответ вручную передаётся в Redux действием loginSuccess.
const LoginPage: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const authMessage = (err: unknown) => {
    if (axios.isAxiosError(err) && err.response?.status === 401) return 'Неверный логин или пароль'
    return errorMessage(err, 'Ошибка авторизации')
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!username || !password) {
      setError('Введите логин и пароль')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      // AJAX-запрос авторизации: бэкенд проверяет пароль и ставит HttpOnly-куку session_id
      const { data } = await axios.post<UserOut>('/api/users/login', { username, password })
      // состояние интерфейса после авторизации вручную передаём в Redux
      dispatch(loginSuccess(data))
      navigate(ROUTES.FEED)
    } catch (err) {
      setError(authMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <div className="form-page">
      <h1 className="page-title">Вход</h1>
      <p className="page-hint">Войдите, чтобы добавлять города и ставить лайки.</p>

      <Form onSubmit={handleSubmit} className="app-form">
        <Form.Group controlId="username">
          <Form.Label>Логин</Form.Label>
          <Form.Control
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="creator1"
            autoComplete="username"
            disabled={submitting}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            disabled={submitting}
          />
        </Form.Group>

        <Button type="submit" className="filter-apply-btn" disabled={submitting}>
          {submitting ? <Spinner animation="border" size="sm" /> : 'Войти'}
        </Button>

        {error && <Alert variant="danger" className="form-error">{error}</Alert>}
      </Form>
    </div>
  )
}

export default LoginPage
