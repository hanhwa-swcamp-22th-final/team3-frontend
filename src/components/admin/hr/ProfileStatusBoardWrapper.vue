<script setup>
import { BaseStatCard } from '@/components/common/base'

defineProps({
  totalCount:     { type: Number, default: 0 },
  topTierCount:   { type: Number, default: 0 },
  topTierPercent: { type: [Number, String], default: 0 },
  avgScore:       { type: [Number, String], default: 0 },
})
</script>

<template>
  <div class="stat-cards">
    <BaseStatCard
      label="전체 인원"
      :value="`${totalCount}`"
      value-suffix="명"
      variant="compact"
    />
    <BaseStatCard
      label="S+A Tier"
      :value="`${topTierCount}`"
      value-suffix="명"
      :helper="`(${topTierPercent}%)`"
      tone="success"
      variant="compact"
    />
    <BaseStatCard
      label="평균 종합점수"
      :value="`${avgScore}`"
      variant="compact"
    />
  </div>
</template>

<style scoped>
.stat-cards {
  display: flex;
  gap: 16px;
}

.stat-cards :deep(.base-stat-card) {
  flex: 1;
  min-height: 0;
  height: auto;
  padding: 20px 24px;
  gap: 4px;
}

.stat-cards :deep(.base-stat-card__label) {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary-300);
}

.stat-cards :deep(.base-stat-card__value) {
  font-size: 40px;
  font-weight: 800;
  line-height: 1;
  color: var(--color-primary-800);
}

.stat-cards :deep(.base-stat-card__helper) {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-primary-300);
}
</style>
