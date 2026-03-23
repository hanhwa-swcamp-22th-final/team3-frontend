<script setup>
import BaseStatCard from './BaseStatCard.vue'

defineProps({
  cards: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Number,
    default: 4,
  },
  variant: {
    type: String,
    default: 'compact',
  },
  toneFallback: {
    type: String,
    default: 'primary',
  },
})
</script>

<template>
  <section class="base-stat-card-grid" :style="{ '--base-stat-card-grid-columns': String(columns) }">
    <BaseStatCard
      v-for="card in cards"
      :key="card.key ?? card.label"
      :label="card.label"
      :value="card.value"
      :helper="card.helper"
      :delta="card.delta"
      :tone="card.tone ?? toneFallback"
      :variant="card.variant ?? variant"
      :value-suffix="card.valueSuffix"
      :class="['base-stat-card-grid__card', card.class]"
    />
  </section>
</template>

<style scoped>
.base-stat-card-grid {
  display: grid;
  grid-template-columns: repeat(var(--base-stat-card-grid-columns, 4), minmax(0, 1fr));
  gap: 12px;
}
</style>
