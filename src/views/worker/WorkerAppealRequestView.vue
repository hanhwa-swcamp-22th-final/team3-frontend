<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { API_BASE } from '@/constants'
import WorkerAppealNotification from '@/components/hr/worker/appeal-request/WorkerAppealNotification.vue'
import WorkerAppealHistory from '@/components/hr/worker/appeal-request/WorkerAppealHistory.vue'
import WorkerAppealForm from '@/components/hr/worker/appeal-request/WorkerAppealForm.vue'
const authStore = useAuthStore()

const loading = ref(true)
const evalHistory = ref([])
const appealForms = ref({})
const selectedId = ref(null)

async function fetchJson(url) {
  const res = await fetch(url)
  return res.json()
}

onMounted(async () => {
  const employeeId = authStore.employee?.employee_id

  try {
    const [historyData, formsData] = await Promise.all([
      fetchJson(`${API_BASE}/evalHistory?employee_id=${employeeId}`),
      fetchJson(`${API_BASE}/appealForms?employee_id=${employeeId}`),
    ])

    evalHistory.value = historyData
    // Index appeal forms by evalHistory id
    formsData.forEach((f) => {
      appealForms.value[f.evalHistoryId] = f
    })

    if (historyData.length) {
      selectedId.value = historyData[0].id
    }
  } catch (e) {
    console.error('Failed to load appeal data:', e)
  } finally {
    loading.value = false
  }
})

const selectedAppeal = computed(() => {
  if (!selectedId.value) return null
  return appealForms.value[selectedId.value] ?? null
})

function handleSelect(id) {
  selectedId.value = id
}

function handleCancel() {
  // reset form to original
}

function handleSubmit(payload) {
  console.log('Appeal submitted:', payload)
}
</script>

<template>
  <div class="ar-content">
    <div v-if="loading" class="ar-loading">데이터를 불러오는 중...</div>

    <template v-else>
      <WorkerAppealNotification />

      <div class="ar-grid">
        <WorkerAppealHistory
          v-if="evalHistory.length"
          :history="evalHistory"
          :selected-id="selectedId"
          @select="handleSelect"
        />
        <WorkerAppealForm
          v-if="selectedAppeal"
          :appeal-data="selectedAppeal"
          @cancel="handleCancel"
          @submit="handleSubmit"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.ar-content {
  flex: 1;
  padding: 20px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  background: var(--color-bg-app);
}

.ar-grid {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 20px;
  align-items: start;
}

.ar-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  font-size: 15px;
  color: var(--color-text-muted);
}
</style>
