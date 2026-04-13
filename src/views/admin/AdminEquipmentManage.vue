<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import FacilityToolbar from '@/components/admin/scm/FacilityToolbar.vue'
import FacilityTable from '@/components/admin/scm/FacilityTable.vue'
import FacilityModal from '@/components/admin/scm/FacilityModalWrapper.vue'
import FacilityLineProcessModal from '@/components/admin/scm/FacilityLineProcessModal.vue'
import { ADMIN_API_BASE } from '@/constants'
import { useAuthStore } from '@/stores/auth'

const EQUIPMENT_API = `${ADMIN_API_BASE}/api/v1/equipment-management`
const PAGE_SIZE = 8

const authStore = useAuthStore()

const facilities = ref([])
const factoryLines = ref([])
const processes = ref([])
const environmentStandards = ref([])
const searchQuery = ref('')
const selectedLine = ref('ALL')
const isModalOpen = ref(false)
const isLineProcessModalOpen = ref(false)
const editingFacility = ref(null)
const currentPage = ref(1)
const isLoading = ref(false)
const errorMessage = ref('')

function authHeaders(extraHeaders = {}) {
  return {
    ...extraHeaders,
    ...(authStore.accessToken ? { Authorization: `Bearer ${authStore.accessToken}` } : {}),
  }
}

async function requestJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: authHeaders(options.headers ?? {}),
  })
  const json = await res.json().catch(() => ({}))

  if (!res.ok || json.success === false) {
    throw new Error(json.message ?? `API 요청에 실패했습니다. (${res.status})`)
  }

  return json.data
}

async function fetchFacilities() {
  const data = await requestJson(`${EQUIPMENT_API}/equipments?mode=latest-snapshots`)
  facilities.value = Array.isArray(data) ? data : []
}

async function fetchReferenceData() {
  const [lineData, processData, environmentData] = await Promise.all([
    requestJson(`${EQUIPMENT_API}/factory-lines`),
    requestJson(`${EQUIPMENT_API}/equipment-processes`),
    requestJson(`${EQUIPMENT_API}/environment-standards`),
  ])
  factoryLines.value = Array.isArray(lineData) ? lineData : []
  processes.value = Array.isArray(processData) ? processData : []
  environmentStandards.value = Array.isArray(environmentData) ? environmentData : []
}

async function loadPageData() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    await Promise.all([fetchFacilities(), fetchReferenceData()])
  } catch (error) {
    console.error('Failed to load equipment data:', error)
    errorMessage.value = error.message ?? '설비 정보를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

async function fetchOptionalLatest(path, equipmentId) {
  try {
    return await requestJson(`${EQUIPMENT_API}/${path}?mode=latest&equipmentId=${equipmentId}`)
  } catch (error) {
    console.warn(`Failed to load latest ${path}:`, error)
    return null
  }
}

function openAddModal() {
  editingFacility.value = null
  isModalOpen.value = true
}

async function openEditModal(facility) {
  try {
    const [detail, aging] = await Promise.all([
      requestJson(`${EQUIPMENT_API}/equipments/${facility.equipmentId}`),
      fetchOptionalLatest('equipment-aging-params', facility.equipmentId),
    ])

    editingFacility.value = {
      ...facility,
      ...detail,
      equipmentWarrantyMonth: aging?.equipmentWarrantyMonth ?? '',
      equipmentDesignLifeMonths: aging?.equipmentDesignLifeMonths ?? '',
      equipmentWearCoefficient: aging?.equipmentWearCoefficient ?? '',
    }
    isModalOpen.value = true
  } catch (error) {
    console.error('Failed to load equipment detail:', error)
    alert(error.message ?? '설비 상세 정보를 불러오지 못했습니다.')
  }
}

function closeModal() {
  isModalOpen.value = false
  editingFacility.value = null
}

function openLineProcessModal() {
  isLineProcessModalOpen.value = true
}

function closeLineProcessModal() {
  isLineProcessModalOpen.value = false
}

const lineOptions = computed(() => {
  const options = factoryLines.value.map((line) => ({
    value: line.factoryLineName,
    label: line.factoryLineName,
  }))

  return [
    { value: 'ALL', label: '라인 전체' },
    ...options,
  ]
})

const processOptions = computed(() =>
  processes.value.map((process) => ({
    value: process.equipmentProcessId,
    label: process.equipmentProcessName,
    factoryLineName: process.factoryLineName,
  }))
)

async function refreshEquipmentData() {
  await Promise.all([fetchFacilities(), fetchReferenceData()])
}

const environmentOptions = computed(() =>
  environmentStandards.value.map((standard) => ({
    value: standard.environmentStandardId,
    label: `${standard.environmentCode} / ${standard.environmentName}`,
  }))
)

const filteredFacilities = computed(() =>
  facilities.value.filter((facility) => {
    const keyword = searchQuery.value.trim().toLowerCase()
    const matchLine =
      selectedLine.value === 'ALL' || facility.factoryLineName === selectedLine.value
    const matchSearch =
      !keyword ||
      [facility.equipmentName, facility.equipmentCode, facility.equipmentProcessName]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword))

    return matchLine && matchSearch
  })
)

