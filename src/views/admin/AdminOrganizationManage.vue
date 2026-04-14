<script setup>
import { ref, computed, onMounted } from 'vue'
import employeeApi from '@/services/employeeApi'
import EmployeeStatusBoardWrapper  from '@/components/admin/hr/EmployeeStatusBoardWrapper.vue'
import EmployeeSearchToolbar from '@/components/admin/hr/EmployeeSearchToolbar.vue'
import EmployeeListTable    from '@/components/admin/hr/EmployeeListTable.vue'
import EmployeeCreateUpdate from '@/components/admin/hr/EmployeeCreateUpdate.vue'

// ── State ──────────────────────────────────────────
const employees    = ref([])
const isLoading    = ref(false)

// ── API 호출 ──────────────────────────────────────
const fetchEmployees = async () => {
  isLoading.value = true
  try {
    const res = await employeeApi.getEmployeesSummary()
    const list = res.data?.success ? res.data.data : res.data
    employees.value = (Array.isArray(list) ? list : []).map((e, i) => ({
      id:                       i + 1,
      employee_code:            e.employeeCode,
      employee_name:            e.employeeName,
      employee_role:            e.employeeRole,
      employee_status:          e.employeeStatus,
      employee_current_tier:    e.employeeTier,
      employee_line:            e.factoryLineName,
      employee_equipment:       e.equipmentName,
      created_at:               e.hireDate,
    }))
  } catch (err) {
    console.error('직원 목록 조회 실패:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchEmployees)
const searchQuery  = ref('')
const selectedTier = ref('전체')
const selectedLine = ref('전체')
const currentPage  = ref(1)
const pageSize     = 6

// 모달 상태
const isModalOpen     = ref(false)
const editingEmployee = ref(null)

// ── 통계 ────────────────────────────────────────────
const totalCount = computed(() => employees.value.length)

const totalWorkerCount = computed(() =>
  employees.value.filter(e => e.employee_role === 'WORKER').length
)

const totalDLCount = computed(() =>
  employees.value.filter(e => e.employee_role === 'DL').length
)

const totalTLCount = computed(() =>
  employees.value.filter(e => e.employee_role === 'TL').length
)

const totalHRMCount = computed(() =>
  employees.value.filter(e => e.employee_role === 'HRM').length
)

// ── 라인 목록 ────────────────────────────────────────
const lines = computed(() => {
  const unique = [...new Set(employees.value.map(e => e.employee_line).filter(Boolean))]
  return ['전체', ...unique.sort()]
})

// ── 필터링 ──────────────────────────────────────────
const filteredEmployees = computed(() =>
  employees.value.filter(e => {
    const matchTier   = selectedTier.value === '전체' || e.employee_current_tier === selectedTier.value
    const matchLine   = selectedLine.value === '전체' || e.employee_line === selectedLine.value
    const matchSearch = e.employee_name.includes(searchQuery.value) ||
                        e.employee_code.includes(searchQuery.value)
    return matchTier && matchLine && matchSearch
  })
)

// ── 페이지네이션 ────────────────────────────────────
const totalPages = computed(() => Math.ceil(filteredEmployees.value.length / pageSize))

const pagedEmployees = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredEmployees.value.slice(start, start + pageSize)
})

const pageStart = computed(() => (currentPage.value - 1) * pageSize + 1)
const pageEnd   = computed(() => Math.min(currentPage.value * pageSize, filteredEmployees.value.length))

const pageButtons = computed(() => {
  const total = totalPages.value
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  const cur = currentPage.value
  const pages = new Set([1, total, cur, cur - 1, cur + 1].filter(p => p >= 1 && p <= total))
  const sorted = [...pages].sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...')
    result.push(sorted[i])
  }
  return result
})

// ── 툴바 핸들러 ─────────────────────────────────────
const onSearch     = (v) => { searchQuery.value  = v; currentPage.value = 1 }
const onTierChange = (v) => { selectedTier.value = v; currentPage.value = 1 }
const onLineChange = (v) => { selectedLine.value = v; currentPage.value = 1 }

