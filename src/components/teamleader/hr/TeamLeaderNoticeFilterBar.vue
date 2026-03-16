<script setup>
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
    <button
      v-for="filter in filters"
      :key="filter.key"
      type="button"
      class="notice-filter__chip"
      :class="{ 'notice-filter__chip--active': filter.key === activeFilter }"
      @click="selectFilter(filter.key)"
    >
      {{ filter.label }}
    </button>
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

.notice-filter__chip {
  height: 36px;
  padding: 0 16px;
  border: 1px solid #ddd7ff;
  border-radius: 999px;
  background: #fff;
  color: var(--color-primary-400);
  font-weight: 700;
  cursor: pointer;
}

.notice-filter__chip--active {
  border-color: #bfb4ff;
  background: #f2efff;
  color: var(--color-primary-700);
}
</style>
