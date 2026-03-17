<script setup>
import { computed, ref } from 'vue'
import TeamLeaderKpiSummaryCard from '@/components/teamleader/hr/TeamLeaderKpiSummaryCard.vue'
import TeamLeaderKpiMemberTable from '@/components/teamleader/hr/TeamLeaderKpiMemberTable.vue'
import TeamLeaderKpiTrendPanel from '@/components/teamleader/hr/TeamLeaderKpiTrendPanel.vue'
import { kpiSummaryCards, kpiRows } from '@/mocks/teamleader/kpiReport'

const selectedMemberId = ref(1)

const selectedMember = computed(() => {
  return kpiRows.find((row) => row.id === selectedMemberId.value) ?? kpiRows[0]
})

const trendPanel = computed(() => {
  const member = selectedMember.value
  return {
    title: `산출 상세 — ${member.name}`,
    steps: [
      { step: 1, title: '기준 생산량 설정', description: 'E_exp = 120개/일', value: '120개' },
      { step: 2, title: '실제 생산량 집계', description: `P = ${member.actualOutput} (MES 수신)`, value: member.actualOutput },
      { step: 3, title: '임시 E값', description: `${member.actualOutput.replace('개', '')} / 120 = ${member.eIdx}`, value: `${Number(member.eIdx) * 100}%` },
      { step: 4, title: '설비 E_idx 수신', description: `${member.name} 가동 E_idx = ${member.eIdx}`, value: member.eIdx },
      { step: 5, title: '보정 달성률', description: `보정 달성률 = ${member.adjustedRate}`, value: member.adjustedRate },
      { step: 6, title: '정량 점수 산출', description: `최종 산출 점수 = ${member.score}`, value: `${member.score}점` },
    ],
    chartTitle: `${member.name} E_idx 월별 추이`,
    chartMeta: `선택 인원 ${member.name} · 최근 산출 지표 기준`,
    benchmarkTitle: '라인 내 비교',
    benchmarkItems: [
      { label: '라인 평균', value: '83.1', delta: '기준' },
      { label: member.name, value: member.score, delta: member.trend },
      { label: '라인 최고', value: '86.1', delta: '▲3.0' },
    ],
  }
})

function handleSelectMember(memberId) {
  selectedMemberId.value = memberId
}
</script>

<template>
  <section class="teamleader-kpi-report-view">
    <section class="teamleader-kpi-report-view__summary">
      <TeamLeaderKpiSummaryCard
        v-for="card in kpiSummaryCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :helper="card.helper"
        :tone="card.tone"
      />
    </section>

    <section class="teamleader-kpi-report-view__content">
      <TeamLeaderKpiMemberTable
        :rows="kpiRows"
        :page-size="10"
        :selected-id="selectedMemberId"
        @select-row="handleSelectMember"
      />
      <TeamLeaderKpiTrendPanel :panel="trendPanel" />
    </section>
  </section>
</template>

<style scoped>
.teamleader-kpi-report-view {
  display: grid;
  gap: 16px;
  width: 100%;
  min-width: 0;
  padding: 14px 10px;
  background: var(--color-bg-app);
  box-sizing: border-box;
}

.teamleader-kpi-report-view__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.teamleader-kpi-report-view__content {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(360px, 1.05fr);
  gap: 16px;
  align-items: start;
}

@media (max-width: 1180px) {
  .teamleader-kpi-report-view__summary,
  .teamleader-kpi-report-view__content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .teamleader-kpi-report-view {
    padding: 12px;
  }
}
</style>

