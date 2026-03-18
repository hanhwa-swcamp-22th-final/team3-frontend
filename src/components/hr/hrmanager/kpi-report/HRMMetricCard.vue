<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  delta: {
    type: String,
    default: '',
  },
  helper: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: 'primary',
  },
})

const toneClassMap = {
  primary: 'metric-card--primary',
  success: 'metric-card--success',
  warning: 'metric-card--warning',
  danger: 'metric-card--danger',
}
</script>

<template>
  <article class="metric-card" :class="toneClassMap[tone]">
    <p class="metric-card__label">{{ label }}</p>
    <p class="metric-card__value">{{ value }}</p>
    <div class="metric-card__foot">
      <span v-if="delta" class="metric-card__delta">{{ delta }}</span>
      <p v-if="helper" class="metric-card__helper">{{ helper }}</p>
    </div>
  </article>
</template>

<style scoped>
.metric-card {
  display: grid;
  gap: 10px;
  min-height: 120px;
  padding: 20px 24px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  background: var(--color-bg-surface);
}
.metric-card__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-300);
}
.metric-card__value {
  font-size: var(--font-size-display);
  line-height: 1;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}
.metric-card__delta,
.metric-card__helper {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
}
.metric-card--primary .metric-card__delta,
.metric-card--primary .metric-card__helper {
  color: var(--color-primary-600);
}
.metric-card--success .metric-card__delta,
.metric-card--success .metric-card__helper {
  color: var(--color-mint-500);
}
.metric-card--danger .metric-card__delta,
.metric-card--danger .metric-card__helper {
  color: var(--color-danger);
}
</style>
