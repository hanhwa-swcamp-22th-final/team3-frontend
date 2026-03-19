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

.service-value {
  font-family: var(--font-family-mono);
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
}
</style>
