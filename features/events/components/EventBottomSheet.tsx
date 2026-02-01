'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Users, Ticket, Mic, Building2, ChevronRight } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils/date'
import type { SeoulEvent } from '@/features/events/types/event'
import { EventImage } from './EventImage'
import { CategoryBadge } from './CategoryBadge'
import { EventInfoRow } from './EventInfoRow'

interface EventBottomSheetProps {
  event: SeoulEvent | null
  isOpen: boolean
  onClose: () => void
  isLoading?: boolean
}

export function EventBottomSheet({ event, isOpen, onClose, isLoading }: EventBottomSheetProps) {
  // 닫히는 애니메이션 동안 데이터를 유지하기 위한 로컬 캐시
  const [activeEvent, setActiveEvent] = useState<SeoulEvent | null>(event)

  // event prop이 들어오면 activeEvent 업데이트 (null일 때는 무시하여 기존 데이터 유지)
  if (event && event.id !== activeEvent?.id) {
    setActiveEvent(event)
  }

  // 렌더링 할 데이터가 없으면(초기 상태) 아무것도 안 그림
  if (!activeEvent && !isLoading) return null

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md pt-2 pb-6">
          {isLoading ? (
            <BottomSheetSkeleton />
          ) : activeEvent ? (
            <>
              {/* 1. Header Image & Badge */}
              <div className="relative isolate h-48 w-full overflow-hidden rounded-t-xl">
                <EventImage
                  src={activeEvent.thumbnailUrl}
                  alt={activeEvent.title}
                  className="h-full w-full rounded-t-xl"
                />
                <CategoryBadge category={activeEvent.category} className="absolute top-4 left-4" />
              </div>

              {/* 2. Content */}
              <div className="p-4">
                <DrawerHeader className="p-0 text-left">
                  <DrawerTitle className="text-xl leading-tight font-bold">{activeEvent.title}</DrawerTitle>
                  <DrawerDescription className="sr-only">Event Details</DrawerDescription>
                </DrawerHeader>

                <div className="mt-4 space-y-3">
                  <EventInfoRow icon={Calendar}>
                    {formatDate(activeEvent.startDate)} ~ {formatDate(activeEvent.endDate)}
                  </EventInfoRow>

                  <EventInfoRow icon={MapPin}>{activeEvent.locationName || '장소 정보 없음'}</EventInfoRow>

                  {activeEvent.useTarget && <EventInfoRow icon={Users}>{activeEvent.useTarget}</EventInfoRow>}

                  <EventInfoRow icon={Ticket}>
                    <span className={activeEvent.isFree ? 'font-bold text-green-600' : ''}>
                      {activeEvent.isFree ? '무료' : activeEvent.ticketPrice || '요금 정보 없음'}
                    </span>
                  </EventInfoRow>

                  {activeEvent.player && (
                    <EventInfoRow icon={Mic}>
                      <span className="line-clamp-1">{activeEvent.player}</span>
                    </EventInfoRow>
                  )}

                  {activeEvent.orgName && <EventInfoRow icon={Building2}>{activeEvent.orgName}</EventInfoRow>}

                  {(activeEvent.description || activeEvent.etcDescription) && (
                    <div className="mt-2 border-t border-gray-100 pt-3">
                      <p className="line-clamp-4 text-sm leading-relaxed whitespace-pre-wrap text-gray-600">
                        {activeEvent.description || activeEvent.etcDescription}
                      </p>
                    </div>
                  )}
                </div>

                {/* 4. Footer CTA */}
                <DrawerFooter className="flex-row gap-2 px-0 pt-4 pb-0">
                  <Link href={`/events/${activeEvent.id}?from=map`} className="flex-1">
                    <Button size="lg" className="w-full bg-blue-600 text-base font-bold text-white hover:bg-blue-700">
                      자세히 보기
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>

                  <DrawerClose asChild>
                    <Button variant="outline" size="lg" className="flex-1">
                      닫기
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </>
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function BottomSheetSkeleton() {
  return (
    <div className="mx-auto w-full max-w-md space-y-4 p-4">
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  )
}
