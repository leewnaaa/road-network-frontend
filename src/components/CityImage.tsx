import { FC, useEffect, useState } from 'react'
import { DEFAULT_IMAGE, imageOrDefault } from '../modules/media'

interface Props {
  src: string | null
  alt: string
  className?: string
}

export const CityImage: FC<Props> = ({ src, alt, className }) => {
  const [current, setCurrent] = useState(imageOrDefault(src))

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
