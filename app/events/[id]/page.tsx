import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  ExternalLink,
  Share2,
  Heart,
  Ticket,
  Users,
  Mic,
  Building2,
  Map as MapIcon,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils/date'
import { fetchEventById } from '@/features/events/queries'
import { EventHeroImage } from '@/features/events/components/EventHeroImage'
import { ParkingButton } from '@/features/events/components/PartnerActionButtons'
import { CategoryBadge } from '@/features/events/components/CategoryBadge'
import { EventInfoRow } from '@/features/events/components/EventInfoRow'

// Force dynamic rendering since we're fetching data
export const dynamic = 'force-dynamic'

export default async function EventDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params
  const { from } = await searchParams
  const event = await fetchEventById(id)

  const backLink = from === 'map' ? `/map?eventId=${id}` : '/events'

  if (!event) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Navbar (Absolute on mobile, Sticky on desktop) */}
      <header className="fixed top-0 right-0 left-0 z-20 flex items-center justify-between p-4 sm:sticky sm:border-b sm:border-slate-100 sm:bg-white/80 sm:backdrop-blur-md">
        <Link href={backLink}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/50 backdrop-blur-sm hover:bg-white sm:bg-transparent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/50 backdrop-blur-sm hover:bg-white sm:bg-transparent"
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/50 backdrop-blur-sm hover:bg-white sm:bg-transparent"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl">
        {/* Hero Image Component */}
        <EventHeroImage src={event.thumbnailUrl} alt={event.title} category={event.category} title={event.title} />

        {/* Desktop Header (Visible only on SM+) */}
        <div className="hidden px-6 pt-8 sm:block">
          <CategoryBadge category={event.category} className="mb-3 text-sm" />
          <h1 className="text-3xl font-extrabold text-slate-900">{event.title}</h1>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-8 px-6">
          {/* Quick Info Grid */}
          <div className="grid gap-4 rounded-2xl bg-slate-50 p-5">
            <EventInfoRow icon={Calendar} iconClassName="text-slate-500 h-5 w-5">
              <p className="font-semibold text-slate-900">일정</p>
              <p className="text-sm text-slate-600">
                {formatDate(event.startDate)} ~ {formatDate(event.endDate)}
              </p>
            </EventInfoRow>

            {event.displayTime && (
              <EventInfoRow icon={Clock} iconClassName="text-slate-500 h-5 w-5">
                <p className="font-semibold text-slate-900">행사 시간</p>
                <p className="text-sm text-slate-600">{event.displayTime}</p>
              </EventInfoRow>
            )}

            <EventInfoRow icon={MapPin} iconClassName="text-slate-500 h-5 w-5">
              <p className="font-semibold text-slate-900">장소</p>
              <p className="text-sm text-slate-600">{event.locationName}</p>
            </EventInfoRow>

            <EventInfoRow icon={Ticket} iconClassName="text-slate-500 h-5 w-5">
              <p className="font-semibold text-slate-900">이용 요금</p>
              <p className={`text-sm ${event.isFree ? 'font-bold text-green-600' : 'text-slate-600'}`}>
                {event.isFree ? '무료' : event.ticketPrice || '정보 없음'}
              </p>
            </EventInfoRow>

            {event.useTarget && (
              <EventInfoRow icon={Users} iconClassName="text-slate-500 h-5 w-5">
                <p className="font-semibold text-slate-900">이용 대상</p>
                <p className="text-sm text-slate-600">{event.useTarget}</p>
              </EventInfoRow>
            )}

            {event.externalLink && (
              <EventInfoRow icon={ExternalLink} iconClassName="text-slate-500 h-5 w-5">
                <p className="font-semibold text-slate-900">공식 홈페이지</p>
                <Link
                  href={event.externalLink}
                  target="_blank"
                  className="text-sm text-blue-600 underline-offset-4 hover:underline"
                >
                  바로가기
                </Link>
              </EventInfoRow>
            )}
          </div>

          {/* Monetization: Parking Ticket */}
          <ParkingButton locationName={event.locationName} />

          {/* Description */}
          <div>
            <h2 className="mb-3 text-lg font-bold text-slate-900">상세 정보</h2>
            <div className="prose prose-slate max-w-none text-sm leading-relaxed whitespace-pre-wrap text-slate-600">
              {event.description || event.etcDescription || '상세 설명이 없습니다.'}
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-3 border-t border-slate-100 pt-6">
            {event.player && (
              <EventInfoRow icon={Mic} iconClassName="text-slate-400 h-5 w-5">
                <span className="text-slate-600">
                  <span className="font-semibold text-slate-900">출연:</span> {event.player}
                </span>
              </EventInfoRow>
            )}
            {event.orgName && (
              <EventInfoRow icon={Building2} iconClassName="text-slate-400 h-5 w-5">
                <span className="text-slate-600">
                  <span className="font-semibold text-slate-900">주최:</span> {event.orgName}
                </span>
              </EventInfoRow>
            )}
          </div>
        </div>
      </main>

      {/* Floating Bottom Bar */}
      <div className="fixed right-0 bottom-0 left-0 border-t border-slate-200 bg-white p-4 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sm:pb-4">
        <div className="mx-auto flex max-w-3xl gap-3">
          <Link href={`/map?eventId=${event.id}`} className="flex-1">
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2 border-blue-200 bg-blue-50 text-base font-bold text-blue-700 hover:bg-blue-100 hover:text-blue-800"
            >
              <MapIcon className="h-5 w-5" />
              지도에서 위치 보기
            </Button>
          </Link>

          {event.externalLink && (
            <Link href={event.externalLink} target="_blank" className="flex-1">
              <Button size="lg" className="w-full gap-2 bg-slate-900 text-base font-bold hover:bg-slate-800">
                공식 홈페이지
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
