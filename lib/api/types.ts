export interface User {
  user_id: string
  login_method: 'naver' | 'kakao'
  nickname: string
  email: string | null
  profile_img: string | null
  bookmark_list: number[]
  user_access_token: string | null
  user_refresh_token: string | null
  created_at: string
}

export interface BookmarkList {
  bookmark_list: number[]
}

export interface EventDetail {
  event_id: number
  category_seq: number
  gu_seq: number | null
  event_name: string
  period: string
  place: string
  org_name: string
  use_target: string
  ticket_price: string | null
  player: string | null
  describe: string | null
  etc_desc: string | null
  homepage_link: string
  main_img: string
  reg_date: string
  is_public: boolean
  start_date: string
  end_date: string
  theme: string | null
  latitude: number
  longitude: number
  is_free: boolean
  detail_url: string
  geohash: string
}

export interface NearbyEventListResponse {
  data: {
    [geohash: string]: {
      event_id: number
      category_seq: number
      event_name: string
      period: string
      main_img: string
      start_date: string
      end_date: string
      detail_url: string
      latitude: number
      longitude: number
      geohash: string
    }[]
  }
}
