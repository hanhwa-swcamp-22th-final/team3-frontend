<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js'
import { getCssVar } from '@/utils/tierColors'

Chart.register(DoughnutController, ArcElement, Tooltip)

const props = defineProps({
  completionRate: { type: Number, default: 0 },
  inProgressRate: { type: Number, default: 0 },
  pendingRate:     { type: Number, default: 0 },
})

const canvasRef = ref(null)
let chartInstance = null

function makeCenterTextPlugin() {
  return {
    id: 'centerText',
    afterDraw(chart) {
      const { ctx, chartArea: { top, bottom, left, right } } = chart
      const cx = (left + right) / 2
      const cy = (top + bottom) / 2
      ctx.save()
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = '800 28px Pretendard, sans-serif'
      ctx.fillStyle = getCssVar('--color-text-strong')
      ctx.fillText(`${props.completionRate}%`, cx, cy - 8)
      ctx.font = '500 12px Pretendard, sans-serif'
      ctx.fillStyle = getCssVar('--color-text-muted')
      ctx.fillText('완료', cx, cy + 14)
      ctx.restore()
    },
  }
}

function buildChart() {
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(canvasRef.value, {
    type: 'doughnut',
    plugins: [makeCenterTextPlugin()],
    data: {
      labels: ['완료', '진행중', '대기'],
      datasets: [{
        data: [props.completionRate, props.inProgressRate, props.pendingRate],
        backgroundColor: [
          getCssVar('--tier-s'),
          getCssVar('--color-primary-300'),
          getCssVar('--color-border-default'),
        ],
        borderWidth: 0,
        hoverOffset: 4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` } },
      },
    },
  })
}

function defer(fn) { nextTick().then(() => requestAnimationFrame(fn)) }

onMounted(() => defer(buildChart))
watch(() => [props.completionRate, props.inProgressRate, props.pendingRate], () => {
  if (chartInstance) {
    chartInstance.data.datasets[0].data = [props.completionRate, props.inProgressRate, props.pendingRate]
    chartInstance.update()
  } else {
    defer(buildChart)
  }
})
onBeforeUnmount(() => chartInstance?.destroy())
</script>

<template>
  <section class="kpi-donut-card">
    <p class="kpi-donut-card__title">✅ 분기 평가 완료율</p>
    <div class="kpi-donut-card__chart">
      <canvas ref="canvasRef" />
    </div>
    <ul class="kpi-donut-card__legend">
      <li class="kpi-donut-card__legend-item">
        <span class="kpi-donut-card__dot kpi-donut-card__dot--complete"></span>완료 {{ completionRate }}%
      </li>
      <li class="kpi-donut-card__legend-item">
        <span class="kpi-donut-card__dot kpi-donut-card__dot--progress"></span>진행중 {{ inProgressRate }}%
      </li>
      <li class="kpi-donut-card__legend-item">
        <span class="kpi-donut-card__dot kpi-donut-card__dot--pending"></span>대기 {{ pendingRate }}%
      </li>
    </ul>
  </section>
</template>

<style scoped>
.kpi-donut-card {
  padding: 22px;
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.kpi-donut-card__title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-500);
  align-self: flex-start;
}
.kpi-donut-card__chart {
  width: 160px;
  height: 160px;
  position: relative;
}
.kpi-donut-card__legend {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-self: flex-start;
}
.kpi-donut-card__legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-default);
}
.kpi-donut-card__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.kpi-donut-card__dot--complete { background: var(--tier-s); }
.kpi-donut-card__dot--progress { background: var(--color-primary-300); }
.kpi-donut-card__dot--pending  { background: var(--color-border-default); }
</style>
