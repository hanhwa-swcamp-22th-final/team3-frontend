<script setup>
import { computed } from 'vue'
import TeamLeaderDashboardNotice from '@/components/dashboard/common/TeamLeaderDashboardNoticeWrapper.vue'
import TeamLeaderMetricCard from '@/components/dashboard/teamleader/TeamLeaderMetricCardWrapper.vue'
import TeamLeaderMemberGrid from '@/components/dashboard/teamleader/TeamLeaderMemberGrid.vue'
import { dashboardNotice, dashboardMetrics, dashboardMembers } from '@/mocks/teamleader/dashboard'

const evaluationRate = computed(() => {
  const rateMetric = dashboardMetrics.find((metric) => metric.label === '평가율')
  return Number.parseFloat(String(rateMetric?.value ?? '0').replace('%', '')) || 0
})
</script>

<template>
  <section class="teamleader-dashboard-view">
    <TeamLeaderDashboardNotice
      :badge="dashboardNotice.badge"
      :title="dashboardNotice.title"
      :description="dashboardNotice.description"
    />

    <section class="teamleader-dashboard-view__metrics">
      <TeamLeaderMetricCard
        v-for="metric in dashboardMetrics"
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

    <TeamLeaderMemberGrid :members="dashboardMembers" />
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

:deep(.member-grid-section),
:deep(.notice) {
  width: 100%;
  box-sizing: border-box;
}
</style>
