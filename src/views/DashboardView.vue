<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import RoleSidebar from '@/components/common/RoleSidebar.vue'
import AdminSidebar from '@/components/common/AdminSidebar.vue'
import { roleLabels } from '@/components/common/menuConfig.js'

// Worker dashboard components
import WorkerNotificationBanner from '@/components/worker/dashboard/WorkerNotificationBanner.vue'
import WorkerOverallStatusCard from '@/components/worker/dashboard/WorkerOverallStatusCard.vue'
import WorkerSkillsRadarChart from '@/components/worker/dashboard/WorkerSkillsRadarChart.vue'
import WorkerTierGrowthHistory from '@/components/worker/dashboard/WorkerTierGrowthHistory.vue'
import WorkerMissionBoard from '@/components/worker/dashboard/WorkerMissionBoard.vue'

const API_BASE = 'http://localhost:3001'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const props = defineProps({
  title: {
    type: String,
    default: 'S.E.T.O',
  },
  subtitle: {
    type: String,
    default: 'SMART EQUIPMENT & TALENT ORCHESTRATOR',
  },
})

const profileName = computed(() => authStore.employee?.employee_name || 'User')
const profileRole = computed(() => roleLabels[authStore.role()] ?? authStore.role() ?? 'User')
const profileInitials = computed(() => {
  const role = authStore.role()
  return role ? role.slice(0, 2).toUpperCase() : 'U'
})
const isAdmin = computed(() => authStore.role() === 'admin')
const isWorker = computed(() => authStore.role() === 'worker')
const isWorkerDashboard = computed(() => isWorker.value && route.name === 'WorkerDashboard')

// ── Worker dashboard state ──
const workerLoading = ref(true)
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
  if (!isWorkerDashboard.value) return

  const employeeId = authStore.employee?.employee_id

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
    workerLoading.value = false
  }
})

function handleLogout() {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="dashboard-brand">
        <div class="dashboard-logo">SE</div>
        <div class="dashboard-brand-copy">
          <strong>{{ props.title }}</strong>
          <span>{{ props.subtitle }}</span>
        </div>
      </div>

      <div class="dashboard-actions">
        <div class="dashboard-profile">
          <div class="dashboard-avatar">{{ profileInitials }}</div>
          <div class="dashboard-profile-copy">
            <strong>{{ profileName }}</strong>
            <span>{{ profileRole }}</span>
          </div>
        </div>
        <button type="button" class="dashboard-logout" @click="handleLogout">
          로그아웃
        </button>
      </div>
    </header>

    <main class="dashboard-content">
      <AdminSidebar v-if="isAdmin" />
      <RoleSidebar v-else />

      <!-- Worker dashboard content -->
      <div v-if="isWorkerDashboard" class="worker-content">
        <div v-if="workerLoading" class="worker-loading">데이터를 불러오는 중...</div>

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

      <!-- Placeholder for other roles / other worker pages -->
      <div v-else class="dashboard-placeholder">
        <p>대시보드 페이지입니다. (준비 중)</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 80px;
  padding: 0 30px;
  border-top: 1px solid var(--color-border-default);
  border-bottom: 1px solid var(--color-border-default);
  background: var(--color-bg-surface);
}

.dashboard-brand,
.dashboard-actions,
.dashboard-profile {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dashboard-logo {
  width: 46px;
  height: 46px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-800);
  color: var(--color-text-inverse);
  font-size: 24px;
  font-weight: 700;
}

.dashboard-brand-copy,
.dashboard-profile-copy {
  display: grid;
}

.dashboard-brand-copy strong,
.dashboard-profile-copy strong {
  font-size: 20px;
  color: var(--color-primary-800);
}

.dashboard-brand-copy span,
.dashboard-profile-copy span {
  font-size: 13px;
  color: var(--color-primary-300);
}

.dashboard-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-100);
  color: var(--color-primary-500);
  font-weight: 700;
}

.dashboard-logout {
  height: 38px;
  padding: 0 14px;
  border: 1px solid var(--color-border-default);
  border-radius: 999px;
  background: var(--color-bg-surface);
  color: var(--color-primary-600);
  font-weight: 600;
  cursor: pointer;
}

.dashboard-content {
  display: flex;
}

.dashboard-placeholder {
  flex: 1;
  padding: 40px 32px;
  font-size: 16px;
  color: var(--color-text-default);
}

/* ── Worker dashboard ── */
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
