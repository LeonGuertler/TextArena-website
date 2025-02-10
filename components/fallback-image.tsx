"use client"

import { useState } from "react"

interface FallbackImageProps {
  src: string
  alt: string
  className?: string
}

export function FallbackImage({ src, alt, className }: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <img
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      className={className}
      onError={() => setImgSrc("/gifs/coming-soon.gif")}
    />
  )
}

