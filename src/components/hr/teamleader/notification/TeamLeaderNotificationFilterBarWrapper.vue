<script setup>
import BaseFilterTabs from '@/components/common/base/navigation/BaseFilterTabs.vue'

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
      variant="underline"
      size="md"
      @change="handleChange"
    />
  </section>
</template>

<style scoped>
.notification-filter {
  padding: 18px 20px 14px;
  border: 1px solid var(--color-border-default);
  border-radius: 18px 18px 0 0;
  border-bottom: none;
  background: var(--color-bg-surface);
}

.notification-filter__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-300);
}

.notification-filter__tabs {
  margin-top: 14px;
}
</style>
