<script setup>
defineProps({
  icon: { type: String, default: '📭' },
  title: { type: String, default: '데이터가 없습니다.' },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="base-empty-state">
    <span class="base-empty-state__icon" aria-hidden="true">{{ icon }}</span>
    <p class="base-empty-state__title">{{ title }}</p>
    <p v-if="description" class="base-empty-state__description">{{ description }}</p>
    <div v-if="$slots.action" class="base-empty-state__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.base-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 48px 24px;
  text-align: center;
}

.base-empty-state__icon {
  font-size: var(--font-size-2xl);
  line-height: 1;
}

.base-empty-state__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
}

.base-empty-state__description {
  font-size: var(--font-size-xs-plus);
  color: var(--color-text-muted);
  line-height: 1.6;
  max-width: 320px;
}

.base-empty-state__action {
  margin-top: 6px;
}
</style>
