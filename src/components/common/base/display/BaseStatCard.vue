<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  helper: {
    type: String,
    default: '',
  },
  delta: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: 'primary',
  },
  variant: {
    type: String,
    default: 'default',
  },
  tag: {
    type: String,
    default: 'article',
  },
  valueSuffix: {
    type: String,
    default: '',
  },
})

const toneClassMap = {
  primary: 'base-stat-card--primary',
  success: 'base-stat-card--success',
  warning: 'base-stat-card--warning',
  danger: 'base-stat-card--danger',
  neutral: 'base-stat-card--neutral',
}

const variantClassMap = {
  default: 'base-stat-card--default',
  compact: 'base-stat-card--compact',
  tier: 'base-stat-card--tier',
}
</script>

<template>
  <component
    :is="tag"
    class="base-stat-card"
    :class="[toneClassMap[props.tone], variantClassMap[props.variant]]"
  >
    <p class="base-stat-card__label">{{ label }}</p>

    <slot name="value">
      <p class="base-stat-card__value">
        {{ value }}<span v-if="valueSuffix" class="base-stat-card__value-suffix">{{ valueSuffix }}</span>
      </p>
    </slot>

    <slot>
      <div v-if="delta || helper" class="base-stat-card__foot">
        <span v-if="delta" class="base-stat-card__delta">{{ delta }}</span>
        <p v-if="helper" class="base-stat-card__helper">{{ helper }}</p>
      </div>
    </slot>
  </component>
</template>

<style scoped>
.base-stat-card {
  display: grid;
  gap: 10px;
  min-height: 120px;
  padding: 20px 24px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  background: var(--color-bg-surface);
}

.base-stat-card__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary-300);
}

.base-stat-card__value {
  font-size: 52px;
  line-height: 1;
  font-weight: 700;
  color: var(--color-primary-800);
}

.base-stat-card__value-suffix {
  margin-left: 4px;
  font-size: 18px;
}

.base-stat-card__foot {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
  align-items: center;
}

.base-stat-card__delta,
.base-stat-card__helper {
  font-size: 14px;
  font-weight: 700;
}

.base-stat-card--compact {
  min-height: 96px;
  gap: 8px;
  padding: 18px 22px;
  border-radius: 18px;
}

.base-stat-card--compact .base-stat-card__value {
  font-size: 28px;
  line-height: 1.1;
}

.base-stat-card--tier .base-stat-card__value {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: var(--radius-sm);
  background: var(--color-primary-700);
  color: var(--color-text-inverse);
  font-size: 28px;
}

.base-stat-card--primary .base-stat-card__delta,
.base-stat-card--primary .base-stat-card__helper {
  color: var(--color-primary-600);
}

.base-stat-card--success .base-stat-card__delta,
.base-stat-card--success .base-stat-card__helper {
  color: var(--color-mint-500);
}

.base-stat-card--warning .base-stat-card__delta,
.base-stat-card--warning .base-stat-card__helper {
  color: var(--color-warning, #f2b63f);
}

.base-stat-card--danger .base-stat-card__delta,
.base-stat-card--danger .base-stat-card__helper,
.base-stat-card--danger .base-stat-card__value {
  color: var(--color-danger);
}

.base-stat-card--neutral .base-stat-card__delta,
.base-stat-card--neutral .base-stat-card__helper {
  color: var(--color-text-muted);
}
</style>