// ── 모달 핸들러 ─────────────────────────────────────
const openAddModal  = () => { editingEmployee.value = null; isModalOpen.value = true }
const openEditModal = async (emp) => {
  try {
    const res = await employeeApi.getEmployeeByCode(emp.employee_code)
    const data = res.data?.success ? res.data.data : res.data
    editingEmployee.value = { employeeId: data.employeeId }
    isModalOpen.value = true
  } catch (err) {
    console.error('사원 상세 조회 실패:', err)
    alert('사원 정보를 불러올 수 없습니다.')
  }
}
const closeModal = () => { isModalOpen.value = false; editingEmployee.value = null }

const onSaved = async (formData) => {
  const toNull = (v) => (v === '' || v === undefined) ? null : v

  const skillKeys = [
    'equipmentResponse', 'technicalTransfer', 'innovationProposal',
    'safetyCompliance', 'qualityManagement', 'productivity',
  ]

  try {
    if (formData.employeeId) {
      const updatePayload = {
        employeeId:             formData.employeeId,
        employeeName:           toNull(formData.employeeName),
        employeeEmail:          toNull(formData.employeeEmail),
        employeePhone:          toNull(formData.employeePhone),
        employeeAddress:        toNull(formData.employeeAddress),
        employeeEmergencyContact: toNull(formData.employeeEmergencyContact),
        employeePassword:       toNull(formData.employeePassword),
        employeeRole:           toNull(formData.employeeRole),
        employeeStatus:         toNull(formData.employeeStatus),
        employeeTier:           toNull(formData.employeeTier),
        hireDate:               toNull(formData.hireDate),
      }
      skillKeys.forEach(k => {
        const v = Number(formData[k]) || 0
        if (v > 0) updatePayload[k] = v
      })

      await employeeApi.updateEmployee(updatePayload)
    } else {
      await employeeApi.createEmployee(formData)
    }

    await fetchEmployees()
  } catch (err) {
    console.error('사원 저장 실패:', err)
    alert('사원 저장에 실패했습니다.')
  }
  closeModal()
}

// ── 삭제 ────────────────────────────────────────────
const removeEmployee = async (id) => {
  if (!confirm('삭제하시겠습니까?')) return
  const emp = employees.value.find(e => e.id === id)
  if (!emp) return
  try {
    await employeeApi.deleteEmployee(emp.employee_code)
    await fetchEmployees()
  } catch (err) {
    console.error('사원 삭제 실패:', err)
    alert('사원 삭제에 실패했습니다.')
  }
}
</script>

<template>
  <div class="admin-profiles">

    <EmployeeSearchToolbar
        :searchQuery="searchQuery"
        :selectedTier="selectedTier"
        :selectedLine="selectedLine"
        :lines="lines"
        @search="onSearch"
        @tierChange="onTierChange"
        @lineChange="onLineChange"
        @addClick="openAddModal"
    />


    <EmployeeStatusBoardWrapper
      :totalCount="totalCount"
      :totalWorkerCount="totalWorkerCount"
      :totalDLCount="totalDLCount"
      :totalTLCount="totalTLCount"
      :totalHRMCount="totalHRMCount"
    />


    <EmployeeListTable
      :employees="employees"
      :filteredEmployees="filteredEmployees"
      :pagedEmployees="pagedEmployees"
      :pageButtons="pageButtons"
      :currentPage="currentPage"
      :totalPages="totalPages"
      :selectedTier="selectedTier"
      :isLoading="isLoading"
      :pageStart="pageStart"
      :pageEnd="pageEnd"
      @tierSelect="onTierChange"
      @pageChange="(p) => currentPage = p"
      @editClick="openEditModal"
      @deleteClick="removeEmployee"
    />

    <EmployeeCreateUpdate
      :isOpen="isModalOpen"
      :employee="editingEmployee"
      @close="closeModal"
      @save="onSaved"
    />

  </div>
</template>

<style scoped>
.admin-profiles {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  flex: 1;
  min-width: 0;
  height: calc(100vh - 80px);
  box-sizing: border-box;
  overflow: hidden;
}
</style>
