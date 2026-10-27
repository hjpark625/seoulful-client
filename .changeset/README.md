# Changesets

사용자에게 배포할 변경에는 `pnpm changeset`으로 changeset을 추가합니다.
`seoulful-client`의 patch / minor / major와 변경 설명을 선택하고 기능 코드와 함께 커밋하세요.
버전과 CHANGELOG.md는 Changesets가 관리하므로 직접 올리지 않습니다.

1. changeset이 포함된 PR을 main에 병합합니다.
2. Actions가 `changeset-release/main` 브랜치의 릴리스 PR을 생성하거나 갱신합니다.
3. 릴리스 PR의 버전과 CHANGELOG를 확인하고 main에 병합합니다.
4. Actions가 해당 버전의 `vX.Y.Z` 태그와 GitHub Release를 생성하고 Railway에 배포합니다.

이 앱은 private 패키지이며 npm에 게시하지 않습니다.
문서 수정처럼 릴리스가 필요 없는 작업에는 changeset을 생략해도 됩니다.
보류 중인 changeset이 없고 이미 배포한 버전이면 새 Release를 만들지 않습니다.
