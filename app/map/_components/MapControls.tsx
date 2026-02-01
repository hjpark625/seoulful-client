import { Home, LocateFixed, Plus, Minus } from 'lucide-react'
import Link from 'next/link'

interface MapControlsProps {
  onZoom: (delta: number) => void
  onLocation: () => void
}

export function MapControls({ onZoom, onLocation }: MapControlsProps) {
  return (
    <>
      {/* 홈 버튼 */}
      <Link href="/" className="absolute top-4 left-4 z-20">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 transition-all hover:bg-slate-50 active:scale-95">
          <Home className="h-5 w-5 text-slate-700" />
        </button>
      </Link>

      {/* 줌 컨트롤 */}
      <div className="absolute top-1/2 right-4 z-20 flex -translate-y-1/2 flex-col gap-2">
        <button
          onClick={() => onZoom(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 transition-all hover:bg-slate-50 active:scale-95"
          aria-label="확대"
        >
          <Plus className="h-5 w-5 text-slate-700" />
        </button>
        <button
          onClick={() => onZoom(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 transition-all hover:bg-slate-50 active:scale-95"
          aria-label="축소"
        >
          <Minus className="h-5 w-5 text-slate-700" />
        </button>
      </div>

      {/* 내 위치 버튼 */}
      <button
        onClick={onLocation}
        className="absolute right-4 bottom-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 transition-all hover:bg-slate-50 active:scale-95"
        aria-label="내 위치로 이동"
      >
        <LocateFixed className="h-5 w-5 text-blue-600" />
      </button>
    </>
  )
}
