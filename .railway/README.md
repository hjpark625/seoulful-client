# Seoulful 클라이언트 배포

`.railway/railway.ts`가 Railway의 `seoulful` 프로젝트 내 `seoulful-client` 서비스를 관리합니다.
`partial = 'seoulful-client'`로 소유 범위를 제한합니다. Go 서버와 DB는 각 저장소에서 별도로 관리합니다.
환경 변수는 Railway에서 유지하며 IaC에서 값을 쓰거나 삭제하지 않습니다.

## 최초 연결

1. Railway GitHub App에 `hjpark625/seoulful-client` 저장소 접근 권한을 부여합니다.
2. Railway `seoulful` → `production` 환경의 Project Token을 발급합니다.
3. GitHub 저장소 또는 `production` Environment secret에 `RAILWAY_TOKEN`으로 등록합니다.
4. Railway 변수 `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`, `NEXT_PUBLIC_SITE_URL`을 확인합니다.
   Docker 빌드 시 공개 변수로 주입되며, 변경 시 새 빌드가 필요합니다.
5. 아래 검증을 마친 변경사항과 changeset을 main에 병합한 뒤, 자동 생성되는 Changesets 릴리스 PR을 병합합니다.
6. GitHub Settings → Actions → General의 `Allow GitHub Actions to create and approve pull requests`를 활성화합니다.

GitHub Environment의 배포 브랜치/태그 제한을 사용한다면 `v*` 태그도 허용해야 합니다.
Railway의 GitHub 소스는 검증된 Release 태그의 전체 커밋 SHA로 고정됩니다.
main 변경은 Actions를 통해 릴리스 버전일 때만 배포합니다.
첫 Release의 IaC 적용이 DockerHub 이미지 소스를 GitHub 소스로 전환합니다.
DockerHub 계정/토큰 secret은 새 배포에서 사용하지 않습니다.

## 릴리스와 배포 이력

배포와 상태 확인 로직은 `.github/workflows/release.yml`의 GitHub Actions step으로 정의합니다.

1. 기능/수정 PR에 `pnpm changeset`으로 버전 증가 폭과 변경 설명을 추가합니다.
2. main 병합 시 Changesets가 `package.json` 버전과 `CHANGELOG.md`를 갱신하는 릴리스 PR을 생성합니다.
   해당 PR을 main에 병합하면 `vX.Y.Z` 태그와 CHANGELOG 기반의 **정식 GitHub Release**가 자동 생성됩니다.
   보류 중인 changeset이 있거나 버전이 그대로인 일반 main 변경에는 배포하지 않습니다.
3. Release workflow가 PR과 릴리스 커밋의 lint/build/IaC 타입 검사 및 changeset 상태를 확인합니다.
4. Railway IaC plan을 저장하고 같은 plan을 적용합니다. Railway가 Dockerfile을 빌드합니다.
   IaC는 `commitSha`만 바뀐 경우 차이를 무시하므로, Release 단계에서 해당 서비스의 소스 SHA를 명시적으로 갱신·배포합니다.
5. 해당 커밋의 Railway 배포가 `SUCCESS`가 될 때까지 기다립니다. `/api/health`가 통과해야 전환됩니다.
6. GitHub Deployments에 커밋·태그·성공/실패·Actions 실행 링크를 기록합니다.
   성공한 배포의 ID와 SHA는 Release의 `railway-deployment-<run>-<attempt>.json` 첨부 파일에도 남습니다.

초안과 prerelease는 운영 배포하지 않습니다. 태그 push 시 같은 태그의 초안/prerelease가 있으면 배포를 중단합니다.
배포 후 태그를 다른 커밋으로 이동하지 마세요. GitHub tag ruleset으로 `v*` 수정/삭제를 제한하는 것을 권장합니다.
main에서 자동 생성한 태그와 Release는 같은 workflow에서 배포까지 진행합니다.
수동 `vX.Y.Z` 태그 push와 정식 Release 발행도 지원하며, 기존 태그를 덮어쓰지 않습니다.
Changesets는 private 앱의 버전과 CHANGELOG만 관리하고, GitHub 태그/Release는 Actions에서 생성합니다. npm publish는 실행하지 않습니다.
기본 `GITHUB_TOKEN`으로 발생시킨 Release 이벤트는 다른 workflow를 실행하지 않아 중복 배포를 막습니다.

## 재배포와 롤백

Actions → Release → Run workflow에서 이미 발행한 Release 태그를 입력합니다.
워크플로가 포함된 첫 Release 이후의 버전만 이 경로로 재배포할 수 있습니다.
동일 커밋을 다시 선택해도 새 배포를 만들고 반환된 배포 ID의 성공 여부를 확인합니다.
실패한 배포는 Actions 로그와 Railway deployment ID를 확인한 뒤 재실행합니다.
운영 상태는 GitHub Deployments에서 확인하고, Releases는 배포 가능한 버전 목록으로 사용합니다.

## 로컬 검증

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm typecheck:infra

railway link --project 1a68e725-e7be-485d-bf7d-47e92e738393 \
  --environment production --service seoulful-client
export SEOULFUL_RELEASE_SHA="$(git rev-parse 'vX.Y.Z^{commit}')"
pnpm railway:plan --environment production
# plan을 검토한 뒤 적용
pnpm railway:apply --environment production
```

Railway CLI와 TypeScript SDK는 devDependencies의 버전으로 고정합니다.
`railway:plan` / `railway:apply`는 CLI에 포함된 IaC 엔진을 사용합니다.
