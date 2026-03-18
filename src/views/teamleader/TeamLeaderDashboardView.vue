<script setup>
import TeamLeaderDashboardNotice from '@/components/dashboard/common/TeamLeaderDashboardNoticeWrapper.vue'
import TeamLeaderMetricCard from '@/components/dashboard/teamleader/TeamLeaderMetricCardWrapper.vue'
import TeamLeaderMemberGrid from '@/components/dashboard/teamleader/TeamLeaderMemberGrid.vue'
import TeamLeaderAlertFeed from '@/components/dashboard/teamleader/TeamLeaderAlertFeed.vue'
import { dashboardNotice, dashboardMetrics, dashboardMembers, dashboardAlerts } from '@/mocks/teamleader/dashboard'


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
      />
    </section>
    <TeamLeaderMemberGrid :members="dashboardMembers" />
    <TeamLeaderAlertFeed :items="dashboardAlerts" />
  </section>

</template>

<style scoped>
.teamleader-dashboard-view {
  width: 100%;
  flex: 1;
  min-width: 0;
  box-sizing: border-box;

  display: grid;
  gap: 20px;
  padding: 20px 28px 28px;
  background: var(--color-bg-app);
}

.teamleader-dashboard-view__metrics {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

:deep(.member-grid-section),
:deep(.alert-feed),
:deep(.notice) {
  width: 100%;
  box-sizing: border-box;
}
</style>


