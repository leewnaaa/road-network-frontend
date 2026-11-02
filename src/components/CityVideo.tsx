import { FC, useEffect, useState } from 'react'
import { DEFAULT_VIDEO, imageOrDefault, videoOrDefault } from '../modules/media'

interface Props {
  src: string | null
  poster: string | null
}

// Видео для ленты. Пустое поле → видео по умолчанию; ошибка загрузки → тоже по умолчанию.
// autoPlay + muted + playsInline нужны для автозапуска в мобильных браузерах.
export const CityVideo: FC<Props> = ({ src, poster }) => {
  const [current, setCurrent] = useState(videoOrDefault(src))

  useEffect(() => setCurrent(videoOrDefault(src)), [src])

  return (
    <video
      key={current}
      className="reelsVideo"
      src={current}
      poster={imageOrDefault(poster)}
      autoPlay
      loop
      muted
      playsInline
      onError={() => current !== DEFAULT_VIDEO && setCurrent(DEFAULT_VIDEO)}
    />
  )
}
