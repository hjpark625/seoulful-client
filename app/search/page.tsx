'use client'

import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { SearchFilters } from '@/app/search/_components/SearchFilters'
import { SearchResults } from '@/app/search/_components/SearchResults'

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<SearchLoading />}>
        <SearchFilters />
        <SearchResults />
      </Suspense>
    </div>
  )
}

function SearchLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>
  )
}
