'use client'

import { useState, useRef, useMemo, useEffect, memo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useWindowVirtualizer } from '@tanstack/react-virtual'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EventCard } from '@/features/events/components/EventCard'
import { useEventsInfinite } from '@/features/events/hooks/useEvents'
import type { EventCategory } from '@/features/events/types/event'
import { format, addDays } from 'date-fns'

const VALID_CATEGORIES: EventCategory[] = ['FESTIVAL', 'EXHIBITION', 'PERFORMANCE', 'OTHER']

export const SearchResults = memo(function SearchResults() {
  const searchParams = useSearchParams()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Query events with Infinite Loading
  const filter = useMemo(() => {
    const today = new Date()
    const oneWeekLater = addDays(today, 7)

    const start = searchParams.get('start') || format(today, 'yyyy-MM-dd')
    const end = searchParams.get('end') || format(oneWeekLater, 'yyyy-MM-dd')
    const categoryParam = searchParams.get('category')
    const categories = categoryParam
      ? categoryParam
          .split(',')
          .map((c) => c.trim().toUpperCase() as EventCategory)
          .filter((c): c is EventCategory => VALID_CATEGORIES.includes(c))
      : undefined

    return {
      search: searchParams.get('q') || undefined,
      guSeq: searchParams.get('gu') ? parseInt(searchParams.get('gu')!) : undefined,
      category: categories && categories.length > 0 ? categories : undefined,
      startDate: start,
      endDate: end,
      limit: 20,
    }
  }, [searchParams])

  const { events, totalCount, setSize, isInitialLoading, isMoreLoading, isReachedEnd } = useEventsInfinite(filter)

  // Virtualization logic for Grid
  const getGridCols = () => {
    if (typeof window === 'undefined') return 1
    if (window.innerWidth >= 1024) return 3
    if (window.innerWidth >= 640) return 2
    return 1
  }

  const [cols, setCols] = useState(1)

  useEffect(() => {
    const updateCols = () => setCols(getGridCols())
    updateCols()
    window.addEventListener('resize', updateCols)
    return () => window.removeEventListener('resize', updateCols)
  }, [])

  const rows = useMemo(() => {
    const r = []
    for (let i = 0; i < events.length; i += cols) {
      r.push(events.slice(i, i + cols))
    }
    return r
  }, [events, cols])

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => 480, // 데스크탑 카드 높이에 맞춰 상향 조정
    overscan: 5,
    scrollMargin: 0,
  })

  return (
    <main className="p-4 pb-20" ref={scrollContainerRef}>
      {isInitialLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <Skeleton className="aspect-4/3 w-full rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length > 0 ? (
        <>
          <div className="mb-4 text-sm font-medium text-slate-500">
            검색 결과 {totalCount}건 (표시 {events.length}건)
          </div>

          {/* Virtualized List Container */}
          <div
            className="relative w-full"
            style={{
              height: `${virtualizer.getTotalSize()}px`,
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="absolute top-0 left-0 grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                  paddingBottom: '24px', // gap-6에 해당하는 간격 유지
                }}
              >
                {rows[virtualRow.index].map((event) => (
                  <div key={event.id} className="h-full">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-10 flex justify-center border-t border-slate-50 pt-10">
            {!isReachedEnd ? (
              <Button
                variant="outline"
                size="lg"
                className="w-full max-w-xs rounded-full border-slate-200 py-6 text-base font-bold text-slate-700 hover:bg-slate-50 active:scale-95"
                onClick={() => setSize((prev) => prev + 1)}
                disabled={isMoreLoading}
              >
                {isMoreLoading ? '불러오는 중...' : '더보기'}
              </Button>
            ) : (
              <p className="text-sm text-slate-400">마지막 행사입니다.</p>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center pt-20 text-center">
          <div className="mb-4 rounded-full bg-slate-50 p-6">
            <Search className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">검색 결과가 없습니다</h3>
          <p className="mt-2 text-sm text-slate-500">
            다른 검색어나 필터를 사용해 보세요. <br />
            검색어를 비우고 지역만 선택해도 결과를 볼 수 있습니다.
          </p>
        </div>
      )}
    </main>
  )
})
