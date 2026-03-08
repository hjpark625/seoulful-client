import type { EventStatus } from '@/features/events/types/event'
import { getEventStatusLabel } from '@/lib/utils/date'
import { cn } from '@/lib/cn'

interface EventStatusBadgeProps {
  status: EventStatus
  className?: string
}

const STATUS_STYLES: Record<EventStatus, string> = {
  UPCOMING: 'bg-amber-50 text-amber-700 ring-amber-200',
  ONGOING: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  ENDED: 'bg-slate-100 text-slate-600 ring-slate-200',
}

export function EventStatusBadge({ status, className }: EventStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        STATUS_STYLES[status],
        className,
      )}
    >
      {getEventStatusLabel(status)}
    </span>
  )
}
