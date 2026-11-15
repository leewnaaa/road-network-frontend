import { FC, useEffect, useState } from 'react'
import { DEFAULT_VIDEO, imageOrDefault, mediaCandidates } from '../modules/media'

interface Props {
  src: string | null
  poster: string | null
}

// Видео города: сначала через proxy /minio, затем напрямую, затем видео по умолчанию
export const CityVideo: FC<Props> = ({ src, poster }) => {
  const candidates = mediaCandidates(src, DEFAULT_VIDEO)
  const [index, setIndex] = useState(0)

  useEffect(() => setIndex(0), [src])

  const current = candidates[Math.min(index, candidates.length - 1)]

  return (
    <video
      key={current}
      src={current}
      poster={imageOrDefault(poster)}
      autoPlay
      loop
      muted
      playsInline
      onError={() => setIndex((value) => Math.min(value + 1, candidates.length - 1))}
    />
  )
}
