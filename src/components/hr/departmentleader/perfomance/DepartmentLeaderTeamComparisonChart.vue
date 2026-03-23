<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import {
  Chart, RadarController, RadialLinearScale,
  PointElement, LineElement, Filler, Tooltip, Legend,
} from 'chart.js'

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const props = defineProps({
  teamData: { type: Object, required: true },
})

const canvasRef = ref(null)
let chartInstance = null

function buildChart() {
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(canvasRef.value, {
    type: 'radar',
    data: {
      labels: props.teamData.labels,
      datasets: props.teamData.teams.map((team) => ({
        label: team.name,
        data: team.values,
        backgroundColor: team.color + '22',
        borderColor: team.color,
        borderWidth: 2,
        pointBackgroundColor: team.color,
        pointRadius: 4,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800, easing: 'easeOutQuart' },
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
            color: '#aaa',
            font: { size: 10 },
            backdropColor: 'transparent',
          },
          grid: { color: '#e8e4ff' },
          angleLines: { color: '#e8e4ff' },
          pointLabels: { font: { size: 12, weight: '600' }, color: '#555' },
        },
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { size: 12 }, color: '#555', boxWidth: 14, padding: 14 },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.r}`,
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
  <div class="dl-team-chart">
    <header class="dl-team-chart__header">
      <span class="dl-team-chart__title">팀별 성과 비교</span>
    </header>
    <div class="dl-team-chart__canvas-wrap">
      <canvas ref="canvasRef" />
    </div>
  </div>
</template>

<style scoped>
.dl-team-chart {
  padding: 22px;
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dl-team-chart__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dl-team-chart__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-primary-800);
}

.dl-team-chart__canvas-wrap {
  height: 260px;
  position: relative;
}
</style>
