import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { ADMIN_API_BASE } from '@/constants'

const BACKEND_TO_FRONTEND_ROLE = {
  ADMIN: 'admin',
  HRM: 'HRM',
  TL: 'TL',
  DL: 'DL',
  WORKER: 'worker',
}

function decodeJwtPayload(token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
  return JSON.parse(jsonPayload)
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null)
  const userInfo = ref(null)
  const isAuthenticated = ref(false)

  // Backward-compatible employee object for DashboardView
  const employee = computed(() => {
    if (!userInfo.value) return null
    return {
      employee_name: userInfo.value.employeeName,
      employee_code: userInfo.value.employeeCode,
    }
  })

  function setToken(token) {
    accessToken.value = token
    const claims = decodeJwtPayload(token)
    userInfo.value = {
      employeeId: claims.sub,
      employeeCode: claims.employeeCode,
      employeeName: claims.employeeName ?? claims.employeeCode,
      role: BACKEND_TO_FRONTEND_ROLE[claims.role] ?? claims.role,
    }
    isAuthenticated.value = true
  }

  function clearAuth() {
    accessToken.value = null
    userInfo.value = null
    isAuthenticated.value = false
  }

  function login(token) {
    setToken(token)
  }

  async function logout() {
    try {
      await axios.post(`${ADMIN_API_BASE}/api/v1/auth/logout`, null, {
        withCredentials: true,
      })
    } catch {
      // logout even if backend call fails
    }
    clearAuth()
  }

  const role = () => userInfo.value?.role ?? null

  async function initAuth() {
    try {
      const res = await axios.post(
        `${ADMIN_API_BASE}/api/v1/auth/refresh`,
        null,
        { withCredentials: true }
      )
      if (res.data?.success && res.data.data?.accessToken) {
        setToken(res.data.data.accessToken)
      }
    } catch {
      clearAuth()
    }
  }

  return {
    accessToken,
    userInfo,
    employee,
    isAuthenticated,
    login,
    logout,
    role,
    setToken,
    clearAuth,
    initAuth,
  }
})
