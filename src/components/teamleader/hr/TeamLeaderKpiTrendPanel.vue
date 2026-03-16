<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="trend-panel">
    <header class="trend-panel__header">
      <p class="trend-panel__eyebrow">지표 분석</p>
      <h2 class="trend-panel__title">관리 포인트</h2>
    </header>

    <div class="trend-panel__list">
      <article v-for="item in items" :key="item.label" class="trend-panel__card">
        <div class="trend-panel__top">
          <strong>{{ item.label }}</strong>
          <span>{{ item.current }}</span>
        </div>
        <p class="trend-panel__target">목표: {{ item.target }}</p>
        <p class="trend-panel__description">{{ item.description }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.trend-panel {
  padding: 20px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
}

.trend-panel__header {
  margin-bottom: 18px;
}

.trend-panel__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-500);
}

.trend-panel__title {
  margin-top: 6px;
  font-size: 18px;
  color: var(--color-primary-800);
}

.trend-panel__list {
  display: grid;
  gap: 14px;
}

.trend-panel__card {
  display: grid;
  gap: 8px;
  padding: 16px;
  border: 1px solid var(--color-border-soft);
  border-radius: 16px;
  background: #fcfbff;
}

.trend-panel__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.trend-panel__top strong {
  color: var(--color-primary-800);
  font-size: 15px;
}

.trend-panel__top span {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary-600);
}

.trend-panel__target {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-500);
}

.trend-panel__description {
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-text-default);
}
</style>
