# Seoulful Server API Interface Document

이 문서는 `seoulful-server`의 API 엔드포인트 및 응답(Response) 인터페이스 정의서입니다.

## 기본 정보

- **Base URL**: (서버 배포 주소 또는 `http://localhost:3000`)
- **인증 방식**: header에 `Authorization: Bearer <token>` (JWT)

---

## 1. 인증 (Authentication)

**Prefix**: `/auth`

| Method | Endpoint | 설명 | Request Parameters / Body | Response Interface |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/auth/login/:provider` | 소셜 로그인 및 회원가입 | **Param**: `provider` ('kakao' \| 'naver')<br>**Body (Kakao)**: `{ code, redirectUrl }`<br>**Body (Naver)**: `{ code, state }` | `UserResponse` |
| **GET** | `/auth/user/:userId` | 유저 상세 정보 조회 | **Param**: `userId`<br>**Query**: `provider` ('kakao' \| 'naver')<br>**Header**: `Authorization` | `UserResponse` |
| **POST** | `/auth/token/validate` | 토큰 유효성 검증 | **Header**: `Authorization` | `void` (200 OK or Error) |
| **POST** | `/auth/token/reissue` | 토큰 재발급 | **Header**: `Authorization` (Refresh Token) | `UserResponse` |

### Response Interfaces

```typescript
interface UserResponse {
  data: {
    user_id: string;            // 사용자 고유 ID (String)
    login_method: 'naver' | 'kakao';
    nickname: string;
    email: string | null;
    profile_img: string | null;
    bookmark_list: number[];    // 북마크한 행사 ID 목록
    user_access_token: string | null;
    user_refresh_token: string | null;
    created_at: string;         // 'yyyy.MM.dd(E) HH:mm:ss' 형식
  }
}
```

---

## 2. 북마크 (Bookmark)

**Prefix**: `/bookmark`
**Required Header**: `Authorization`

| Method | Endpoint | 설명 | Request Parameters / Body | Response Interface |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/bookmark/:userId` | 북마크 목록 조회 | **Param**: `userId` | `EventListResponse` |
| **PUT** | `/bookmark/:userId` | 북마크 추가 | **Param**: `userId`<br>**Body**: `{ eventSeq: number }` | `BookmarkListResponse` |
| **DELETE** | `/bookmark/:userId` | 북마크 삭제 | **Param**: `userId`<br>**Body**: `{ eventSeq: number }` | `BookmarkListResponse` |

### Response Interfaces

```typescript
interface BookmarkListResponse {
  data: {
    bookmark_list: number[];
  }
}

// EventListResponse는 행사 정보 섹션 참조
```

---

## 3. 행사 정보 (Events)

**Prefix**: `/event`

| Method | Endpoint | 설명 | Request Parameters / Body | Response Interface |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/event/list` | 행사 목록 조회 (페이지네이션) | **Query**: `limit` (string), `offset` (string), `categorySeq` (optional string) | `EventListResponse` |
| **GET** | `/event/list/search` | 행사 검색 | **Query**:<br>- `limit`, `offset`<br>- `eventName` (optional)<br>- `startDate`, `endDate` (optional)<br>- `categorySeq`, `guSeq` (optional) | `EventListResponse` |
| **GET** | `/event/detail/:eventId` | 행사 상세 정보 조회 | **Param**: `eventId` | `EventDetailResponse` |
| **GET** | `/event/nearby` | 주변 행사 조회 | **Query**: `geohash` (string) | `NearbyEventListResponse` |

### Response Interfaces

```typescript
interface EventListResponse {
  data: {
    event_id: number;
    category_seq: number;
    event_name: string;
    period: string;
    main_img: string;
    start_date: string; // 'yyyy.M.d HH:mm'
    end_date: string;   // 'yyyy.M.d HH:mm'
    detail_url: string;
  }[];
  totalCount: number;
}

interface EventDetailResponse {
  data: {
    event_id: number;
    category_seq: number;
    gu_seq: number | null;
    event_name: string;
    period: string;
    place: string;
    org_name: string;
    use_target: string;
    ticket_price: string | null;
    player: string | null;
    describe: string | null;
    etc_desc: string | null;
    homepage_link: string;
    main_img: string;
    reg_date: string;    // 'yyyy.M.d HH:mm'
    is_public: boolean;
    start_date: string;  // 'yyyy.M.d HH:mm'
    end_date: string;    // 'yyyy.M.d HH:mm'
    theme: string | null;
    latitude: number;
    longitude: number;
    is_free: boolean;
    detail_url: string;
    geohash: string;
  }
}

interface NearbyEventListResponse {
  data: {
    // Key는 요청한 geohash 문자열
    [geohash: string]: {
      event_id: number;
      category_seq: number;
      event_name: string;
      period: string;
      main_img: string;
      start_date: string; // 'yyyy.M.d HH:mm'
      end_date: string;   // 'yyyy.M.d HH:mm'
      detail_url: string;
      latitude: number;
      longitude: number;
      geohash: string;
    }[]
  }
}
```

---

## 4. 시스템 (System / Wildcard)

| Method | Endpoint | 설명 | 비고 | Response |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | 헬스 체크 / 기본 인사 | - | `string` ("Hello World!") |
| **ALL** | `*` | 존재하지 않는 경로 처리 | - | JSON Error Message |
