import axios from 'axios'
import { ADMIN_API_BASE, HR_API_BASE, SCM_API_BASE, KMS_API_BASE } from '@/constants'
import { useAuthStore } from '@/stores/auth'

let isRefreshing = false
let failedQueue = []

function processQueue(error, token) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  failedQueue = []
}

function createApiClient(baseURL) {
  const instance = axios.create({
    baseURL,
    timeout: 15000,
    withCredentials: true,
  })

  instance.interceptors.request.use((config) => {
    const authStore = useAuthStore()
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    return config
  })

  instance.interceptors.response.use(
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
          return instance(originalRequest)
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
          return instance(originalRequest)
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

  return instance
}

export const authApi = createApiClient(ADMIN_API_BASE)
export const hrApi = createApiClient(HR_API_BASE)
export const scmApi = createApiClient(SCM_API_BASE)
export const kmsApi = createApiClient(KMS_API_BASE)
