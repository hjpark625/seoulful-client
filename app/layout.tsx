import { Noto_Sans_KR, Inter } from 'next/font/google'
import '@/app/globals.css'

import type { Metadata, Viewport } from 'next'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const notoSansKr = Noto_Sans_KR({
  variable: '--font-noto-sans-kr',
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Seoulful',
  description: '서울특별시 내 문화 및 행사 컨텐츠 알리미 서비스',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} ${notoSansKr.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
