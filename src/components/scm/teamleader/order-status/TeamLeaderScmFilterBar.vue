<script setup>
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
    <button
      v-for="filter in filters"
      :key="filter.key"
      type="button"
      class="scm-filter-bar__button"
      :class="{ 'scm-filter-bar__button--active': activeFilter === filter.key }"
      @click="emit('change-filter', filter.key)"
    >
      {{ filter.label }}
    </button>
  </section>
</template>

<style scoped>
.scm-filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.scm-filter-bar__button {
  height: 38px;
  padding: 0 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 999px;
  background: var(--color-bg-surface);
  color: var(--color-primary-500);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.scm-filter-bar__button--active {
  border-color: var(--color-primary-600);
  background: var(--color-primary-600);
  color: var(--color-text-inverse);
}
</style>
