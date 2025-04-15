"use client"

import { useState } from "react"

interface FallbackImageProps {
  src: string
  alt: string
  className?: string
}

export function FallbackImage({ src, alt, className }: FallbackImageProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-green-950 text-gray text-xl italic ${className}`}
      >
        Preview Coming
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  )
}