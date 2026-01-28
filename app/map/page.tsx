'use client'

import { useState, useCallback, useMemo } from 'react'
import { Map, useKakaoLoader } from 'react-kakao-maps-sdk'
import { useEvents } from '@/features/events/hooks/useEvents'
import { EventBottomSheet } from '@/features/events/components/EventBottomSheet'
import { EventMarker } from '@/features/events/components/EventMarker'
import { FilterChip } from '@/components/common/FilterChip'
import { ErrorView, LoadingView, DataLoadingIndicator } from '@/app/map/_components/MapStatus'

export default function MapPage() {
  // 1. Kakao Map SDK 로드
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY!,
    libraries: ['clusterer', 'services'],
  })

  // 2. 비즈니스 로직 (데이터 & 필터)
  const [filter, setFilter] = useState({ isWeekendOnly: false })
  const { events, isLoading: isEventsLoading } = useEvents(filter)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  // Memoize selected event
  const selectedEvent = useMemo(() => events.find(e => e.id === selectedEventId) || null, [events, selectedEventId])

  // Handlers
  const handleMarkerClick = useCallback((id: string) => {
    setSelectedEventId(id)
  }, [])

  const handleMapClick = useCallback(() => {
    setSelectedEventId(null)
  }, [])

  const toggleWeekendFilter = useCallback(() => {
    setFilter(prev => ({ ...prev, isWeekendOnly: !prev.isWeekendOnly }))
  }, [])

  // 3. 에러 및 로딩 뷰
  if (error) return <ErrorView />
  if (loading) return <LoadingView />

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <Map
        center={{ lat: 37.5665, lng: 126.978 }}
        style={{ width: '100%', height: '100%' }}
        level={7}
        onClick={handleMapClick}
      >
        {events.map(event => (
          <EventMarker
            key={event.id}
            event={event}
            isSelected={selectedEventId === event.id}
            onClick={handleMarkerClick}
          />
        ))}
      </Map>

      {/* 로딩 인디케이터 */}
      {isEventsLoading && <DataLoadingIndicator />}

      {/* 필터 컨트롤 */}
      <div className="scrollbar-hide absolute top-4 left-1/2 z-10 flex w-max max-w-[90%] -translate-x-1/2 gap-2 overflow-x-auto">
        <FilterChip label="이번 주말만" isActive={filter.isWeekendOnly} onClick={toggleWeekendFilter} />
      </div>

      {/* Bottom Sheet */}
      <EventBottomSheet isOpen={!!selectedEventId} onClose={() => setSelectedEventId(null)} event={selectedEvent} />
    </main>
  )
}
