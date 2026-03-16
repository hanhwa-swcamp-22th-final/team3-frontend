<script setup>
defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
})

function formatCount(count) {
  return `${count}건`
}
</script>

<template>
  <section class="pipeline-board">
    <header class="pipeline-board__header">
      <div>
        <p class="pipeline-board__eyebrow">주문 파이프라인</p>
        <h2 class="pipeline-board__title">주문 진행 상태</h2>
      </div>
    </header>

    <div class="pipeline-board__columns">
      <article
        v-for="column in columns"
        :key="column.key"
        class="pipeline-column"
      >
        <div class="pipeline-column__head">
          <div>
            <strong>{{ column.label }}</strong>
            <span>{{ formatCount(column.items.length) }}</span>
          </div>
          <div class="pipeline-column__line"></div>
        </div>

        <div class="pipeline-column__body">
          <article
            v-for="item in column.items"
            :key="item.id"
            class="pipeline-card"
            :class="`pipeline-card--${item.tone}`"
          >
            <p class="pipeline-card__code">{{ item.orderCode }}</p>
            <strong class="pipeline-card__title">{{ item.title }}</strong>
            <p class="pipeline-card__meta">{{ item.line }}</p>
            <p class="pipeline-card__meta">{{ item.daysLabel }}</p>
          </article>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.pipeline-board {
  display: grid;
  gap: 16px;
  padding: 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 22px;
  background: var(--color-bg-surface);
}

.pipeline-board__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.pipeline-board__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-500);
}

.pipeline-board__title {
  margin-top: 6px;
  font-size: 18px;
  color: var(--color-primary-800);
}

.pipeline-board__caption {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-muted);
}

.pipeline-board__columns {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.pipeline-column {
  display: grid;
  gap: 12px;
  min-width: 0;
}

.pipeline-column__head {
  display: grid;
  gap: 8px;
}

.pipeline-column__head div:first-child {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.pipeline-column__head strong {
  font-size: 14px;
  color: var(--color-primary-700);
}

.pipeline-column__head span {
  font-size: 12px;
  color: var(--color-text-muted);
}

.pipeline-column__line {
  height: 2px;
  border-radius: 999px;
  background: var(--color-primary-200);
}

.pipeline-column__body {
  display: grid;
  gap: 10px;
  max-height: 485px;
  min-height: 260px;
  padding-right: 6px;
  overflow-y: auto;
}

.pipeline-column__body::-webkit-scrollbar {
  width: 8px;
}

.pipeline-column__body::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: var(--color-primary-200);
}

.pipeline-card {
  display: grid;
  gap: 6px;
  padding: 14px 12px;
  border: 2px solid var(--color-border-default);
  border-radius: 16px;
  background: #fff;
}

.pipeline-card__code {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-300);
}

.pipeline-card__title {
  font-size: 16px;
  line-height: 1.35;
  color: var(--color-primary-800);
}

.pipeline-card__meta {
  font-size: 12px;
  color: var(--color-text-muted);
}

.pipeline-card--primary {
  border-color: var(--color-primary-200);
}

.pipeline-card--warning {
  border-color: #ffd166;
}

.pipeline-card--danger {
  border-color: #ff8aa4;
}

.pipeline-card--success {
  border-color: var(--color-mint-200);
}

@media (max-width: 1280px) {
  .pipeline-board__columns {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .pipeline-board__columns {
    grid-template-columns: 1fr;
  }
}
</style>
