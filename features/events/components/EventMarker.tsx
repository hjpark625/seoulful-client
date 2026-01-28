'use client'

import { CustomOverlayMap } from 'react-kakao-maps-sdk'
import { EVENT_STYLES, DEFAULT_EVENT_STYLE } from '@/features/events/constants'
import type { SeoulEvent } from '@/features/events/types/event'

interface EventMarkerProps {
  event: SeoulEvent
  isSelected: boolean
  onClick: (id: string) => void
}

export function EventMarker({ event, isSelected, onClick }: EventMarkerProps) {
  const style = EVENT_STYLES[event.category as keyof typeof EVENT_STYLES] || DEFAULT_EVENT_STYLE

  return (
    <CustomOverlayMap position={{ lat: event.latitude, lng: event.longitude }} yAnchor={1} zIndex={isSelected ? 50 : 1}>
      <div
        className="group relative flex cursor-pointer flex-col items-center"
        onClick={e => {
          e.stopPropagation()
          onClick(event.id)
        }}
      >
        {/* 핀 본체 */}
        <div
          className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xl shadow-lg transition-all duration-300 ease-out ${style.color} ${style.shadow} ${isSelected ? 'scale-125 ring-4 ' + style.ring : 'group-hover:-translate-y-1 group-hover:scale-110'} `}
        >
          {style.icon}
        </div>

        {/* 핀 꼬리 (날카로운 삼각형) */}
        <div
          className={`-mt-1.5 h-4 w-3 shadow-lg ${style.color} z-0`}
          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}
        />
      </div>
    </CustomOverlayMap>
  )
}
