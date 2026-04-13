import hrApi from '@/services/hrApi'

/** active 알고리즘 버전 ID 조회 (HR 서버 경유) */
export async function fetchActiveAlgorithmVersionId() {
  const res = await hrApi.get('/api/v1/hr/evaluation-periods/active-algorithm')
  const id = res.data?.data
  if (!id) throw new Error('활성화된 알고리즘 버전이 없습니다.')
  return id
}

/** 평가기간 목록 조회 */
export function fetchEvaluationPeriods(params = {}) {
  return hrApi.get('/api/v1/hr/evaluation-periods', { params })
}

/** 평가기간 생성 */
export function createEvaluationPeriod({ algorithmVersionId, evalYear, evalSequence, evalType, startDate, endDate }) {
  return hrApi.post('/api/v1/hr/evaluation-periods', {
    algorithmVersionId,
    evalYear,
    evalSequence,
    evalType,
    startDate,
    endDate,
  })
}

/** 평가기간 수정 (startDate, endDate, algorithmVersionId 변경) */
export function updateEvaluationPeriod(periodId, { startDate, endDate, algorithmVersionId }) {
  return hrApi.patch(`/api/v1/hr/evaluation-periods/${periodId}`, {
    startDate,
    endDate,
    algorithmVersionId,
    status: 'IN_PROGRESS',
  })
}

/** 평가기간 마감 */
export function closeEvaluationPeriod(periodId) {
  return hrApi.patch(`/api/v1/hr/evaluation-periods/${periodId}`, { status: 'CLOSING' })
}

/** 평가기간 확정 */
export function confirmEvaluationPeriod(periodId) {
  return hrApi.patch(`/api/v1/hr/evaluation-periods/${periodId}`, { status: 'CONFIRMED' })
}

/** 평가기간 삭제 (관련 평가내역 포함) */
export function deleteEvaluationPeriod(periodId) {
  return hrApi.delete(`/api/v1/hr/evaluation-periods/${periodId}`)
}
