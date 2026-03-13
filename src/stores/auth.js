import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const employee = ref(null)
  const isAuthenticated = ref(false)

  function login(employeeData) {
    employee.value = employeeData
    isAuthenticated.value = true
  }

  function logout() {
    employee.value = null
    isAuthenticated.value = false
  }

  const role = () => employee.value?.employee_role ?? null

  return { employee, isAuthenticated, login, logout, role }
})
