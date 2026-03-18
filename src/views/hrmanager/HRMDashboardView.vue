<script setup>
import { ref, onMounted } from 'vue'
import { API_BASE } from '@/constants'
import HRMDashboardNotice from '@/components/dashboard/common/HRMDashboardNotice.vue'
import HRMMetricCard from '@/components/hr/hrmanager/kpi-report/HRMMetricCard.vue'
import HRMTierDonutChart from '@/components/dashboard/hrmanager/HRMTierDonutChart.vue'
import HRMTierTrendChart from '@/components/dashboard/hrmanager/HRMTierTrendChart.vue'
import HRMTeamStatsTable from '@/components/dashboard/hrmanager/HRMTeamStatsTable.vue'
import HRMTierDistCard from '@/components/dashboard/hrmanager/HRMTierDistCard.vue'

const loading = ref(true)
const dashboard = ref(null)
const tierDistribution = ref([])
const tierTrend = ref([])
const teamStats = ref([])
const tierSummary = ref(null)
const notification = ref(null)

async function fetchJson(url) {
  const res = await fetch(url)
  return res.json()
}

onMounted(async () => {
  try {
    const [dash, dist, trend, stats, summary, notifs] = await Promise.all([
      fetchJson(`${API_BASE}/hrmDashboard`),
      fetchJson(`${API_BASE}/tierDistribution`),
      fetchJson(`${API_BASE}/tierTrend`),
      fetchJson(`${API_BASE}/teamStats`),
      fetchJson(`${API_BASE}/tierSummary`),
      fetchJson(`${API_BASE}/notifications?active=true`),
    ])

    dashboard.value = dash[0] ?? null
    tierDistribution.value = dist
    tierTrend.value = trend
    teamStats.value = stats
    tierSummary.value = summary[0] ?? null
    notification.value = notifs[0] ?? null
  } catch (e) {
    console.error('Failed to load HRM dashboard data:', e)
  } finally {
    loading.value = false
  }
})

const metrics = ref([
  { key: 'avgScore', label: '전사 평균 점수', tone: 'primary' },
  { key: 'totalEmployees', label: '총 직원 수', suffix: '명', tone: 'primary' },
  { key: 'evaluationRate', label: '평가 완료율', suffix: '%', tone: 'success' },
  { key: 'unevaluatedCount', label: '미평가 직원', suffix: '명', tone: 'danger' },
])

function metricValue(key, suffix) {
  if (!dashboard.value) return '-'
  return `${dashboard.value[key]}${suffix ?? ''}`
}
</script>

<template>
  <section class="hrm-dashboard">
    <div v-if="loading" class="hrm-dashboard__loading">로딩 중...</div>

    <template v-else>
      <HRMDashboardNotice
        badge="📌 중요 공지"
        :title="notification?.notification_title ?? ''"
        :description="notification?.notification_content ?? ''"
      />

      <section class="hrm-dashboard__metrics">
        <HRMMetricCard
          v-for="m in metrics"
          :key="m.key"
          :label="m.label"
          :value="metricValue(m.key, m.suffix)"
          :tone="m.tone"
        />
      </section>

      <section class="hrm-dashboard__charts">
        <HRMTierDonutChart
          :tiers="tierDistribution"
          :total="tierDistribution.reduce((s, t) => s + t.count, 0)"
        />
        <HRMTierTrendChart
          :data="tierTrend"
          :delta-text="dashboard?.tierDelta"
        />
      </section>

      <section class="hrm-dashboard__bottom">
        <HRMTeamStatsTable :rows="teamStats" />
        <HRMTierDistCard
          v-if="tierSummary"
          :tier-s="tierSummary.S"
          :tier-a="tierSummary.A"
          :tier-b="tierSummary.B"
          :process-label="tierSummary.processLabel"
          :process-percent="tierSummary.processPercent"
        />
      </section>
    </template>
  </section>
</template>

<style scoped>
.hrm-dashboard {
  width: 100%;
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  display: grid;
  gap: 20px;
  padding: 20px 28px 28px;
  background: var(--color-bg-app);
}

.hrm-dashboard__loading {
  padding: 60px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 15px;
}

.hrm-dashboard__metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.hrm-dashboard__charts {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 20px;
}

.hrm-dashboard__bottom {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
}

:deep(.notice),
:deep(.metric-card) {
  width: 100%;
  box-sizing: border-box;
}
</style>
