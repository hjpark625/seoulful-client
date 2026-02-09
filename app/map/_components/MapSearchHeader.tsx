'use client'

import { Search, Home, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { FilterChip } from '@/components/common/FilterChip'
import type { EventCategory } from '@/features/events/types/event'

const CATEGORY_FILTERS: { label: string; value: EventCategory }[] = [
  { label: '🎉 축제', value: 'FESTIVAL' },
  { label: '🎭 공연', value: 'PERFORMANCE' },
  { label: '🖼️ 전시', value: 'EXHIBITION' },
  { label: '🎸 기타', value: 'OTHER' },
]

interface MapSearchHeaderProps {
  activeCategories?: EventCategory[]
  onSelectCategory: (category: EventCategory) => void
}

export function MapSearchHeader({ activeCategories, onSelectCategory }: MapSearchHeaderProps) {
  return (
    <div className="absolute top-0 left-0 z-20 w-full px-4 pt-4 pb-2">
      <div className="flex flex-col gap-3">
        {/* 검색바 영역 */}
        <div className="flex items-center gap-2">
          {/* 홈 버튼 */}
          <Link href="/">
            <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/5 bg-white shadow-xl transition-all active:scale-95">
              <Home className="h-5 w-5 text-slate-700" />
            </button>
          </Link>

          {/* 검색 입력바 (클릭 시 검색 페이지로 이동) */}
          <Link href="/search" className="flex-1">
            <div className="flex h-12 w-full cursor-pointer items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 shadow-xl transition-all active:bg-slate-50">
              <Search className="h-5 w-5 text-slate-400" />
              <span className="text-base text-slate-400">행사 이름, 장소를 검색해보세요</span>
            </div>
          </Link>
        </div>

        {/* 필터 영역 */}
        <div className="scrollbar-hide flex items-center gap-1.5 overflow-x-auto pb-1">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5">
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          </div>
          {CATEGORY_FILTERS.map((cat) => (
            <FilterChip
              key={cat.value}
              label={cat.label}
              isActive={activeCategories?.includes(cat.value) ?? false}
              onClick={() => onSelectCategory(cat.value)}
              className="h-9 shadow-md"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
