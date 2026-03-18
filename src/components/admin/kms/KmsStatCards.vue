<script setup>
import { KMS_STATS } from '@/mocks/admin/kms/kmsData.js'
</script>

<template>
  <div class="stat-cards">
    <div v-for="stat in KMS_STATS" :key="stat.label" class="stat-card">
      <span class="stat-label">{{ stat.label }}</span>
      <div class="stat-bottom">
        <span class="stat-value">{{ stat.value }}<span class="stat-unit">{{ stat.unit }}</span></span>
        <span v-if="stat.trend" class="stat-trend">{{ stat.trend }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-cards {
  display: flex;
  gap: 14px;
  font-family: var(--font-family-base);
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 15px 17px;
  background: var(--color-bg-surface, #ffffff);
  border: 1.5px solid var(--color-border-default, #e0dcff);
  border-radius: 12px;
  flex: 1;
}

.stat-label {
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
