'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { X, ZoomIn } from 'lucide-react'
import { createPortal } from 'react-dom'
import { CategoryBadge } from './CategoryBadge'

interface EventHeroImageProps {
  src?: string
  alt: string
  category: string
  title: string
}

export function EventHeroImage({ src, alt, category, title }: EventHeroImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  // 모달 열렸을 때 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      <div
        className="group relative aspect-square w-full cursor-pointer overflow-hidden bg-slate-100 sm:aspect-21/9 sm:rounded-b-3xl"
        onClick={() => src && setIsOpen(true)}
      >
        {src ? (
          <>
            <Image
              src={src}
              alt={alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Hover overlay with Zoom icon */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
              <ZoomIn className="h-10 w-10 text-white opacity-0 drop-shadow-md transition-opacity group-hover:opacity-100" />
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">이미지 없음</div>
        )}

        {/* Mobile Gradient & Text Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 to-transparent sm:hidden" />

        <div className="pointer-events-none absolute bottom-0 left-0 p-6 text-white sm:hidden">
          <CategoryBadge category={category} className="mb-2 backdrop-blur-md" />
          <h1 className="text-2xl leading-tight font-bold">{title}</h1>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {isOpen &&
        src &&
        createPortal(
          <div
            className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm duration-200"
            onClick={() => setIsOpen(false)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
              }}
            >
              <X className="h-6 w-6" />
            </button>

            {/* Image */}
            <div className="relative flex h-full max-h-screen w-full max-w-5xl items-center justify-center">
              <div className="relative h-full max-h-[90vh] w-full">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  unoptimized // 상세 확대 이미지는 원본 퀄리티를 위해 최적화 제외 선택 가능
                  className="rounded-lg object-contain shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
