<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:items'])

const total = computed(() => props.items.reduce((sum, item) => sum + item.weight, 0))

function updateWeight(index, value) {
  const updated = props.items.map((item, i) =>
    i === index ? { ...item, weight: Number(value) } : item
  )
  emit('update:items', updated)
}
</script>

<template>
  <article class="eval-quant-card">
    <p class="eval-quant-card__title">📊 정량 평가 세부 항목</p>
    <p class="eval-quant-card__subtitle">설비 보정 가중치</p>

    <div class="eval-quant-card__list">
      <div
        v-for="(item, index) in items"
        :key="item.key"
        class="eval-quant-card__item"
      >
        <div class="eval-quant-card__item-row">
          <span class="eval-quant-card__label">{{ item.label }}</span>
          <div class="eval-quant-card__input-wrap">
            <input
              type="number" min="0" max="100"
              :value="item.weight"
              @input="updateWeight(index, $event.target.value)"
              class="eval-quant-card__input"
            />
            <span class="eval-quant-card__unit">%</span>
          </div>
        </div>
        <input
          type="range"
          min="0" max="100" step="5"
          :value="item.weight"
          @input="updateWeight(index, $event.target.value)"
          class="eval-slider"
        />
      </div>
    </div>

    <p class="eval-quant-card__total" :class="{ 'eval-quant-card__total--error': total !== 100 }">
      합계: {{ total }}%
    </p>
  </article>
</template>

<style scoped>
.eval-quant-card {
  padding: 24px;
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.eval-quant-card__title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-500);
}
.eval-quant-card__subtitle {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: -8px;
}
.eval-quant-card__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.eval-quant-card__item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.eval-quant-card__item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.eval-quant-card__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary-800);
}
.eval-quant-card__input-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}
.eval-quant-card__input {
  width: 44px;
  padding: 3px 6px;
  border: 1px solid var(--color-border-default);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  color: var(--color-primary-800);
  background: var(--color-bg-app);
}
.eval-quant-card__unit {
  font-size: 12px;
  color: var(--color-text-muted);
}
.eval-slider {
  width: 100%;
  accent-color: var(--color-primary-500);
  cursor: pointer;
}
.eval-quant-card__total {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-600);
  text-align: right;
}
.eval-quant-card__total--error {
  color: var(--color-danger);
}
</style>
