<script setup>
import { computed, ref } from 'vue'
import { BaseStatCardGrid } from '@/components/common/base'
import TeamLeaderKpiMemberTable from '@/components/hr/teamleader/kpi-report/TeamLeaderKpiMemberTableWrapper.vue'
import TeamLeaderKpiTrendPanel from '@/components/hr/teamleader/kpi-report/TeamLeaderKpiTrendPanel.vue'
import { kpiSummaryCards, kpiRows, kpiTrendPanelMap } from '@/mocks/teamleader/kpiReport'

const selectedMemberId = ref(1)

const selectedMember = computed(() => {
  return kpiRows.find((row) => row.id === selectedMemberId.value) ?? kpiRows[0]
})

const trendPanel = computed(() => {
  const member = selectedMember.value
  const basePanel = kpiTrendPanelMap.default

  const steps = basePanel.stepTemplates.map((step) => ({
    step: step.step,
    title: step.title,
    description: step.descriptionTemplate
      .replace('{actualOutput}', member.actualOutput)
      .replace('{actualBase}', member.actualOutput.replace('개', ''))
      .replace('{eIdx}', member.eIdx)
      .replace('{name}', member.name)
      .replace('{adjustedRate}', member.adjustedRate)
      .replace('{score}', member.score),
    value: step.valueTemplate
      .replace('{actualOutput}', member.actualOutput)
      .replace('{eRate}', `${Number(member.eIdx) * 100}`)
      .replace('{eIdx}', member.eIdx)
      .replace('{adjustedRate}', member.adjustedRate)
      .replace('{score}', member.score),
  }))

  const benchmarkItems = basePanel.benchmarkTemplates.map((item) => ({
    label: item.labelTemplate.replace('{name}', member.name),
    value: item.valueTemplate.replace('{score}', member.score),
    delta: item.deltaTemplate.replace('{trend}', member.trend),
  }))

  return {
    title: `산출 상세 — ${member.name}`,
    steps,
    chartTitle: basePanel.chartTitleTemplate.replace('{name}', member.name),
    chartMeta: basePanel.chartMetaTemplate.replace('{name}', member.name),
    benchmarkTitle: basePanel.benchmarkTitle,
    benchmarkItems,
  }
})

function handleSelectMember(memberId) {
  selectedMemberId.value = memberId
}
</script>

<template>
  <section class="teamleader-kpi-report-view">
    <BaseStatCardGrid class="teamleader-kpi-report-view__summary" :cards="kpiSummaryCards" />

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
  grid-template-columns: repeat(4, minmax(0, 1fr));
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
