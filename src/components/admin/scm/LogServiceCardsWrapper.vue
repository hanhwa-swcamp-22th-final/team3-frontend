<script setup>
import { BaseStatCard } from '@/components/common/base'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div class="service-cards">
    <BaseStatCard
      v-for="item in items"
      :key="item.label"
      :label="item.label"
      value=""
      variant="compact"
    >
      <template #value>
        <span class="service-value" :style="{ color: item.color }">{{ item.value }}</span>
      </template>
    </BaseStatCard>
  </div>
</template>

<style scoped>
.service-cards {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.service-cards :deep(.base-stat-card) {
  flex: 1;
  min-height: 80px;
  height: auto;
  padding: 14px 16px;
  align-items: end;
}

.service-cards :deep(.base-stat-card__label) {
  align-self: start;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.service-value {
  font-family: var(--font-family-base);
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  color: var(--color-primary-800);
}
</style>
