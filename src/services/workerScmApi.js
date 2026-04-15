import { scmApi } from '@/services/apiClient'

function unwrap(response) {
  return response.data?.data ?? response.data
}

export async function getTasks(employeeId) {
  const response = await scmApi.get('/api/v1/scm/tasks', {
    params: { employeeId },
  })
  return unwrap(response)
}

export async function getTaskSummary(employeeId) {
  const response = await scmApi.get('/api/v1/scm/tasks/summary', {
    params: { employeeId },
  })
  return unwrap(response)
}

export async function startTask(taskId) {
  const response = await scmApi.post(`/api/v1/scm/workers/me/today-tasks/${taskId}/start`)
  return unwrap(response)
}

export async function saveFinishDraft(taskId, comment) {
  const response = await scmApi.post(`/api/v1/scm/workers/me/today-tasks/${taskId}/finish-draft`, {
    comment,
  })
  return unwrap(response)
}

export async function finishTask(taskId, comment) {
  const response = await scmApi.post(`/api/v1/scm/workers/me/today-tasks/${taskId}/finish`, {
    comment,
  })
  return unwrap(response)
}
