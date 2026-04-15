<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  facilityName: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <article class="history-panel">
    <div class="history-panel__head">
      <p class="history-panel__eyebrow">최근 장비 이력</p>
      <strong v-if="facilityName" class="history-panel__facility">{{ facilityName }}</strong>
    </div>

    <div v-if="items.length" class="history-panel__list">
      <article v-for="item in items" :key="item.id" class="history-panel__item">
        <span class="history-panel__time">{{ item.time }}</span>
        <strong class="history-panel__title">{{ item.title }}</strong>
      </article>
    </div>

    <p v-else class="history-panel__empty">선택한 설비의 최근 이력이 없습니다.</p>
  </article>
</template>

<style scoped>
.history-panel {
  display: grid;
  gap: 18px;
  padding: 16px 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 18px;
  background: var(--color-bg-surface);
}

.history-panel__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-300);
}

.history-panel__head {
  display: grid;
  gap: 6px;
}

.history-panel__facility {
  font-size: 16px;
  color: var(--color-primary-800);
}

.history-panel__list {
  display: grid;
  gap: 18px;
}

.history-panel__item {
  display: grid;
  gap: 8px;
}

.history-panel__time {
  font-size: 12px;
  color: var(--color-primary-200);
}

.history-panel__title {
  font-size: 18px;
  line-height: 1.35;
  color: var(--color-primary-800);
}

.history-panel__empty {
  padding: 18px 0;
  color: var(--color-primary-200);
  font-size: 14px;
  font-weight: 700;
}
</style>
