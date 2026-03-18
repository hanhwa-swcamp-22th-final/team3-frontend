<script setup>
import { ref, computed } from 'vue'
import ProfileStatusBoard  from '@/components/admin/hr/ProfileStatusBoard.vue'
import ProfileSearchToolbar from '@/components/admin/hr/ProfileSearchToolbar.vue'
import ProfileListTable    from '@/components/admin/hr/ProfileListTable.vue'
import ProfileCreateUpdate from '@/components/admin/hr/ProfileCreateUpdate.vue'
import { DUMMY_EMPLOYEES } from '@/mocks/admin/profile/profileData.js'

// ── State ──────────────────────────────────────────
const employees    = ref(DUMMY_EMPLOYEES.map(e => ({ ...e })))
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
const openAddModal  = ()    => { editingEmployee.value = null;       isModalOpen.value = true }
const openEditModal = (emp) => { editingEmployee.value = { ...emp }; isModalOpen.value = true }
const closeModal    = ()    => { isModalOpen.value = false; editingEmployee.value = null }

const onSaved = (emp) => {
  if (emp.id) {
    const idx = employees.value.findIndex(e => e.id === emp.id)
    if (idx !== -1) employees.value[idx] = { ...emp }
  } else {
    const newId = Math.max(...employees.value.map(e => e.id)) + 1
    employees.value.push({ ...emp, id: newId })
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

    <ProfileStatusBoard
      :totalCount="totalCount"
      :topTierCount="topTierCount"
      :topTierPercent="topTierPercent"
      :avgScore="avgScore"
    />

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

    <ProfileListTable
      :employees="employees"
      :filteredEmployees="filteredEmployees"
      :pagedEmployees="pagedEmployees"
      :pageButtons="pageButtons"
      :currentPage="currentPage"
      :totalPages="totalPages"
      :selectedTier="selectedTier"
      :isLoading="false"
      :pageStart="pageStart"
      :pageEnd="pageEnd"
      @tierSelect="onTierChange"
      @pageChange="(p) => currentPage = p"
      @editClick="openEditModal"
      @deleteClick="removeEmployee"
    />

    <ProfileCreateUpdate
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
