import { FC, FormEvent, useState } from 'react'
import { Alert, Button, Form, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { loginRequest, registerRequest } from '../modules/authApi'
import { errorMessage } from '../modules/errors'
import { ROUTES } from '../Routes'
import { loginSuccess } from '../slices/userSlice'
import { useAppDispatch } from '../store'

// Авторизация: запросы через axios (без thunk и кодогенерации),
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
    if (axios.isAxiosError(err) && err.response?.status === 409) return 'Логин уже занят'
    return errorMessage(err, 'Ошибка авторизации')
  }

  const submit = async (register: boolean) => {
    if (!username || !password) {
      setError('Введите логин и пароль')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      if (register) await registerRequest(username, password)
      const user = await loginRequest(username, password)
      dispatch(loginSuccess(user))
      navigate(ROUTES.FEED)
    } catch (err) {
      setError(authMessage(err))
      setSubmitting(false)
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit(false)
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
        <Button type="button" className="outline-btn" disabled={submitting} onClick={() => submit(true)}>
          Зарегистрироваться
        </Button>

        {error && <Alert variant="danger" className="form-error">{error}</Alert>}
      </Form>
    </div>
  )
}

export default LoginPage
