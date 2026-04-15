<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseStatCard         from '@/components/common/base/display/BaseStatCard.vue'
import HRMKpiTeamBarChart   from '@/components/hr/hrmanager/kpi-report/HRMKpiTeamBarChart.vue'
import HRMKpiTierTrendChart from '@/components/hr/hrmanager/kpi-report/HRMKpiTierTrendChart.vue'
import HRMKpiCompletionDonut from '@/components/hr/hrmanager/kpi-report/HRMKpiCompletionDonut.vue'
import HRMKpiTeamTable      from '@/components/hr/hrmanager/kpi-report/HRMKpiTeamTable.vue'
import { downloadHrmKpiReport, getHrmKpiReport } from '@/services/hrDashboardApi'

const loading         = ref(true)
const allReports      = ref([])
const allTeamScores   = ref([])
const allTeamLeaders  = ref([])
const tierTrend       = ref([])
const selectedQuarter = ref('2026년 1분기')

const report      = computed(() => allReports.value.find(r => r.quarter === selectedQuarter.value) ?? null)
const teamScores  = computed(() => allTeamScores.value.filter(s => s.quarter === selectedQuarter.value))
const teamLeaders = computed(() => allTeamLeaders.value.filter(l => l.quarter === selectedQuarter.value))
const quarterOptions = computed(() => {
  const defaults = ['2026년 1분기', '2025년 4분기', '2025년 3분기']
  return [...new Set([selectedQuarter.value, ...defaults].filter(Boolean))]
})

onMounted(async () => {
  try {
    const data = await getHrmKpiReport()
    allReports.value = [data.report]
    selectedQuarter.value = data.report.quarter
    allTeamScores.value = data.teamScores
    tierTrend.value = data.tierTrend
    allTeamLeaders.value = data.teamLeaders
  } catch (e) {
    console.error('KPI 데이터 로딩 실패:', e)
  } finally {
    loading.value = false
  }
})

async function handleDownloadReport() {
  try {
    await downloadHrmKpiReport()
  } catch (e) {
    console.error('KPI 보고서 다운로드 실패:', e)
    alert('보고서 다운로드에 실패했습니다.')
  }
}
</script>

<template>
  <section class="kpi-view">
    <div v-if="loading" class="kpi-view__loading">불러오는 중...</div>

    <template v-else>
      <!-- 툴바 -->
      <div class="kpi-view__toolbar">
        <select class="kpi-view__quarter-select" v-model="selectedQuarter">
          <option v-for="quarter in quarterOptions" :key="quarter">{{ quarter }}</option>
        </select>
        <div class="kpi-view__toolbar-actions">
          <button class="kpi-view__btn kpi-view__btn--primary" @click="handleDownloadReport">📥 전체 보고서 다운로드</button>
        </div>
      </div>

      <!-- 지표 카드 4개 -->
      <section class="kpi-view__metrics" v-if="report">
        <BaseStatCard
          label="전사 평균 종합점수"
          :value="String(report.avgScore)"
          :delta="`▲${report.avgScoreDelta}`"
          tone="primary"
        />
        <BaseStatCard
          label="S+A TIER 비율"
          :value="`${report.saRatio}%`"
          :delta="`▲${report.saRatioDelta}%`"
          tone="primary"
        />
        <BaseStatCard
          label="분기 완료작업"
          :value="`${report.completedTasks.toLocaleString()}건`"
          :delta="`▲${report.completedTasksDelta}`"
          tone="success"
        />
        <BaseStatCard
          label="평균 MTBF"
          :value="`${report.avgMtbf}H`"
          :delta="`▲${report.avgMtbfDelta}h`"
          tone="success"
        />
      </section>

      <!-- 차트 3개 -->
      <section class="kpi-view__charts">
        <HRMKpiTeamBarChart   :data="teamScores" />
        <HRMKpiTierTrendChart :data="tierTrend" />
        <HRMKpiCompletionDonut
          v-if="report"
          :completion-rate="report.completionRate"
          :in-progress-rate="report.inProgressRate"
          :pending-rate="report.pendingRate"
        />
      </section>

      <!-- 팀장별 테이블 -->
      <HRMKpiTeamTable :rows="teamLeaders" />
    </template>
  </section>
</template>

<style scoped>
.kpi-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 28px;
  background: var(--color-bg-app);
  overflow: auto;
  min-height: 0;
}
.kpi-view__loading {
  padding: 60px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
}

/* 툴바 */
.kpi-view__toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}
.kpi-view__quarter-select {
  height: 38px;
  padding: 0 14px;
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  background: var(--color-bg-surface);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-strong);
  cursor: pointer;
}
.kpi-view__toolbar-actions {
  display: flex;
  gap: 8px;
}
.kpi-view__btn {
  height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  white-space: nowrap;
}
.kpi-view__btn--primary {
  background: var(--color-primary-600);
  color: var(--color-white);
  border: none;
}
.kpi-view__btn--primary:hover { background: var(--color-primary-700); }

/* 지표 카드 */
.kpi-view__metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

/* 차트 3분할 */
.kpi-view__charts {
  display: grid;
  grid-template-columns: 1fr 1.4fr 1fr;
  gap: 16px;
}
</style>
