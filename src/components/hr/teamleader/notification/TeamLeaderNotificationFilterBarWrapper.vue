<script setup>
import { BaseFilterTabs } from '@/components/common/base'

const emit = defineEmits(['change-filter'])

defineProps({
  filters: {
    type: Array,
    default: () => [],
  },
  activeFilter: {
    type: String,
    default: 'all',
  },
})

function handleChange(filterKey) {
  emit('change-filter', filterKey)
}
</script>

<template>
  <section class="notification-filter">
    <div class="notification-filter__header">
      <p class="notification-filter__eyebrow">전체 알림</p>
    </div>

    <BaseFilterTabs
      class="notification-filter__tabs"
      :items="filters"
      :model-value="activeFilter"
      variant="chip"
      size="sm"
      :show-count="false"
      @change="handleChange"
    />
  </section>
</template>

<style scoped>
.notification-filter {
  display: grid;
  gap: 14px;
  padding: 20px 20px 12px;
  border: 1px solid var(--color-border-default);
  border-radius: 18px 18px 0 0;
  border-bottom: none;
  background: var(--color-bg-surface);
}

.notification-filter__eyebrow {
  margin: 0;
  font-size: var(--font-size-xs-plus);
  font-weight: 700;
  color: var(--color-primary-300);
}

.notification-filter__tabs {
  min-width: 0;
}
</style>
