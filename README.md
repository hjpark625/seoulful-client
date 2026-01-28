# 🇰🇷 Seoulful (서울풀) - Client

> **"이번 주말, 서울의 낭만을 찾아서"**  
> 서울시 공공데이터 기반 실시간 축제/전시 큐레이션 지도 서비스

![Seoulful Preview](https://via.placeholder.com/1200x630.png?text=Seoulful+Service+Preview)
*(스크린샷 이미지는 추후 교체 예정)*

## 📖 Project Overview

**Seoulful**은 "검색하다 지친 당신"을 위해 만들어진 **초개인화 데이트/나들이 코스 추천 서비스**입니다.  
복잡한 리스트 대신 **지도(Map)** 위에서 직관적으로 정보를 탐색하고, **"이번 주말"** 필터를 통해 당장 갈 수 있는 핫플레이스만 쏙쏙 골라 보여줍니다.

### ✨ Key Features (핵심 기능)

- **📍 Interactive Map:** 카카오맵 기반의 부드러운 지도 경험 (Clustering 지원)
- **📅 Weekend Filter:** 이번 주 금~일요일에 열리는 행사만 필터링 (Timezone-safe)
- **📱 Mobile First:** 모바일 환경에 최적화된 Bottom Sheet (Drawer) UI
- **💎 Clean UI:** `shadcn/ui` + `Tailwind CSS` + `Pretendard` 폰트 적용
- **🔒 Security:** Supabase RLS 정책을 통한 안전한 데이터 접근

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **UI Library** | [shadcn/ui](https://ui.shadcn.com/) (Radix UI) |
| **State Mgt** | [SWR](https://swr.vercel.app/) (Data Fetching), React Hooks |
| **Map SDK** | [react-kakao-maps-sdk](https://react-kakao-maps-sdk.jaewon.me/) |
| **Backend** | [Supabase](https://supabase.com/) (PostgreSQL, Auth) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Getting Started

이 프로젝트를 로컬 환경에서 실행하려면 다음 단계가 필요합니다.

### 1. Prerequisites

- Node.js 18+
- pnpm (권장) or npm/yarn
- Kakao Developers API Key
- Supabase Project

### 2. Installation

```bash
# Repository Clone
git clone https://github.com/hjpark625/seoulful-client.git
cd seoulful-client

# Install Dependencies
pnpm install
```

### 3. Environment Setup

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 키를 입력하세요.

```bash
# .env.local

# Supabase (Public)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Kakao Maps (Javascript Key)
NEXT_PUBLIC_KAKAO_MAP_APP_KEY=your_kakao_map_api_key
```

### 4. Run Development Server

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000`으로 접속하여 확인합니다.

---

## 📂 Project Structure

```text
/
├── app/                  # Next.js App Router
│   ├── map/              # 지도 서비스 페이지
│   ├── about/            # 서비스 소개 페이지
│   ├── not-found.tsx     # 404 페이지
│   └── error.tsx         # 전역 에러 페이지
├── components/           # 공용 컴포넌트
│   ├── common/           # FilterChip, ValueCard 등
│   └── ui/               # shadcn/ui (Button, Drawer, Skeleton)
├── features/             # 비즈니스 로직 (Feature-based)
│   └── events/           # 행사 데이터 관련 (Service, Hooks, Components)
├── lib/                  # 유틸리티 및 설정
│   ├── supabase/         # Supabase Client
│   └── utils/            # 날짜 계산 등 헬퍼 함수
└── public/               # 정적 파일 (Images, Fonts)
```

---

## 🤝 Contribution

1. 이 저장소를 **Fork** 합니다.
2. 새로운 Branch를 생성합니다 (`git checkout -b feature/AmazingFeature`).
3. 변경 사항을 **Commit** 합니다 (`git commit -m 'Add some AmazingFeature'`).
4. Branch에 **Push** 합니다 (`git push origin feature/AmazingFeature`).
5. **Pull Request**를 생성합니다.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Made with ❤️ in Seoul**