import { NextResponse } from 'next/server'
import { fetchEventById } from '@/features/events/queries'

export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id
    const seoulEvent = await fetchEventById(id)

    if (!seoulEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(seoulEvent)
  } catch (err) {
    console.error('API Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
