<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ADMIN_API_BASE } from '@/constants'
import { useAuthStore } from '@/stores/auth'
import ProfileStatusBoard  from '@/components/admin/hr/ProfileStatusBoardWrapper.vue'
import ProfileSearchToolbar from '@/components/admin/hr/ProfileSearchToolbar.vue'
import ProfileListTable    from '@/components/admin/hr/ProfileListTable.vue'
import EmployeeCreateUpdate from '@/components/admin/hr/EmployeeCreateUpdate.vue'

const authStore = useAuthStore()

// ── State ──────────────────────────────────────────
const employees    = ref([])
const isLoading    = ref(false)

// ── API 호출 ──────────────────────────────────────
const fetchEmployees = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(
      `${ADMIN_API_BASE}/api/v1/organization/employees/summary`,
      { headers: { Authorization: `Bearer ${authStore.accessToken}` } }
    )
    const list = res.data?.success ? res.data.data : res.data
    employees.value = (Array.isArray(list) ? list : []).map((e, i) => ({
      id:                       i + 1,
      employee_code:            e.employeeCode,
      employee_name:            e.employeeName,
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

const topTierCount = computed(() =>
  employees.value.filter(e =>
    e.employee_current_tier === 'S' || e.employee_current_tier === 'A'
  ).length
)

const topTierPercent = computed(() =>
  totalCount.value ? ((topTierCount.value / totalCount.value) * 100).toFixed(1) : 0
)

const avgScore = computed(() => {
  if (!employees.value.length) return 0
  const sum = employees.value.reduce((acc, e) => acc + (e.employee_capability_index || 0), 0)
  return (sum / employees.value.length).toFixed(1)
})

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
    const res = await axios.get(
      `${ADMIN_API_BASE}/api/v1/organization/employee/${emp.employee_code}`,
      { headers: { Authorization: `Bearer ${authStore.accessToken}` } }
    )
    const data = res.data?.success ? res.data.data : res.data
    // employeeId만 전달, 나머지 필드는 빈 상태로 모달 열기
    // 사용자가 입력한 항목만 업데이트됨
    editingEmployee.value = { employeeId: data.employeeId }
    isModalOpen.value = true
  } catch (err) {
    console.error('사원 상세 조회 실패:', err)
    alert('사원 정보를 불러올 수 없습니다.')
  }
}
const closeModal = () => { isModalOpen.value = false; editingEmployee.value = null }

const onSaved = async (formData) => {
  const authHeader = { headers: { Authorization: `Bearer ${authStore.accessToken}` } }

  // 빈 문자열을 null로 변환 (백엔드 partial update에서 null은 변경 없음)
  const toNull = (v) => (v === '' || v === undefined) ? null : v

  const skillKeys = [
    'equipmentResponse', 'technicalTransfer', 'innovationProposal',
    'safetyCompliance', 'qualityManagement', 'productivity',
  ]

  try {
    if (formData.employeeId) {
      // ── 수정 모드: PUT /api/v1/organization/employee ──
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
      // 역량 점수 포함 (non-zero만)
      skillKeys.forEach(k => {
        const v = Number(formData[k]) || 0
        if (v > 0) updatePayload[k] = v
      })

      await axios.put(
        `${ADMIN_API_BASE}/api/v1/organization/employee`,
        updatePayload,
        authHeader,
      )
    } else {
      // ── 등록 모드: POST /api/v1/organization/employee ──
      await axios.post(
        `${ADMIN_API_BASE}/api/v1/organization/employee`,
        formData,
        authHeader,
      )
    }

    await fetchEmployees()
  } catch (err) {
    console.error('사원 저장 실패:', err)
    alert('사원 저장에 실패했습니다.')
  }
  closeModal()
}

// ── 삭제 ────────────────────────────────────────────
const removeEmployee = (id) => {
  if (!confirm('삭제하시겠습니까?')) return
  const idx = employees.value.findIndex(e => e.id === id)
  if (idx !== -1) employees.value.splice(idx, 1)
}
</script>

<template>
  <div class="admin-profiles">

    <ProfileSearchToolbar
        :searchQuery="searchQuery"
        :selectedTier="selectedTier"
        :selectedLine="selectedLine"
        :lines="lines"
        @search="onSearch"
        @tierChange="onTierChange"
        @lineChange="onLineChange"
        @addClick="openAddModal"
    />


    <ProfileStatusBoard
      :totalCount="totalCount"
      :topTierCount="topTierCount"
      :topTierPercent="topTierPercent"
      :avgScore="avgScore"
    />


    <ProfileListTable
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
