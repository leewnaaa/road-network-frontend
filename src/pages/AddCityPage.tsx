import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { imageOrDefault, videoOrDefault } from '../modules/media'
import { feedRoute } from '../Routes'
import { createCityDraft, fetchCityDraft, publishCity } from '../slices/cityDraftSlice'
import { useAppDispatch, useAppSelector } from '../store'

// Локальный предпросмотр выбранного файла (blob-URL), освобождается при смене файла
const useFilePreview = (file: File | null): string | null => {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setUrl(null)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  return url
}

const pickFile = (event: ChangeEvent<HTMLInputElement>) => event.target.files?.[0] ?? null

// Страница «Добавление» (вёрстка как add.html из ЛР1):
// шаг 1 — фото, видео, название -> черновик; шаг 2 — описание и координаты -> публикация.
const AddCityPage: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { draft, error } = useAppSelector((state) => state.cityDraft)
  const pending = useAppSelector((state) => state.loading.pending > 0)

  const [name, setName] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const photoUrl = useFilePreview(photo)
  const videoUrl = useFilePreview(video)

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
    if (!photo || !video || !name.trim()) {
      setFormError('Выберите фото, видео и укажите название города')
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
    if (!description.trim() || lat === '' || lon === '' || Number.isNaN(latNum) || Number.isNaN(lonNum)) {
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
      // текст ошибки лежит в state.cityDraft.error
    }
  }

  const message = formError ?? error

  if (draft) {
    return (
      <div className="add-page">
        <h1 className="add-title">{draft.name}</h1>
        <p className="add-subtitle">Описание и координаты города</p>

        <form className="add-form" onSubmit={handlePublish}>
          <div className="upload-section">
            <div className="upload-item">
              <div className="upload-preview">
                <img src={imageOrDefault(draft.image_url)} alt={draft.name} />
              </div>
              <p className="upload-caption">Фото</p>
            </div>
            <div className="upload-item">
              <div className="upload-preview">
                <video src={videoOrDefault(draft.video_url)} muted loop autoPlay playsInline />
              </div>
              <p className="upload-caption">Видео</p>
            </div>
          </div>

          <div className="form-grid">
            <label>
              Краткое описание
              <textarea
                rows={3}
                maxLength={500}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </label>
            <label>
              Широта
              <input type="number" step="any" min={-90} max={90} value={lat} onChange={(event) => setLat(event.target.value)} required />
            </label>
            <label>
              Долгота
              <input type="number" step="any" min={-180} max={180} value={lon} onChange={(event) => setLon(event.target.value)} required />
            </label>
          </div>

          {message && <Alert variant="danger" className="add-error">{message}</Alert>}

          <button type="submit" className="add-submit" disabled={pending}>
            Опубликовать
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="add-page">
      <h1 className="add-title">Добавление города</h1>
      <p className="add-subtitle">Название, фото и видео города</p>

      <form className="add-form" onSubmit={handleCreate}>
        <div className="upload-section">
          <div className="upload-item">
            <div className="upload-preview">
              {photoUrl ? <img src={photoUrl} alt="Фото города" /> : <span className="upload-photo-stub">Фото</span>}
            </div>
            <label className={`upload-btn ${photo ? 'file-selected' : ''}`} htmlFor="photo-input">
              {photo ? photo.name : '+ Фото'}
            </label>
            <input
              id="photo-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="upload-input"
              onChange={(event) => setPhoto(pickFile(event))}
            />
          </div>

          <div className="upload-item">
            <div className="upload-preview">
              {videoUrl ? (
                <video src={videoUrl} muted loop autoPlay playsInline />
              ) : (
                <span className="video-placeholder">Видео не выбрано</span>
              )}
            </div>
            <label className={`upload-btn ${video ? 'file-selected' : ''}`} htmlFor="video-input">
              {video ? video.name : '+ Видео'}
            </label>
            <input
              id="video-input"
              type="file"
              accept="video/mp4,video/webm"
              className="upload-input"
              onChange={(event) => setVideo(pickFile(event))}
            />
          </div>
        </div>

        <div className="form-grid">
          <label>
            Название города
            <input type="text" value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
        </div>

        {message && <Alert variant="danger" className="add-error">{message}</Alert>}

        <button type="submit" className="add-submit" disabled={pending}>
          Далее
        </button>
      </form>
    </div>
  )
}

export default AddCityPage
