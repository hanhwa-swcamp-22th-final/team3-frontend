<script setup>
defineProps({
  value: { type: Number, default: 0 },  // 0 ~ 100
  tone: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'success', 'warning', 'danger', 'mint'].includes(v),
  },
  label: { type: String, default: '' },
  showPercent: { type: Boolean, default: true },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md'].includes(v),
  },
})
</script>

<template>
  <div class="base-progress-bar">
    <div v-if="label || showPercent" class="base-progress-bar__meta">
      <span v-if="label" class="base-progress-bar__label">{{ label }}</span>
      <span v-if="showPercent" class="base-progress-bar__percent">{{ value }}%</span>
    </div>
    <div class="base-progress-bar__track" :class="`base-progress-bar__track--${size}`">
      <div
        class="base-progress-bar__fill"
        :class="`base-progress-bar__fill--${tone}`"
        :style="{ width: `${Math.min(Math.max(value, 0), 100)}%` }"
      />
    </div>
  </div>
</template>

<style scoped>
.base-progress-bar {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}

.base-progress-bar__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base-progress-bar__label {
  font-size: var(--font-size-xs-plus);
  color: var(--color-text-muted);
}

.base-progress-bar__percent {
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
}

.base-progress-bar__track {
  width: 100%;
  border-radius: 999px;
  background: var(--color-border-row);
  overflow: hidden;
}

.base-progress-bar__track--sm { height: 4px; }
.base-progress-bar__track--md { height: 7px; }

.base-progress-bar__fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}

.base-progress-bar__fill--primary { background: var(--color-primary-600); }
.base-progress-bar__fill--success { background: var(--color-success); }
.base-progress-bar__fill--warning { background: var(--color-warning); }
.base-progress-bar__fill--danger  { background: var(--color-danger); }
.base-progress-bar__fill--mint    { background: var(--color-mint-500); }
</style>
