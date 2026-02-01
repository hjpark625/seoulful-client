import { supabase } from '@/lib/supabase/client'
import type { DbEvent, SeoulEvent } from '@/features/events/types/event'
import { mapCategorySeqToCategory } from '@/features/events/constants'
import { sanitizeNull } from '@/lib/utils/string'

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
    description: sanitizeNull(event.describe),
    category: mapCategorySeqToCategory(event.category_seq),
    startDate: event.start_date,
    endDate: event.end_date,
    locationName: sanitizeNull(event.place) || sanitizeNull(event.org_name) || '장소 정보 없음',
    latitude: event.latitude,
    longitude: event.longitude,
    thumbnailUrl: event.main_img,
    externalLink: event.homepage_link || event.detail_url || '',

    // 상세 정보 정제 적용
    isFree: event.is_free,
    ticketPrice: sanitizeNull(event.ticket_price),
    useTarget: sanitizeNull(event.use_target),
    player: sanitizeNull(event.player),
    orgName: sanitizeNull(event.org_name),
    theme: sanitizeNull(event.theme),
    etcDescription: sanitizeNull(event.etc_desc),
    displayTime: sanitizeNull(event.display_time),
  }
}
