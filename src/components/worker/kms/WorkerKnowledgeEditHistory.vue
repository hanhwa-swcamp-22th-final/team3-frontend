<script setup>
defineProps({
  history: { type: Array, required: true },
})
</script>

<template>
  <div class="keh">
    <span class="keh__subtitle">최근 작업</span>
    <h3 class="keh__title">최근 수정 문서</h3>

    <div class="keh__list">
      <div v-for="item in history" :key="item.id" class="keh__item">
        <span class="keh__item-title">{{ item.title }}</span>
        <span class="keh__item-meta">
          {{ item.date }} · {{ item.status }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.keh {
  background: #ffffff;
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
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
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.keh__item {
  background: #ffffff;
  border: 1px solid var(--color-border-default);
  border-left: 3px solid var(--color-primary-300);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.keh__item:hover {
  border-color: var(--color-primary-300);
}

.keh__item-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-strong);
}

.keh__item-meta {
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>
