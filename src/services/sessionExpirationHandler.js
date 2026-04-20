import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const SESSION_SUPERSEDED_CODE = 'AUTH_005'
const DEFAULT_MESSAGE = '다른 기기에서 로그인되었습니다. 다시 로그인해 주세요.'

let handlingSessionExpiration = false
let fetchInterceptorInstalled = false
let axiosInterceptorInstalled = false

export function isSessionSupersededResponse(data) {
  return data?.errorCode === SESSION_SUPERSEDED_CODE
}

export function handleSessionSuperseded(message = DEFAULT_MESSAGE) {
  if (handlingSessionExpiration) return
  handlingSessionExpiration = true

  const authStore = useAuthStore()
  authStore.clearAuth()

  window.alert(message || DEFAULT_MESSAGE)

  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

export function setupSessionExpirationInterceptors() {
  if (!axiosInterceptorInstalled) {
    axiosInterceptorInstalled = true
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const data = error.response?.data
        if (isSessionSupersededResponse(data)) {
          handleSessionSuperseded(data.message)
        }
        return Promise.reject(error)
      },
    )
  }

  if (!fetchInterceptorInstalled) {
    fetchInterceptorInstalled = true
    const originalFetch = window.fetch.bind(window)

    window.fetch = async (...args) => {
      const response = await originalFetch(...args)

      if (response.status === 401) {
        try {
          const data = await response.clone().json()
          if (isSessionSupersededResponse(data)) {
            handleSessionSuperseded(data.message)
          }
        } catch {
          // Non-JSON 401 responses are handled by each caller.
        }
      }

      return response
    }
  }
}
