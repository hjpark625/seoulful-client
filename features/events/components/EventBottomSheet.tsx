'use client'

import * as React from 'react'
import { Calendar, MapPin, ExternalLink } from 'lucide-react'
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
import type { SeoulEvent } from '../types/event'

interface EventBottomSheetProps {
  event: SeoulEvent | null
  isOpen: boolean
  onClose: () => void
  isLoading?: boolean
}

export function EventBottomSheet({ event, isOpen, onClose, isLoading }: EventBottomSheetProps) {
  const [imgError, setImgError] = React.useState(false)

  // 닫히는 애니메이션 동안 데이터를 유지하기 위한 로컬 캐시
  const [activeEvent, setActiveEvent] = React.useState<SeoulEvent | null>(event)

  // event prop이 들어오면 activeEvent 업데이트 (null일 때는 무시하여 기존 데이터 유지)
  React.useEffect(() => {
    if (event) {
      setActiveEvent(event)
      setImgError(false) // 새 이벤트가 오면 에러 상태도 초기화
    }
  }, [event])

  // 수익화: 제휴 링크 클릭 트래킹 (추후 구현)
  const handleActionClick = () => {
    if (!activeEvent?.external_link) return
    console.log(`[Analytics] Clicked action for event: ${activeEvent.id}`)
    window.open(activeEvent.external_link, '_blank')
  }

  // 렌더링 할 데이터가 없으면(초기 상태) 아무것도 안 그림
  if (!activeEvent && !isLoading) return null

  return (
    <Drawer open={isOpen} onOpenChange={open => !open && onClose()}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md pt-2 pb-6">
          {' '}
          {/* 상단 바와의 간격을 위해 pt-2 추가 */}
          {isLoading ? (
            <BottomSheetSkeleton />
          ) : activeEvent ? (
            <>
              {/* 1. Header Image & Badge */}
              <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-gray-100">
                {!imgError && activeEvent.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeEvent.thumbnail_url}
                    alt={activeEvent.title}
                    className="h-full w-full object-cover transition-opacity duration-300 hover:opacity-90"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center bg-slate-100 text-slate-400">
                    <MapPin className="mb-2 h-8 w-8 opacity-50" />
                    <span className="text-xs font-medium">이미지 준비 중</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
                  {activeEvent.category}
                </div>
              </div>

              {/* 2. Content */}
              <div className="p-4">
                <DrawerHeader className="p-0 text-left">
                  <DrawerTitle className="text-xl leading-tight font-bold">{activeEvent.title}</DrawerTitle>
                  <DrawerDescription className="sr-only">Event Details</DrawerDescription>
                </DrawerHeader>

                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      {new Date(activeEvent.start_date).toLocaleDateString()} ~{' '}
                      {new Date(activeEvent.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{activeEvent.location_name}</span>
                  </div>
                </div>

                {/* 3. Monetization: Ad Banner Placeholder */}
                <div className="mt-6 rounded-lg border border-dashed border-indigo-200 bg-indigo-50 p-3 text-center">
                  <p className="text-xs font-semibold text-indigo-600">🎫 주변 맛집/카페 10% 할인 쿠폰 받기</p>
                  <p className="text-[10px] text-indigo-400">(광고 영역 - 클릭 시 수익 발생)</p>
                </div>

                {/* 4. Footer CTA */}
                <DrawerFooter className="px-0 pt-4 pb-0">
                  <Button size="lg" className="w-full text-base font-bold" onClick={handleActionClick}>
                    상세 정보 및 예매하기
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline" className="mt-2 w-full">
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
