<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { getTierColors } from '@/utils/tierColors'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

const TIERS = ['C', 'B', 'A', 'S']

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  deltaText: {
    type: String,
    default: '',
  },
})

const canvasRef = ref(null)
let chartInstance = null

function defer(fn) {
  nextTick().then(() => requestAnimationFrame(fn))
}

function buildChart() {
  if (chartInstance) chartInstance.destroy()

  const TIER_COLORS = getTierColors()

  chartInstance = new Chart(canvasRef.value, {
    type: 'bar',
    data: {
      labels: props.data.map((d) => d.month),
      datasets: TIERS.map((tier) => ({
        label: tier,
        data: props.data.map((d) => d[tier]),
        backgroundColor: TIER_COLORS[tier],
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart',
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { color: '#7c739f', font: { size: 12 } },
          border: { display: false },
        },
        y: {
          stacked: true,
          display: false,
          beginAtZero: true,
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}명`,
          },
        },
      },
    },
  })
}

onMounted(() => defer(buildChart))
watch(() => props.data, () => {
  if (chartInstance) {
    chartInstance.data.labels = props.data.map((d) => d.month)
    chartInstance.data.datasets.forEach((dataset, index) => {
      dataset.data = props.data.map((d) => d[TIERS[index]])
    })
    chartInstance.update('reset')
  } else {
    defer(buildChart)
  }
}, { deep: true })
onBeforeUnmount(() => chartInstance?.destroy())
</script>

<template>
  <section class="trend-card">
    <header class="trend-card__header">
      <span class="trend-card__eyebrow">📈 최근 6개월 TIER 변화 추이</span>
    </header>

    <div class="trend-chart">
      <canvas ref="canvasRef" />
    </div>

    <p v-if="deltaText" class="trend-card__delta">{{ deltaText }}</p>
  </section>
</template>

<style scoped>
.trend-card {
  padding: 22px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.trend-card__header {
  flex-shrink: 0;
}

.trend-card__eyebrow {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-500);
}

.trend-chart {
  height: 200px;
  position: relative;
}

.trend-card__delta {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-500);
  text-align: center;
}
</style>
