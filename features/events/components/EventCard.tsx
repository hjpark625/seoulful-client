import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import { cn } from '@/lib/cn'
import { CategoryBadge } from './CategoryBadge'
import { EventImage } from './EventImage'
import type { SeoulEvent } from '@/features/events/types/event'

interface EventCardProps {
  event: SeoulEvent
  className?: string
}

export function EventCard({ event, className }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`} className={cn('group block h-full', className)}>
      <div className="isolate flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-md">
        {/* Image Section */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
          <EventImage
            src={event.thumbnailUrl}
            alt={event.title}
            aspectRatio="auto"
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
          <CategoryBadge category={event.category} className="absolute top-3 left-3 px-2.5 py-1 text-[10px]" />
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-2 line-clamp-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600">
            {event.title}
          </h3>

          <div className="mt-auto space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
              <span>
                {new Date(event.startDate).toLocaleDateString()} ~ {new Date(event.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="line-clamp-1">{event.locationName}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
