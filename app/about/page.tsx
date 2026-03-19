import Link from 'next/link'
import Image from 'next/image'
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
            <span className="hidden text-sm font-medium sm:inline">돌아가기</span>
          </Link>
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Seoulful Logo" width={24} height={24} className="rounded-md" />
            <span className="font-bold text-slate-900">Seoulful Story</span>
          </div>
          <div className="hidden w-16 sm:block" /> {/* Spacer for centering */}
          <Link href="/map" className="block sm:hidden">
            <Button size="sm" variant="ghost" className="font-bold text-blue-600">
              지도보기
            </Button>
          </Link>
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
            desc="서울시 공공데이터를 바탕으로 신뢰할 수 있는 행사 정보를 제공합니다."
          />
          <ValueCard
            icon={<Zap className="h-6 w-6 text-yellow-500" />}
            title="진행 중 행사 필터"
            desc="수많은 정보 중 현재 진행 중이거나 곧 시작할 행사만 필터링하여 헛걸음하지 않게 도와드립니다."
          />
          <ValueCard
            icon={<Map className="h-6 w-6 text-green-500" />}
            title="지도 중심 경험"
            desc="복잡한 목록 대신, 직관적인 지도로 내 동선에 맞는 나들이 코스를 짜보세요."
          />
          <ValueCard
            icon={<Heart className="h-6 w-6 text-red-500" />}
            title="낭만적인 발견"
            desc="유명한 축제부터 동네의 작은 전시까지, 서울의 다채로운 매력을 지도를 통해 발견해보세요."
          />
        </section>

        {/* 4. Maker's Message */}
        <section className="mb-20 rounded-2xl bg-slate-50 p-8 text-center sm:p-12">
          <div className="mb-6 flex justify-center">
            <Image src="/logo.png" alt="Seoulful Logo" width={48} height={48} className="rounded-xl shadow-sm" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-slate-900">서울의 낭만을 더 쉽고, 더 직관적으로</h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Seoulful은 서울의 다채로운 행사 정보를 한눈에 발견하고,
            <br />
            소중한 사람과 더 쉽게 공유할 수 있도록 만드는 서비스입니다.
            <br />
            <br />
            광고성 정보와 무분별한 검색 결과 사이에서 길을 잃지 않도록,
            <br />
            서울시 공공데이터를 바탕으로 지금 즐길 수 있는 행사 정보를 지도 위에 담았습니다.
          </p>
          <div className="flex flex-col items-center gap-3">
            <div className="flex justify-center gap-4">
              <Link href="https://github.com/hjpark625/seoulful-client/issues/new/choose" target="_blank">
                <Button variant="outline" size="sm">
                  버그/제안 등록
                </Button>
              </Link>
              <Link href="mailto:zero950@gmail.com">
                <Button variant="outline" size="sm">
                  이메일 문의
                </Button>
              </Link>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-500">
              사용자 여러분의 피드백을 바탕으로 더 나은 탐색 경험을 계속 만들어가고 있습니다. 이용 중 불편한 점이나
              제안하고 싶은 기능이 있다면 언제든 들려주세요. 그 목소리가 Seoulful의 다음 방향이 됩니다.
            </p>
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
