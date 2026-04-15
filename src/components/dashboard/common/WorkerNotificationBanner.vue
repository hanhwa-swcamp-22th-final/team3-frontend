<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
})

const emit = defineEmits(['click'])
</script>

<template>
  <div
    class="notification"
    role="button"
    tabindex="0"
    @click="emit('click')"
    @keydown.enter="emit('click')"
    @keydown.space.prevent="emit('click')"
  >
    <div class="notification__header">
      <span class="notification__icon">🔥</span>
      <span class="notification__badge">중요 공지</span>
    </div>
    <p class="notification__title">{{ title }}</p>
    <p v-if="description" class="notification__desc">{{ description }}</p>
  </div>
</template>

<style scoped>
.notification {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-left: 4px solid var(--tier-c);
  border-radius: var(--radius-base);
  padding: 16px 20px;
  cursor: pointer;
}

.notification__header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.notification__icon {
  font-size: 14px;
}

.notification__badge {
  font-size: 11px;
  font-weight: 700;
  color: var(--tier-c);
}

.notification__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-primary-800);
  margin: 0 0 4px;
}

.notification__desc {
  font-size: 12px;
  color: #7a72a0;
  margin: 0;
  line-height: 1.5;
}
</style>
