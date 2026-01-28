// @/features/events/hooks/useEvents.ts
import useSWR from 'swr'
import { getEvents } from '@/features/events/service'
import type { EventFilter, SeoulEvent } from '@/features/events/types/event'

// SWR Key Generator
const getKey = (filter?: EventFilter) => {
  return ['events', JSON.stringify(filter)] // 필터가 바뀌면 키가 바뀌어 재요청
}

export const useEvents = (filter?: EventFilter) => {
  const { data, error, isLoading, mutate } = useSWR<SeoulEvent[]>(getKey(filter), () => getEvents(filter), {
    revalidateOnFocus: false, // 맵 이동 시 불필요한 깜빡임 방지
    dedupingInterval: 60000, // 1분간 중복 요청 방지 (API 비용 절감)
  })

  return {
    events: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}
