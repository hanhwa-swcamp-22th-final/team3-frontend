<script setup>
import { ref } from 'vue'

defineProps({
  recommendations: {
    type: Array,
    default: () => [],
  },
})

const isCollapsed = ref(true)
</script>

<template>
  <section class="ai-panel">
    <button type="button" class="ai-panel__head" @click="isCollapsed = !isCollapsed">
      <p class="ai-panel__eyebrow">추천 학습</p>
      <span class="ai-panel__toggle" :class="{ 'ai-panel__toggle--collapsed': isCollapsed }">v</span>
    </button>

    <div v-if="!isCollapsed" class="ai-panel__list">
      <article v-for="item in recommendations" :key="item.id" class="ai-panel__item">
        <div>
          <strong>{{ item.title }}</strong>
        </div>
        <span>→</span>
      </article>
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
  justify-content: space-between;
  gap: 12px;
  padding: 0;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.ai-panel__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.72);
}

.ai-panel__toggle {
  color: rgba(255, 255, 255, 0.78);
  font-size: 16px;
  line-height: 1;
  transition: transform 0.2s ease;
}

.ai-panel__toggle--collapsed {
  transform: rotate(-90deg);
}

.ai-panel__list {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(100% + 10px);
  display: grid;
  gap: 10px;
  padding: 16px;
  border-radius: 18px;
  background: linear-gradient(180deg, #34227e 0%, #28195f 100%);
  box-shadow: 0 18px 36px rgba(20, 10, 56, 0.28);
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

.ai-panel__item span {
  color: rgba(255, 255, 255, 0.78);
  font-size: 15px;
}
</style>
