import scmApi from '@/services/scmApi'

function unwrap(response) {
  return response.data?.data ?? response.data
}

export async function getOrders(params = {}) {
  const response = await scmApi.get('/api/v1/scm/orders', { params })
  return unwrap(response)
}

export async function getOrderSummary() {
  const response = await scmApi.get('/api/v1/scm/orders/summary')
  return unwrap(response)
}

export async function getUrgentOrders() {
  const response = await scmApi.get('/api/v1/scm/orders/urgent')
  return unwrap(response)
}

export async function getUnassignedOrders() {
  const response = await scmApi.get('/api/v1/scm/orders/unassigned')
  return unwrap(response)
}

export async function getAssignmentCandidates(params = {}) {
  const response = await scmApi.get('/api/v1/scm/assignments/candidates', { params })
  return unwrap(response)
}

export async function createAssignment(orderId, technicianId) {
  const response = await scmApi.post('/api/v1/scm/assignments', {
    orderId,
    technicianId,
  })
  return unwrap(response)
}

export async function getOcsaSummary() {
  const response = await scmApi.get('/api/v1/scm/orders/ocsa/summary')
  return unwrap(response)
}

export async function getOrderOcsa(orderId) {
  const response = await scmApi.get(`/api/v1/scm/orders/${orderId}/ocsa`)
  return unwrap(response)
}

export async function getTechnicians() {
  const response = await scmApi.get('/api/v1/scm/technicians')
  return unwrap(response)
}

export async function getFacilities() {
  const response = await scmApi.get('/api/v1/scm/facilities')
  return unwrap(response)
}

export async function getMyTeamFacilities() {
  const response = await scmApi.get('/api/v1/scm/facilities/my-team')
  return unwrap(response)
}

export async function getFacilityHistory(facilityId) {
  const response = await scmApi.get(`/api/v1/scm/facilities/${facilityId}/history`)
  return unwrap(response)
}

export async function getFacilityTrends(facilityId) {
  const response = await scmApi.get(`/api/v1/scm/facilities/${facilityId}/trends`)
  return unwrap(response)
}

export async function getAssignmentSummary() {
  const response = await scmApi.get('/api/v1/scm/assignments/summary')
  return unwrap(response)
}

export async function getAssignmentTimeline() {
  const response = await scmApi.get('/api/v1/scm/assignments/timeline')
  return unwrap(response)
}

export async function getLinesSummary() {
  const response = await scmApi.get('/api/v1/scm/lines/summary')
  return unwrap(response)
}

export async function getMyTeamLinesSummary() {
  const response = await scmApi.get('/api/v1/scm/lines/my-team/summary')
  return unwrap(response)
}

export async function getLineWorkers(lineId) {
  const response = await scmApi.get(`/api/v1/scm/lines/${lineId}/workers`)
  return unwrap(response)
}
