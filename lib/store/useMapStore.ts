import { create } from 'zustand'

interface MapState {
  center: { lat: number; lng: number }
  zoom: number
  actions: {
    setCenter: (center: { lat: number; lng: number }) => void
    setZoom: (zoom: number) => void
    reset: () => void
  }
}

const GWANGHWAMUN = { lat: 37.5759, lng: 126.9768 }
const DEFAULT_ZOOM = 7

export const useMapStore = create<MapState>((set) => ({
  center: GWANGHWAMUN,
  zoom: DEFAULT_ZOOM,
  actions: {
    setCenter: (center) => set({ center }),
    setZoom: (zoom) => set({ zoom }),
    reset: () => set({ center: GWANGHWAMUN, zoom: DEFAULT_ZOOM }),
  },
}))

export const useMapCenter = () => useMapStore((state) => state.center)
export const useMapZoom = () => useMapStore((state) => state.zoom)
export const useMapActions = () => useMapStore((state) => state.actions)
