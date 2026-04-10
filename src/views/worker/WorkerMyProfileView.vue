<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { API_BASE } from '@/constants'
import WorkerNotificationBanner from '@/components/dashboard/common/WorkerNotificationBanner.vue'
import WorkerOverallStatusCard from '@/components/dashboard/worker/WorkerOverallStatusCard.vue'
import WorkerSkillsRadarChart from '@/components/dashboard/worker/WorkerSkillsRadarChart.vue'
import WorkerTierGrowthHistory from '@/components/dashboard/worker/WorkerTierGrowthHistory.vue'
import WorkerMissionBoard from '@/components/dashboard/worker/WorkerMissionBoard.vue'
const authStore = useAuthStore()

const loading = ref(true)
const workerData = ref(null)
const workerSkills = ref([])
const workerTierMilestones = ref([])
const workerTierChartData = ref([])
const workerMissions = ref([])
const workerNotification = ref(null)

async function fetchJson(url) {
  const res = await fetch(url)
  return res.json()
}

onMounted(async () => {
  const employeeId = authStore.userInfo?.employeeId

  try {
    const [profiles, skills, milestones, chartData, missions, notifications] =
      await Promise.all([
        fetchJson(`${API_BASE}/workerProfiles?employee_id=${employeeId}`),
        fetchJson(`${API_BASE}/workerSkills?employee_id=${employeeId}`),
        fetchJson(`${API_BASE}/tierMilestones?employee_id=${employeeId}`),
        fetchJson(`${API_BASE}/tierChartData?employee_id=${employeeId}`),
        fetchJson(`${API_BASE}/missions?employee_id=${employeeId}`),
        fetchJson(`${API_BASE}/notifications?active=true`),
      ])

    workerData.value = profiles[0] ?? null
    workerSkills.value = skills
    workerTierMilestones.value = milestones
    workerTierChartData.value = chartData
    workerMissions.value = missions
    workerNotification.value = notifications[0] ?? null
  } catch (e) {
    console.error('Failed to load worker dashboard data:', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="worker-content">
    <div v-if="loading" class="worker-loading">데이터를 불러오는 중...</div>

    <template v-else>
      <WorkerNotificationBanner
        v-if="workerNotification"
        :title="workerNotification.title"
        :description="workerNotification.description"
      />

      <div class="worker-grid">
        <div class="worker-grid__status">
          <WorkerOverallStatusCard v-if="workerData" :worker="workerData" />
        </div>
        <div class="worker-grid__radar">
          <WorkerSkillsRadarChart v-if="workerSkills.length" :skills="workerSkills" />
        </div>
        <div class="worker-grid__tier">
          <WorkerTierGrowthHistory
            v-if="workerTierMilestones.length"
            :milestones="workerTierMilestones"
            :chart-data="workerTierChartData"
          />
        </div>
        <div class="worker-grid__missions">
          <WorkerMissionBoard v-if="workerMissions.length" :missions="workerMissions" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.worker-content {
  flex: 1;
  padding: 20px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  background: var(--color-bg-app);
}

.worker-grid {
  display: grid;
  grid-template-columns: 280px 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 20px;
}

.worker-grid__status {
  grid-row: 1 / 3;
}

.worker-grid__radar {
  grid-column: 2 / 4;
  grid-row: 1;
}

.worker-grid__tier {
  grid-column: 2 / 3;
  grid-row: 2;
}

.worker-grid__missions {
  grid-column: 3 / 4;
  grid-row: 2;
}

.worker-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  font-size: 15px;
  color: var(--color-text-muted);
}
</style>
