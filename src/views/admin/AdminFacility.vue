<script setup>
import { ref, computed, watch } from 'vue'
import FacilityToolbar from '@/components/admin/scm/FacilityToolbar.vue'
import FacilityTable   from '@/components/admin/scm/FacilityTable.vue'
import FacilityModal   from '@/components/admin/scm/FacilityModal.vue'
import { DUMMY_FACILITIES } from '@/mocks/admin/facility/facilityData.js'

// ── State ──────────────────────────────────────────
const facilities      = ref(DUMMY_FACILITIES.map(f => ({ ...f })))
const searchQuery     = ref('')
const selectedLine    = ref('전체')
const isModalOpen     = ref(false)
const editingFacility = ref(null)

// ── 페이지네이션 ─────────────────────────────────────
const PAGE_SIZE   = 7
const currentPage = ref(1)

// ── 필터링 ──────────────────────────────────────────
const filteredFacilities = computed(() =>
  facilities.value.filter(f => {
    const matchLine   = selectedLine.value === '전체' || f.equipment_line === selectedLine.value
    const matchSearch = f.equipment_name.includes(searchQuery.value) ||
                        f.equipment_code.includes(searchQuery.value)
    return matchLine && matchSearch
  })
)

const totalCount      = computed(() => filteredFacilities.value.length)
const totalPages      = computed(() => Math.ceil(totalCount.value / PAGE_SIZE))
const pagedFacilities = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredFacilities.value.slice(start, start + PAGE_SIZE)
})
const pageStart = computed(() => totalCount.value === 0 ? 0 : (currentPage.value - 1) * PAGE_SIZE + 1)
const pageEnd   = computed(() => Math.min(currentPage.value * PAGE_SIZE, totalCount.value))
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

// 필터 변경 시 1페이지로 리셋
watch([searchQuery, selectedLine], () => { currentPage.value = 1 })

// ── 툴바 핸들러 ─────────────────────────────────────
const onSearch     = (v) => { searchQuery.value  = v }
const onLineChange = (v) => { selectedLine.value = v }

// ── 모달 핸들러 ─────────────────────────────────────
const openAddModal  = ()    => { editingFacility.value = null;       isModalOpen.value = true }
const openEditModal = (fac) => { editingFacility.value = { ...fac }; isModalOpen.value = true }
const closeModal    = ()    => { isModalOpen.value = false; editingFacility.value = null }

const onSave = (fac) => {
  if (fac.id) {
    const idx = facilities.value.findIndex(f => f.id === fac.id)
    if (idx !== -1) facilities.value[idx] = { ...fac }
  } else {
    const newId = Math.max(...facilities.value.map(f => f.id)) + 1
    facilities.value.push({ ...fac, id: newId })
  }
  closeModal()
}
</script>

<template>
  <div class="admin-facility">

    <!-- 툴바 -->
    <FacilityToolbar
      :searchQuery="searchQuery"
      :selectedLine="selectedLine"
      @search="onSearch"
      @lineChange="onLineChange"
      @addClick="openAddModal"
    />

    <!-- 테이블 -->
    <FacilityTable
      :facilities="pagedFacilities"
      :totalCount="totalCount"
      :currentPage="currentPage"
      :totalPages="totalPages"
      :pageStart="pageStart"
      :pageEnd="pageEnd"
      :pageButtons="pageButtons"
      @editClick="openEditModal"
      @pageChange="currentPage = $event"
    />

    <!-- 모달 -->
    <FacilityModal
      :isOpen="isModalOpen"
      :facility="editingFacility"
      @close="closeModal"
      @save="onSave"
    />

  </div>
</template>

<style scoped>
.admin-facility {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  flex: 1;
  min-width: 0;
  height: calc(100vh - 80px);
  box-sizing: border-box;
  overflow: hidden;
  font-family: 'Pretendard', sans-serif;
}


</style>
