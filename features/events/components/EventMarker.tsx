import { CustomOverlayMap } from 'react-kakao-maps-sdk'
import { getCategoryStyle } from '@/features/events/constants'

import type { SeoulEvent } from '@/features/events/types/event'

interface EventMarkerProps {
  event: SeoulEvent
  onClick: (id: number) => void
  isSelected?: boolean
}

export function EventMarker({ event, onClick, isSelected }: EventMarkerProps) {
  const categoryStyle = getCategoryStyle(event.category)

  if (!event.latitude || !event.longitude) return null

  return (
    <CustomOverlayMap
      position={{ lat: event.latitude, lng: event.longitude }}
      yAnchor={1}
      zIndex={isSelected ? 100 : 1}
    >
      <div
        className="group relative flex cursor-pointer flex-col items-center"
        onClick={(e) => {
          e.stopPropagation()
          onClick(event.id)
        }}
      >
        {/* 선택시 상단 타이틀 말풍선 */}
        {isSelected && (
          <div className="animate-in fade-in slide-in-from-bottom-2 absolute -top-12 left-1/2 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold whitespace-nowrap text-white shadow-xl">
            {event.title}
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900"></div>
          </div>
        )}

        {/* 핀 본체 (아이콘 유지) */}
        <div
          className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xl shadow-lg transition-all duration-300 ease-out ${categoryStyle.color} ${isSelected ? 'scale-125 ring-4 ' + categoryStyle.ring : 'group-hover:-translate-y-1 group-hover:scale-110'} `}
        >
          {categoryStyle.icon}
        </div>

        {/* 핀 꼬리 */}
        <div
          className={`-mt-1.5 h-4 w-3 shadow-lg ${categoryStyle.color} z-0`}
          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}
        />
      </div>
    </CustomOverlayMap>
  )
}
