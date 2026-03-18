import { ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'seto_auth'

function loadSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const saved = loadSession()
  const employee = ref(saved)
  const isAuthenticated = ref(!!saved)

  function login(employeeData) {
    employee.value = employeeData
    isAuthenticated.value = true
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(employeeData))
  }

  function logout() {
    employee.value = null
    isAuthenticated.value = false
    sessionStorage.removeItem(STORAGE_KEY)
  }

  const role = () => employee.value?.employee_role ?? null

  return { employee, isAuthenticated, login, logout, role }
})
