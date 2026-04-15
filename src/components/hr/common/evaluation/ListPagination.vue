<script setup>
defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['change'])
</script>

<template>
  <button
    v-for="page in totalPages"
    :key="page"
    type="button"
    class="list-pagination__page"
    :class="{ 'list-pagination__page--active': page === currentPage }"
    @click="emit('change', page)"
  >
    {{ page }}
  </button>
</template>

<style scoped>
.list-pagination__page {
  border: 1px solid var(--color-border-default);
  background: var(--color-bg-surface);
  color: var(--color-primary-700);
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  width: 34px;
  height: 34px;
  border-radius: 10px;
}

.list-pagination__page--active {
  border-color: var(--color-primary-600);
  background: var(--color-primary-600);
  color: var(--color-text-inverse);
}
</style>
