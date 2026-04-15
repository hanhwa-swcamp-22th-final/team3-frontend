import { hrApi } from '../apiClient'

const promotionApi = {
  getSummary() {
    return hrApi.get('/api/v1/hr/promotions/summary')
  },

  getCandidates(params = {}) {
    return hrApi.get('/api/v1/hr/promotions/candidates', { params })
  },

  getCandidateDetail(candidateId) {
    return hrApi.get(`/api/v1/hr/promotions/${candidateId}`)
  },

  getCandidateUpgradeMissions(employeeId) {
    return hrApi.get(`/api/v1/hr/promotions/employees/${employeeId}/missions/upgrade`)
  },

  updateStatus(candidateId, status) {
    return hrApi.patch(`/api/v1/hr/promotions/${candidateId}`, { status })
  },

  applyTier() {
    return hrApi.post('/api/v1/hr/promotions/apply-tier')
  },
}

export default promotionApi