const totalCount = computed(() => filteredFacilities.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / PAGE_SIZE)))
const pagedFacilities = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredFacilities.value.slice(start, start + PAGE_SIZE)
})
const pageStart = computed(() => (totalCount.value === 0 ? 0 : (currentPage.value - 1) * PAGE_SIZE + 1))
const pageEnd = computed(() => Math.min(currentPage.value * PAGE_SIZE, totalCount.value))
const pageButtons = computed(() => {
  const total = totalPages.value
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)

  const cur = currentPage.value
  const pages = new Set([1, total, cur, cur - 1, cur + 1].filter((p) => p >= 1 && p <= total))
  const sorted = [...pages].sort((a, b) => a - b)
  const result = []

  for (let i = 0; i < sorted.length; i += 1) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...')
    result.push(sorted[i])
  }

  return result
})

watch([searchQuery, selectedLine], () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotalPages) => {
  if (currentPage.value > nextTotalPages) currentPage.value = nextTotalPages
})

function onSearch(value) {
  searchQuery.value = value
}

function onLineChange(value) {
  selectedLine.value = value
}

function toNumber(value) {
  return value === '' || value === null || value === undefined ? null : Number(value)
}

function buildPayload(form) {
  return {
    equipmentProcessId: toNumber(form.equipmentProcessId),
    environmentStandardId: toNumber(form.environmentStandardId),
    equipmentCode: form.equipmentCode?.trim(),
    equipmentName: form.equipmentName?.trim(),
    equipmentStatus: form.equipmentStatus,
    equipmentGrade: form.equipmentGrade,
    equipmentDescription: form.equipmentDescription?.trim() ?? '',
    equipmentInstallDate: form.equipmentInstallDate || null,
    equipmentWarrantyMonth: toNumber(form.equipmentWarrantyMonth),
    equipmentDesignLifeMonths: toNumber(form.equipmentDesignLifeMonths),
    equipmentWearCoefficient: toNumber(form.equipmentWearCoefficient),
  }
}

async function onDelete(facility) {
  if (!confirm(`"${facility.equipmentName}" 설비를 삭제하시겠습니까?`)) return

  try {
    await requestJson(`${EQUIPMENT_API}/equipments/${facility.equipmentId}`, {
      method: 'DELETE',
    })
    await fetchFacilities()
  } catch (error) {
    console.error('Failed to delete equipment:', error)
    alert(error.message ?? '설비 삭제 중 오류가 발생했습니다.')
  }
}

