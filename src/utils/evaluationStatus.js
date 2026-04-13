/**
 * 백엔드 status (NO_INPUT | DRAFT | SUBMITTED | CONFIRMED)
 * → 컴포넌트 내부 status (not_started | in_progress | submitted)
 */
export function mapStatus(apiStatus) {
  if (apiStatus === 'SUBMITTED' || apiStatus === 'CONFIRMED') return 'submitted'
  if (apiStatus === 'DRAFT') return 'in_progress'
  return 'not_started'
}

/**
 * 컴포넌트 내부 status → 표시 라벨
 * CONFIRMED는 별도로 처리해야 하므로 apiStatus도 받음
 */
export function statusToLabel(status, apiStatus) {
  if (apiStatus === 'CONFIRMED') return '확정'
  if (status === 'submitted') return '제출 완료'
  if (status === 'in_progress') return '초안 저장'
  return '작성 전'
}
