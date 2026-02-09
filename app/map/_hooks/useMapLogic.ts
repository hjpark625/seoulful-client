import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useKakaoLoader } from 'react-kakao-maps-sdk'
import { useEvents } from '@/features/events/hooks/useEvents'
import { getEventDetail } from '@/features/events/service'
import { useMapCenter, useMapZoom, useMapActions } from '@/lib/store/useMapStore'
import { encodeGeohash, getNeighbors } from '@/lib/utils/geohash'
import type { EventFilter, EventCategory, SeoulEvent } from '@/features/events/types/event'

export function useMapLogic() {
  const searchParams = useSearchParams()
  const targetEventId = searchParams.get('eventId')

  // 1. Kakao Map SDK 로드
  const [sdkLoading, sdkError] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY!,
    libraries: ['clusterer', 'services'],
  })

  // 2. Global State
  const center = useMapCenter()
  const zoom = useMapZoom()
  const { setCenter, setZoom } = useMapActions()

  // 3. Local State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLocationLoaded, setIsLocationLoaded] = useState(false)

  // 초기 상태: useState 초기화 시점에 바로 Geohash 계산
  const [filter, setFilter] = useState<EventFilter>(() => {
    const initialGeohash = encodeGeohash(center.lat, center.lng, 5)
    return {
      geohashes: getNeighbors(initialGeohash),
      limit: 300,
    }
  })

  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<SeoulEvent[] | null>(null)
  const [fetchedEvent, setFetchedEvent] = useState<SeoulEvent | null>(null)

  const mapRef = useRef<kakao.maps.Map>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 4. Data Fetching
  const { events, isLoading: isEventsLoading } = useEvents(filter)

  // 5. Effects
  useEffect(() => {
    const handleInitialState = async () => {
      // 1. 특정 이벤트 진입 케이스 처리
      if (targetEventId) {
        const id = Number(targetEventId)
        setSelectedEventId(id)

        const event = await getEventDetail(targetEventId)
        if (event) {
          setFetchedEvent(event)
          setCenter({ lat: event.latitude, lng: event.longitude })
          setZoom(4)

          const eventGeohash = encodeGeohash(event.latitude, event.longitude, 5)
          setFilter((prev) => ({
            ...prev,
            geohashes: getNeighbors(eventGeohash),
          }))
        }
      }
      setIsLocationLoaded(true)
    }

    handleInitialState()
  }, [targetEventId, setCenter, setZoom])

  // 6. Memoized Data
  const groupedEvents = useMemo(() => {
    const groups = new Map<string, SeoulEvent[]>()
    events.forEach((event) => {
      if (event.latitude == null || event.longitude == null) return
      const key = `${event.latitude},${event.longitude}`
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(event)
    })
    return Array.from(groups.values())
  }, [events])

  const selectedEvent = useMemo(() => {
    return (
      events.find((e) => e.id === selectedEventId) ||
      (selectedEventId && fetchedEvent?.id === selectedEventId ? fetchedEvent : null)
    )
  }, [events, selectedEventId, fetchedEvent])

  // 7. Handlers
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

  const closeDetailSheet = useCallback(() => setSelectedEventId(null), [])
  const closeListSheet = useCallback(() => setSelectedGroup(null), [])

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

  const handleCenterChanged = useCallback(
    (map: kakao.maps.Map) => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)

      debounceTimerRef.current = setTimeout(() => {
        const centerPos = map.getCenter()
        const level = map.getLevel()
        const lat = centerPos.getLat()
        const lng = centerPos.getLng()

        const newGeohash = encodeGeohash(lat, lng, 5)
        const newGeohashes = getNeighbors(newGeohash)

        setFilter((prev) => {
          const isSame =
            prev.geohashes &&
            prev.geohashes.length === newGeohashes.length &&
            prev.geohashes.every((val, index) => val === newGeohashes[index])

          if (isSame) return prev
          return { ...prev, geohashes: newGeohashes }
        })
        setZoom(level)
        setCenter({ lat, lng })
      }, 200)
    },
    [setCenter, setZoom],
  )

  const handleMapCreate = (map: kakao.maps.Map) => {
    mapRef.current = map
    const lat = map.getCenter().getLat()
    const lng = map.getCenter().getLng()
    const newGeohash = encodeGeohash(lat, lng, 5)
    const newGeohashes = getNeighbors(newGeohash)

    setFilter((prev) => {
      const isSame =
        prev.geohashes &&
        prev.geohashes.length === newGeohashes.length &&
        prev.geohashes.every((val, index) => val === newGeohashes[index])

      if (isSame) return prev
      return { ...prev, geohashes: newGeohashes }
    })
  }

  return {
    // State
    center,
    zoom,
    userLocation,
    isLocationLoaded,
    filter,
    selectedEventId,
    selectedGroup,
    selectedEvent,
    groupedEvents,
    events,

    // Status
    sdkLoading,
    sdkError,
    isEventsLoading,

    // Refs
    mapRef,

    // Actions
    handleMarkerClick,
    handleMapClick,
    handleSelectFromList,
    handleCategoryClick,
    handleMyLocation,
    handleZoom,
    handleCenterChanged,
    handleMapCreate, // 추가됨
    closeDetailSheet,
    closeListSheet,
  }
}
