<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  data: { type: Object, required: true },
})

const chartRef = ref(null)
let chartInstance = null

const chartRows = computed(() => props.data?.chartData || [])
const hasTeamSeries = computed(() =>
  chartRows.value.some((point) => Number.isFinite(point?.team)),
)
const hasCompanySeries = computed(() =>
  chartRows.value.some((point) => Number.isFinite(point?.company)),
)

function renderChart() {
  if (!chartRef.value) return

  chartInstance?.destroy()

  const labels = chartRows.value.map((point) => point.label ?? '-')
  const overallData = chartRows.value.map((point) =>
    Number.isFinite(point?.overall) ? point.overall : null,
  )
  const teamData = chartRows.value.map((point) =>
    Number.isFinite(point?.team) ? point.team : null,
  )

  chartInstance = new Chart(chartRef.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '분기 포인트',
          data: overallData,
          borderColor: '#5B4FCF',
          backgroundColor: '#5B4FCF',
          borderWidth: 2.5,
          pointRadius: 3.5,
          pointHoverRadius: 4,
          tension: 0.35,
          spanGaps: true,
        },
        {
          label: '팀 평균',
          data: teamData,
          borderColor: '#00BF95',
          backgroundColor: '#00BF95',
          borderWidth: 2,
          borderDash: [6, 3],
          pointRadius: 3,
          pointHoverRadius: 3.5,
          tension: 0.35,
          spanGaps: true,
          hidden: !hasTeamSeries.value,
        },
        {
          label: '전사 평균',
          data: chartRows.value.map((point) =>
            Number.isFinite(point?.company) ? point.company : null,
          ),
          borderColor: '#F59E0B',
          backgroundColor: '#F59E0B',
          borderWidth: 2,
          borderDash: [4, 4],
          pointRadius: 3,
          pointHoverRadius: 3.5,
          tension: 0.35,
          spanGaps: true,
          hidden: !hasCompanySeries.value,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 900,
        easing: 'easeOutCubic',
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#7B7796',
            font: {
              size: 11,
            },
          },
          border: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#7B7796',
            font: {
              size: 11,
            },
          },
          grid: {
            color: '#E0DCFF',
            borderDash: [4, 3],
          },
          border: {
            display: false,
          },
        },
      },
    },
  })
}

onMounted(() => {
  renderChart()
})

watch(chartRows, () => {
  renderChart()
}, { deep: true })

onBeforeUnmount(() => {
  chartInstance?.destroy()
})
</script>

<template>
  <div class="gf">
    <div class="gf__header">
      <span class="gf__icon">📈</span>
      <h3 class="gf__title">성장 추이</h3>
    </div>

    <!-- Line chart -->
    <div class="gf__chart">
      <div class="gf__chart-frame">
        <canvas ref="chartRef" class="gf__chart-canvas"></canvas>
      </div>
      <div v-if="!data?.chartData?.length" class="gf__chart-empty">성장 추이 데이터가 없습니다.</div>
      <div class="gf__chart-legend">
        <span class="gf__chart-legend-item">
          <span class="gf__chart-legend-line gf__chart-legend-line--overall"></span>
          분기 포인트
        </span>
        <span v-if="hasTeamSeries" class="gf__chart-legend-item">
          <span class="gf__chart-legend-line gf__chart-legend-line--team"></span>
          팀 평균
        </span>
        <span v-if="hasCompanySeries" class="gf__chart-legend-item">
          <span class="gf__chart-legend-line gf__chart-legend-line--company"></span>
          전사 평균
        </span>
      </div>
    </div>

    <!-- Next quarter goals -->
    <div class="gf__goals">
      <span class="gf__goals-title">🎯 다음 분기 목표</span>
      <div class="gf__goals-grid">
        <div v-for="goal in (data?.nextQuarterGoals || [])" :key="goal.label" class="gf__goal">
          <span class="gf__goal-label">{{ goal.label }}</span>
          <div class="gf__goal-values">
            <span class="gf__goal-current">{{ goal.current ?? '-' }}</span>
            <span class="gf__goal-arrow">→</span>
            <span class="gf__goal-target">{{ String(goal.target ?? '-').replace('건', '') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gf {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.gf__header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.gf__icon {
  font-size: var(--font-size-md);
}

.gf__title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-strong);
  margin: 0;
}

.gf__chart {
  padding: 12px 0 8px;
  position: relative;
}

.gf__chart-frame {
  position: relative;
  width: 100%;
  height: 220px;
}

.gf__chart-canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

.gf__chart-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 8px;
}

.gf__chart-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-xs-plus);
  color: var(--color-text-muted);
}

.gf__chart-legend-line {
  display: inline-block;
  width: 20px;
  height: 2.5px;
  border-radius: 2px;
}

.gf__chart-legend-line--overall {
  background: var(--color-primary-800);
}

.gf__chart-legend-line--team {
  background: var(--tier-s);
  background-image: repeating-linear-gradient(
    90deg,
    var(--tier-s) 0px,
    var(--tier-s) 4px,
    transparent 4px,
    transparent 7px
  );
  background-color: transparent;
}

.gf__chart-legend-line--company {
  background: #F59E0B;
  background-image: repeating-linear-gradient(
    90deg,
    #F59E0B 0px,
    #F59E0B 4px,
    transparent 4px,
    transparent 8px
  );
  background-color: transparent;
}

.gf__goals {
  background: var(--color-mint-100);
  border: 1px solid var(--color-mint-200);
  border-radius: var(--radius-base);
  padding: 18px 20px;
}

.gf__goals-title {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--color-primary-800);
}

.gf__goals-grid {
  display: flex;
  gap: 16px;
  margin-top: 14px;
}

.gf__goal {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.gf__goal-label {
  font-size: var(--font-size-xs-plus);
  color: var(--color-text-muted);
}

.gf__goal-values {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.gf__goal-current {
  font-size: var(--font-size-lg-plus);
  font-weight: 800;
  color: var(--color-text-strong);
}

.gf__goal-arrow {
  font-size: var(--font-size-md);
  color: var(--color-text-muted);
}

.gf__goal-target {
  font-size: var(--font-size-lg-plus);
  font-weight: 800;
  color: var(--color-text-strong);
}
</style>
