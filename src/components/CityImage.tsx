import { FC, useEffect, useState } from 'react'
import { DEFAULT_IMAGE, imageOrDefault } from '../modules/media'

interface Props {
  src: string | null
  alt: string
  className?: string
}

// Фото города. Если поле пустое — сразу берётся изображение по умолчанию.
// Если ссылка есть, но файл не загрузился (MinIO выключен, 404) — подменяем в onError.
export const CityImage: FC<Props> = ({ src, alt, className }) => {
  const [current, setCurrent] = useState(imageOrDefault(src))

  // при переходе к другому городу сбрасываем подмену
  useEffect(() => setCurrent(imageOrDefault(src)), [src])

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      onError={() => current !== DEFAULT_IMAGE && setCurrent(DEFAULT_IMAGE)}
    />
  )
}
