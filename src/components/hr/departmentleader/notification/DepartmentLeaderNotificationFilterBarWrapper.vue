<script setup>
import BaseFilterTabs from '@/components/common/base/navigation/BaseFilterTabs.vue'

const emit = defineEmits(['change-filter'])

defineProps({
  filters:      { type: Array,  default: () => [] },
  activeFilter: { type: String, default: 'all' },
})

function handleChange(filterKey) {
  emit('change-filter', filterKey)
}
</script>

<template>
  <section class="dl-notif-filter">
    <p class="dl-notif-filter__eyebrow">전체 알림</p>
    <BaseFilterTabs
      class="dl-notif-filter__tabs"
      :items="filters"
      :model-value="activeFilter"
      variant="underline"
      size="md"
      :show-count="true"
      @change="handleChange"
    />
  </section>
</template>

<style scoped>
.dl-notif-filter {
  padding: 18px 20px 14px;
  border: 1px solid var(--color-border-default);
  border-radius: 18px 18px 0 0;
  border-bottom: none;
  background: var(--color-bg-surface);
}

.dl-notif-filter__eyebrow {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-300);
}

.dl-notif-filter__tabs {
  margin-top: 14px;
}
</style>
