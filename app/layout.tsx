import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Seoulful',
    default: 'Seoulful - 이번 주말, 서울의 낭만을 찾아서',
  },
  description:
    '서울시 공공데이터 기반 실시간 축제/전시 지도 서비스. 지금 내 주변에서 열리는 가장 핫한 행사를 확인하세요.',
  keywords: ['서울축제', '서울데이트', '주말데이트', '서울전시', '서울가볼만한곳', '성수동팝업', '한강공원'],
  openGraph: {
    title: 'Seoulful - 주말 데이트 큐레이션 맵',
    description: '이번 주말 뭐 하지? 고민하지 마세요. 현재 진행 중인 서울의 모든 축제를 지도 한 눈에!',
    url: 'https://seoulful.vercel.app',
    siteName: 'Seoulful',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png', // TODO: 실제 이미지 제작 후 public 폴더에 추가 필요
        width: 1200,
        height: 630,
        alt: 'Seoulful Service Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '서울풀 - 주말 데이트 해결사',
    description: '지금 서울에서 가장 핫한 축제 정보를 지도에서 확인하세요.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard Font (CDN) - 가장 깔끔한 한글 웹폰트 */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="bg-slate-50 font-sans text-slate-900 antialiased">{children}</body>
    </html>
  )
}
