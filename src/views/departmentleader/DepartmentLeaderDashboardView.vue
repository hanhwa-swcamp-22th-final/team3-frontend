<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { BaseNoticeBanner, BaseStatCard } from '@/components/common/base'
import DepartmentLeaderGroupKpiCard  from '@/components/dashboard/departmentleader/DepartmentLeaderGroupKpiCard.vue'
import DepartmentLeaderTeamStatusCard from '@/components/dashboard/departmentleader/DepartmentLeaderTeamStatusCard.vue'
import DepartmentLeaderMemberTable   from '@/components/dashboard/departmentleader/DepartmentLeaderMemberTable.vue'
import { getDepartmentLeaderDashboard } from '@/services/hrDashboardApi'

const loading = ref(true)
const notice = ref(null)
const metrics = ref([])
const teams = ref([])
const members = ref([])
const dashboardGroupKpi = ref({ groupAvg: 0, equipRate: '0%', qualityRate: '0명' })
const router = useRouter()

onMounted(async () => {
  try {
    const dashboard = await getDepartmentLeaderDashboard()
    notice.value = dashboard.notice
    metrics.value = dashboard.metrics
    teams.value = dashboard.teams
    members.value = dashboard.members
    dashboardGroupKpi.value = dashboard.groupKpi
  } catch (error) {
    console.error('Failed to load department leader dashboard:', error)
  } finally {
    loading.value = false
  }
})

function goNoticeBoard() {
  router.push({
    name: 'DLNoticeBoard',
    query: notice.value?.id ? { noticeId: notice.value.id } : {},
  })
}
</script>

<template>
  <section class="department-leader-dashboard">
    <div v-if="loading" class="department-leader-dashboard__loading">데이터를 불러오는 중...</div>

    <template v-else>
      <BaseNoticeBanner
        v-if="notice"
        :badge="notice.badge"
        :title="notice.title"
        :description="notice.description"
        tone="success"
        variant="soft"
        class="department-leader-dashboard__notice"
        role="button"
        tabindex="0"
        @click="goNoticeBoard"
        @keydown.enter="goNoticeBoard"
        @keydown.space.prevent="goNoticeBoard"
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
          :tier-stats="dashboardGroupKpi.tierStats"
        />
        <DepartmentLeaderTeamStatusCard :teams="teams" />
      </section>

      <DepartmentLeaderMemberTable :members="members" />
    </template>
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

.department-leader-dashboard__loading {
  padding: 60px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
}

.department-leader-dashboard__notice {
  cursor: pointer;
}
</style>
