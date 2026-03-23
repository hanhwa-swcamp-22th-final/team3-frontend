<script setup>
defineProps({
  orders: {
    type: Array,
    default: () => [],
  },
  showAction: {
    type: Boolean,
    default: true,
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
        <div class="urgent-card__top">
          <span class="urgent-card__badge">{{ order.deadlineLabel }}</span>
          <span v-if="order.helper" class="urgent-card__helper">{{ order.helper }}</span>
        </div>
        <strong class="urgent-card__title">{{ order.title }}</strong>
        <div class="urgent-card__progress">
          <div class="urgent-card__progress-track">
            <div class="urgent-card__progress-fill" :style="{ width: order.progressWidth }"></div>
          </div>
          <span>{{ order.progress }}</span>
        </div>
      </article>
    </div>

    <div v-else class="urgent-panel__empty">
      선택한 필터에 해당하는 긴급 주문이 없습니다.
    </div>

    <button v-if="showAction" type="button" class="urgent-panel__action">작업 매칭으로 이동</button>
  </aside>
</template>

<style scoped>
.urgent-panel {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 14px;
  height: 100%;
  min-height: 0;
  padding: 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 22px;
  background: var(--color-bg-surface);
  align-content: start;
  overflow: hidden;
  box-sizing: border-box;
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
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  overflow-y: auto;
  scrollbar-gutter: stable;
  padding-right: 6px;
}

.urgent-panel__list::-webkit-scrollbar {
  width: 8px;
}

.urgent-panel__list::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: var(--color-primary-200);
}

.urgent-panel__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  height: 100%;
  padding: 18px;
  border: 1px dashed var(--color-border-default);
  border-radius: 16px;
  color: var(--color-text-muted);
  font-size: 14px;
  text-align: center;
}

.urgent-card {
  display: grid;
  align-content: start;
  gap: 6px;
  min-height: 132px;
  padding: 16px 16px 12px;
  border: 2px solid var(--color-border-default);
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
}

.urgent-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
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
  display: block;
  font-size: 16px;
  line-height: 1.4;
  color: var(--color-primary-800);
  white-space: normal;
  word-break: keep-all;
  overflow-wrap: anywhere;
}

.urgent-card__progress {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  font-size: 12px;
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
  line-height: 1.4;
  color: var(--color-text-muted);
}

.urgent-card__helper {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
  text-align: right;
  white-space: nowrap;
  color: var(--color-danger);
  font-weight: 700;
}

.urgent-panel__action {
  margin-top: auto;
  height: 44px;
  border: none;
  border-radius: 10px;
  background: var(--color-primary-600);
  color: var(--color-text-inverse);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
}
</style>
