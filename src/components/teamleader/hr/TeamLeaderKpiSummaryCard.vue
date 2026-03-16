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
  primary: 'summary-card--primary',
  success: 'summary-card--success',
  warning: 'summary-card--warning',
  danger: 'summary-card--danger',
}
</script>

<template>
  <article class="summary-card" :class="toneClassMap[tone]">
    <p class="summary-card__label">{{ label }}</p>
    <p class="summary-card__value">{{ value }}</p>
    <div class="summary-card__foot">
      <span v-if="delta" class="summary-card__delta">{{ delta }}</span>
      <p v-if="helper" class="summary-card__helper">{{ helper }}</p>
    </div>
  </article>
</template>

<style scoped>
.summary-card {
  display: grid;
  gap: 10px;
  min-height: 124px;
  padding: 20px 24px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  background: var(--color-bg-surface);
  box-shadow: var(--shadow-soft);
}

.summary-card__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary-300);
}

.summary-card__value {
  font-size: 44px;
  line-height: 1;
  font-weight: 700;
  color: var(--color-primary-800);
}

.summary-card__foot {
  display: grid;
  gap: 6px;
}

.summary-card__delta,
.summary-card__helper {
  font-size: 14px;
  font-weight: 700;
}

.summary-card--primary .summary-card__delta,
.summary-card--primary .summary-card__helper {
  color: var(--color-primary-600);
}

.summary-card--success .summary-card__delta,
.summary-card--success .summary-card__helper {
  color: var(--color-mint-500);
}

.summary-card--warning .summary-card__delta,
.summary-card--warning .summary-card__helper {
  color: var(--color-warning);
}

.summary-card--danger .summary-card__delta,
.summary-card--danger .summary-card__helper {
  color: var(--color-danger);
}
</style>
