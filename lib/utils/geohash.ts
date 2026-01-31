import ngeohash from 'ngeohash'

/**
 * 위도/경도를 geohash로 인코딩합니다.
 * @param latitude 위도
 * @param longitude 경도
 * @param precision 정밀도 (기본값: 5, 약 4.9km x 4.9km 영역)
 */
export function encodeGeohash(latitude: number, longitude: number, precision: number = 5): string {
  return ngeohash.encode(latitude, longitude, precision)
}

/**
 * geohash를 위도/경도로 디코딩합니다.
 * @param geohash 디코딩할 geohash 문자열
 * @returns { latitude, longitude } 좌표 객체
 */
export function decodeGeohash(geohash: string): { latitude: number; longitude: number } {
  return ngeohash.decode(geohash)
}

/**
 * geohash의 바운딩 박스를 반환합니다.
 * @param geohash geohash 문자열
 * @returns [minLat, minLon, maxLat, maxLon] 배열
 */
export function getGeohashBounds(geohash: string): [number, number, number, number] {
  return ngeohash.decode_bbox(geohash)
}

/**
 * 중심 geohash와 8방향 인접 geohash를 포함한 9개 geohash 배열을 반환합니다.
 * @param geohash 중심 geohash
 */
export function getNeighbors(geohash: string): string[] {
  if (!geohash) return []

  const neighbors = ngeohash.neighbors(geohash)
  // ngeohash.neighbors는 8개의 인접 geohash를 반환 (n, ne, e, se, s, sw, w, nw 순서)
  return [geohash, ...neighbors]
}

/**
 * 특정 방향의 인접 geohash를 반환합니다.
 * @param geohash 기준 geohash
 * @param direction 방향 ('n' | 's' | 'e' | 'w')
 */
export function getNeighbor(geohash: string, direction: 'n' | 's' | 'e' | 'w'): string {
  if (!geohash) return ''
  return ngeohash.neighbor(geohash, [
    direction === 'n' ? 1 : direction === 's' ? -1 : 0,
    direction === 'e' ? 1 : direction === 'w' ? -1 : 0,
  ])
}
