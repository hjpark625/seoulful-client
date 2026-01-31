import Link from 'next/link'
import { ArrowLeft, Map, Heart, Database, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ValueCard } from '@/components/common/ValueCard'

export const metadata = {
  title: '서비스 소개',
  description: '서울풀이 만들어진 이유와 우리가 제공하는 가치에 대해 이야기합니다.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Header & Navigation */}
      <header className="sticky top-0 z-50 flex h-16 items-center border-b border-slate-100 bg-white/80 px-4 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">돌아가기</span>
          </Link>
          <span className="font-bold text-slate-900">Seoulful Story</span>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-20">
        {/* 2. Hero Message */}
        <section className="animate-in fade-in slide-in-from-bottom-4 mb-20 space-y-6 text-center duration-700">
          <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            &quot;이번 주말에 뭐 하지?&quot; <br />
            <span className="text-blue-600">검색하다 지친 당신</span>을 위해
          </h1>
          <p className="mx-auto max-w-lg text-lg leading-relaxed text-slate-600">
            광고성 블로그, 종료된 행사 정보, 너무 먼 장소...
            <br />
            소중한 주말 시간을 검색하는 데 낭비하지 마세요.
          </p>
        </section>

        {/* 3. Core Values */}
        <section className="mb-20 grid gap-8 sm:grid-cols-2">
          <ValueCard
            icon={<Database className="h-6 w-6 text-blue-500" />}
            title="공공데이터 100%"
            desc="서울시가 인증한 공식 행사 데이터만을 사용하여 신뢰할 수 있는 정보를 제공합니다."
          />
          <ValueCard
            icon={<Zap className="h-6 w-6 text-yellow-500" />}
            title="이번 주말 큐레이션"
            desc="수많은 행사 중 '지금', '내 주변에서' 즐길 수 있는 것들만 쏙쏙 골라 보여드립니다."
          />
          <ValueCard
            icon={<Map className="h-6 w-6 text-green-500" />}
            title="지도 중심 경험"
            desc="복잡한 목록 대신, 직관적인 지도로 내 동선에 맞는 데이트 코스를 짜보세요."
          />
          <ValueCard
            icon={<Heart className="h-6 w-6 text-red-500" />}
            title="낭만적인 발견"
            desc="유명한 핫플레이스뿐만 아니라, 당신만 알고 싶은 숨겨진 명소를 찾아드립니다."
          />
        </section>

        {/* 4. Maker's Message */}
        <section className="mb-20 rounded-2xl bg-slate-50 p-8 text-center sm:p-12">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">만든 사람들</h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Seoulful은 서울을 사랑하는 1인 개발자와
            <br />
            데이터 분석 AI가 함께 만들어가는 프로젝트입니다.
            <br />
            여러분의 피드백이 더 나은 주말을 만듭니다.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="mailto:zero950@gmail.com">
              <Button variant="outline" size="sm">
                문의하기
              </Button>
            </Link>
            <Link href="https://github.com/hjpark625" target="_blank">
              <Button variant="outline" size="sm">
                Github
              </Button>
            </Link>
          </div>
        </section>

        {/* 5. Bottom CTA */}
        <div className="text-center">
          <h3 className="mb-6 text-xl font-bold text-slate-900">이제, 서울의 낭만을 찾으러 갈까요?</h3>
          <Link href="/map">
            <Button size="lg" className="h-14 w-full max-w-xs animate-bounce rounded-full text-lg font-bold shadow-xl">
              지도 보러 가기
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
