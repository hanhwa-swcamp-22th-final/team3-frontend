<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { BaseStatCardGrid } from '@/components/common/base'
import TeamLeaderKpiMemberTable from '@/components/hr/teamleader/kpi-report/TeamLeaderKpiMemberTableWrapper.vue'
import TeamLeaderKpiTrendPanel from '@/components/hr/teamleader/kpi-report/TeamLeaderKpiTrendPanel.vue'
import { getTeamLeaderKpiMemberDetail, getTeamLeaderKpiReport } from '@/services/hrDashboardApi'

const loading = ref(true)
const detailLoading = ref(false)
const summaryCards = ref([])
const rows = ref([])
const selectedMemberId = ref(null)
const trendPanel = ref(null)
const period = { year: 2026, evalSequence: 1 }

const selectedMember = computed(() => {
  return rows.value.find((row) => row.id === selectedMemberId.value) ?? rows.value[0] ?? null
})

function handleSelectMember(memberId) {
  selectedMemberId.value = memberId
}

async function loadMemberDetail() {
  if (!selectedMember.value) {
    trendPanel.value = null
    return
  }
  detailLoading.value = true
  try {
    trendPanel.value = await getTeamLeaderKpiMemberDetail(
      selectedMember.value.id,
      period,
      selectedMember.value
    )
  } catch (error) {
    console.error('Failed to load team leader KPI member detail:', error)
  } finally {
    detailLoading.value = false
  }
}

onMounted(async () => {
  try {
    const report = await getTeamLeaderKpiReport(period)
    summaryCards.value = report.summaryCards
    rows.value = report.rows
    selectedMemberId.value = report.rows[0]?.id ?? null
  } catch (error) {
    console.error('Failed to load team leader KPI report:', error)
  } finally {
    loading.value = false
  }
})

watch(selectedMemberId, loadMemberDetail)
</script>

<template>
  <section class="teamleader-kpi-report-view">
    <div v-if="loading" class="teamleader-kpi-report-view__loading">데이터를 불러오는 중...</div>

    <template v-else>
      <BaseStatCardGrid class="teamleader-kpi-report-view__summary" :cards="summaryCards" />

      <section class="teamleader-kpi-report-view__content">
        <TeamLeaderKpiMemberTable
          :rows="rows"
          :page-size="8"
          :selected-id="selectedMemberId"
          @select-row="handleSelectMember"
        />
        <div v-if="detailLoading || !trendPanel" class="teamleader-kpi-report-view__loading">
          상세 데이터를 불러오는 중...
        </div>
        <TeamLeaderKpiTrendPanel v-else :panel="trendPanel" />
      </section>
    </template>
  </section>
</template>

<style scoped>
.teamleader-kpi-report-view {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 16px;
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 0;
  height: calc(100vh - 80px);
  padding: 14px 10px;
  background: var(--color-bg-app);
  box-sizing: border-box;
  overflow: hidden;
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
  align-items: stretch;
  min-height: 0;
}

.teamleader-kpi-report-view__loading {
  padding: 60px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
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
