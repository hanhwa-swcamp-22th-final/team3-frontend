<script setup>
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  status: { type: Object, required: true },
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

const gaugeProgress = computed(() => Math.min(Math.max(Number(props.status?.overallScore ?? 0), 0), 100))
const scoreAngle = computed(() => (gaugeProgress.value / 100) * 360)
const circumference = 2 * Math.PI * 46
const dashLen = computed(() => (gaugeProgress.value / 100) * circumference)

function diffClass(val) {
  return val > 0 ? 'diff--up' : val < 0 ? 'diff--down' : ''
}

function diffText(val) {
  if (val > 0) return `▲${val}`
  if (val < 0) return `▼${Math.abs(val)}`
  return '—'
}

function rankText(val) {
  return val === null || val === undefined || val === '-' ? '-' : `${val}위`
}

function rankTotalText(val) {
  return val === null || val === undefined || val === '-' ? '-' : `${val}명`
}
</script>

<template>
  <div class="es">
    <!-- Circular score gauge -->
    <div class="es__gauge">
      <svg viewBox="0 0 100 100" class="es__ring">
        <circle cx="50" cy="50" r="46" fill="none" stroke="#E0DCFF" stroke-width="6" />
        <circle
          cx="50" cy="50" r="46"
          fill="none"
          stroke="#5B4FCF"
          stroke-width="6"
          stroke-linecap="round"
          :stroke-dasharray="`${dashLen * animProgress} ${circumference}`"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div class="es__gauge-text">
        <span class="es__gauge-score">{{ status?.overallScore ?? '-' }}</span>
        <span class="es__gauge-max">this quarter</span>
      </div>
    </div>

    <!-- Metric columns -->
    <div class="es__metric">
      <span class="es__metric-label">정량 평가</span>
      <span class="es__metric-value">{{ status?.quantitative?.score ?? '-' }}</span>
      <span class="es__metric-diff" :class="diffClass(status?.quantitative?.diff ?? 0)">
        {{ diffText(status?.quantitative?.diff ?? 0) }}
      </span>
    </div>

    <div class="es__divider"></div>

    <div class="es__metric">
      <span class="es__metric-label">정성 평가</span>
      <span class="es__metric-value">{{ status?.qualitative?.score ?? '-' }}</span>
      <span class="es__metric-diff" :class="diffClass(status?.qualitative?.diff ?? 0)">
        {{ diffText(status?.qualitative?.diff ?? 0) }}
      </span>
    </div>

    <div class="es__divider"></div>

    <div class="es__metric">
      <span class="es__metric-label">전분기 비교</span>
      <div class="es__compare-list">
        <div class="es__compare-item">
          <span class="es__compare-key">정량</span>
          <span class="es__compare-value" :class="diffClass(status?.quantitative?.diff ?? 0)">
            {{ diffText(status?.quantitative?.diff ?? 0) }}
          </span>
        </div>
        <div class="es__compare-item">
          <span class="es__compare-key">정성</span>
          <span class="es__compare-value" :class="diffClass(status?.qualitative?.diff ?? 0)">
            {{ diffText(status?.qualitative?.diff ?? 0) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Tier + Rank badge -->
    <div class="es__rank">
      <span class="es__rank-quarter">{{ status?.periodLabel ?? '이번 분기' }}</span>
      <span class="es__rank-tier">{{ status?.tier ?? '-' }}-Tier</span>
      <span class="es__rank-label">포인트 순위</span>
      <div class="es__rank-numbers">
        <span class="es__rank-current">{{ rankText(status?.rank) }}</span>
        <span class="es__rank-sep">/</span>
        <span class="es__rank-total">{{ rankTotalText(status?.rankTotal) }}</span>
      </div>
      <span class="es__rank-diff diff--up" v-if="(status?.rankDiff ?? 0) > 0">
        ▲{{ status.rankDiff }} 전분기비
      </span>
    </div>
  </div>
</template>

<style scoped>
.es {
  display: flex;
  align-items: stretch;
  gap: 32px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  padding: 28px 32px;
}

.es__gauge {
  position: relative;
  width: 120px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
}

.es__ring {
  width: 120px;
  height: 120px;
}

.es__gauge-text {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.es__gauge-score {
  font-size: var(--font-size-2xl-plus);
  font-weight: 800;
  color: var(--color-text-strong);
  line-height: 1;
}

.es__gauge-max {
  font-size: var(--font-size-xs-plus);
  color: var(--color-text-muted);
}

.es__metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
  min-width: 0;
  padding-top: 3.5%;
}

.es__metric-label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-muted);
}

.es__metric-value {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  color: var(--color-text-strong);
  line-height: 1.1;
}

.es__metric-value--accent {
  color: var(--tier-s);
}

.es__metric-diff {
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.es__metric-sub {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.es__compare-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
}

.es__compare-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 120px;
}

.es__compare-key {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-muted);
}

.es__compare-value {
  font-size: var(--font-size-lg);
  font-weight: 800;
  color: var(--color-text-strong);
}

.diff--up {
  color: var(--tier-s);
}

.diff--down {
  color: var(--color-danger);
}

.es__divider {
  width: 1px;
  height: 60px;
  background: var(--color-border-default);
  flex-shrink: 0;
  align-self: center;
}

.es__rank {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  align-self: center;
  background: var(--color-primary-100);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: 18px 28px;
  min-width: 140px;
}

.es__rank-quarter {
  font-size: var(--font-size-xs-plus);
  color: var(--color-text-muted);
}

.es__rank-tier {
  font-size: var(--font-size-display-md);
  font-weight: 800;
  color: var(--color-text-strong);
  line-height: 1.1;
}

.es__rank-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: 4px;
}

.es__rank-numbers {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.es__rank-current {
  font-size: var(--font-size-display-md);
  font-weight: 800;
  color: var(--color-text-strong);
}

.es__rank-sep {
  font-size: var(--font-size-xl);
  color: var(--color-text-muted);
}

.es__rank-total {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text-default);
}

.es__rank-diff {
  font-size: var(--font-size-xs-plus);
  font-weight: 600;
}
</style>
