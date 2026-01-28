// @/features/events/service.ts
import { supabase } from '@/lib/supabase/client'
import { getWeekendRange } from '@/lib/utils/date'
import type { SeoulEvent, EventFilter } from '@/features/events/types/event'

export const getEvents = async (filter?: EventFilter): Promise<SeoulEvent[]> => {
  let query = supabase.from('events').select('*').eq('is_published', true)

  if (filter?.category) {
    query = query.eq('category', filter.category)
  }

  // 이번 주말 필터 로직 (금요일~일요일)
  if (filter?.isWeekendOnly) {
    const { start, end } = getWeekendRange()

    // 로직: (행사 시작일 <= 주말 끝) AND (행사 종료일 >= 주말 시작)
    // AND (행사 종료일 >= 현재 시간) -> 이미 끝난 행사 제외 (Hotfix by QA)
    query = query
      .lte('start_date', end.toISOString())
      .gte('end_date', start.toISOString())
      .gte('end_date', new Date().toISOString())
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching events:', error)
    throw new Error(error.message)
  }

  return data as SeoulEvent[]
}
