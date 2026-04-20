import { hrApi } from '@/services/apiClient'

/** TL 평가 대상 목록 조회 */
export function fetchTlTargets(periodId) {
  return hrApi.get('/api/v1/hr/team-leader/evaluations/targets', {
    params: periodId ? { periodId } : {},
  })
}

/** TL 정성 평가 임시저장 / 제출 */
export function updateTlEvaluation(evaluateeId, { status, evaluationPeriodId, evalItems, evalComment, inputMethod }) {
  return hrApi.patch(`/api/v1/hr/team-leader/evaluations/${evaluateeId}`, {
    status,
    evaluationPeriodId,
    evalItems: evalItems ?? null,
    evalComment: evalComment ?? null,
    inputMethod,
  })
}

/** TL 이의신청 목록 조회 */
export function fetchTlAppeals(periodId) {
  return hrApi.get('/api/v1/hr/team-leader/appeals', {
    params: periodId ? { evaluationPeriodId: periodId } : {},
  })
}

/** TL 이의신청 상세 조회 */
export function fetchTlAppealDetail(appealId) {
  return hrApi.get(`/api/v1/hr/appeals/${appealId}`)
}

/** TL 이의신청 승인 후 DL 단계로 전달 */
export function approveTlAppeal(appealId, payload = {}) {
  return hrApi.patch(`/api/v1/hr/team-leader/appeals/${appealId}/approve`, payload)
}

/** TL 이의신청 기각 */
export function rejectTlAppeal(appealId, payload = {}) {
  return hrApi.patch(`/api/v1/hr/team-leader/appeals/${appealId}/reject`, payload)
}
