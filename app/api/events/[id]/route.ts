import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import type { DbEvent, SeoulEvent } from '@/features/events/types/event'
import { mapCategorySeqToCategory } from '@/features/events/constants'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('event_id', id) // Query by event_id
      .single()

    if (error) {
      console.error(`Error fetching event ${id}:`, error)
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const event = data as DbEvent

    // Transform
    const seoulEvent: SeoulEvent = {
      id: event.event_id,
      title: event.event_name,
      description: event.describe,
      category: mapCategorySeqToCategory(event.category_seq),
      startDate: event.start_date,
      endDate: event.end_date,
      locationName: event.org_name, // Fallback
      latitude: event.latitude,
      longitude: event.longitude,
      thumbnailUrl: event.main_img,
      externalLink: event.hompage_link,

      // Detailed Info
      isFree: event.is_free,
      ticketPrice: event.ticket_price,
      useTarget: event.use_target,
      player: event.player,
      orgName: event.org_name,
      theme: event.theme,
      etcDescription: event.etc_desc,
    }

    return NextResponse.json(seoulEvent)
  } catch (err) {
    console.error('API Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
