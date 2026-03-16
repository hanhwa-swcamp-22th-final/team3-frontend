<script setup>
defineProps({
  orders: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <aside class="urgent-panel">
    <header class="urgent-panel__header">
      <p class="urgent-panel__eyebrow">긴급 주문</p>
      <h2 class="urgent-panel__title">납기 임박 주문</h2>
    </header>

    <div v-if="orders.length" class="urgent-panel__list">
      <article
        v-for="order in orders"
        :key="order.id"
        class="urgent-card"
        :class="`urgent-card--${order.tone}`"
      >
        <span class="urgent-card__badge">{{ order.deadlineLabel }}</span>
        <strong class="urgent-card__title">{{ order.title }}</strong>
        <div class="urgent-card__progress">
          <div class="urgent-card__progress-track">
            <div class="urgent-card__progress-fill" :style="{ width: order.progressWidth }"></div>
          </div>
          <span>{{ order.progress }}</span>
        </div>
        <p class="urgent-card__meta">담당: {{ order.assignee }}</p>
        <p v-if="order.helper" class="urgent-card__helper">{{ order.helper }}</p>
      </article>
    </div>

    <div v-else class="urgent-panel__empty">
      선택한 필터에 해당하는 긴급 주문이 없습니다.
    </div>

    <button type="button" class="urgent-panel__action">작업 매칭으로 이동</button>
  </aside>
</template>

<style scoped>
.urgent-panel {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 22px;
  background: var(--color-bg-surface);
}

.urgent-panel__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-500);
}

.urgent-panel__title {
  margin-top: 6px;
  font-size: 18px;
  color: var(--color-primary-800);
}

.urgent-panel__list {
  display: grid;
  gap: 12px;
}

.urgent-panel__empty {
  display: grid;
  place-items: center;
  min-height: 180px;
  padding: 18px;
  border: 1px dashed var(--color-border-default);
  border-radius: 16px;
  color: var(--color-text-muted);
  font-size: 14px;
  text-align: center;
}

.urgent-card {
  display: grid;
  gap: 10px;
  padding: 14px 14px 16px;
  border: 2px solid var(--color-border-default);
  border-radius: 16px;
}

.urgent-card__badge {
  display: inline-flex;
  width: fit-content;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  color: #fff;
}

.urgent-card--danger {
  background: #fff4f6;
  border-color: #ffb3c3;
}

.urgent-card--danger .urgent-card__badge {
  background: var(--color-danger);
}

.urgent-card--warning {
  background: #fff9eb;
  border-color: #ffd166;
}

.urgent-card--warning .urgent-card__badge {
  background: var(--color-warning);
}

.urgent-card__title {
  font-size: 18px;
  line-height: 1.35;
  color: var(--color-primary-800);
}

.urgent-card__progress {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-500);
}

.urgent-card__progress-track {
  height: 6px;
  border-radius: 999px;
  overflow: hidden;
  background: var(--color-primary-100);
}

.urgent-card__progress-fill {
  height: 100%;
  background: var(--color-primary-300);
}

.urgent-card__meta,
.urgent-card__helper {
  font-size: 12px;
  color: var(--color-text-muted);
}

.urgent-card__helper {
  color: var(--color-danger);
  font-weight: 700;
}

.urgent-panel__action {
  height: 44px;
  border: none;
  border-radius: 10px;
  background: var(--color-primary-600);
  color: var(--color-text-inverse);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
</style>
