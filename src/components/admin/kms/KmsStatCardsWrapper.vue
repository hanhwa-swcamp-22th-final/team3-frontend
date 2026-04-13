<script setup>
import { BaseStatCard } from '@/components/common/base'

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
          <span
            v-if="item.trend"
            class="stat-trend"
            :class="{ 'stat-trend--negative': String(item.trend).startsWith('▼') }"
          >
            {{ item.trend }}
          </span>
        </div>
      </template>
    </BaseStatCard>
  </div>
</template>

<style scoped>
.stat-cards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  flex-shrink: 0;
}

.stat-cards :deep(.base-stat-card) {
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

.value-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 40px;
  font-weight: 800;
  line-height: 1;
  color: var(--color-primary-800);
}

.stat-unit {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary-800);
  margin-left: 3px;
}

.stat-trend {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-mint-500, #00BF95);
}

.stat-trend--negative {
  color: var(--color-danger-text);
}
</style>
