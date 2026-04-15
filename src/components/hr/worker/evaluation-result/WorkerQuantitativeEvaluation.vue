<script setup>
import { ref } from 'vue'

const props = defineProps({
  evaluation: { type: Object, required: true },
})

const showFormula = ref(false)

function isHighlight(val) {
  return val.endsWith('%') || val.endsWith('점')
}

function parseLabel(label) {
  const index = label.substring(0, 2)
  const rest = label.substring(2)
  const splitMatch = rest.match(/ (?:[A-Z]|MCH|R')/)
  if (splitMatch) {
    const splitIndex = splitMatch.index
    return {
      name: index + rest.substring(0, splitIndex).trim(),
      formula: rest.substring(splitIndex).trim(),
    }
  }
  return { name: label, formula: '' }
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
      <button
        class="qn__toggle"
        :class="{ 'qn__toggle--active': showFormula }"
        @click="showFormula = !showFormula"
      >
        정량 세부 산식
      </button>
    </div>

    <!-- Formula steps -->
    <div class="qn__steps">
      <div v-for="(step, i) in (evaluation?.steps || [])" :key="i" class="qn__step">
        <div class="qn__step-label">
          <span class="qn__step-name">{{ parseLabel(step.label).name }}</span>
          <span v-if="showFormula && parseLabel(step.label).formula" class="qn__step-formula">
            {{ parseLabel(step.label).formula }}
          </span>
        </div>
        <span
          class="qn__step-value"
          :class="{ 'qn__step-value--accent': isHighlight(step.value) }"
        >
          {{ step.value }}
        </span>
      </div>
    </div>

  </div>
</template>

<style scoped>
.qn {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
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

.qn__toggle {
  padding: 8px 18px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  background: var(--color-bg-surface);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-default);
  cursor: pointer;
  transition: all 0.15s;
}

.qn__toggle--active {
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
  border-radius: var(--radius-base);
}

.qn__step-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.qn__step-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-strong);
}

.qn__step-formula {
  font-family: 'Courier New', Courier, monospace;
  font-size: 11px;
  color: var(--color-text-muted);
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

</style>
