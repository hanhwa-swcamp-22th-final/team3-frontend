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
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

const props = defineProps({
  data: { type: Array, default: () => [] },
})

const canvasRef = ref(null)
let chartInstance = null

const scoreLabelsPlugin = {
  id: 'scoreLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart
    ctx.save()
    chart.data.datasets.forEach((dataset, i) => {
      chart.getDatasetMeta(i).data.forEach((bar, index) => {
        ctx.font = '700 12px Pretendard, sans-serif'
        ctx.fillStyle = '#4b5563'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.fillText(dataset.data[index], bar.x + 6, bar.y)
      })
    })
    ctx.restore()
  },
}

function buildChart() {
  if (chartInstance) chartInstance.destroy()
  const colors = ['#4330a0', '#5b4fcf', '#7468e2', '#b8b1f2']
  chartInstance = new Chart(canvasRef.value, {
    type: 'bar',
    plugins: [scoreLabelsPlugin],
    data: {
      labels: props.data.map(d => d.team),
      datasets: [{
        data: props.data.map(d => d.score),
        backgroundColor: props.data.map((_, i) => colors[i] ?? colors[colors.length - 1]),
        borderRadius: 6,
        barThickness: 28,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 40 } },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.x}점` } },
      },
      scales: {
        x: { display: false, min: 70, max: 100 },
        y: {
          grid: { display: false },
          ticks: { color: '#7c739f', font: { size: 12 } },
          border: { display: false },
        },
      },
    },
  })
}

function defer(fn) { nextTick().then(() => requestAnimationFrame(fn)) }

onMounted(() => defer(buildChart))
watch(() => props.data, () => {
  if (chartInstance) {
    chartInstance.data.labels = props.data.map(d => d.team)
    chartInstance.data.datasets[0].data = props.data.map(d => d.score)
    chartInstance.update()
  } else {
    defer(buildChart)
  }
}, { deep: true })
onBeforeUnmount(() => chartInstance?.destroy())
</script>

<template>
  <section class="kpi-bar-card">
    <p class="kpi-bar-card__title">🏅 팀별 평균 종합점수</p>
    <div class="kpi-bar-card__chart">
      <canvas ref="canvasRef" />
    </div>
  </section>
</template>

<style scoped>
.kpi-bar-card {
  padding: 16px 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.kpi-bar-card__title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-500);
}
.kpi-bar-card__chart {
  height: 200px;
  position: relative;
}
</style>
