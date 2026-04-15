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

  updateStatus(candidateId, status) {
    return hrApi.patch(`/api/v1/hr/promotions/${candidateId}`, { status })
  },
}

export default promotionApi
