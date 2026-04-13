import hrApi from '@/services/hrApi'

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
