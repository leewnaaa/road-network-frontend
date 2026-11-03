import { FC, useEffect, useState } from 'react'
import { DEFAULT_VIDEO, imageOrDefault, videoOrDefault } from '../modules/media'

interface Props {
  src: string | null
  poster: string | null
}

export const CityVideo: FC<Props> = ({ src, poster }) => {
  const [current, setCurrent] = useState(videoOrDefault(src))

  useEffect(() => setCurrent(videoOrDefault(src)), [src])

  return (
    <video
      key={current}
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
