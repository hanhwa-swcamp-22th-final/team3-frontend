import hrApi from '@/services/hrApi'

/** DL 2차 평가 대상 목록 */
export function fetchDlTargets(periodId) {
  return hrApi.get('/api/v1/hr/department-leader/evaluations/targets', {
    params: periodId ? { periodId } : {},
  })
}

/** DL — 특정 사원 1차 평가 상세 (TL 코멘트·점수) */
export function fetchDlEvaluationDetail(employeeId, periodId) {
  return hrApi.get(`/api/v1/hr/department-leader/evaluations/${employeeId}`, {
    params: periodId ? { periodId } : {},
  })
}

/** DL 2차 평가 임시저장 / 제출 */
export function updateDlEvaluation(employeeId, { status, evaluationPeriodId, evalItems, evalComment, inputMethod }) {
  return hrApi.patch(`/api/v1/hr/department-leader/evaluations/${employeeId}`, {
    status,
    evaluationPeriodId,
    evalItems: evalItems ?? null,
    evalComment: evalComment ?? null,
    inputMethod,
  })
}
