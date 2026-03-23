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

function selectFilter(filterKey) {
  emit('change-filter', filterKey)
}
</script>

<template>
  <section class="notice-filter">
    <BaseFilterTabs
      :items="filters"
      :model-value="activeFilter"
      @change="selectFilter"
    />
  </section>
</template>

<style scoped>
.notice-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 16px 18px;
  border: 1px solid var(--color-border-default);
  border-bottom: none;
  border-radius: 20px 20px 0 0;
  background: var(--color-bg-surface);
}
</style>
