<script setup>
defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['item-action'])

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
          <template v-if="column.items.length">
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
              <button
                v-if="item.actionLabel"
                type="button"
                class="pipeline-card__action"
                :disabled="item.actionDisabled"
                @click="emit('item-action', item)"
              >
                {{ item.actionLabel }}
              </button>
            </article>
          </template>

          <div v-else class="pipeline-column__empty">
            해당 상태의 주문이 없습니다.
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.pipeline-board {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 16px;
  height: 100%;
  min-height: 0;
  padding: 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 22px;
  background: var(--color-bg-surface);
  align-content: start;
  overflow: hidden;
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

.pipeline-board__columns {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.pipeline-column {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 12px;
  min-width: 0;
  min-height: 0;
}

.pipeline-column__head {
  display: grid;
  gap: 8px;
  min-height: 44px;
  padding-right: 14px;
  align-content: start;
}

.pipeline-column__head div:first-child {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 20px;
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
  grid-auto-rows: 156px;
  align-content: start;
  gap: 10px;
  min-height: 0;
  padding-right: 6px;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.pipeline-column__body::-webkit-scrollbar { width: 8px; }
.pipeline-column__body::-webkit-scrollbar-thumb { border-radius: 999px; background: var(--color-primary-200); }

.pipeline-column__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 132px;
  padding: 16px;
  border: 1px dashed var(--color-border-default);
  border-radius: 16px;
  background: var(--color-bg-surface-muted);
  color: var(--color-text-muted);
  font-size: 13px;
  text-align: center;
}

.pipeline-card {
  display: grid;
  align-content: start;
  gap: 6px;
  min-height: 156px;
  padding: 14px 12px;
  border: 2px solid var(--color-border-default);
  border-radius: 16px;
  background: #fff;
  overflow: hidden;
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

.pipeline-card__action {
  margin-top: auto;
  height: 34px;
  border: none;
  border-radius: 10px;
  background: var(--color-primary-600);
  color: var(--color-text-inverse);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.pipeline-card__action:disabled {
  background: var(--color-border-default);
  color: var(--color-text-muted);
  cursor: not-allowed;
}

.pipeline-card--primary { border-color: var(--color-primary-200); }
.pipeline-card--warning { border-color: #ffd166; }
.pipeline-card--danger { border-color: #ff8aa4; }
.pipeline-card--success { border-color: var(--color-mint-200); }

@media (max-width: 1280px) {
  .pipeline-board__columns { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 720px) {
  .pipeline-board__columns { grid-template-columns: 1fr; }
}
</style>
