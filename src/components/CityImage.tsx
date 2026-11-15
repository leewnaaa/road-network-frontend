import { FC, useEffect, useState } from 'react'
import { DEFAULT_IMAGE, mediaCandidates } from '../modules/media'

interface Props {
  src: string | null
  alt: string
  className?: string
}

// Фото города: сначала через proxy /minio, затем напрямую, затем изображение по умолчанию
export const CityImage: FC<Props> = ({ src, alt, className }) => {
  const candidates = mediaCandidates(src, DEFAULT_IMAGE)
  const [index, setIndex] = useState(0)

  useEffect(() => setIndex(0), [src])

  return (
    <img
      src={candidates[Math.min(index, candidates.length - 1)]}
      alt={alt}
      className={className}
      onError={() => setIndex((value) => Math.min(value + 1, candidates.length - 1))}
    />
  )
}
