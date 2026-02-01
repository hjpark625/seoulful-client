'use client'

import { Suspense } from 'react'
import { Map as KakaoMap, MarkerClusterer, CustomOverlayMap } from 'react-kakao-maps-sdk'
import { EventBottomSheet } from '@/features/events/components/EventBottomSheet'
import { EventListBottomSheet } from '@/features/events/components/EventListBottomSheet'
import { EventMarker } from '@/features/events/components/EventMarker'
import { ErrorView, LoadingView, DataLoadingIndicator } from '@/app/map/_components/MapStatus'
import { useMapLogic } from '@/app/map/_hooks/useMapLogic'
import { MapControls } from '@/app/map/_components/MapControls'
import { CategoryFilterList } from '@/app/map/_components/CategoryFilterList'

export default function MapPage() {
  return (
    <Suspense fallback={<LoadingView />}>
      <MapContent />
    </Suspense>
  )
}

function MapContent() {
  const {
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
    closeDetailSheet,
    closeListSheet,
  } = useMapLogic()

  if (sdkError) return <ErrorView />
  if (sdkLoading || !isLocationLoaded) return <LoadingView />

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
        <MarkerClusterer averageCenter={true} minLevel={8} key={JSON.stringify(filter)}>
          {groupedEvents.map((group) => {
            const representativeEvent = group[0]
            const isSelected =
              (selectedEventId !== null && group.some((e) => e.id === selectedEventId)) ||
              (selectedGroup !== null && selectedGroup === group)

            return (
              <EventMarker
                key={representativeEvent.id}
                event={representativeEvent}
                count={group.length}
                isSelected={isSelected}
                onClick={() => handleMarkerClick(group)}
              />
            )
          })}
        </MarkerClusterer>

        {userLocation && (
          <CustomOverlayMap position={userLocation} zIndex={30}>
            <div className="relative">
              <div className="h-4 w-4 animate-ping rounded-full bg-blue-500 opacity-75" />
              <div className="absolute top-0 h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-sm" />
            </div>
          </CustomOverlayMap>
        )}
      </KakaoMap>

      {/* Loading Indicator */}
      {isEventsLoading && <DataLoadingIndicator />}

      {/* Controls (Zoom, Home, MyLocation) */}
      <MapControls onZoom={handleZoom} onLocation={handleMyLocation} />

      {/* Category Filters */}
      <CategoryFilterList activeCategories={filter.category} onSelect={handleCategoryClick} />

      {/* Bottom Sheet (Single Event) */}
      <EventBottomSheet isOpen={!!selectedEventId} onClose={closeDetailSheet} event={selectedEvent} />

      {/* Bottom Sheet (Multiple Events List) */}
      <EventListBottomSheet
        isOpen={!!selectedGroup}
        onClose={closeListSheet}
        events={selectedGroup || []}
        onSelectEvent={handleSelectFromList}
      />
    </main>
  )
}
