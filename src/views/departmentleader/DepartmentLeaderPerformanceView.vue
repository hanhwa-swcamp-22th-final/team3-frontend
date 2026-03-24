<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import DepartmentLeaderPerformanceSummary from '@/components/hr/departmentleader/perfomance/DepartmentLeaderPerformanceSummary.vue'
import DepartmentLeaderPerformanceTable from '@/components/hr/departmentleader/perfomance/DepartmentLeaderPerformanceTable.vue'
import {
  performanceSummary,
  performanceMembers,
  teamOptions,
  gradeOptions,
  periodOptions,
} from '@/mocks/departmentleader/performance.js'

const router = useRouter()

const selectedTeam = ref('전체')
const teamTabs = teamOptions

const activeSummary = computed(() => {
  if (selectedTeam.value === '전체') return performanceSummary

  const members = performanceMembers.filter((member) => member.team === selectedTeam.value)
  const completed = members.filter((member) => member.status === '완료').length
  const avg = members.length
    ? +(members.reduce((sum, member) => sum + member.total, 0) / members.length).toFixed(1)
    : 0
  const delta = +(avg - performanceSummary.deptAvg).toFixed(1)

  return {
    totalMembers: members.length,
    totalTeams: 1,
    evalCompleted: completed,
    evalTotal: members.length,
    deptAvg: avg,
    deptAvgDelta: delta,
    period: performanceSummary.period,
  }
})

function handleViewCapability(member) {
  router.push({ path: '/departmentleader/team-capability', query: { empId: member.empId } })
}

function handleGoEvaluation() {
  router.push({ path: '/departmentleader/evaluation' })
}
</script>

<template>
  <div class="dl-performance">
    <header class="dl-performance__header">
      <h2 class="dl-performance__title">부서 성과 현황</h2>
      <span class="dl-performance__dept-name">{{ performanceSummary.deptName }}</span>
      <span class="dl-performance__period">{{ performanceSummary.period }}</span>
    </header>

    <DepartmentLeaderPerformanceSummary
      :summary="activeSummary"
      :team-tabs="teamTabs"
      v-model:selectedTeam="selectedTeam"
    />

    <DepartmentLeaderPerformanceTable
      :members="performanceMembers"
      :team-options="teamOptions"
      :grade-options="gradeOptions"
      :period-options="periodOptions"
      @view-capability="handleViewCapability"
      @go-evaluation="handleGoEvaluation"
    />
  </div>
</template>

<style scoped>
.dl-performance {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 24px 28px;
  background: var(--color-bg-app);
  overflow-y: auto;
}

.dl-performance__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dl-performance__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-primary-800);
  margin: 0;
}

.dl-performance__dept-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
  background: var(--color-primary-50, #f5f4ff);
  border: 1px solid var(--color-primary-200, #d4cfff);
  border-radius: 99px;
  padding: 3px 12px;
}

.dl-performance__period {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  background: var(--color-bg-surface-muted, #f5f4ff);
  border: 1px solid var(--color-border-default);
  border-radius: 99px;
  padding: 3px 12px;
}

@media (max-width: 960px) {
  .dl-performance {
    padding: 20px 16px;
  }
}
</style>
