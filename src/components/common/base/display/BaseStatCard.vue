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

    <div class="base-stat-card__value-wrapper">
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
    </div>
  </component>
</template>

<style scoped>
.base-stat-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: var(--base-stat-card-gap-row) var(--base-stat-card-gap-column);
  min-height: var(--base-stat-card-min-height);
  padding: var(--base-stat-card-padding-y) var(--base-stat-card-padding-x);
  border: 1px solid var(--color-border-default);
  border-radius: var(--base-stat-card-radius);
  background: var(--color-bg-surface);
  text-align: left;
}

.base-stat-card__label {
  margin: 0;
  font-size: var(--font-size-xl);
  line-height: 1.4;
  font-weight: 600;
  color: var(--color-primary-300);
}

.base-stat-card__value-wrapper {
  display: grid;
  justify-items: end;
  align-content: start;
  gap: var(--base-stat-card-content-gap);
  text-align: right;
}

.base-stat-card__value {
  margin: 0;
  font-size: var(--font-size-xl-plus);
  line-height: 1.1;
  font-weight: 700;
  color: var(--color-primary-800);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.base-stat-card__value-suffix {
  margin-left: var(--base-stat-card-suffix-gap);
  font-size: var(--font-size-md);
}

.base-stat-card__foot {
  display: grid;
  justify-items: end;
  gap: var(--base-stat-card-foot-gap);
}

.base-stat-card__delta,
.base-stat-card__helper {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: 1.4;
  font-weight: 600;
}

.base-stat-card--compact {
  min-height: var(--base-stat-card-min-height);
  gap: var(--base-stat-card-gap-row) var(--base-stat-card-gap-column);
  padding: var(--base-stat-card-padding-y) var(--base-stat-card-padding-x);
  border-radius: var(--base-stat-card-radius);
}

.base-stat-card--compact .base-stat-card__value {
  font-size: var(--font-size-xl-plus);
  line-height: 1.1;
}

.base-stat-card--compact .base-stat-card__value-suffix {
  font-size: var(--font-size-md);
}

.base-stat-card--tier .base-stat-card__value {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--base-stat-card-tier-size);
  height: var(--base-stat-card-tier-size);
  border-radius: var(--radius-sm);
  background: var(--color-primary-700);
  color: var(--color-text-inverse);
  font-size: var(--font-size-2xl-plus);
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
