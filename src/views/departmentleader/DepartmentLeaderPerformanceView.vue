<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DLPerformanceSummary        from '@/components/hr/departmentleader/perfomance/DLPerformanceSummary.vue'
import DLGradeDistributionChart    from '@/components/hr/departmentleader/perfomance/DLGradeDistributionChart.vue'
import DLTeamComparisonChart       from '@/components/hr/departmentleader/perfomance/DLTeamComparisonChart.vue'
import DLPerformanceTable          from '@/components/hr/departmentleader/perfomance/DLPerformanceTable.vue'
import {
  performanceSummary,
  gradeDistribution,
  teamComparison,
  performanceMembers,
  teamOptions,
  gradeOptions,
  periodOptions,
} from '@/mocks/departmentleader/performance.js'

const router = useRouter()

function handleViewCapability(member) {
  router.push({ path: '/departmentleader/team-capability', query: { empId: member.empId } })
}
</script>

<template>
  <div class="dl-performance">
    <header class="dl-performance__header">
      <h2 class="dl-performance__title">그룹 성과 현황</h2>
      <span class="dl-performance__period">{{ performanceSummary.period }}</span>
    </header>

    <!-- 1. 상단: 부서 성과 요약 -->
    <DLPerformanceSummary :summary="performanceSummary" />

    <!-- 2&3. 중앙: 등급 분포 + 팀별 비교 -->
    <div class="dl-performance__charts">
      <DLGradeDistributionChart
        :distribution="gradeDistribution"
        :total-members="performanceSummary.totalMembers"
      />
      <DLTeamComparisonChart :team-data="teamComparison" />
    </div>

    <!-- 4. 하단: 상세 데이터 그리드 -->
    <DLPerformanceTable
      :members="performanceMembers"
      :team-options="teamOptions"
      :grade-options="gradeOptions"
      :period-options="periodOptions"
      @view-capability="handleViewCapability"
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
  font-size: 22px;
  font-weight: 800;
  color: var(--color-primary-800);
  margin: 0;
}

.dl-performance__period {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-muted);
  background: var(--color-bg-surface-muted, #f5f4ff);
  border: 1px solid var(--color-border-default);
  border-radius: 99px;
  padding: 3px 12px;
}

.dl-performance__charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 960px) {
  .dl-performance__charts {
    grid-template-columns: 1fr;
  }
  .dl-performance {
    padding: 20px 16px;
  }
}
</style>
