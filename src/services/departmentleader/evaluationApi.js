import hrApi from '@/services/hrApi'

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
