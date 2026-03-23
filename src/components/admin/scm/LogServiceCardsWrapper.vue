<script setup>
import BaseStatCard from '@/components/common/base/display/BaseStatCard.vue'

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
  padding: 15px 17px;
  gap: 4px;
}

.service-cards :deep(.base-stat-card__label) {
  font-size: 10px;
  font-weight: 400;
  color: #A89ED8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.service-value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 30px;
  font-weight: 400;
  line-height: 30px;
  color: #2D1F6E;
}
</style>
