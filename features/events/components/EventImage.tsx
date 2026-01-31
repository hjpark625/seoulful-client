import Image from 'next/image'
import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/cn'

interface EventImageProps {
  src?: string
  alt: string
  className?: string
  aspectRatio?: 'square' | 'video' | 'auto'
}

export function EventImage({ src, alt, className, aspectRatio = 'auto' }: EventImageProps) {
  const [imgError, setImgError] = useState(false)

  const aspectClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: '',
  }[aspectRatio]

  if (!src || imgError) {
    return (
      <div
        className={cn('flex flex-col items-center justify-center bg-slate-100 text-slate-400', aspectClass, className)}
      >
        <MapPin className="mb-2 h-8 w-8 opacity-50" />
        <span className="text-xs font-medium">이미지 준비 중</span>
      </div>
    )
  }

  return (
    <div className={cn('relative isolate overflow-hidden bg-gray-100', aspectClass, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-opacity duration-300 hover:opacity-90"
        onError={() => setImgError(true)}
      />
    </div>
  )
}
