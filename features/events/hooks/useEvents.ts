// @/features/events/hooks/useEvents.ts
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { getEvents } from '@/features/events/service'
import type { EventFilter, EventsResponse } from '@/features/events/types/event'

// SWR Key Generator for single fetch
const getKey = (filter?: EventFilter) => {
  return ['events', JSON.stringify(filter)]
}

export const useEvents = (filter?: EventFilter) => {
  const { data, error, isLoading, mutate, isValidating } = useSWR<EventsResponse>(
    getKey(filter),
    () => getEvents(filter),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      keepPreviousData: true, // 데이터 교체 시 이전 데이터 유지
    },
  )

  return {
    events: data?.events || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    isValidating,
    isError: error,
    mutate,
  }
}

// SWR Infinite Key Generator
const getInfiniteKey = (filter: EventFilter) => (pageIndex: number, previousPageData: EventsResponse) => {
  // 끝에 도달했는지 확인
  if (previousPageData && previousPageData.events.length === 0) return null

  const page = pageIndex + 1
  return ['events-infinite', JSON.stringify({ ...filter, page })]
}

export const useEventsInfinite = (filter: EventFilter) => {
  const { data, error, size, setSize, isLoading, isValidating } = useSWRInfinite<EventsResponse>(
    getInfiniteKey(filter),
    (key) => {
      const parsedFilter = JSON.parse((key as [string, string])[1])
      return getEvents(parsedFilter)
    },
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      persistSize: true,
      keepPreviousData: true, // 데이터 교체 시 이전 데이터 유지
    },
  )

  const events = data ? data.flatMap((page) => page.events) : []
  const totalCount = data?.[0]?.totalCount || 0
  const isReachedEnd = data && data[data.length - 1]?.events.length < (filter.limit || 20)

  // 처음 데이터를 가져오는 중인지 (데이터가 아예 없는 상태)
  const isInitialLoading = isLoading
  // 다음 페이지를 가져오는 중인지
  const isMoreLoading = size > 0 && data && typeof data[size - 1] === 'undefined'

  return {
    events,
    totalCount,
    size,
    setSize,
    isInitialLoading,
    isMoreLoading,
    isLoading,
    isValidating,
    isReachedEnd,
    isError: error,
  }
}
