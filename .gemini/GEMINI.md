# Seoulful - 클라이언트 프로젝트 컨텍스트 (GEMINI.md)

## 1. 프로젝트 개요

**Seoulful**은 서울시 공공데이터를 활용한 초개인화 데이트/나들이 코스 추천 서비스입니다. 축제, 전시, 공연 정보를 인터랙티브 지도를 통해 제공하며, 커플, 가족, 관광객들이 겪는 "정보 탐색 피로감"을 해결하는 것을 목표로 합니다.

- **핵심 가치:** 리스트 중심의 피로한 검색 대신, 지도 기반의 직관적인 탐색 경험 제공.
- **타겟 사용자:** "이번 주말에 뭐 하지?"를 고민하는 커플, 가족 단위 방문객 및 관광객.
- **현재 단계:** 핵심 검색 기능과 지도 인터랙션을 중심으로 한 MVP(Minimum Viable Product) 단계.

## 2. 기술 스택

### 핵심 (Core)

- **프레임워크:** Next.js 16.1 (App Router)
- **언어:** TypeScript
- **런타임:** Node.js 24+
- **패키지 매니저:** pnpm

### 프론트엔드 (Frontend)

- **스타일링:** Tailwind CSS v4, Shadcn/ui, `clsx`, `tailwind-merge`
- **지도 연동:** `react-kakao-maps-sdk`
- **상태 관리:**
  - 서버 상태: `swr` (데이터 페칭 및 캐싱)
  - 클라이언트 상태: `zustand` (예: `useMapStore`)
  - React Hooks (Context API)
- **UI 컴포넌트:** `vaul` (Drawer), `lucide-react` (아이콘), `@tanstack/react-virtual` (가상 스크롤)
- **날짜 처리:** `date-fns`

### 백엔드 / 인프라

- **BaaS:** Supabase (PostgreSQL, RLS 활성화)
- **API:** Next.js API Routes (외부 API 프록시 및 데이터 가공)
- **배포:** Docker (Multi-stage 빌드)

## 3. 시작하기

### 사전 준비 사항

- Node.js 24+
- pnpm
- 카카오맵 API 키
- Supabase 프로젝트 설정

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드 및 실행
pnpm build
pnpm start

# 린트 체크
pnpm lint
```

### 환경 변수 (.env.local)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`

## 4. 프로젝트 구조 및 아키텍처

프로젝트는 기능 중심의 모듈형 아키텍처를 따릅니다.

```text
/
├── app/                  # Next.js App Router (파일 기반 라우팅)
│   ├── api/              # 백엔드 API 루트
│   ├── map/              # 메인 지도 페이지
│   ├── search/           # 검색 및 결과 리스트 페이지
│   └── events/           # 이벤트 상세 정보 페이지
├── components/           # 공용 UI 컴포넌트
│   ├── common/           # 도메인 특화적이나 재사용 가능한 단위 (BackButton, FilterChip)
│   └── ui/               # Shadcn 기본 컴포넌트 (Button, Input 등)
├── features/             # 도메인 비즈니스 로직 (핵심)
│   └── events/
│       ├── components/   # 기능 전용 UI (EventCard, Marker 등)
│       ├── hooks/        # 데이터 페칭 로직 (useEvents)
│       ├── service.ts    # API 호출 및 데이터 변환
│       └── types/        # 도메인 타입 정의
├── lib/                  # 유틸리티 및 설정
│   ├── supabase/         # Supabase 클라이언트 설정
│   ├── store/            # 전역 상태 관리 (Zustand)
│   └── utils/            # 헬퍼 함수 (geohash, date, cn)
└── .gemini/              # 프로젝트 컨텍스트 및 AI 에이전트 지침
```

## 5. 개발 컨벤션

### 코딩 스타일

- **스타일링:** Tailwind CSS 유틸리티 클래스 사용. 클래스 병합 시 `@/lib/cn` 활용.
- **컴포넌트:** TypeScript 인터페이스를 포함한 함수형 컴포넌트 지향.
- **임포트:** `tsconfig.json`에 설정된 절대 경로(`@/components/...`) 사용.

### 상태 관리 전략

- **서버 상태:** `swr`을 사용하여 캐싱 및 갱신 처리.
- **클라이언트 상태:** 전역 UI 상태(지도 좌표, 활성 필터 등)는 `zustand` 사용. 컴포넌트 지역 로직은 React 상태 사용.
- **URL 기반 상태:** 검색 필터 및 공유 가능한 뷰를 위해 상태를 URL 쿼리 파라미터와 동기화.

### 지도 및 지오해시 (Geohash)

- 클라이언트 측 클러스터링 및 쿼리를 위해 `ngeohash` (정밀도 5) 사용.
- 지도 성능 최적화를 위해 마커 클러스터링 적용.

### Git 및 커밋

- **커밋 메시지:** 한국어로 작성 (프로젝트 히스토리 준수).
- **구조:** `type: message` 형식 (예: `feat: 검색 페이지 구현`).

## 6. 비즈니스 컨텍스트 (에이전트 가이드)

- **목표:** 쿠폰, 광고 등 수익화 모델 검증을 위한 빠른 MVP 런칭.
- **우선순위:** 개발 공수(Effort) 대비 비즈니스 영향도(Impact) 중심. 과잉 엔지니어링 지양.
- **핵심 지표:** 사용자의 지도 마커 클릭 및 검색 필터 활용도.
