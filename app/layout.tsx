import type { Metadata, Viewport } from 'next'
import '@/app/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'),
  title: {
    template: '%s | Seoulful',
    default: 'Seoulful - 서울시 축제/전시 검색 서비스',
  },
  description:
    '서울시 공공데이터 기반 실시간 축제/전시 지도 서비스. 지금 내 주변에서 열리는 가장 핫한 행사를 확인하세요.',
  keywords: ['서울축제', '서울데이트', '주말데이트', '서울전시', '서울가볼만한곳', '성수동팝업', '한강공원'],
  openGraph: {
    title: 'Seoulful - 서울시 축제/전시 검색 서비스',
    description: '서울시 축제/전시 검색 서비스. 지금 내 주변에서 열리는 가장 핫한 행사를 확인하세요.',
    url: 'https://seoulful.hjpark625.site',
    siteName: 'Seoulful',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1024,
        height: 1024,
        alt: 'Seoulful Service Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seoulful - 서울시 축제/전시 검색 서비스',
    description: '지금 서울에서 가장 핫한 축제 정보를 지도에서 확인하세요.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
