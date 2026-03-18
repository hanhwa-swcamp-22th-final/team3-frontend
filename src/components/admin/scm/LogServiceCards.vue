<script setup>
import { SERVICE_STATUS } from '@/mocks/admin/record/logData.js'
</script>

<template>
  <div class="service-cards">
    <div
      v-for="service in SERVICE_STATUS"
      :key="service.label"
      class="service-card"
    >
      <span class="card-label">{{ service.label }}</span>
      <span class="card-value" :style="{ color: service.color }">{{ service.value }}</span>
    </div>
  </div>
</template>

<style scoped>
.service-cards {
  display: flex;
  gap: 12px;
  flex-shrink: 0;

}

.service-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 13.5px 15.5px;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: var(--radius-base);
  flex: 1;
}

.card-label {
  font-size: 10px;
  font-weight: 400;
  color: var(--color-text-placeholder);
  text-transform: uppercase;
}

.card-value {
  font-family: var(--font-family-mono);
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
}
</style>