async function onSave(form) {
  const isEdit = !!form.equipmentId
  const payload = buildPayload(form)

  if (!isEdit) {
    payload.equipmentStandardPerformanceRate = toNumber(form.equipmentStandardPerformanceRate)
    payload.equipmentBaselineErrorRate = toNumber(form.equipmentBaselineErrorRate)
  }

  try {
    await requestJson(
      isEdit
        ? `${EQUIPMENT_API}/equipments/${form.equipmentId}`
        : `${EQUIPMENT_API}/equipments`,
      {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )
    closeModal()
    await fetchFacilities()
  } catch (error) {
    console.error(`Failed to ${isEdit ? 'update' : 'create'} equipment:`, error)
    alert(error.message ?? `설비 ${isEdit ? '수정' : '등록'} 중 오류가 발생했습니다.`)
  }
}

async function onSaveLine(lineForm) {
  const isEdit = !!lineForm.factoryLineId
  const payload = {
    factoryLineCode: lineForm.factoryLineCode?.trim(),
    factoryLineName: lineForm.factoryLineName?.trim(),
  }

  try {
    await requestJson(
      isEdit
        ? `${EQUIPMENT_API}/factory-lines/${lineForm.factoryLineId}`
        : `${EQUIPMENT_API}/factory-lines`,
      {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )
    await refreshEquipmentData()
  } catch (error) {
    console.error(`Failed to ${isEdit ? 'update' : 'create'} factory line:`, error)
    alert(error.message ?? `라인 ${isEdit ? '수정' : '등록'} 중 오류가 발생했습니다.`)
  }
}

async function onDeleteLine(line) {
  if (!confirm(`"${line.factoryLineName}" 라인을 삭제하시겠습니까?`)) return

  try {
    await requestJson(`${EQUIPMENT_API}/factory-lines/${line.factoryLineId}`, {
      method: 'DELETE',
    })
    await refreshEquipmentData()
  } catch (error) {
    console.error('Failed to delete factory line:', error)
    alert(error.message ?? '라인 삭제 중 오류가 발생했습니다.')
  }
}

async function onSaveProcess(processForm) {
  const isEdit = !!processForm.equipmentProcessId
  const payload = {
    factoryLineId: toNumber(processForm.factoryLineId),
    equipmentProcessCode: processForm.equipmentProcessCode?.trim(),
    equipmentProcessName: processForm.equipmentProcessName?.trim(),
  }

  try {
    await requestJson(
      isEdit
        ? `${EQUIPMENT_API}/equipment-processes/${processForm.equipmentProcessId}`
        : `${EQUIPMENT_API}/equipment-processes`,
      {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )
    await refreshEquipmentData()
  } catch (error) {
    console.error(`Failed to ${isEdit ? 'update' : 'create'} equipment process:`, error)
    alert(error.message ?? `공정 ${isEdit ? '수정' : '등록'} 중 오류가 발생했습니다.`)
  }
}

async function onDeleteProcess(process) {
  if (!confirm(`"${process.equipmentProcessName}" 공정을 삭제하시겠습니까?`)) return

  try {
    await requestJson(`${EQUIPMENT_API}/equipment-processes/${process.equipmentProcessId}`, {
      method: 'DELETE',
    })
    await refreshEquipmentData()
  } catch (error) {
    console.error('Failed to delete equipment process:', error)
    alert(error.message ?? '공정 삭제 중 오류가 발생했습니다.')
  }
}

async function onSaveEnvironment(environmentForm) {
  const isEdit = !!environmentForm.environmentStandardId
  const payload = {
    environmentType: environmentForm.environmentType,
    environmentCode: environmentForm.environmentCode?.trim(),
    environmentName: environmentForm.environmentName?.trim(),
    envTempMin: toNumber(environmentForm.envTempMin),
    envTempMax: toNumber(environmentForm.envTempMax),
    envHumidityMin: toNumber(environmentForm.envHumidityMin),
    envHumidityMax: toNumber(environmentForm.envHumidityMax),
    envParticleLimit: toNumber(environmentForm.envParticleLimit),
  }

  try {
    await requestJson(
      isEdit
        ? `${EQUIPMENT_API}/environment-standards/${environmentForm.environmentStandardId}`
        : `${EQUIPMENT_API}/environment-standards`,
      {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )
    await refreshEquipmentData()
  } catch (error) {
    console.error(`Failed to ${isEdit ? 'update' : 'create'} environment standard:`, error)
    alert(error.message ?? `환경 기준 ${isEdit ? '수정' : '등록'} 중 오류가 발생했습니다.`)
  }
}

async function onDeleteEnvironment(environment) {
  if (!confirm(`"${environment.environmentName}" 환경 기준을 삭제하시겠습니까?`)) return

  try {
    await requestJson(`${EQUIPMENT_API}/environment-standards/${environment.environmentStandardId}`, {
      method: 'DELETE',
    })
    await refreshEquipmentData()
  } catch (error) {
    console.error('Failed to delete environment standard:', error)
    alert(error.message ?? '환경 기준 삭제 중 오류가 발생했습니다.')
  }
}

onMounted(loadPageData)
</script>

<template>
  <div class="admin-facility">
    <div v-if="errorMessage" class="notice notice--error">
      {{ errorMessage }}
    </div>

    <FacilityToolbar
      :search-query="searchQuery"
      :selected-line="selectedLine"
      :line-options="lineOptions"
      @search="onSearch"
      @line-change="onLineChange"
      @add-click="openAddModal"
      @manage-line-process-click="openLineProcessModal"
    />

    <FacilityTable
      :facilities="pagedFacilities"
      :total-count="totalCount"
      :current-page="currentPage"
      :total-pages="totalPages"
      :page-start="pageStart"
      :page-end="pageEnd"
      :page-buttons="pageButtons"
      :is-loading="isLoading"
      @edit-click="openEditModal"
      @delete-click="onDelete"
      @page-change="currentPage = $event"
    />

    <FacilityModal
      :is-open="isModalOpen"
      :facility="editingFacility"
      :line-options="lineOptions"
      :process-options="processOptions"
      :environment-options="environmentOptions"
      @close="closeModal"
      @save="onSave"
    />

    <FacilityLineProcessModal
      :is-open="isLineProcessModalOpen"
      :factory-lines="factoryLines"
      :processes="processes"
      :environment-standards="environmentStandards"
      @close="closeLineProcessModal"
      @save-line="onSaveLine"
      @delete-line="onDeleteLine"
      @save-process="onSaveProcess"
      @delete-process="onDeleteProcess"
      @save-environment="onSaveEnvironment"
      @delete-environment="onDeleteEnvironment"
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
}

.notice {
  flex-shrink: 0;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 700;
}

.notice--error {
  background: var(--color-equip-warning-bg, #fff8e7);
  border: 1px solid var(--color-equip-warning-border, #f1c27d);
  color: var(--color-equip-warning, #8a4d00);
}
</style>
