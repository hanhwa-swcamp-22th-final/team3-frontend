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
        <div class="stat-bottom">
          <span class="stat-value">
            {{ item.value }}<span class="stat-unit">{{ item.unit }}</span>
          </span>
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
  padding: 15px 17px;
  gap: 8px;
}

.stat-cards :deep(.base-stat-card__label) {
  font-size: 10px;
  font-weight: 400;
  color: var(--color-text-muted, #a89ed8);
  text-transform: uppercase;
}

.stat-bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary-800, #2d1f6e);
  line-height: 1;
}

.stat-unit {
  font-size: 13px;
  font-weight: 400;
  color: var(--color-text-sub, #7a6fa8);
  margin-left: 3px;
}

.stat-trend {
  font-size: 11px;
  font-weight: 700;
  color: #00bf95;
  background: #e3fbef;
  padding: 2px 7px;
  border-radius: 4px;
}
</style>
