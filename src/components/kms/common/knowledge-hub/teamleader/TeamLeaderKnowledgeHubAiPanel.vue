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
      <button
        v-for="item in recommendations"
        :key="item.id"
        type="button"
        class="ai-panel__item"
        @click="emit('open-detail', item)"
      >
        <div>
          <strong>{{ item.title }}</strong>
        </div>
      </button>
    </div>
  </section>
</template>

<style scoped>
.ai-panel {
  position: relative;
  border-radius: 18px;
  background: linear-gradient(180deg, #34227e 0%, #28195f 100%);
  padding: 20px;
  display: grid;
  gap: 0;
  z-index: 3;
}

.ai-panel__head {
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
}

.ai-panel__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.72);
}

.ai-panel__list {
  display: grid;
  gap: 10px;
  margin-top: 8px;
}

.ai-panel__item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 14px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.04);
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.ai-panel__item strong {
  color: #fff;
}

.ai-panel__item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.28);
  transform: translateY(-1px);
}
</style>
