import Link from 'next/link'
import { MapPin, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-12 text-center sm:py-24">
      {/* Hero Section */}
      <div className="animate-in fade-in slide-in-from-bottom-8 max-w-2xl space-y-10 duration-700 sm:space-y-12">
        <div className="space-y-6">
          <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold text-blue-600 shadow-sm">
            ✨ 서울시 공식 데이터 기반
          </span>
          <h1 className="text-4xl !leading-[1.15] font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            이번 주말, <br />
            <span className="text-blue-600">서울의 낭만</span>을 찾아서
          </h1>
          <p className="mx-auto max-w-lg text-base leading-relaxed text-slate-600 sm:text-xl">
            더 이상 검색창을 헤매지 마세요. <br />
            지금 진행 중인 축제와 전시만 지도 위에 남겼습니다.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-center">
          <Link href="/map">
            <Button size="lg" className="h-14 w-full gap-2 rounded-full px-8 text-lg font-bold shadow-xl sm:w-auto">
              <MapPin className="h-5 w-5" />
              지도 바로 보기
            </Button>
          </Link>
          <Link href="/about">
            <Button
              variant="outline"
              size="lg"
              className="h-14 w-full gap-2 rounded-full px-8 text-lg font-medium sm:w-auto"
            >
              <Calendar className="h-5 w-5" />
              서비스 소개
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Grid (Mockup) */}
      <div className="mt-24 grid max-w-4xl gap-6 text-left sm:mt-32 sm:grid-cols-3">
        <FeatureCard
          icon="🎉"
          title="실시간 축제 정보"
          desc="종료된 행사는 가라! 지금 핫한 페스티벌만 쏙쏙 골라 보여드려요."
        />
        <FeatureCard
          icon="💑"
          title="데이트 코스 추천"
          desc="성수, 홍대, 강남... 지역별 분위기 좋은 전시와 팝업스토어 큐레이션."
        />
        <FeatureCard
          icon="🎫"
          title="최저가 예매 꿀팁"
          desc="얼리버드 티켓 정보와 주변 맛집 할인 쿠폰까지 챙겨가세요."
        />
      </div>

      <footer className="absolute bottom-4 text-xs text-slate-400">
        © 2026 Seoulful Project. All rights reserved.
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50 transition-all hover:shadow-md">
      <div className="mb-4 text-3xl">{icon}</div>
      <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
    </div>
  )
}
