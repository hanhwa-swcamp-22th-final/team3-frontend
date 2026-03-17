<script setup>
import { ref, computed } from 'vue'
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

// ── 필터링 ──────────────────────────────────────────
const filteredFacilities = computed(() =>
  facilities.value.filter(f => {
    const matchLine   = selectedLine.value === '전체' || f.equipment_line === selectedLine.value
    const matchSearch = f.equipment_name.includes(searchQuery.value) ||
                        f.equipment_code.includes(searchQuery.value)
    return matchLine && matchSearch
  })
)

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
      :facilities="filteredFacilities"
      @editClick="openEditModal"
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
