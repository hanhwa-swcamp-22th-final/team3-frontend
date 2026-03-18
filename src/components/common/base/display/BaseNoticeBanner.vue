<script setup>
const props = defineProps({
  badge: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: 'success',
  },
  variant: {
    type: String,
    default: 'soft',
  },
  icon: {
    type: String,
    default: '',
  },
  closable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'action'])

const toneClassMap = {
  info: 'base-notice-banner--info',
  success: 'base-notice-banner--success',
  warning: 'base-notice-banner--warning',
  danger: 'base-notice-banner--danger',
}

const variantClassMap = {
  soft: 'base-notice-banner--soft',
  solid: 'base-notice-banner--solid',
  leftAccent: 'base-notice-banner--left-accent',
}
</script>

<template>
  <section
    class="base-notice-banner"
    :class="[toneClassMap[props.tone], variantClassMap[props.variant]]"
  >
    <div class="base-notice-banner__top">
      <div v-if="badge || icon" class="base-notice-banner__meta">
        <slot name="icon">
          <span v-if="icon" class="base-notice-banner__icon">{{ icon }}</span>
        </slot>
        <span v-if="badge" class="base-notice-banner__badge">{{ badge }}</span>
      </div>

      <button
        v-if="closable"
        type="button"
        class="base-notice-banner__close"
        @click="emit('close')"
      >
        ×
      </button>
    </div>

    <h2 class="base-notice-banner__title">{{ title }}</h2>
    <p v-if="description" class="base-notice-banner__description">{{ description }}</p>

    <slot />

    <div v-if="$slots.actions" class="base-notice-banner__actions">
      <slot name="actions" />
    </div>
  </section>
</template>

<style scoped>
.base-notice-banner {
  padding: 22px;
  border-radius: 24px;
  border: 1px solid transparent;
}

.base-notice-banner__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.base-notice-banner__meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.base-notice-banner__icon {
  font-size: 14px;
}

.base-notice-banner__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 104px;
  height: 32px;
  padding: 0 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
}

.base-notice-banner__close {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  color: var(--color-primary-700);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

.base-notice-banner__title {
  margin-top: 16px;
  font-size: 20px;
  color: var(--color-primary-800);
}

.base-notice-banner__description {
  margin-top: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-primary-500);
}

.base-notice-banner__actions {
  margin-top: 16px;
}

.base-notice-banner--soft.base-notice-banner--success {
  border-color: var(--color-mint-200);
  background: linear-gradient(180deg, rgba(174, 236, 227, 0.65) 0%, rgba(232, 251, 247, 0.9) 100%);
}

.base-notice-banner--soft.base-notice-banner--info {
  border-color: #d9d4ff;
  background: linear-gradient(180deg, rgba(230, 226, 255, 0.9) 0%, rgba(248, 247, 255, 1) 100%);
}

.base-notice-banner--soft.base-notice-banner--warning {
  border-color: #ffe0a3;
  background: linear-gradient(180deg, rgba(255, 245, 210, 0.9) 0%, rgba(255, 251, 238, 1) 100%);
}

.base-notice-banner--soft.base-notice-banner--danger {
  border-color: #ffc9d6;
  background: linear-gradient(180deg, rgba(255, 235, 240, 0.92) 0%, rgba(255, 247, 249, 1) 100%);
}

.base-notice-banner--success .base-notice-banner__badge {
  background: rgba(24, 195, 170, 0.16);
  color: #10937f;
}

.base-notice-banner--info .base-notice-banner__badge {
  background: rgba(101, 87, 221, 0.14);
  color: var(--color-info, #6557dd);
}

.base-notice-banner--warning .base-notice-banner__badge {
  background: rgba(244, 197, 75, 0.2);
  color: #9a6a00;
}

.base-notice-banner--danger .base-notice-banner__badge {
  background: rgba(239, 71, 111, 0.14);
  color: #c42b56;
}

.base-notice-banner--left-accent {
  border-color: var(--color-border-default);
  border-left-width: 4px;
  background: var(--color-bg-surface);
}

.base-notice-banner--left-accent.base-notice-banner--success {
  border-left-color: var(--color-mint-500);
}

.base-notice-banner--left-accent.base-notice-banner--info {
  border-left-color: var(--color-info, #6557dd);
}

.base-notice-banner--left-accent.base-notice-banner--warning {
  border-left-color: var(--color-warning, #f2b63f);
}

.base-notice-banner--left-accent.base-notice-banner--danger {
  border-left-color: var(--color-danger);
}

.base-notice-banner--solid.base-notice-banner--success {
  background: var(--color-mint-500);
  color: var(--color-text-inverse);
}

.base-notice-banner--solid.base-notice-banner--success .base-notice-banner__title,
.base-notice-banner--solid.base-notice-banner--success .base-notice-banner__description {
  color: var(--color-text-inverse);
}

.base-notice-banner--solid.base-notice-banner--success .base-notice-banner__badge {
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-text-inverse);
}
</style>
