/**
 * DB에서 내려오는 'NULL' 문자열이나 빈 값을 정제합니다.
 */
export const sanitizeNull = (val: string | null | undefined): string | undefined => {
  if (!val || val === 'NULL' || val === 'null') return undefined
  return val
}
