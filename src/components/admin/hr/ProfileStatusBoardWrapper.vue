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
    />
    <BaseStatCard
      label="S+A Tier"
      :value="`${topTierCount}`"
      value-suffix="명"
      :helper="`(${topTierPercent}%)`"
      tone="success"
    />
    <BaseStatCard
      label="평균 종합점수"
      :value="`${avgScore}`"
    />
  </div>
</template>

<style scoped>
.stat-cards {
  display: flex;
  gap: 16px;
}
</style>
