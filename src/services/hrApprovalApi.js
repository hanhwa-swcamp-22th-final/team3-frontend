import hrApi from './hrApi.js'

const hrApprovalApi = {
  getAppeals(params = {}) {
    return hrApi.get('/api/v1/hr/appeals', { params })
  },

  getAppealById(appealId) {
    return hrApi.get(`/api/v1/hr/appeals/${appealId}`)
  },

  updateAppealStatus(appealId, payload) {
    return hrApi.patch(`/api/v1/hr/appeals/${appealId}`, payload)
  },

  getEvaluationApprovals(params = {}) {
    return hrApi.get('/api/v1/hr/evaluations', { params })
  },

  getEvaluationPeriods(params = {}) {
    return hrApi.get('/api/v1/hr/evaluation-periods', { params })
  },

  getEvaluationApprovalDetail(evalId) {
    return hrApi.get(`/api/v1/hr/evaluations/${evalId}`)
  },

  confirmEvaluation(employeeId, payload) {
    return hrApi.patch(`/api/v1/hr/hr-manager/evaluations/${employeeId}`, payload)
  },
}

export default hrApprovalApi
