import { hrApi } from '@/services/apiClient'

export function fetchDlTargets(periodId) {
  return hrApi.get('/api/v1/hr/department-leader/evaluations/targets', {
    params: periodId ? { periodId } : {},
  })
}

export function fetchDlEvaluationDetail(employeeId, periodId) {
  return hrApi.get(`/api/v1/hr/department-leader/evaluations/${employeeId}`, {
    params: periodId ? { periodId } : {},
  })
}

export function updateDlEvaluation(
  employeeId,
  { status, evaluationPeriodId, evalItems, evalComment, inputMethod },
) {
  return hrApi.patch(`/api/v1/hr/department-leader/evaluations/${employeeId}`, {
    status,
    evaluationPeriodId,
    evalItems: evalItems ?? null,
    evalComment: evalComment ?? null,
    inputMethod,
  })
}

/** DL 이의신청 목록 조회 */
export function fetchDlAppeals() {
  return hrApi.get('/api/v1/hr/department-leader/appeals')
}

/** DL 이의신청 상세 조회 */
export function fetchDlAppealDetail(appealId) {
  return hrApi.get(`/api/v1/hr/appeals/${appealId}`)
}

/** DL 이의신청 최종 인용 */
export function approveDlAppeal(appealId, payload = {}) {
  return hrApi.patch(`/api/v1/hr/department-leader/appeals/${appealId}/approve`, payload)
}

/** DL 이의신청 일부 인용 종료 */
export function rejectDlAppeal(appealId, payload = {}) {
  return hrApi.patch(`/api/v1/hr/department-leader/appeals/${appealId}/reject`, payload)
}
