<script setup>
import { BaseNoticeBanner, BaseStatCard } from '@/components/common/base'
import DepartmentLeaderGroupKpiCard           from '@/components/dashboard/departmentleader/DepartmentLeaderGroupKpiCard.vue'
import DepartmentLeaderTeamStatusCard         from '@/components/dashboard/departmentleader/DepartmentLeaderTeamStatusCard.vue'
import {
  dashboardNotice  as notice,
  dashboardMetrics as metrics,
  dashboardTeams   as teams,
  dashboardGroupKpi,
} from '@/mocks/departmentleader/dashboard.js'
</script>

<template>
  <section class="department-leader-dashboard">
    <BaseNoticeBanner
      :badge="notice.badge"
      :title="notice.title"
      :description="notice.description"
      tone="success"
      variant="soft"
    />

    <section class="department-leader-dashboard__metrics">
      <BaseStatCard
        v-for="m in metrics"
        :key="m.label"
        :label="m.label"
        :value="m.value"
        :delta="m.delta ?? ''"
        :tone="m.tone"
        :variant="m.isTier ? 'tier' : 'default'"
      />
    </section>

    <section class="department-leader-dashboard__bottom">
      <DepartmentLeaderGroupKpiCard
        :group-avg="dashboardGroupKpi.groupAvg"
        :equip-rate="dashboardGroupKpi.equipRate"
        :quality-rate="dashboardGroupKpi.qualityRate"
      />
      <DepartmentLeaderTeamStatusCard :teams="teams" />
    </section>
  </section>
</template>

<style scoped>
.department-leader-dashboard {
  width: 100%;
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  display: grid;
  gap: 20px;
  padding: 20px 28px 28px;
  background: var(--color-bg-app);
  align-content: start;
}

.department-leader-dashboard__metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.department-leader-dashboard__bottom {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;
}
</style>
