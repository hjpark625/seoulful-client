# 🇰🇷 Seoulful - Client

> **"이번 주말, 서울의 낭만을 찾아서"**  
> 서울시 공공데이터 기반 실시간 축제/전시 큐레이션 지도 서비스

## 📖 Project Overview

**Seoulful**은 "검색하다 지친 당신"을 위해 만들어진 **초개인화 데이트/나들이 코스 추천 서비스**입니다.  
복잡한 리스트 대신 **지도(Map)** 위에서 직관적으로 정보를 탐색하고, **"카테고리 별"** 필터를 통해 원하는 테마의 행사를 빠르게 찾을 수 있습니다.

### ✨ Key Features (핵심 기능)

- **📍 Geohash-based Map:** 카카오맵 기반의 인터랙티브 지도로, Geohash(Precision 5) 알고리즘을 사용해 대량의 이벤트를 효율적으로 클러스터링 및 렌더링합니다.
- **🎨 Category Filtering:** 축제, 전시, 공연 등 카테고리별 필터링을 통해 사용자가 원하는 테마의 행사를 빠르게 찾을 수 있습니다.
- **📅 Real-time Curation:** 서울시 공공데이터 API와 연동되어 실시간으로 업데이트되는 전시, 축제, 공연 정보를 제공합니다.
- **📱 Mobile-First UX:** `Vaul(Drawer)`을 활용한 바텀 시트와 모바일에 최적화된 직관적인 내비게이션을 제공합니다.
- **🖼 Optimized Media:** Next.js `<Image>` 컴포넌트와 전용 에러 핸들링 로직(`EventImage`)을 통해 저품질 외부 소스에서도 안정적인 시각 경험을 제공합니다.

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16.1 (App Router)](https://js.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn/ui](https://ui.shadcn.com/) |
| **State Mgt** | [SWR](https://swr.vercel.app/) (Data Fetching), React Hooks |
| **Map SDK** | [react-kakao-maps-sdk](https://react-kakao-maps-sdk.jaewon.me/) |
| **Backend** | [Supabase](https://supabase.com/) (PostgreSQL, RLS Enabled) |
| **Utils** | `ngeohash`, `date-fns`, `clsx`, `tailwind-merge` |

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 24+
- pnpm (권장)
- Kakao Developers Javascript API Key
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

프로젝트 루트에 `.env.local` 파일을 생성하세요.

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_KAKAO_MAP_APP_KEY=your_kakao_map_api_key
```

### 4. Run Development Server

```bash
pnpm dev
```

---

## 📂 Project Structure (Modular Architecture)

```text
/
├── app/                  # Next.js App Router
│   ├── api/              # Backend API Routes (Event Proxy, Geohash Query)
│   ├── map/              # 지도 기반 검색 페이지 (메인)
│   ├── events/           # 이벤트 리스트 및 상세 페이지 ([id])
│   └── about/            # 서비스 소개 페이지
├── components/           # 공용 UI 컴포넌트
│   ├── common/           # FilterChip, ValueCard 등 재사용 단위
│   └── ui/               # shadcn/ui 기반 원자적 컴포넌트
├── features/             # 도메인 중심 비즈니스 로직
│   └── events/           # 행사 데이터 관련
│       ├── components/   # EventCard, CategoryBadge, EventBottomSheet 등
│       ├── hooks/        # useEvents (SWR 기반 데이터 페칭)
│       ├── service.ts    # API 연동 및 데이터 가공 로직
│       └── types/        # TypeScript 타입 정의
├── lib/                  # 인프라 및 유틸리티
│   ├── supabase/         # Supabase 클라이언트 설정
│   └── utils/            # geohash, date, cn(class merging) 유틸
└── public/               # 정적 자원 (지도 마커 아이콘 등)
```

---

## 🛠 Technical Achievements (MVP v1)

- **Performance Optimization:** 이미지 컨테이너의 `isolate`와 `z-index` 설정을 통해 모바일 브라우저에서의 보더 라디우스 렌더링 버그를 수정했습니다.
- **Rendering Stability:** 애니메이션 컴포넌트(Drawer) 내에서 Prop-to-State 동기화 시 발생하는 무한 렌더링 루프를 방지하기 위해 "Update during render" 패턴을 적용했습니다.
- **Type Safety:** `typescript-eslint`의 엄격한 규칙을 준수하며, 빈 인터페이스를 타입 별칭으로 전환하는 등 코드 퀄리티를 확보했습니다.

---

## 📅 Roadmap

- [x] **Phase 1 (MVP):** 지도 기반 검색, 이벤트 상세 페이지, 지오해시 클러스터링, 카테고리 필터
- [ ] **Phase 2:** 이번 주말 필터(금~일 자동 큐레이션), 유저 인증 (Supabase Auth) 및 '찜하기(Bookmark)', 공유하기(Kakao Share) 기능
- [ ] **Phase 3:** 수익화 모델 테스트 (주차권 구매 링크, 인근 파트너사 쿠폰 연동)
- [ ] **Phase 4:** Toast UI 기반 알림 시스템 전환 및 다국어 지원

---

## 🐛 Feedback & Issue Guide

Seoulful은 문의 성격에 따라 GitHub Issues와 이메일을 함께 운영합니다.

문의 채널:

- GitHub Issues: 버그 제보, 기능 제안, 데이터 오류 제보
- 이메일 문의: 개인 문의, 공개가 어려운 문의, 아주 간단한 문의

- `bug`: 화면 오류, API 동작 이상, 성능 저하, 모바일 UI 깨짐 등 실제 동작 문제
- `enhancement`: 검색 경험 개선, 필터 추가, UX 개선, 신규 기능 제안
- `data`: 행사명, 날짜, 장소, 좌표, 종료 여부 등 공공데이터 기반 정보 오류

접수 경로:

- 서비스 내 `/about` 페이지의 `버그/제안 등록` 버튼
- GitHub의 [Issue 생성 페이지](https://github.com/hjpark625/seoulful-client/issues/new/choose)
- 이메일: `zero950@gmail.com`

운영 원칙:

- 재현 가능한 사용자 문제는 `bug`를 우선 사용합니다.
- 제품 아이디어나 개선 요청은 `enhancement`로 분류합니다.
- 데이터 자체가 틀린 경우는 기능 문제와 분리해 `data`로 관리합니다.
- 공개하기 어려운 문의나 답변을 1:1로 받아야 하는 경우 이메일을 사용합니다.
- 스크린샷, 재현 단계, 참고 링크가 포함될수록 처리 속도가 빨라집니다.

추천 라벨 설정:

| Label | Color | Description |
| :--- | :--- | :--- |
| `bug` | `d73a4a` | 실제 동작 오류, UI 깨짐, 성능 이슈를 추적합니다. |
| `enhancement` | `1d76db` | 기능 제안, UX 개선, 제품 아이디어를 관리합니다. |
| `data` | `0e8a16` | 행사 정보, 날짜, 장소, 좌표 등 데이터 오류를 관리합니다. |
| `needs-triage` | `fbca04` | 새로 등록된 이슈로, 확인 및 분류가 아직 끝나지 않았음을 나타냅니다. |

운영 메모:

- 모든 이슈 템플릿은 카테고리 라벨과 함께 `needs-triage`를 기본 부여합니다.
- 모든 이슈 템플릿은 기본 담당자를 `hjpark625`로 지정합니다.
- 확인이 끝난 뒤에는 `needs-triage`를 제거하고 필요한 후속 라벨을 수동으로 추가합니다.
- `question` 라벨은 현재 사용하지 않습니다. 단순 문의는 이메일로 받습니다.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
