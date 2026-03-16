<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

defineProps({
  groupAvg: { type: Number, default: 83.1 },
  equipRate: { type: String, default: '91.4%' },
  qualityRate: { type: String, default: '96.2%' },
})

const canvasRef = ref(null)
let chartInstance = null

const kpiTrend = [
  { quarter: '2024Q2', value: 72 },
  { quarter: 'Q3',     value: 75 },
  { quarter: 'Q4',     value: 80 },
  { quarter: '2025Q1', value: 83.1 },
]

const barColors = ['#e0dcff', '#e0dcff', '#5b4fcf', '#18c3aa']

function buildChart() {
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(canvasRef.value, {
    type: 'bar',
    data: {
      labels: kpiTrend.map((d) => d.quarter),
      datasets: [
        {
          data: kpiTrend.map((d) => d.value),
          backgroundColor: barColors,
          borderRadius: 6,
          barThickness: 48,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900, easing: 'easeOutQuart' },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: getComputedStyle(document.documentElement)
              .getPropertyValue('--color-text-muted').trim(),
            font: { size: 12 },
          },
          border: { display: false },
        },
        y: {
          display: false,
          beginAtZero: true,
          max: 100,
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` 그룹 KPI: ${ctx.parsed.y}`,
          },
        },
      },
    },
  })
}

onMounted(() => {
  nextTick().then(() => requestAnimationFrame(buildChart))
})
onBeforeUnmount(() => chartInstance?.destroy())
</script>

<template>
  <section class="dl-kpi-card">
    <header class="dl-kpi-card__header">
      <div class="dl-kpi-card__title-row">
        <span class="dl-kpi-card__dot">●</span>
        <span class="dl-kpi-card__title">그룹 통합 KPI</span>
        <span class="dl-kpi-card__ai-badge">AI</span>
      </div>
      <button class="dl-kpi-card__detail-btn">상세 →</button>
    </header>

    <div class="dl-kpi-card__stats">
      <div class="dl-kpi-card__stat dl-kpi-card__stat--primary">
        <span class="dl-kpi-card__stat-value">{{ groupAvg }}</span>
        <span class="dl-kpi-card__stat-label">그룹 평균</span>
      </div>
      <div class="dl-kpi-card__stat dl-kpi-card__stat--mint">
        <span class="dl-kpi-card__stat-value">{{ equipRate }}</span>
        <span class="dl-kpi-card__stat-label">설비 가동률</span>
      </div>
      <div class="dl-kpi-card__stat dl-kpi-card__stat--gold">
        <span class="dl-kpi-card__stat-value">{{ qualityRate }}</span>
        <span class="dl-kpi-card__stat-label">품질 달성</span>
      </div>
    </div>

    <div class="dl-kpi-card__chart">
      <canvas ref="canvasRef" />
    </div>
  </section>
</template>

<style scoped>
.dl-kpi-card {
  padding: 22px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dl-kpi-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dl-kpi-card__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dl-kpi-card__dot {
  font-size: 10px;
  color: var(--color-primary-500);
}

.dl-kpi-card__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-primary-800);
}

.dl-kpi-card__ai-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  background: var(--color-primary-700);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}

.dl-kpi-card__detail-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary-500);
}
.dl-kpi-card__detail-btn:hover {
  color: var(--color-primary-700);
}

.dl-kpi-card__stats {
  display: flex;
  gap: 32px;
}

.dl-kpi-card__stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dl-kpi-card__stat-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}

.dl-kpi-card__stat-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.dl-kpi-card__stat--primary .dl-kpi-card__stat-value {
  color: var(--color-primary-700);
}
.dl-kpi-card__stat--mint .dl-kpi-card__stat-value {
  color: var(--color-mint-500);
}
.dl-kpi-card__stat--gold .dl-kpi-card__stat-value {
  color: #d97706;
}

.dl-kpi-card__chart {
  height: 160px;
  position: relative;
}
</style>
