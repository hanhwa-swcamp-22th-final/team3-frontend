<script setup>
import BaseStatCard from '@/components/common/base/display/BaseStatCard.vue'

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
  min-height: 80px;
  height: auto;
  padding: 15px 17px;
  gap: 4px;
}

.stat-cards :deep(.base-stat-card__label) {
  font-size: 10px;
  font-weight: 400;
  color: #A89ED8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-cards :deep(.base-stat-card__value) {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 30px;
  font-weight: 400;
  line-height: 30px;
  color: #2D1F6E;
}

.stat-cards :deep(.base-stat-card__helper) {
  font-size: 11px;
  font-weight: 400;
  color: #7A6FA8;
}
</style>
