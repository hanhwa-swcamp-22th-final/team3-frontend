<script setup>
import { BaseStatCardGrid } from '@/components/common/base'

defineProps({
  cards: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <BaseStatCardGrid :cards="cards" class="knowledge-header" tone-fallback="neutral" />
</template>

<style scoped>
.knowledge-header :deep(.base-stat-card__helper) {
  color: var(--color-text-muted);
}

@media (max-width: 980px) {
  .knowledge-header :deep(.base-stat-card-grid) {
    grid-template-columns: 1fr;
  }
}
</style>
