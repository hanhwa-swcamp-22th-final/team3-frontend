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
  tone: {
    type: String,
    default: 'primary',
  },
  isTier: {
    type: Boolean,
    default: false,
  },
})

const toneClassMap = {
  primary: 'dl-metric-card--primary',
  success: 'dl-metric-card--success',
  warning: 'dl-metric-card--warning',
  danger:  'dl-metric-card--danger',
}
</script>

<template>
  <article class="dl-metric-card" :class="toneClassMap[tone]">
    <p class="dl-metric-card__label">{{ label }}</p>
    <div v-if="isTier" class="dl-metric-card__tier-badge">{{ value }}</div>
    <p v-else class="dl-metric-card__value">{{ value }}</p>
    <div class="dl-metric-card__foot">
      <span v-if="delta" class="dl-metric-card__delta">{{ delta }}</span>
    </div>
  </article>
</template>

<style scoped>
.dl-metric-card {
  display: grid;
  gap: 10px;
  min-height: 120px;
  padding: 20px 24px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  background: var(--color-bg-surface);
}
.dl-metric-card__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary-300);
}
.dl-metric-card__value {
  font-size: 52px;
  line-height: 1;
  font-weight: 700;
  color: var(--color-primary-800);
}
.dl-metric-card__tier-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: var(--radius-sm);
  background: var(--color-primary-700);
  color: var(--color-text-inverse);
  font-size: 28px;
  font-weight: 700;
}
.dl-metric-card__delta {
  font-size: 14px;
  font-weight: 700;
}
.dl-metric-card--primary .dl-metric-card__delta {
  color: var(--color-primary-600);
}
.dl-metric-card--success .dl-metric-card__delta {
  color: var(--color-mint-500);
}
.dl-metric-card--danger .dl-metric-card__delta {
  color: var(--color-danger);
}
</style>
