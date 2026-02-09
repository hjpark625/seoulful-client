import { LocateFixed, Plus, Minus } from 'lucide-react'

interface MapControlsProps {
  onZoom: (delta: number) => void
  onLocation: () => void
}

export function MapControls({ onZoom, onLocation }: MapControlsProps) {
  return (
    <>
      {/* 줌 컨트롤 (우측 중앙) */}
      <div className="absolute top-1/2 right-4 z-20 flex -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-black/5 bg-white/90 shadow-2xl backdrop-blur-md">
        <button
          onClick={() => onZoom(-1)}
          className="flex h-12 w-12 items-center justify-center transition-all hover:bg-slate-50 active:bg-slate-100"
          aria-label="확대"
        >
          <Plus className="h-6 w-6 text-slate-700" />
        </button>
        <div className="mx-auto h-px w-6 bg-slate-200" />
        <button
          onClick={() => onZoom(1)}
          className="flex h-12 w-12 items-center justify-center transition-all hover:bg-slate-50 active:bg-slate-100"
          aria-label="축소"
        >
          <Minus className="h-6 w-6 text-slate-700" />
        </button>
      </div>

      {/* 내 위치 버튼 (우측 하단) */}
      <button
        onClick={onLocation}
        className="absolute right-4 bottom-4 z-20 flex h-12 w-12 items-center justify-center rounded-2xl border border-black/5 bg-white/90 shadow-2xl backdrop-blur-md transition-all hover:bg-white active:scale-95"
        aria-label="내 위치로 이동"
      >
        <LocateFixed className="h-6 w-6 text-blue-600" />
      </button>
    </>
  )
}
