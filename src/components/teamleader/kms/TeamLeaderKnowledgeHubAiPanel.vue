<script setup>
defineProps({
  recommendations: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="ai-panel">
    <div class="ai-panel__head">
      <p class="ai-panel__eyebrow">추천 학습</p>
      <h3>AI 추천 학습</h3>
    </div>

    <div class="ai-panel__list">
      <article v-for="item in recommendations" :key="item.id" class="ai-panel__item">
        <div>
          <strong>{{ item.title }}</strong>
          <p>{{ item.subtitle }}</p>
        </div>
        <span>→</span>
      </article>
    </div>
  </section>
</template>

<style scoped>
.ai-panel {
  border-radius: 18px;
  background: linear-gradient(180deg, #34227e 0%, #28195f 100%);
  padding: 20px;
  display: grid;
  gap: 14px;
}

.ai-panel__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.72);
}

.ai-panel__head h3 {
  margin-top: 6px;
  font-size: 20px;
  color: #fff;
}

.ai-panel__list {
  display: grid;
  gap: 10px;
}

.ai-panel__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 14px;
  padding: 14px 16px;
}

.ai-panel__item strong {
  color: #fff;
}

.ai-panel__item p {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.68);
}

.ai-panel__item span {
  color: rgba(255, 255, 255, 0.78);
  font-size: 18px;
}
</style>
