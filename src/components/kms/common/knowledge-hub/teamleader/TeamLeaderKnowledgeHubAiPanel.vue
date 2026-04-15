<script setup>
defineProps({
  recommendations: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['open-detail'])
</script>

<template>
  <section class="ai-panel">
    <div class="ai-panel__head">
      <p class="ai-panel__eyebrow">추천 학습</p>
    </div>

    <div class="ai-panel__list">
      <article v-for="item in recommendations" :key="item.id" class="ai-panel__item">
        <div>
          <strong>{{ item.title }}</strong>
        </div>
        <button
          type="button"
          class="ai-panel__action"
          @click="emit('open-detail', item)"
        >
          →
        </button>
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
  z-index: 3;
}

.ai-panel__head {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.ai-panel__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.72);
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

.ai-panel__action {
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.78);
  font-size: 15px;
  cursor: pointer;
  transition: transform 0.2s ease, color 0.2s ease;
}

.ai-panel__action:hover {
  color: #fff;
  transform: translateX(2px);
}
</style>
