<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'ghost', 'danger'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
})

defineEmits(['click'])
</script>

<template>
  <button
    class="base-btn"
    :class="[`base-btn--${variant}`, `base-btn--${size}`]"
    :type="type"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="base-btn__spinner" />
    <slot />
  </button>
</template>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-semibold);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s, box-shadow 0.15s;
  white-space: nowrap;
}

.base-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* size */
.base-btn--sm { height: 32px; padding: 0 12px; font-size: var(--font-size-xs-plus); }
.base-btn--md { height: 40px; padding: 0 18px; font-size: var(--font-size-sm); }
.base-btn--lg { height: 48px; padding: 0 24px; font-size: var(--font-size-base-plus); }

/* variant */
.base-btn--primary {
  background: var(--color-primary-600);
  color: var(--color-text-inverse);
}
.base-btn--primary:not(:disabled):hover {
  background: var(--color-primary-700);
}

.base-btn--secondary {
  background: transparent;
  border-color: var(--color-primary-600);
  color: var(--color-primary-600);
}
.base-btn--secondary:not(:disabled):hover {
  background: var(--color-primary-100);
}

.base-btn--ghost {
  background: transparent;
  color: var(--color-primary-600);
}
.base-btn--ghost:not(:disabled):hover {
  background: var(--color-primary-100);
}

.base-btn--danger {
  background: var(--color-danger);
  color: var(--color-text-inverse);
}
.base-btn--danger:not(:disabled):hover {
  opacity: 0.88;
}

/* spinner */
.base-btn__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: base-btn-spin 0.7s linear infinite;
  flex-shrink: 0;
}
.base-btn--secondary .base-btn__spinner,
.base-btn--ghost .base-btn__spinner {
  border-color: rgba(91, 79, 207, 0.25);
  border-top-color: var(--color-primary-600);
}

@keyframes base-btn-spin {
  to { transform: rotate(360deg); }
}
</style>
