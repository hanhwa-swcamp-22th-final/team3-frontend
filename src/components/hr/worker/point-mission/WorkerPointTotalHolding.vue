<script setup>
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  summary: {
    type: Object,
    required: true,
    // { totalPoints, monthGain, monthGainPercent, distribution: [{ label, value, color }] }
  },
})

const animProgress = ref(0)
onMounted(() => {
  let start = null
  const duration = 800
  function step(ts) {
    if (!start) start = ts
    const t = Math.min((ts - start) / duration, 1)
    animProgress.value = 1 - Math.pow(1 - t, 3)
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
})

const total = computed(() => props.summary.totalPoints)
const segments = computed(() => {
  const dist = props.summary.distribution
  const sum = dist.reduce((a, d) => a + d.value, 0)
  let offset = 0
  return dist.map((d) => {
    const pct = (d.value / sum) * 100
    const seg = { ...d, pct, offset }
    offset += pct
    return seg
  })
})
</script>

<template>
  <div class="holding">
    <div class="holding__stats">
      <span class="holding__label">총 보유 포인트</span>
      <div class="holding__total">
        <span class="holding__number">{{ total.toLocaleString() }}</span>
        <span class="holding__unit">pts</span>
      </div>
      <div class="holding__gain">
        <span class="holding__gain-arrow">▲</span>
        <span>+{{ summary.monthGain.toLocaleString() }} 이번 달</span>
      </div>
      <span class="holding__compare">전월 대비 +{{ summary.monthGainPercent }}%</span>
    </div>

    <div class="holding__chart">
      <svg viewBox="0 0 120 120" class="holding__donut">
        <circle
          v-for="(seg, i) in segments"
          :key="i"
          cx="60"
          cy="60"
          r="50"
          fill="none"
          :stroke="seg.color"
          stroke-width="14"
          :stroke-dasharray="`${(seg.pct / 100) * 314.16 * animProgress} ${314.16}`"
          :stroke-dashoffset="`${-(seg.offset / 100) * 314.16 * animProgress}`"
          stroke-linecap="butt"
        />
        <text x="60" y="56" text-anchor="middle" class="holding__donut-number">
          {{ total.toLocaleString() }}
        </text>
        <text x="60" y="72" text-anchor="middle" class="holding__donut-sub">pts</text>
      </svg>
    </div>

    <div class="holding__legend">
      <div v-for="(seg, i) in segments" :key="i" class="holding__legend-item">
        <span class="holding__legend-dot" :style="{ background: seg.color }"></span>
        <span class="holding__legend-label">{{ seg.label }}</span>
        <span class="holding__legend-value">{{ seg.value.toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.holding {
  display: flex;
  align-items: center;
  gap: 32px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  padding: 28px 32px;
}

.holding__stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 160px;
}

.holding__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary-700);
}

.holding__total {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.holding__number {
  font-size: 42px;
  font-weight: 800;
  color: var(--color-text-strong);
  line-height: 1.1;
}

.holding__unit {
  font-size: 22px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.holding__gain {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: var(--tier-s);
}

.holding__gain-arrow {
  font-size: 10px;
}

.holding__compare {
  font-size: 13px;
  color: var(--color-text-muted);
}

.holding__chart {
  width: 140px;
  height: 140px;
  flex-shrink: 0;
}

.holding__donut {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.holding__donut-number {
  font-size: 18px;
  font-weight: 800;
  fill: var(--color-text-strong);
  transform: rotate(90deg);
  transform-origin: 60px 60px;
}

.holding__donut-sub {
  font-size: 10px;
  font-weight: 500;
  fill: var(--color-text-muted);
  transform: rotate(90deg);
  transform-origin: 60px 60px;
}

.holding__legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 130px;
}

.holding__legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.holding__legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}

.holding__legend-label {
  font-size: 13px;
  color: var(--color-text-default);
  flex: 1;
}

.holding__legend-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-strong);
}
</style>
