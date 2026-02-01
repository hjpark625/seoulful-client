'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'
import { useEvents } from '@/features/events/hooks/useEvents'
import { EventCard } from '@/features/events/components/EventCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense, useState, memo } from 'react'
import type { SeoulEvent } from '@/features/events/types/event'

// Memoized Event List Component
const EventList = memo(function EventList({
  events,
  isLoading,
  activeSearch,
}: {
  events: SeoulEvent[]
  isLoading: boolean
  activeSearch: string
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-4/5 rounded-2xl">
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full bg-slate-100 p-4">
          <Search className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">검색 결과가 없어요</h3>
        <p className="mt-1 text-sm text-slate-500">다른 키워드로 검색해보거나 필터를 변경해보세요.</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-xl font-bold text-slate-900">
          {activeSearch ? `'${activeSearch}' 검색 결과` : '진행 중인 행사'}
        </h1>
        <span className="text-sm font-medium text-slate-500">총 {events.length}개</span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </>
  )
})

function EventsContent() {
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('search') || ''
  const [keyword, setKeyword] = useState(initialSearch)
  const [activeSearch, setActiveSearch] = useState(initialSearch)

  const { events, isLoading } = useEvents({
    search: activeSearch,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveSearch(keyword)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="-ml-2 shrink-0 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          <form onSubmit={handleSearch} className="relative flex-1">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="축제, 공연, 지역 검색..."
              className="h-10 w-full rounded-full border-slate-200 bg-slate-100 pr-10 focus-visible:bg-white focus-visible:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-blue-600"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl p-4 pb-20 sm:p-6">
        <EventList events={events} isLoading={isLoading} activeSearch={activeSearch} />
      </main>
    </div>
  )
}

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-slate-50">
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      }
    >
      <EventsContent />
    </Suspense>
  )
}
