<script setup>
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  data: { type: Object, required: true },
})

const animated = ref(false)
onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { animated.value = true })
  })
})

const chartPoints = computed(() => {
  const pts = props.data?.chartData || []
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
          class="gf__line--team"
          :class="{ 'gf__line--team--visible': animated }"
        />
        <!-- Overall (solid) -->
        <polyline
          :points="chartPoints.overall"
          fill="none"
          stroke="var(--color-primary-800)"
          stroke-width="2.5"
          class="gf__line gf__line--overall"
          :class="{ 'gf__line--drawn': animated }"
        />
      </svg>
      <div v-if="!data?.chartData?.length" class="gf__chart-empty">성장 추이 데이터가 없습니다.</div>
      <div class="gf__chart-legend">
        <span class="gf__chart-legend-item">
          <span class="gf__chart-legend-line gf__chart-legend-line--overall"></span>
          내 종합 점수
        </span>
        <span class="gf__chart-legend-item">
          <span class="gf__chart-legend-line gf__chart-legend-line--team"></span>
          팀 평균
        </span>
      </div>
    </div>

    <!-- TL Feedback -->
    <div class="gf__feedback">
      <span class="gf__feedback-label">TEAM LEADER 피드백</span>
      <p class="gf__feedback-text">{{ data?.feedback?.content ?? '등록된 피드백이 없습니다.' }}</p>
      <span class="gf__feedback-meta">{{ data?.feedback?.author ?? '-' }} · {{ data?.feedback?.date ?? '-' }}</span>
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

.gf__line {
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  transition: stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.gf__line--team {
  opacity: 0;
  transition: opacity 1s ease 0.15s;
}

.gf__line--team--visible {
  opacity: 1;
}

.gf__line--drawn {
  stroke-dashoffset: 0;
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
  font-size: 12px;
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

.gf__feedback {
  border: 2px solid var(--color-primary-700);
  border-radius: var(--radius-base);
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
  border-radius: var(--radius-base);
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
