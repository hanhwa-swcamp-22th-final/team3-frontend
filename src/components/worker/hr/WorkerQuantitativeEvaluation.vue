<script setup>
import { ref } from 'vue'

const props = defineProps({
  evaluation: { type: Object, required: true },
})

const tabs = ['정량 세부 산식', 'AI 평가 근거 보기']
const activeTab = ref(tabs[0])

function isHighlight(val) {
  return val.endsWith('%') || val.endsWith('점')
}
</script>

<template>
  <div class="qn">
    <div class="qn__header">
      <div class="qn__header-left">
        <span class="qn__icon-badge">🔢</span>
        <h3 class="qn__title">정량 평가 산출 내역</h3>
        <span class="qn__sub">설비 E_idx 보정 적용 기준</span>
      </div>
      <div class="qn__tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          class="qn__tab"
          :class="{ 'qn__tab--active': activeTab === tab }"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- Formula steps -->
    <div class="qn__steps">
      <div v-for="(step, i) in evaluation.steps" :key="i" class="qn__step">
        <span class="qn__step-label">{{ step.label }}</span>
        <span
          class="qn__step-value"
          :class="{ 'qn__step-value--accent': isHighlight(step.value) }"
        >
          {{ step.value }}
        </span>
      </div>
    </div>

    <!-- E_idx chart -->
    <div class="qn__chart-card">
      <h4 class="qn__chart-title">📈 {{ evaluation.eidxChart.title }}</h4>
      <div class="qn__chart">
        <svg viewBox="0 0 280 80" class="qn__chart-svg">
          <line
            v-for="(_, i) in evaluation.eidxChart.data.slice(0, -1)"
            :key="'l' + i"
            :x1="i * (260 / (evaluation.eidxChart.data.length - 1)) + 10"
            :y1="70 - ((evaluation.eidxChart.data[i] - 0.85) / 0.15) * 60"
            :x2="(i + 1) * (260 / (evaluation.eidxChart.data.length - 1)) + 10"
            :y2="70 - ((evaluation.eidxChart.data[i + 1] - 0.85) / 0.15) * 60"
            stroke="var(--tier-s)"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <span class="qn__chart-meta">
        평균 E_idx: {{ evaluation.eidxChart.avg }} · 최저: {{ evaluation.eidxChart.min }}({{ evaluation.eidxChart.minDate }}) · 최고: {{ evaluation.eidxChart.max }}
      </span>
    </div>

    <!-- AI Summary -->
    <div class="qn__ai">
      <h4 class="qn__ai-title">AI 요약</h4>
      <p class="qn__ai-text">{{ evaluation.aiSummary }}</p>
    </div>
  </div>
</template>

<style scoped>
.qn {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.qn__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.qn__header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qn__icon-badge {
  font-size: 18px;
  line-height: 1;
}

.qn__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-strong);
  margin: 0;
}

.qn__sub {
  font-size: 12px;
  color: var(--color-text-muted);
}

.qn__tabs {
  display: flex;
  gap: 8px;
}

.qn__tab {
  padding: 9px 20px;
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  background: var(--color-bg-surface);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-default);
  cursor: pointer;
  white-space: nowrap;
}

.qn__tab--active {
  background: var(--color-primary-800);
  color: var(--color-white);
  border-color: var(--color-primary-800);
}

.qn__steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.qn__step {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-muted);
  border-radius: 12px;
}

.qn__step-label {
  color: var(--color-text-default);
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
}

.qn__step-value {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-text-strong);
  white-space: nowrap;
  margin-left: 12px;
}

.qn__step-value--accent {
  color: var(--tier-s);
}

.qn__chart-card {
  background: var(--color-primary-100);
  border-left: 4px solid var(--color-primary-300);
  border-radius: 12px;
  padding: 18px 20px;
}

.qn__chart-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-primary-800);
  margin: 0 0 10px;
}

.qn__chart {
  margin-bottom: 10px;
}

.qn__chart-svg {
  width: 100%;
  height: 80px;
}

.qn__chart-meta {
  font-size: 12px;
  color: var(--color-text-muted);
}

.qn__ai {
  background: var(--color-bg-surface-muted);
  border-left: 4px solid var(--color-primary-300);
  border-radius: 12px;
  padding: 18px 20px;
}

.qn__ai-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--color-primary-800);
  margin: 0 0 8px;
}

.qn__ai-text {
  font-size: 14px;
  color: var(--color-text-default);
  line-height: 1.7;
  margin: 0;
}
</style>
