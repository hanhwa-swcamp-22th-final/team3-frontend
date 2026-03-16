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
}
</script>

<template>
  <article class="summary-card" :class="toneClassMap[tone]">
    <p class="summary-card__label">{{ label }}</p>
    <p class="summary-card__value">{{ value }}</p>
    <p v-if="helper" class="summary-card__helper">{{ helper }}</p>
  </article>
</template>

<style scoped>
.summary-card {
  display: grid;
  gap: 10px;
  min-height: 110px;
  padding: 18px 20px;
  border: 1px solid #ddd7ff;
  border-radius: 16px;
  background: #fff;
}

.summary-card__label {
  font-size: 12px;
  font-weight: 700;
  color: #b0a8dc;
}

.summary-card__value {
  font-size: 23px;
  line-height: 1.2;
  font-weight: 800;
  color: var(--color-primary-800);
}

.summary-card__helper {
  font-size: 13px;
  font-weight: 700;
}

.summary-card--primary .summary-card__helper {
  color: #20c9a7;
}

.summary-card--warning .summary-card__value,
.summary-card--warning .summary-card__helper {
  color: #f2b63f;
}
</style>
