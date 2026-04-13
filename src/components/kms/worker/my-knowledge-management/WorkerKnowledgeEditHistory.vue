<script setup>
const emit = defineEmits(['open-detail'])

defineProps({
  history: { type: Array, required: true },
})
</script>

<template>
  <div class="keh">
    <span class="keh__subtitle">최근 작업</span>
    <h3 class="keh__title">최근 수정 문서</h3>

    <div class="keh__list">
      <button
        v-for="item in history"
        :key="item.id"
        type="button"
        class="keh__item"
        @click="emit('open-detail', item)"
      >
        <span class="keh__item-label">문서 제목</span>
        <span class="keh__item-title">{{ item.title }}</span>
        <span class="keh__item-meta">
          {{ item.date }} · {{ item.status }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.keh {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.keh__subtitle {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary-700);
}

.keh__title {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text-strong);
  margin: 0;
}

.keh__list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.keh__item {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-left: 3px solid var(--color-primary-300);
  border-radius: var(--radius-base);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  cursor: pointer;
  transition: border-color 0.15s;
  text-align: left;
}

.keh__item:hover {
  border-color: var(--color-primary-300);
}

.keh__item-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-strong);
  line-height: 1.5;
}

.keh__item-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-placeholder);
  letter-spacing: 0.03em;
}

.keh__item-meta {
  font-size: 12px;
  color: var(--color-text-muted);
}

@media (max-width: 1100px) {
  .keh__list {
    grid-template-columns: 1fr;
  }
}
</style>
