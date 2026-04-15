import { authApi } from './apiClient'

const employeeApi = {
  getEmployeesSummary() {
    return authApi.get('/api/v1/organization/employees/summary')
  },

  getEmployeeByCode(code) {
    return authApi.get(`/api/v1/organization/employee/${code}`)
  },

  createEmployee(data) {
    return authApi.post('/api/v1/organization/employee', data)
  },

  updateEmployee(data) {
    return authApi.put('/api/v1/organization/employee', data)
  },

  deleteEmployee(code) {
    return authApi.delete(`/api/v1/organization/employee/${code}`)
  },
}

export default employeeApi
