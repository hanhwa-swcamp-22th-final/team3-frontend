<script setup>
import BaseStatCard from '@/components/common/base/display/BaseStatCard.vue'

defineProps({
  items: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="stat-cards">
    <BaseStatCard
      v-for="item in items"
      :key="item.label"
      :label="item.label"
      value=""
      variant="compact"
    >
      <template #value>
        <div class="value-block">
          <span class="stat-value">{{ item.value }}<span class="stat-unit">{{ item.unit }}</span></span>
          <span v-if="item.trend" class="stat-trend">{{ item.trend }}</span>
        </div>
      </template>
    </BaseStatCard>
  </div>
</template>

<style scoped>
.stat-cards {
  display: flex;
  gap: 14px;
  flex-shrink: 0;
}

.stat-cards :deep(.base-stat-card) {
  flex: 1;
  min-height: 80px;
  height: auto;
  padding: 15px 17px 1px;
  gap: 4px;
}

.stat-cards :deep(.base-stat-card__label) {
  font-size: 10px;
  font-weight: 400;
  color: #A89ED8;
  text-transform: uppercase;
  line-height: 12px;
}

.value-block {
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.stat-value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 30px;
  font-weight: 400;
  line-height: 30px;
  color: #2D1F6E;
}

.stat-unit {
  font-size: 13px;
  font-weight: 400;
  color: var(--color-text-sub, #7a6fa8);
  margin-left: 3px;
}

.stat-trend {
  font-size: 11px;
  font-weight: 400;
  line-height: 13px;
  color: #00BF95;
}
</style>
