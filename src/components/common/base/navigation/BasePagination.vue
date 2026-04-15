<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
  maxVisible: {
    type: Number,
    default: 5,
  },
})

const emit = defineEmits(['update:currentPage'])

const normalizedCurrentPage = computed(() =>
  Math.min(Math.max(1, props.currentPage), Math.max(1, props.totalPages)),
)

const visiblePages = computed(() => {
  const total = Math.max(1, props.totalPages)
  const maxVisible = Math.max(1, props.maxVisible)

  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const half = Math.floor(maxVisible / 2)
  let start = Math.max(1, normalizedCurrentPage.value - half)
  let end = start + maxVisible - 1

  if (end > total) {
    end = total
    start = end - maxVisible + 1
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
})

function moveTo(page) {
  const target = Math.min(Math.max(1, page), Math.max(1, props.totalPages))
  if (target === normalizedCurrentPage.value) return
  emit('update:currentPage', target)
}
</script>

<template>
  <div v-if="totalPages > 1" class="base-pagination">
    <button
      type="button"
      class="base-pagination__page"
      :disabled="normalizedCurrentPage === 1"
      @click="moveTo(normalizedCurrentPage - 1)"
    >
      &lt;
    </button>

    <button
      v-for="page in visiblePages"
      :key="page"
      type="button"
      class="base-pagination__page"
      :class="{ 'base-pagination__page--active': page === normalizedCurrentPage }"
      @click="moveTo(page)"
    >
      {{ page }}
    </button>

    <button
      type="button"
      class="base-pagination__page"
      :disabled="normalizedCurrentPage === totalPages"
      @click="moveTo(normalizedCurrentPage + 1)"
    >
      &gt;
    </button>
  </div>
</template>

<style scoped>
.base-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.base-pagination__page {
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  border: 1px solid #ddd7ff;
  border-radius: 8px;
  background: #fff;
  color: var(--color-primary-500);
  font-size: var(--font-size-sm);
  font-weight: 700;
  cursor: pointer;
}

.base-pagination__page:hover:not(:disabled) {
  border-color: var(--color-primary-300);
  background: var(--color-primary-100);
}

.base-pagination__page:disabled {
  opacity: 0.4;
  cursor: default;
}

.base-pagination__page--active {
  border-color: var(--color-primary-600);
  background: var(--color-primary-600);
  color: #fff;
}
</style>
