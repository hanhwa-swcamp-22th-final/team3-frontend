<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Object, required: true },
})

const chartPoints = computed(() => {
  const pts = props.data.chartData
  const len = pts.length
  if (!len) return { overall: '', team: '' }

  const w = 260
  const h = 110
  const maxVal = 90
  const minVal = 60

  function toCoords(series) {
    return pts
      .map((p, i) => {
        const x = (i / (len - 1)) * w + 10
        const y = h - ((p[series] - minVal) / (maxVal - minVal)) * (h - 10) + 5
        return `${x},${y}`
      })
      .join(' ')
  }

  return {
    overall: toCoords('overall'),
    team: toCoords('team'),
  }
})
</script>

<template>
  <div class="gf">
    <div class="gf__header">
      <span class="gf__icon">📈</span>
      <h3 class="gf__title">성장 추이 & 피드백</h3>
    </div>

    <!-- Line chart -->
    <div class="gf__chart">
      <svg viewBox="0 0 280 120" class="gf__chart-svg">
        <!-- Grid lines -->
        <line x1="10" y1="5" x2="270" y2="5" stroke="#E0DCFF" stroke-width="0.5" stroke-dasharray="4 3" />
        <line x1="10" y1="57" x2="270" y2="57" stroke="#E0DCFF" stroke-width="0.5" stroke-dasharray="4 3" />
        <line x1="10" y1="115" x2="270" y2="115" stroke="#E0DCFF" stroke-width="0.5" stroke-dasharray="4 3" />

        <!-- Team avg (dashed) -->
        <polyline
          :points="chartPoints.team"
          fill="none"
          stroke="var(--tier-s)"
          stroke-width="2"
          stroke-dasharray="6 3"
        />
        <!-- Overall (solid) -->
        <polyline
          :points="chartPoints.overall"
          fill="none"
          stroke="var(--color-primary-800)"
          stroke-width="2.5"
        />
        <!-- Current point dot -->
        <circle
          v-if="data.chartData.length"
          :cx="270"
          :cy="110 - ((data.chartData[data.chartData.length - 1].overall - 60) / 30) * 100 + 5"
          r="4"
          fill="var(--color-primary-800)"
        />
      </svg>
    </div>

    <!-- TL Feedback -->
    <div class="gf__feedback">
      <span class="gf__feedback-label">TEAM LEADER 피드백</span>
      <p class="gf__feedback-text">{{ data.feedback.content }}</p>
      <span class="gf__feedback-meta">{{ data.feedback.author }} · {{ data.feedback.date }}</span>
    </div>

    <!-- Next quarter goals -->
    <div class="gf__goals">
      <span class="gf__goals-title">🎯 다음 분기 목표</span>
      <div class="gf__goals-grid">
        <div v-for="goal in data.nextQuarterGoals" :key="goal.label" class="gf__goal">
          <span class="gf__goal-label">{{ goal.label }}</span>
          <div class="gf__goal-values">
            <span class="gf__goal-current">{{ goal.current }}</span>
            <span class="gf__goal-arrow">→</span>
            <span class="gf__goal-target">{{ goal.target }}</span>
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
  border-radius: 16px;
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
  font-size: 16px;
}

.gf__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-strong);
  margin: 0;
}

.gf__chart {
  padding: 12px 0 8px;
}

.gf__chart-svg {
  width: 100%;
  height: 120px;
}

.gf__feedback {
  border: 2px solid var(--color-primary-700);
  border-radius: 12px;
  padding: 16px 18px;
}

.gf__feedback-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-muted);
  letter-spacing: 0.02em;
}

.gf__feedback-text {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-strong);
  line-height: 1.7;
  margin: 10px 0 8px;
}

.gf__feedback-meta {
  font-size: 12px;
  color: var(--color-text-muted);
}

.gf__goals {
  background: var(--color-mint-100);
  border: 1px solid var(--color-mint-200);
  border-radius: 12px;
  padding: 18px 20px;
}

.gf__goals-title {
  font-size: 14px;
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
  font-size: 12px;
  color: var(--color-text-muted);
}

.gf__goal-values {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.gf__goal-current {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-text-strong);
}

.gf__goal-arrow {
  font-size: 16px;
  color: var(--color-text-muted);
}

.gf__goal-target {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-text-strong);
}
</style>
