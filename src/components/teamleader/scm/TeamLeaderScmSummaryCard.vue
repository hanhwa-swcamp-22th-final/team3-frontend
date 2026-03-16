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
  primary: 'summary-card--primary',
  warning: 'summary-card--warning',
  danger: 'summary-card--danger',
  success: 'summary-card--success',
}
</script>

<template>
  <article class="summary-card" :class="toneClassMap[tone]">
    <p class="summary-card__label">{{ label }}</p>
    <strong class="summary-card__value">{{ value }}</strong>
    <p v-if="helper" class="summary-card__helper">{{ helper }}</p>
  </article>
</template>

<style scoped>
.summary-card {
  display: grid;
  gap: 8px;
  min-height: 96px;
  padding: 18px 22px;
  border: 1px solid var(--color-border-default);
  border-radius: 18px;
  background: var(--color-bg-surface);
}

.summary-card__label {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-300);
}

.summary-card__value {
  font-size: 28px;
  line-height: 1.1;
  color: var(--color-primary-800);
}

.summary-card__helper {
  font-size: 13px;
  font-weight: 700;
}

.summary-card--primary .summary-card__helper {
  color: var(--color-primary-500);
}

.summary-card--warning .summary-card__helper {
  color: var(--color-warning);
}

.summary-card--danger .summary-card__value,
.summary-card--danger .summary-card__helper {
  color: var(--color-danger);
}

.summary-card--success .summary-card__helper {
  color: var(--color-mint-500);
}
</style>
