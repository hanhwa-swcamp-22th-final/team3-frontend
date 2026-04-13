<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { API_BASE, HR_API_BASE } from '@/constants'
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

async function fetchHrApi(path) {
  const res = await fetch(`${HR_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${authStore.accessToken}` },
  })
  const json = await res.json()
  return json.data
}

const SKILL_LABEL = {
  EQUIPMENT_RESPONSE: '설비대응',
  TECHNICAL_TRANSFER: '기술전수',
  INNOVATION_PROPOSAL: '혁신제안',
  SAFETY_COMPLIANCE: '안전준수',
  QUALITY_MANAGEMENT: '품질관리',
  PRODUCTIVITY: '생산성',
}

onMounted(async () => {
  const employeeId = authStore.userInfo?.employeeId

  try {
    // Profile + Skills + Tier Chart + Missions from backend HR API
    const [profile, skills, tierChart, missions] = await Promise.all([
      fetchHrApi('/api/v1/hr/workers/me/profile'),
      fetchHrApi('/api/v1/hr/workers/me/skills'),
      fetchHrApi('/api/v1/hr/workers/me/tier-chart'),
      fetchHrApi('/api/v1/hr/workers/me/missions'),
    ])

    workerData.value = {
      score: profile.totalScore != null ? Math.round(Number(profile.totalScore)) : null,
      type: null,
      tier: profile.currentTier,
      name: profile.employeeName,
      nameEn: null,
      skillGrid: skills.map(s => ({
        value: Math.round(Number(s.skillScore)),
        label: SKILL_LABEL[s.skillName] ?? s.skillName,
      })),
      historyPeriod: null,
      worksDone: null,
      finishRate: null,
      aiEval: null,
    }

    // Radar chart uses same skills data from HR API
    workerSkills.value = skills.map(s => ({
      label: SKILL_LABEL[s.skillName] ?? s.skillName,
      value: Math.round(Number(s.skillScore)),
    }))

    // Tier chart data from HR API
    workerTierChartData.value = (tierChart ?? []).map(d => ({
      period: d.year != null ? `${d.year}-Q${d.evalSequence}` : null,
      value: d.totalScore != null ? Math.round(Number(d.totalScore)) : null,
      tier: d.tier,
    }))
    // Milestones — no backend endpoint yet, set empty
    workerTierMilestones.value = []

    // Missions from HR API
    workerMissions.value = (missions ?? []).map(m => ({
      title: m.missionName ?? null,
      points: m.rewardPoint ?? null,
      current: m.currentValue != null ? Math.round(Number(m.currentValue)) : null,
      target: m.conditionValue != null ? Math.round(Number(m.conditionValue)) : null,
      icon: null,
    }))

    // Remaining data from mock API (to be migrated later)
    const notifications = await fetchJson(`${API_BASE}/notifications?active=true`)
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
            :milestones="workerTierMilestones"
            :chart-data="workerTierChartData"
          />
        </div>
        <div class="worker-grid__missions">
          <WorkerMissionBoard :missions="workerMissions" />
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
