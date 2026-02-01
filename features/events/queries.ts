import { supabase } from '@/lib/supabase/client'
import type { DbEvent, SeoulEvent } from '@/features/events/types/event'
import { mapCategorySeqToCategory } from '@/features/events/constants'

/**
 * DB에서 내려오는 'NULL' 문자열이나 빈 값을 정제합니다.
 */
const sanitize = (val: string | null | undefined): string | undefined => {
  if (!val || val === 'NULL' || val === 'null') return undefined
  return val
}

/**
 * 특정 이벤트 상세 정보를 DB에서 직접 조회하고 매핑합니다.
 */
export async function fetchEventById(id: string): Promise<SeoulEvent | null> {
  const { data, error } = await supabase.from('events').select('*').eq('event_id', id).single()

  if (error || !data) {
    console.error(`Error fetching event ${id}:`, error)
    return null
  }

  const event = data as DbEvent

  return {
    id: event.event_id,
    title: event.event_name,
    description: sanitize(event.describe),
    category: mapCategorySeqToCategory(event.category_seq),
    startDate: event.start_date,
    endDate: event.end_date,
    locationName: sanitize(event.place) || sanitize(event.org_name) || '장소 정보 없음',
    latitude: event.latitude,
    longitude: event.longitude,
    thumbnailUrl: event.main_img,
    externalLink: event.homepage_link || event.detail_url || '',

    // 상세 정보 정제 적용
    isFree: event.is_free,
    ticketPrice: sanitize(event.ticket_price),
    useTarget: sanitize(event.use_target),
    player: sanitize(event.player),
    orgName: sanitize(event.org_name),
    theme: sanitize(event.theme),
    etcDescription: sanitize(event.etc_desc),
  }
}
