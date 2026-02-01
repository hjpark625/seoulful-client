'use client'

import { useState, useCallback, useMemo, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Home, LocateFixed, Plus, Minus } from 'lucide-react'
import { Map as KakaoMap, useKakaoLoader, MarkerClusterer, CustomOverlayMap } from 'react-kakao-maps-sdk'
import { useEvents } from '@/features/events/hooks/useEvents'
import { getEventDetail } from '@/features/events/service'
import { EventBottomSheet } from '@/features/events/components/EventBottomSheet'
import { EventListBottomSheet } from '@/features/events/components/EventListBottomSheet'
import { EventMarker } from '@/features/events/components/EventMarker'
import { FilterChip } from '@/components/common/FilterChip'
import { ErrorView, LoadingView, DataLoadingIndicator } from '@/app/map/_components/MapStatus'
import type { EventFilter, EventCategory, SeoulEvent } from '@/features/events/types/event'
import { encodeGeohash, getNeighbors } from '@/lib/utils/geohash'
import { useMapCenter, useMapZoom, useMapActions } from '@/lib/store/useMapStore'

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

  // 2. Global State (Zustand)
  const center = useMapCenter()
  const zoom = useMapZoom()
  const { setCenter, setZoom } = useMapActions()

  // Local state for UI only
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLocationLoaded, setIsLocationLoaded] = useState(false)
  const mapRef = useRef<kakao.maps.Map>(null)

  // 3. 비즈니스 로직 (데이터 & 필터)
  const [filter, setFilter] = useState<EventFilter>(() => ({
    search: initialSearch,
    geohashes: getNeighbors(encodeGeohash(center.lat, center.lng, 5)),
  }))

  // 디바운스 타이머 ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const { events, isLoading: isEventsLoading } = useEvents(filter)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<SeoulEvent[] | null>(null) // 다중 선택된 그룹
  const [fetchedEvent, setFetchedEvent] = useState<SeoulEvent | null>(null)

  // 1. Handle external event navigation (Run only when targetEventId changes)
  useEffect(() => {
    const handleInitialState = async () => {
      if (!targetEventId) {
        setIsLocationLoaded(true)
        return
      }

      const id = Number(targetEventId)
      setSelectedEventId(id)

      const event = await getEventDetail(targetEventId)
      if (event) {
        setFetchedEvent(event)
        setCenter({ lat: event.latitude, lng: event.longitude })
        setZoom(4)

        const eventGeohash = encodeGeohash(event.latitude, event.longitude, 5)
        setFilter((prev) => ({ ...prev, geohashes: getNeighbors(eventGeohash) }))
      }
      setIsLocationLoaded(true)
    }

    handleInitialState()
  }, [targetEventId, setCenter, setZoom])

  // Group events by location (lat,lng)
  const groupedEvents = useMemo(() => {
    const groups = new Map<string, SeoulEvent[]>()

    events.forEach((event) => {
      if (!event.latitude || !event.longitude) return
      const key = `${event.latitude},${event.longitude}`
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(event)
    })

    return Array.from(groups.values())
  }, [events])

  // Memoize selected event
  const selectedEvent = useMemo(() => {
    return (
      events.find((e) => e.id === selectedEventId) ||
      (selectedEventId && fetchedEvent?.id === selectedEventId ? fetchedEvent : null)
    )
  }, [events, selectedEventId, fetchedEvent])

  // Handlers
  const handleMarkerClick = useCallback((group: SeoulEvent[]) => {
    if (group.length === 1) {
      setSelectedEventId(group[0].id)
      setSelectedGroup(null)
    } else {
      setSelectedGroup(group)
      setSelectedEventId(null)
    }
  }, [])

  const handleMapClick = useCallback(() => {
    setSelectedEventId(null)
    setSelectedGroup(null)
  }, [])

  const handleSelectFromList = useCallback((eventId: number) => {
    setSelectedEventId(eventId)
    setSelectedGroup(null)
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

  // 내 위치로 이동 핸들러
  const handleMyLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const newLocation = { lat: latitude, lng: longitude }
          setCenter(newLocation)
          setUserLocation(newLocation)

          if (mapRef.current) {
            mapRef.current.panTo(new kakao.maps.LatLng(latitude, longitude))
          }

          const currentGeohash = encodeGeohash(latitude, longitude, 5)
          setFilter((prev) => ({ ...prev, geohashes: getNeighbors(currentGeohash) }))
        },
        (err) => {
          alert('위치 정보를 가져올 수 없습니다. 권한 설정을 확인해주세요.')
          console.error(err)
        },
      )
    } else {
      alert('이 브라우저에서는 위치 서비스를 지원하지 않습니다.')
    }
  }, [setCenter])

  // 줌 조절 핸들러
  const handleZoom = useCallback(
    (delta: number) => {
      if (!mapRef.current) return
      const currentLevel = mapRef.current.getLevel()
      const newLevel = currentLevel + delta
      mapRef.current.setLevel(newLevel)
      setZoom(newLevel)
    },
    [setZoom],
  )

  // 지도 중심 변경 시 디바운스로 geohash 및 상태 저장
  const handleCenterChanged = useCallback(
    (map: kakao.maps.Map) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        const centerPos = map.getCenter()
        const level = map.getLevel()
        const lat = centerPos.getLat()
        const lng = centerPos.getLng()

        const newGeohash = encodeGeohash(lat, lng, 5)
        const newGeohashes = getNeighbors(newGeohash)

        setFilter((prev) => ({ ...prev, geohashes: newGeohashes }))
        setZoom(level)
        setCenter({ lat, lng })
      }, 200)
    },
    [setCenter, setZoom],
  )

  // 4. 에러 및 로딩 뷰
  if (error) return <ErrorView />
  if (loading || !isLocationLoaded) return <LoadingView />

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <KakaoMap
        center={center}
        style={{ width: '100%', height: '100%' }}
        level={zoom}
        onClick={handleMapClick}
        onCenterChanged={handleCenterChanged}
        ref={mapRef}
      >
        <MarkerClusterer averageCenter={true} minLevel={8} key={events.length}>
          {groupedEvents.map((group) => {
            const representativeEvent = group[0] // 첫 번째 이벤트를 대표로 사용
            const isSelected =
              (selectedEventId !== null && group.some((e) => e.id === selectedEventId)) ||
              (selectedGroup !== null && selectedGroup === group)

            return (
              <EventMarker
                key={representativeEvent.id} // 대표 ID 사용 (좌표가 같으므로 키 충돌 없음)
                event={representativeEvent}
                count={group.length}
                isSelected={isSelected}
                onClick={() => handleMarkerClick(group)}
              />
            )
          })}
        </MarkerClusterer>
        {/* 사용자 현재 위치 마커 */}
        {userLocation && (
          <CustomOverlayMap position={userLocation} zIndex={30}>
            <div className="relative">
              <div className="h-4 w-4 animate-ping rounded-full bg-blue-500 opacity-75" />
              <div className="absolute top-0 h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-sm" />
            </div>
          </CustomOverlayMap>
        )}
      </KakaoMap>

      {/* 로딩 인디케이터 */}
      {isEventsLoading && <DataLoadingIndicator />}
      {/* 홈 버튼 */}
      <Link href="/" className="absolute top-4 left-4 z-20">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 transition-all hover:bg-slate-50 active:scale-95">
          <Home className="h-5 w-5 text-slate-700" />
        </button>
      </Link>

      {/* 줌 컨트롤 */}
      <div className="absolute top-1/2 right-4 z-20 flex -translate-y-1/2 flex-col gap-2">
        <button
          onClick={() => handleZoom(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 transition-all hover:bg-slate-50 active:scale-95"
          aria-label="확대"
        >
          <Plus className="h-5 w-5 text-slate-700" />
        </button>
        <button
          onClick={() => handleZoom(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 transition-all hover:bg-slate-50 active:scale-95"
          aria-label="축소"
        >
          <Minus className="h-5 w-5 text-slate-700" />
        </button>
      </div>

      {/* 내 위치 버튼 */}
      <button
        onClick={handleMyLocation}
        className="absolute right-4 bottom-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 transition-all hover:bg-slate-50 active:scale-95"
        aria-label="내 위치로 이동"
      >
        <LocateFixed className="h-5 w-5 text-blue-600" />
      </button>

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

      {/* Detail Bottom Sheet (Single Event) */}
      <EventBottomSheet isOpen={!!selectedEventId} onClose={() => setSelectedEventId(null)} event={selectedEvent} />

      {/* List Bottom Sheet (Multiple Events) */}
      <EventListBottomSheet
        isOpen={!!selectedGroup}
        onClose={() => setSelectedGroup(null)}
        events={selectedGroup || []}
        onSelectEvent={handleSelectFromList}
      />
    </main>
  )
}
