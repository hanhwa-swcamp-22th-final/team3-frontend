<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import WorkerNotificationBanner from '@/components/dashboard/common/WorkerNotificationBanner.vue'
import TeamLeaderMetricCard from '@/components/dashboard/teamleader/TeamLeaderMetricCardWrapper.vue'
import TeamLeaderMemberGrid from '@/components/dashboard/teamleader/TeamLeaderMemberGrid.vue'
import { getTeamLeaderDashboard } from '@/services/hrDashboardApi'

const loading = ref(true)
const router = useRouter()
const notice = ref(null)
const metrics = ref([])
const members = ref([])

const evaluationRate = computed(() => {
  const rateMetric = metrics.value.find((metric) => metric.label === '평가율')
  return Number.parseFloat(String(rateMetric?.value ?? '0').replace('%', '')) || 0
})

onMounted(async () => {
  try {
    const dashboard = await getTeamLeaderDashboard()
    notice.value = dashboard.notice
    metrics.value = dashboard.metrics
    members.value = dashboard.members
  } catch (error) {
    console.error('Failed to load team leader dashboard:', error)
  } finally {
    loading.value = false
  }
})

function goNoticeBoard() {
  router.push({
    name: 'TLNoticeBoard',
    query: notice.value?.id ? { noticeId: notice.value.id } : {},
  })
}
</script>

<template>
  <section class="teamleader-dashboard-view">
    <div v-if="loading" class="teamleader-dashboard-view__loading">데이터를 불러오는 중...</div>

    <template v-else>
      <WorkerNotificationBanner
        v-if="notice"
        :title="notice.title"
        :description="notice.description"
        class="teamleader-dashboard-view__notice"
        @click="goNoticeBoard"
      />

      <section class="teamleader-dashboard-view__metrics">
        <TeamLeaderMetricCard
          v-for="metric in metrics"
          :key="metric.label"
          :label="metric.label"
          :value="metric.value"
          :delta="metric.delta"
          :helper="metric.helper"
          :tone="metric.tone"
          :progress-value="metric.label === '평가율' ? evaluationRate : null"
          progress-tone="success"
        />
      </section>

      <TeamLeaderMemberGrid :members="members" />
    </template>
  </section>
</template>

<style scoped>
.teamleader-dashboard-view {
  width: 100%;
  flex: 1;
  min-width: 0;
  min-height: 0;
  height: calc(100vh - 80px);
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto auto auto;
  gap: 16px;
  padding: 12px 10px 18px;
  background: var(--color-bg-app);
  overflow: hidden;
}

.teamleader-dashboard-view__metrics {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

:deep(.member-grid-section) {
  width: 100%;
  box-sizing: border-box;
}

.teamleader-dashboard-view__notice {
  width: 100%;
  box-sizing: border-box;
}

.teamleader-dashboard-view__loading {
  padding: 60px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
}
</style>
