import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'culture.seoul.go.kr',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
