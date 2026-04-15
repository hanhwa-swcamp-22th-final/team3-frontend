<script setup>
import { ref, onMounted } from 'vue'
import { getWorkerPointMission } from '@/services/workerHrApi'
import WorkerPointTotalHolding from '@/components/hr/worker/point-mission/WorkerPointTotalHolding.vue'
import WorkerPointAccrualHistory from '@/components/hr/worker/point-mission/WorkerPointAccrualHistory.vue'
import WorkerPointPerMission from '@/components/hr/worker/point-mission/WorkerPointPerMission.vue'

const loading = ref(true)
const pointSummary = ref(null)
const pointHistory = ref([])
const upgradeMissions = ref([])
const currentTier = ref('')

onMounted(async () => {
  try {
    const data = await getWorkerPointMission()
    pointSummary.value = data.summary
    pointHistory.value = data.history
    upgradeMissions.value = data.missions
    currentTier.value = data.currentTier
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
      <WorkerPointTotalHolding :summary="pointSummary" />

      <div class="pm-grid">
        <WorkerPointAccrualHistory :history="pointHistory" />
        <WorkerPointPerMission
          :missions="upgradeMissions"
          :current-tier="currentTier"
        />
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
