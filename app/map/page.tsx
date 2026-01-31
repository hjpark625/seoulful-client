'use client'

import { useState, useCallback, useMemo, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Home } from 'lucide-react'
import { Map, useKakaoLoader, MarkerClusterer } from 'react-kakao-maps-sdk'
import { useEvents } from '@/features/events/hooks/useEvents'
import { getEventDetail } from '@/features/events/service'
import { EventBottomSheet } from '@/features/events/components/EventBottomSheet'
import { EventMarker } from '@/features/events/components/EventMarker'
import { FilterChip } from '@/components/common/FilterChip'
import { ErrorView, LoadingView, DataLoadingIndicator } from '@/app/map/_components/MapStatus'
import type { EventFilter, EventCategory, SeoulEvent } from '@/features/events/types/event'
import { encodeGeohash, getNeighbors } from '@/lib/utils/geohash'

const CATEGORY_FILTERS: { label: string; value: EventCategory }[] = [
  { label: '🎉 축제', value: 'FESTIVAL' },
  { label: '🎭 공연', value: 'PERFORMANCE' },
  { label: '🖼️ 전시', value: 'EXHIBITION' },
  { label: '🎸 기타', value: 'OTHER' },
]

export default function MapPage() {
  return (
    <Suspense fallback={<LoadingView />}>
      <MapContent />
    </Suspense>
  )
}

function MapContent() {
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('search') || ''
  const targetEventId = searchParams.get('eventId')

  // 1. Kakao Map SDK 로드
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY!,
    libraries: ['clusterer', 'services'],
  })

  // State for map center (default: Seoul City Hall)
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 })
  const [isLocationLoaded, setIsLocationLoaded] = useState(false)

  // 2. 비즈니스 로직 (데이터 & 필터)
  const [filter, setFilter] = useState<EventFilter>(() => ({
    search: initialSearch,
    geohashes: getNeighbors('wyd77'), // 서울 시청 근처 기본 geohash + 인접 8개
  }))

  // 디바운스 타이머 ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const { events, isLoading: isEventsLoading } = useEvents(filter)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [fetchedEvent, setFetchedEvent] = useState<SeoulEvent | null>(null)

  // Handle external event navigation
  useEffect(() => {
    if (targetEventId) {
      const id = Number(targetEventId)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedEventId(id)

      // Fetch specific event location if not in current list
      getEventDetail(targetEventId).then((event) => {
        if (event) {
          setFetchedEvent(event)
          setCenter({ lat: event.latitude, lng: event.longitude })
          // Update filter to include this location
          const eventGeohash = encodeGeohash(event.latitude, event.longitude, 5)
          setFilter((prev) => ({ ...prev, geohashes: getNeighbors(eventGeohash) }))
          // Async update to avoid cascading render warning in effect
          setTimeout(() => setIsLocationLoaded(true), 0)
        }
      })
    }
  }, [targetEventId])

  // Memoize selected event
  const selectedEvent = useMemo(() => {
    return (
      events.find((e) => e.id === selectedEventId) ||
      (selectedEventId && fetchedEvent?.id === selectedEventId ? fetchedEvent : null)
    )
  }, [events, selectedEventId, fetchedEvent])

  // Get User Location on Mount (Only if no target event)
  useEffect(() => {
    if (targetEventId) return // Skip if targeting a specific event

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCenter({ lat: latitude, lng: longitude })

          const currentGeohash = encodeGeohash(latitude, longitude, 5)
          setFilter((prev) => ({ ...prev, geohashes: getNeighbors(currentGeohash) }))
          setIsLocationLoaded(true)
        },
        () => {
          setIsLocationLoaded(true)
        },
      )
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLocationLoaded(true)
    }
  }, [targetEventId])

  // Handlers
  const handleMarkerClick = useCallback((id: number) => {
    setSelectedEventId(id)
  }, [])

  const handleMapClick = useCallback(() => {
    setSelectedEventId(null)
  }, [])

  const handleCategoryClick = useCallback((category: EventCategory) => {
    setFilter((prev) => {
      const currentCategories = prev.category || []
      const isSelected = currentCategories.includes(category)

      const newCategories = isSelected
        ? currentCategories.filter((c) => c !== category)
        : [...currentCategories, category]

      return {
        ...prev,
        category: newCategories.length > 0 ? newCategories : undefined,
      }
    })
  }, [])

  // 지도 중심 변경 시 디바운스로 geohash 업데이트
  const handleCenterChanged = useCallback((map: kakao.maps.Map) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      const center = map.getCenter()
      const newGeohash = encodeGeohash(center.getLat(), center.getLng(), 5)
      const newGeohashes = getNeighbors(newGeohash)
      setFilter((prev) => ({ ...prev, geohashes: newGeohashes }))
    }, 500)
  }, [])

  // 3. 에러 및 로딩 뷰
  if (error) return <ErrorView />
  if (loading || !isLocationLoaded) return <LoadingView />

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <Map
        center={center}
        style={{ width: '100%', height: '100%' }}
        level={7}
        onClick={handleMapClick}
        onCenterChanged={handleCenterChanged}
      >
        <MarkerClusterer averageCenter={true} minLevel={8} key={events.length}>
          {events
            .filter((event) => event.latitude && event.longitude)
            .map((event) => (
              <EventMarker
                key={event.id}
                event={event}
                isSelected={selectedEventId === event.id}
                onClick={() => handleMarkerClick(event.id)}
              />
            ))}
        </MarkerClusterer>
      </Map>

      {/* 로딩 인디케이터 */}
      {isEventsLoading && <DataLoadingIndicator />}

      {/* 홈 버튼 */}
      <Link href="/" className="absolute top-4 left-4 z-20">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 transition-all hover:bg-slate-50 active:scale-95">
          <Home className="h-5 w-5 text-slate-700" />
        </button>
      </Link>

      {/* 필터 컨트롤 */}
      <div className="scrollbar-hide absolute top-4 left-1/2 z-10 flex w-max max-w-[90%] -translate-x-1/2 gap-1.5 overflow-x-auto px-4">
        {CATEGORY_FILTERS.map((cat) => (
          <FilterChip
            key={cat.value}
            label={cat.label}
            isActive={filter.category?.includes(cat.value) ?? false}
            onClick={() => handleCategoryClick(cat.value)}
          />
        ))}
      </div>

      {/* Bottom Sheet */}
      <EventBottomSheet isOpen={!!selectedEventId} onClose={() => setSelectedEventId(null)} event={selectedEvent} />
    </main>
  )
}
