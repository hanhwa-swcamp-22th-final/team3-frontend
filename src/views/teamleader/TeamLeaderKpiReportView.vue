<script setup>
import TeamLeaderKpiSummaryCard from '@/components/teamleader/hr/TeamLeaderKpiSummaryCard.vue'
import TeamLeaderKpiPeriodFilter from '@/components/teamleader/hr/TeamLeaderKpiPeriodFilter.vue'
import TeamLeaderKpiMemberTable from '@/components/teamleader/hr/TeamLeaderKpiMemberTable.vue'
import TeamLeaderKpiTrendPanel from '@/components/teamleader/hr/TeamLeaderKpiTrendPanel.vue'

const filterOptions = ['이번달', '분기', '반기', '연간']

const summaryCards = [
  {
    label: '팀 종합 KPI',
    value: '89.6',
    delta: '+1.8',
    helper: '전월 대비',
    tone: 'primary',
  },
  {
    label: '품질 달성률',
    value: '96.2%',
    delta: '+0.9%',
    helper: '불량률 안정화',
    tone: 'success',
  },
  {
    label: '납기 준수율',
    value: '93.8%',
    delta: '+2.4%',
    helper: '긴급 건 포함',
    tone: 'success',
  },
  {
    label: '개선 필요 지표',
    value: '2건',
    delta: '-1',
    helper: '집중 관리 대상',
    tone: 'warning',
  },
]

const kpiRows = [
  {
    id: 1,
    name: '손창우',
    code: 'MCH-01',
    tier: 'S',
    productivity: '94.2%',
    quality: '97.1%',
    collaboration: '92.4%',
    trend: '+3.2',
    statusTone: 'success',
  },
  {
    id: 2,
    name: '김신우',
    code: 'MCH-02',
    tier: 'A',
    productivity: '86.1%',
    quality: '92.7%',
    collaboration: '88.2%',
    trend: '+1.8',
    statusTone: 'success',
  },
  {
    id: 3,
    name: '황자현',
    code: 'PRS-01',
    tier: 'A',
    productivity: '83.4%',
    quality: '88.4%',
    collaboration: '80.1%',
    trend: '-0.6',
    statusTone: 'danger',
  },
  {
    id: 4,
    name: '임원석',
    code: 'WLD-01',
    tier: 'B',
    productivity: '72.8%',
    quality: '84.3%',
    collaboration: '79.5%',
    trend: '+2.4',
    statusTone: 'success',
  },
]

const trendItems = [
  { label: '생산성', current: '89.2', target: '90+', description: '주간 기준 안정권 진입 직전입니다.' },
  { label: '품질', current: '96.2%', target: '95%+', description: '팀 전체 품질 지표가 목표를 상회하고 있습니다.' },
  { label: '협업', current: '87.6', target: '90', description: '교대 간 인수인계 품질 보완이 필요합니다.' },
]
</script>

<template>
  <section class="teamleader-kpi-report-view">
    <header class="teamleader-kpi-report-view__header">
      <div>
        <p class="teamleader-kpi-report-view__eyebrow">KPI 리포트</p>
        <h1 class="teamleader-kpi-report-view__title">팀 핵심 성과 지표 리포트</h1>
        <p class="teamleader-kpi-report-view__description">
          팀 성과 추이와 관리가 필요한 지표를 빠르게 점검할 수 있습니다.
        </p>
      </div>
      <TeamLeaderKpiPeriodFilter :options="filterOptions" active-label="이번달" />
    </header>

    <section class="teamleader-kpi-report-view__summary">
      <TeamLeaderKpiSummaryCard
        v-for="card in summaryCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :delta="card.delta"
        :helper="card.helper"
        :tone="card.tone"
      />
    </section>

    <section class="teamleader-kpi-report-view__content">
      <TeamLeaderKpiMemberTable :rows="kpiRows" />
      <TeamLeaderKpiTrendPanel :items="trendItems" />
    </section>
  </section>
</template>

<style scoped>
.teamleader-kpi-report-view {
  display: grid;
  gap: 20px;
  width: 100%;
  min-width: 0;
  padding: 20px 28px 28px;
  background: var(--color-bg-app);
  box-sizing: border-box;
}

.teamleader-kpi-report-view__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.teamleader-kpi-report-view__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-500);
}

.teamleader-kpi-report-view__title {
  margin-top: 6px;
  font-size: 28px;
  color: var(--color-primary-800);
}

.teamleader-kpi-report-view__description {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-default);
}

.teamleader-kpi-report-view__summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.teamleader-kpi-report-view__content {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(300px, 0.9fr);
  gap: 18px;
  align-items: start;
}

@media (max-width: 1280px) {
  .teamleader-kpi-report-view__summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .teamleader-kpi-report-view__content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .teamleader-kpi-report-view {
    padding: 18px;
  }

  .teamleader-kpi-report-view__header {
    flex-direction: column;
  }

  .teamleader-kpi-report-view__summary {
    grid-template-columns: 1fr;
  }
}
</style>
