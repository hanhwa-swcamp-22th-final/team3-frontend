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

  receiveAppeal(appealId) {
    return hrApi.patch(`/api/v1/hr/appeals/${appealId}/receive`)
  },

  rejectAppeal(appealId, payload = {}) {
    return hrApi.patch(`/api/v1/hr/appeals/${appealId}/reject`, payload)
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
