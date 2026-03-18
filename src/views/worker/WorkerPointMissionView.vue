<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { API_BASE } from '@/constants'
import WorkerPointTotalHolding from '@/components/hr/worker/point-mission/WorkerPointTotalHolding.vue'
import WorkerPointAccrualHistory from '@/components/hr/worker/point-mission/WorkerPointAccrualHistory.vue'
import WorkerPointPerMission from '@/components/hr/worker/point-mission/WorkerPointPerMission.vue'
const authStore = useAuthStore()

const loading = ref(true)
const pointSummary = ref(null)
const pointHistory = ref([])
const upgradeMissions = ref([])

async function fetchJson(url) {
  const res = await fetch(url)
  return res.json()
}

onMounted(async () => {
  const employeeId = authStore.employee?.employee_id

  try {
    const [summaryData, historyData, missionsData] = await Promise.all([
      fetchJson(`${API_BASE}/pointSummary?employee_id=${employeeId}`),
      fetchJson(`${API_BASE}/pointHistory?employee_id=${employeeId}`),
      fetchJson(`${API_BASE}/upgradeMissions?employee_id=${employeeId}`),
    ])

    pointSummary.value = summaryData[0] ?? null
    pointHistory.value = historyData
    upgradeMissions.value = missionsData
  } catch (e) {
    console.error('Failed to load point/mission data:', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="pm-content">
    <div v-if="loading" class="pm-loading">데이터를 불러오는 중...</div>

    <template v-else>
      <WorkerPointTotalHolding v-if="pointSummary" :summary="pointSummary" />

      <div class="pm-grid">
        <WorkerPointAccrualHistory v-if="pointHistory.length" :history="pointHistory" />
        <WorkerPointPerMission v-if="upgradeMissions.length" :missions="upgradeMissions" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.pm-content {
  flex: 1;
  padding: 20px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  background: var(--color-bg-app);
}

.pm-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

.pm-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  font-size: 15px;
  color: var(--color-text-muted);
}
</style>
