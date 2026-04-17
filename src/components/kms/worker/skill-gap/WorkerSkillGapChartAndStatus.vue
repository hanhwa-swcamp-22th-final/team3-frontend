<script setup>
import { computed, ref, onMounted } from 'vue'
import BaseProgressBar from '@/components/common/base/data-display/BaseProgressBar.vue'

const props = defineProps({
  currentTier: { type: String, required: true },
  targetTier: { type: String, required: true },
  skills: { type: Array, required: true },
  summary: { type: Object, required: true },
})

const animProgress = ref(0)
const animated = ref(false)
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
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { animated.value = true })
  })
})

const size = 220
const cx = size / 2
const cy = size / 2
const maxR = 80
const levels = 4

function polarToXY(angle, radius) {
  const rad = ((angle - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  }
}

const angleStep = computed(() => 360 / props.skills.length)

const gridPaths = computed(() => {
  return Array.from({ length: levels }, (_, lvl) => {
    const r = (maxR / levels) * (lvl + 1)
    const points = props.skills.map((_, i) => {
      const p = polarToXY(i * angleStep.value, r)
      return `${p.x},${p.y}`
    })
    return `M${points.join('L')}Z`
  })
})

const axisLines = computed(() => {
  return props.skills.map((_, i) => {
    const p = polarToXY(i * angleStep.value, maxR)
    return { x1: cx, y1: cy, x2: p.x, y2: p.y }
  })
})

const currentPath = computed(() => {
  const points = props.skills.map((s, i) => {
    const r = (s.current / 100) * maxR * animProgress.value
    const p = polarToXY(i * angleStep.value, r)
    return `${p.x},${p.y}`
  })
  return `M${points.join('L')}Z`
})

const targetPath = computed(() => {
  const points = props.skills.map((s, i) => {
    const r = (s.target / 100) * maxR * animProgress.value
    const p = polarToXY(i * angleStep.value, r)
    return `${p.x},${p.y}`
  })
  return `M${points.join('L')}Z`
})

const labelPositions = computed(() => {
  return props.skills.map((s, i) => {
    const p = polarToXY(i * angleStep.value, maxR + 20)
    return { ...p, label: s.label }
  })
})

const overallPercent = computed(() => {
  if (!props.summary.targetOverall) return 0
  return Math.round((props.summary.currentOverall / props.summary.targetOverall) * 100)
})

const currentLabel = computed(() => `현재 ${props.currentTier}등급`)
const targetLabel = computed(() => `${props.targetTier} 등급 목표`)
const comparisonLabel = computed(() => `현재 ${props.currentTier} 등급 VS ${props.targetTier} 등급 목표`)
const gapSummaryLabel = computed(() => {
  if (props.currentTier === props.targetTier) {
    return '현재 최고 등급 유지 중'
  }
  return `평균 기준 ▲ ${props.summary.totalGap}점 필요`
})

function tierClass(tier) {
  return `sg__tier--${String(tier ?? 'C').toLowerCase()}`
}
</script>

<template>
  <div class="sg">
    <span class="sg__label">📊 {{ comparisonLabel }}</span>

    <!-- Radar Chart -->
    <div class="sg__chart-wrap">
      <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="sg__svg">
        <path
          v-for="(d, i) in gridPaths"
          :key="'g' + i"
          :d="d"
          fill="none"
          stroke="#E0DCFF"
          stroke-width="1"
        />
        <line
          v-for="(l, i) in axisLines"
          :key="'a' + i"
          :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2"
          stroke="#E0DCFF"
          stroke-width="1"
        />
        <!-- Target -->
        <path
          :d="targetPath"
          fill="rgba(0, 191, 149, 0.08)"
          stroke="var(--color-success)"
          stroke-width="2"
          stroke-dasharray="6 3"
        />
        <!-- Current -->
        <path
          :d="currentPath"
          fill="rgba(91, 79, 207, 0.18)"
          stroke="var(--color-primary-700)"
          stroke-width="2"
        />
        <text
          v-for="(lp, i) in labelPositions"
          :key="'l' + i"
          :x="lp.x" :y="lp.y"
          text-anchor="middle"
          dominant-baseline="central"
          class="sg__axis-label"
        >
          {{ lp.label }}
        </text>
      </svg>
    </div>

    <!-- Legend -->
    <div class="sg__legend">
      <span class="sg__legend-item" :class="tierClass(currentTier)">
        <span class="sg__legend-dot sg__legend-dot--current"></span> {{ currentLabel }}
      </span>
      <span class="sg__legend-item" :class="tierClass(targetTier)">
        <span class="sg__legend-dot sg__legend-dot--target"></span> {{ targetLabel }}
      </span>
    </div>

    <!-- Gap Summary -->
    <div class="sg__gap">
      <span class="sg__gap-label">종합 Gap</span>
      <span class="sg__gap-value">{{ gapSummaryLabel }}</span>
    </div>

    <!-- Overall Progress Bar -->
    <div class="sg__progress">
      <BaseProgressBar :value="animated ? overallPercent : 0" :show-percent="true" size="md" />
      <span class="sg__progress-text">
        평균 현재 {{ summary.currentOverall }}점 → 평균 목표 {{ summary.targetOverall }}점
      </span>
    </div>

    <!-- Skill Table -->
    <div class="sg__table">
      <div v-for="skill in skills" :key="skill.label" class="sg__row">
        <span class="sg__row-label">{{ skill.label }}</span>
        <div class="sg__row-bar">
          <BaseProgressBar :value="animated ? skill.current : 0" :show-percent="false" size="sm" />
        </div>
        <span class="sg__row-current">{{ skill.current }}</span>
        <span class="sg__row-arrow">→</span>
        <span class="sg__row-target">{{ skill.target }}</span>
        <span class="sg__row-gap">+{{ skill.gap }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sg {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.sg__label {
  font-size: 13px;
  color: var(--color-text-muted);
}

.sg__chart-wrap {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}

.sg__svg {
  flex-shrink: 0;
}

.sg__axis-label {
  font-size: 10px;
  fill: #7a72a0;
}

/* ── Legend ─────────────────────────────────────────────── */
.sg__legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 11px;
  color: var(--color-text-muted);
}

.sg__legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
}

.sg__legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.sg__legend-dot--current {
  background: var(--color-primary-700);
}

.sg__legend-dot--target {
  background: var(--color-success);
}

.sg__tier--s {
  color: var(--tier-s);
}

.sg__tier--a {
  color: var(--tier-a);
}

.sg__tier--b {
  color: var(--tier-b);
}

.sg__tier--c {
  color: var(--tier-c);
}

/* ── Gap Summary ───────────────────────────────────────── */
.sg__gap {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.sg__gap-label {
  font-size: 13px;
  color: var(--color-text-muted);
}

.sg__gap-value {
  font-size: 24px;
  font-weight: 800;
  color: var(--tier-c);
  font-family: var(--font-family-num);
}

/* ── Progress ──────────────────────────────────────────── */
.sg__progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sg__progress-text {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* ── Skill Table ───────────────────────────────────────── */
.sg__table {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sg__row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sg__row-label {
  font-size: 13px;
  color: var(--color-text-default);
  width: 60px;
  flex-shrink: 0;
}

.sg__row-bar {
  flex: 1;
  min-width: 0;
}

.sg__row-current {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-strong);
  width: 24px;
  text-align: right;
}

.sg__row-arrow {
  font-size: 12px;
  color: var(--color-text-muted);
}

.sg__row-target {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-success);
  width: 24px;
}

.sg__row-gap {
  font-size: 13px;
  font-weight: 600;
  color: var(--tier-c);
  width: 24px;
}
</style>
