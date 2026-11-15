import { FC, FormEvent, useEffect, useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { CityImage } from '../components/CityImage'
import { feedRoute } from '../Routes'
import { createCityDraft, fetchCityDraft, publishCity } from '../slices/cityDraftSlice'
import { useAppDispatch, useAppSelector } from '../store'

// Страница «Добавление»: шаг 1 — черновик (название, фото, видео), шаг 2 — публикация.
const AddCityPage: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { draft, error } = useAppSelector((state) => state.cityDraft)
  const pending = useAppSelector((state) => state.loading.pending > 0)

  const [name, setName] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)

  const [description, setDescription] = useState('')
  const [lat, setLat] = useState('')
  const [lon, setLon] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    const request = dispatch(fetchCityDraft())
    return () => request.abort()
  }, [dispatch])

  const handleCreate = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !photo || !video) {
      setFormError('Укажите название, фото и видео')
      return
    }
    setFormError(null)
    dispatch(createCityDraft({ name: name.trim(), photo, video }))
  }

  const handlePublish = async (event: FormEvent) => {
    event.preventDefault()
    if (!draft) return
    const latNum = Number(lat.replace(',', '.'))
    const lonNum = Number(lon.replace(',', '.'))
    if (!description.trim() || !lat || !lon || Number.isNaN(latNum) || Number.isNaN(lonNum)) {
      setFormError('Заполните описание и координаты')
      return
    }
    setFormError(null)
    try {
      const city = await dispatch(
        publishCity({ cityId: draft.id, data: { description: description.trim(), lat: latNum, lon: lonNum } }),
      ).unwrap()
      navigate(feedRoute(city.id))
    } catch {
      // текст ошибки в state.cityDraft.error
    }
  }

  const message = formError ?? error

  return (
    <div className="form-page">
      <h1 className="page-title">Добавление города</h1>
      <p className="page-hint">{draft ? 'Шаг 2 из 2: описание и координаты' : 'Шаг 1 из 2: название, фото и видео'}</p>

      {!draft ? (
        <Form onSubmit={handleCreate} className="app-form">
          <Form.Group controlId="city-name">
            <Form.Label>Название</Form.Label>
            <Form.Control value={name} onChange={(event) => setName(event.target.value)} placeholder="Ростов-на-Дону" />
          </Form.Group>
          <Form.Group controlId="city-photo">
            <Form.Label>Фото (jpeg, png, webp до 5 МБ)</Form.Label>
            <Form.Control
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => setPhoto((event.target as HTMLInputElement).files?.[0] ?? null)}
            />
          </Form.Group>
          <Form.Group controlId="city-video">
            <Form.Label>Видео (mp4, webm до 50 МБ)</Form.Label>
            <Form.Control
              type="file"
              accept="video/mp4,video/webm"
              onChange={(event) => setVideo((event.target as HTMLInputElement).files?.[0] ?? null)}
            />
          </Form.Group>
          <Button type="submit" className="filter-apply-btn" disabled={pending}>
            Далее
          </Button>
        </Form>
      ) : (
        <Form onSubmit={handlePublish} className="app-form">
          <div className="draft-preview">
            <CityImage src={draft.image_url} alt={draft.name} />
            <strong>{draft.name}</strong>
          </div>
          <Form.Group controlId="city-description">
            <Form.Label>Описание</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              maxLength={500}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Form.Group>
          <div className="form-row-2">
            <Form.Group controlId="city-lat">
              <Form.Label>Широта</Form.Label>
              <Form.Control inputMode="decimal" value={lat} onChange={(event) => setLat(event.target.value)} placeholder="47.2357" />
            </Form.Group>
            <Form.Group controlId="city-lon">
              <Form.Label>Долгота</Form.Label>
              <Form.Control inputMode="decimal" value={lon} onChange={(event) => setLon(event.target.value)} placeholder="39.7015" />
            </Form.Group>
          </div>
          <Button type="submit" className="filter-apply-btn" disabled={pending}>
            Опубликовать
          </Button>
        </Form>
      )}

      {message && <Alert variant="danger" className="form-error">{message}</Alert>}
    </div>
  )
}

export default AddCityPage
