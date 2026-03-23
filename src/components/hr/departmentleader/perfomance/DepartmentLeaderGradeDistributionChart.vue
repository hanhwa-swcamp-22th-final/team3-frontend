<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import {
  Chart, BarController, BarElement,
  CategoryScale, LinearScale, Tooltip, Legend,
} from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps({
  distribution: { type: Array, default: () => [] },
  totalMembers:  { type: Number, default: 1 },
})

const canvasRef = ref(null)
let chartInstance = null

const actualPct = computed(() =>
  props.distribution.map((d) => +(d.count / props.totalMembers * 100).toFixed(1)),
)

const gradeColors = {
  S: '#5b4fcf', A: '#269063', B: '#f4c54b', C: '#ef476f', D: '#aaa',
}

function buildChart() {
  if (chartInstance) chartInstance.destroy()
  const labels = props.distribution.map((d) => d.grade)
  const bgActual = props.distribution.map((d) => gradeColors[d.grade])
  chartInstance = new Chart(canvasRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: '실제 비율(%)',
          data: actualPct.value,
          backgroundColor: bgActual,
          borderRadius: 6,
          barPercentage: 0.45,
          categoryPercentage: 0.8,
        },
        {
          label: '권장 비율(%)',
          data: props.distribution.map((d) => d.recommended),
          backgroundColor: 'rgba(0,0,0,0)',
          borderColor: props.distribution.map((d) => gradeColors[d.grade]),
          borderWidth: 2,
          borderRadius: 6,
          barPercentage: 0.45,
          categoryPercentage: 0.8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800, easing: 'easeOutQuart' },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#888', font: { size: 13, weight: '700' } },
          border: { display: false },
        },
        y: {
          beginAtZero: true,
          max: 60,
          ticks: { color: '#aaa', font: { size: 11 }, callback: (v) => v + '%' },
          grid: { color: '#f0eeff' },
          border: { display: false },
        },
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { size: 12 }, color: '#666', boxWidth: 14, padding: 16 },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}%`,
          },
        },
      },
    },
  })
}

onMounted(() => nextTick().then(() => requestAnimationFrame(buildChart)))
onBeforeUnmount(() => chartInstance?.destroy())
</script>

<template>
  <div class="dl-grade-chart">
    <header class="dl-grade-chart__header">
      <span class="dl-grade-chart__title">성과 등급 분포</span>
      <div class="dl-grade-chart__counts">
        <span
          v-for="d in distribution"
          :key="d.grade"
          class="dl-grade-chart__count-badge"
          :style="{ background: d.count > 0 ? '#f0eeff' : '#f5f5f5', color: d.count > 0 ? '#5b4fcf' : '#aaa' }"
        >
          {{ d.grade }} {{ d.count }}명
        </span>
      </div>
    </header>
    <div class="dl-grade-chart__canvas-wrap">
      <canvas ref="canvasRef" />
    </div>
  </div>
</template>

<style scoped>
.dl-grade-chart {
  padding: 22px;
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dl-grade-chart__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.dl-grade-chart__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-primary-800);
}

.dl-grade-chart__counts {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.dl-grade-chart__count-badge {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
}

.dl-grade-chart__canvas-wrap {
  height: 220px;
  position: relative;
}
</style>
