<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'
import { getTierColors } from '@/utils/tierColors'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const props = defineProps({
  tiers: {
    type: Array,
    default: () => [],
  },
  total: {
    type: Number,
    default: 0,
  },
})

const canvasRef = ref(null)
let chartInstance = null

function getCssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function buildChart() {
  const TIER_COLORS = getTierColors()
  const colorPrimary = getCssVar('--color-primary-800')
  const colorMuted = getCssVar('--color-text-muted')

  chartInstance = new Chart(canvasRef.value, {
    type: 'doughnut',
    data: {
      labels: props.tiers.map((t) => t.tier),
      datasets: [
        {
          data: props.tiers.map((t) => t.count),
          backgroundColor: props.tiers.map((t) => TIER_COLORS[t.tier]),
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      cutout: '70%',
      layout: { padding: 10 },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed}명`,
          },
        },
      },
    },
    plugins: [
      {
        id: 'centerText',
        afterDraw(chart) {
          const { ctx, chartArea: { top, bottom, left, right } } = chart
          const cx = (left + right) / 2
          const cy = (top + bottom) / 2
          ctx.save()
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.font = 'bold 20px sans-serif'
          ctx.fillStyle = colorPrimary
          ctx.fillText(`${props.total}명`, cx, cy - 8)
          ctx.font = '12px sans-serif'
          ctx.fillStyle = colorMuted
          ctx.fillText('전체', cx, cy + 14)
          ctx.restore()
        },
      },
    ],
  })
}

function updateChart() {
  const TIER_COLORS = getTierColors()
  chartInstance.data.labels = props.tiers.map((t) => t.tier)
  chartInstance.data.datasets[0].data = props.tiers.map((t) => t.count)
  chartInstance.data.datasets[0].backgroundColor = props.tiers.map((t) => TIER_COLORS[t.tier])
  chartInstance.update()
}

onMounted(buildChart)
watch(() => props.tiers, () => chartInstance ? updateChart() : buildChart(), { deep: true })
onBeforeUnmount(() => chartInstance?.destroy())
</script>

<template>
  <section class="donut-card">
    <header class="donut-card__header">
      <span class="donut-card__eyebrow">📊 전사 TIER 분포</span>
    </header>

    <div class="donut-card__body">
      <div class="donut-card__chart">
        <canvas ref="canvasRef" />
      </div>

      <ul class="donut-card__legend">
        <li v-for="tier in tiers" :key="tier.tier" class="legend-item">
          <span class="legend-item__dot" :class="`legend-item__dot--${tier.tier.toLowerCase()}`" />
          <span class="legend-item__tier">{{ tier.tier }}</span>
          <span class="legend-item__stat">{{ tier.count }}명 · {{ tier.percent }}%</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.donut-card {
  padding: 22px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
}

.donut-card__header {
  margin-bottom: 20px;
}

.donut-card__eyebrow {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-500);
}

.donut-card__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.donut-card__chart {
  width: 180px;
  flex-shrink: 0;
}

.donut-card__legend {
  list-style: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.legend-item__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-item__tier {
  font-weight: 700;
  color: var(--color-primary-800);
  width: 12px;
}

.legend-item__stat {
  color: var(--color-text-muted);
  margin-left: auto;
}

.legend-item__dot--s { background: var(--tier-s); }
.legend-item__dot--a { background: var(--tier-a); }
.legend-item__dot--b { background: var(--tier-b); }
.legend-item__dot--c { background: var(--tier-c); }
</style>
