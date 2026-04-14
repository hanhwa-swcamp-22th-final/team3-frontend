import axios from 'axios'
import { ADMIN_API_BASE } from '@/constants'
import { useAuthStore } from '@/stores/auth'

const adminApi = axios.create({
  baseURL: ADMIN_API_BASE,
  timeout: 5000,
  withCredentials: true,
})

adminApi.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }
  return config
})

let isRefreshing = false
let failedQueue = []

function processQueue(error, token) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  failedQueue = []
}

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return adminApi(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const res = await axios.post(
        `${ADMIN_API_BASE}/api/v1/auth/refresh`,
        null,
        { withCredentials: true },
      )

      if (res.data?.success && res.data.data?.accessToken) {
        const newToken = res.data.data.accessToken
        const authStore = useAuthStore()
        authStore.setToken(newToken)
        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return adminApi(originalRequest)
      }
    } catch (refreshError) {
      processQueue(refreshError, null)
      const authStore = useAuthStore()
      authStore.clearAuth()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }

    return Promise.reject(error)
  },
)

const employeeApi = {
  getEmployeesSummary() {
    return adminApi.get('/api/v1/organization/employees/summary')
  },

  getEmployeeByCode(code) {
    return adminApi.get(`/api/v1/organization/employee/${code}`)
  },

  createEmployee(data) {
    return adminApi.post('/api/v1/organization/employee', data)
  },

  updateEmployee(data) {
    return adminApi.put('/api/v1/organization/employee', data)
  },

  deleteEmployee(code) {
    return adminApi.delete(`/api/v1/organization/employee/${code}`)
  },
}

export default employeeApi
