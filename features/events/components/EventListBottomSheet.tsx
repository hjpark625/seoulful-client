import { Drawer } from 'vaul'
import { Calendar, MapPin } from 'lucide-react'
import Image from 'next/image'
import type { SeoulEvent } from '@/features/events/types/event'
import { getCategoryStyle } from '@/features/events/constants'
import { Button } from '@/components/ui/button'

interface EventListBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  events: SeoulEvent[]
  onSelectEvent: (eventId: number) => void
}

export function EventListBottomSheet({ isOpen, onClose, events, onSelectEvent }: EventListBottomSheetProps) {
  if (!events || events.length === 0) return null

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Drawer.Content className="fixed right-0 bottom-0 left-0 z-50 mt-24 flex h-[80vh] flex-col rounded-t-[10px] bg-slate-50 outline-none">
          <div className="flex-1 overflow-y-auto rounded-t-[10px] bg-white p-4 pb-20">
            <div className="mx-auto mb-6 h-1.5 w-12 flex-shrink-0 rounded-full bg-slate-200" />

            <div className="mb-6 px-2">
              <Drawer.Title className="text-xl font-bold text-slate-900">
                이 장소의 행사 <span className="text-blue-600">{events.length}</span>건
              </Drawer.Title>
              <Drawer.Description className="mt-1 text-sm text-slate-500">
                원하시는 행사를 선택해주세요.
              </Drawer.Description>
            </div>

            <div className="space-y-3">
              {events.map((event) => {
                const categoryStyle = getCategoryStyle(event.category)
                return (
                  <button
                    key={event.id}
                    onClick={() => onSelectEvent(event.id)}
                    className="flex w-full items-start gap-4 rounded-xl border border-slate-100 bg-white p-3 text-left shadow-sm transition-all hover:bg-slate-50 active:scale-[0.99]"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {event.thumbnailUrl ? (
                        <Image src={event.thumbnailUrl} alt={event.title} fill className="object-cover" unoptimized />
                      ) : (
                        <div
                          className={`flex h-full w-full items-center justify-center ${categoryStyle.color} text-2xl`}
                        >
                          {categoryStyle.icon}
                        </div>
                      )}
                      <div className="absolute top-0 right-0 rounded-bl-lg bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-slate-900 shadow-sm backdrop-blur-sm">
                        {categoryStyle.label}
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                      <div>
                        <h3 className="line-clamp-1 text-base font-bold text-slate-900">{event.title}</h3>
                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(event.startDate).toLocaleDateString()} ~{' '}
                            {new Date(event.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">{event.locationName || event.orgName}</span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        {event.isFree ? (
                          <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">
                            무료
                          </span>
                        ) : (
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                            유료
                          </span>
                        )}
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                          {event.category}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
