<script setup>
defineProps({
  recommendations: { type: Array, required: true },
})
</script>

<template>
  <div class="ai">
    <span class="ai__label">🤖 AI 추천 학습</span>
    <div class="ai__list">
      <div v-for="item in recommendations" :key="item.id" class="ai__item">
        <span class="ai__item-title">{{ item.title }}</span>
        <span class="ai__item-arrow">→</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai {
  background: var(--color-primary-800);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ai__label {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
}

.ai__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ai__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.15s;
}

.ai__item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.ai__item-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.ai__item-arrow {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
