<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { getTierColors } from '@/utils/tierColors'
import { TIERS } from '@/constants'

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps({
  data: { type: Array, default: () => [] },
})

const canvasRef = ref(null)
let chartInstance = null

function buildChart() {
  if (chartInstance) chartInstance.destroy()
  const TIER_COLORS = getTierColors()
  chartInstance = new Chart(canvasRef.value, {
    type: 'line',
    data: {
      labels: props.data.map(d => d.quarter),
      datasets: TIERS.map((tier, i) => ({
        label: `${tier}-Tier`,
        data: props.data.map(d => d[tier]),
        borderColor: TIER_COLORS[tier],
        backgroundColor: 'transparent',
        borderWidth: tier === 'C' ? 2 : 2.5,
        segment: tier === 'C' ? { borderDash: () => [6, 3] } : {},
        pointRadius: 3,
        pointBackgroundColor: TIER_COLORS[tier],
        tension: 0.3,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#7c739f',
            font: { size: 11 },
            boxWidth: 14,
            padding: 12,
          },
        },
        tooltip: {
          callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}명` },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#7c739f', font: { size: 11 } },
          border: { display: false },
        },
        y: {
          display: false,
          beginAtZero: false,
        },
      },
    },
  })
}

function defer(fn) { nextTick().then(() => requestAnimationFrame(fn)) }

onMounted(() => defer(buildChart))
watch(() => props.data, () => {
  if (chartInstance) {
    chartInstance.data.labels = props.data.map(d => d.quarter)
    chartInstance.data.datasets.forEach((ds, i) => {
      ds.data = props.data.map(d => d[TIERS[i]])
    })
    chartInstance.update('reset')
  } else {
    defer(buildChart)
  }
}, { deep: true })
onBeforeUnmount(() => chartInstance?.destroy())
</script>

<template>
  <section class="kpi-trend-card">
    <p class="kpi-trend-card__title">📅 분기별 TIER 분포 변화</p>
    <div class="kpi-trend-card__chart">
      <canvas ref="canvasRef" />
    </div>
  </section>
</template>

<style scoped>
.kpi-trend-card {
  padding: 22px;
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.kpi-trend-card__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-500);
}
.kpi-trend-card__chart {
  flex: 1;
  min-height: 180px;
  position: relative;
}
</style>
