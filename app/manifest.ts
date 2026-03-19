import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Seoulful - 서울 축제/전시 지도',
    short_name: 'Seoulful',
    description: '서울시 공공데이터 기반 실시간 축제/전시 지도 서비스',
    id: '/',
    start_url: '/map',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172a',
    orientation: 'portrait',
    categories: ['travel', 'lifestyle', 'entertainment'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
