<script setup>
import { BaseFilterTabs } from '@/components/common/base'

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

const emit = defineEmits(['change-filter'])
</script>

<template>
  <section class="scm-filter-bar">
    <BaseFilterTabs
      :items="filters"
      :model-value="activeFilter"
      @change="emit('change-filter', $event)"
    />
  </section>
</template>

<style scoped>
.scm-filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
