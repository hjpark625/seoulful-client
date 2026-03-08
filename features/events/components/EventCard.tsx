import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import { cn } from '@/lib/cn'
import { getEventStatus } from '@/lib/utils/date'
import { CategoryBadge } from './CategoryBadge'
import { EventImage } from './EventImage'
import { EventStatusBadge } from './EventStatusBadge'
import type { SeoulEvent } from '@/features/events/types/event'

interface EventCardProps {
  event: SeoulEvent
  className?: string
}

export function EventCard({ event, className }: EventCardProps) {
  const status = getEventStatus(event.startDate, event.endDate)
  const isEnded = status === 'ENDED'

  return (
    <Link href={`/events/${event.id}`} className={cn('group block h-full', className)}>
      <div
        className={cn(
          'isolate flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-md',
          isEnded && 'opacity-75 grayscale-[0.8] transition-all duration-300 hover:grayscale-0',
        )}
      >
        {/* Image Section */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
          <EventImage
            src={event.thumbnailUrl}
            alt={event.title}
            aspectRatio="auto"
            className={cn(
              'h-full w-full transition-transform duration-500 group-hover:scale-105',
              isEnded && 'opacity-60',
            )}
          />
          <CategoryBadge category={event.category} className="absolute top-3 left-3 px-2.5 py-1 text-[10px]" />
          <EventStatusBadge status={status} className="absolute top-3 right-3 shadow-sm" />
          {isEnded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 backdrop-blur-[1px]">
              <span className="rounded-full bg-slate-900/60 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
                종료된 행사
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-4">
          <h3
            className={cn(
              'mb-2 line-clamp-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600',
              isEnded && 'text-slate-500',
            )}
          >
            {event.title}
          </h3>

          <div className="mt-auto space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className={cn('h-4 w-4 shrink-0 text-slate-400', isEnded && 'text-slate-300')} />
              <span className={isEnded ? 'text-slate-400' : ''}>
                {new Date(event.startDate).toLocaleDateString()} ~ {new Date(event.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className={cn('h-4 w-4 shrink-0 text-slate-400', isEnded && 'text-slate-300')} />
              <span className={cn('line-clamp-1', isEnded && 'text-slate-400')}>{event.locationName}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
