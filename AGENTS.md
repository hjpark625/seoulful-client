# Repository Guidelines

## Project Structure & Module Organization

이 저장소는 Next.js App Router 기반입니다. 기능별 로직은 도메인 폴더에 가깝게 유지하세요.

- `app/`: 라우트 세그먼트, 페이지 진입점, API 라우트 (`app/api/**/route.ts`)
- `app/map/`, `app/search/`: 지도/검색 화면과 해당 하위 UI 컴포넌트(`_components`) 및 훅(`_hooks`)
- `features/events/`: 이벤트 도메인 로직 (components, hooks, service, constants, types)
- `components/common/`, `components/ui/`: 공용 UI 및 shadcn 스타일 프리미티브
- `lib/`: 공통 유틸(`lib/utils/*`), API 타입, Supabase 클라이언트, 상태 저장소
- `public/`: 정적 에셋(아이콘, 로고)

새 비즈니스 로직은 전역 폴더를 늘리기보다 `features/<domain>/` 아래에 먼저 추가하세요.

## Build, Test, and Development Commands

`pnpm`과 Node `v24`를 사용합니다(`.nvmrc` 참고).

- `pnpm dev`: 로컬 개발 서버 실행
- `pnpm build`: 프로덕션 빌드 생성
- `pnpm start`: 빌드된 앱 실행
- `pnpm lint`: ESLint 검사 실행
- `pnpm lint-staged`: 스테이징 파일 lint/format 검사(프리커밋 훅에서도 실행)
- `pnpm docker:build` / `pnpm docker:push`: 컨테이너 이미지 빌드/푸시

## Coding Style & Naming Conventions

TypeScript 우선, 함수형 React 컴포넌트, 2칸 들여쓰기, 세미콜론 미사용, 작은따옴표, trailing comma를 사용합니다.

- Formatting: Prettier (`prettier.config.mjs`) + Tailwind plugin
- Linting: ESLint (`eslint.config.mjs`) + Next.js + `typescript-eslint`
- Naming:
- Components: `PascalCase.tsx` (예: `EventCard.tsx`)
- Hooks: `useXxx.ts` (예: `useEvents.ts`)
- Utilities: `lib/utils/` 아래 짧은 소문자 파일명

import 순서와 Tailwind 클래스는 포매터 친화적으로 유지하고, PR 전에 반드시 lint를 실행하세요.

## Testing Guidelines

현재 전용 테스트 러너가 설정되어 있지 않습니다(`test` 스크립트 없음). 당분간 아래를 기준으로 검증하세요.

- `pnpm lint`와 `pnpm build` 성공을 필수 체크로 간주
- 변경된 라우트를 수동 검증 (`/map`, `/search`, `/events`, `/events/[id]`, `/about`)
- 테스트 추가 시 기능 코드와 같은 위치에 두고 `*.test.ts(x)` 규칙 사용

## Commit & Pull Request Guidelines

커밋은 저장소 이력의 Conventional Commit 패턴을 따르세요.

- `feat: ...`, `refactor: ...`, `feat(detail): ...`, `refactor(map): ...`
- 제목은 명령형으로 짧고 명확하게 작성

PR에는 다음 내용을 포함하세요.

- 사용자 관점 변경사항 요약
- 관련 이슈 링크(해당 시)
- UI 변경 스크린샷/영상(필요 시 데스크톱+모바일)
- 환경변수/설정 변경 메모(`.env.local` 키, API 동작)
