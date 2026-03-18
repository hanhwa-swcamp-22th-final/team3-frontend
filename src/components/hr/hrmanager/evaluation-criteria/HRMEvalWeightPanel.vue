<script setup>
import { computed } from 'vue'

const props = defineProps({
  quantWeight: { type: Number, default: 60 },
})

const emit = defineEmits(['update:quantWeight'])

const qualWeight = computed(() => 100 - props.quantWeight)
</script>

<template>
  <article class="eval-weight-card">
    <p class="eval-weight-card__title">⚖ 정량 / 정성 평가 비중</p>

    <div class="eval-weight-card__bar">
      <div class="eval-weight-card__bar-quant" :style="{ width: quantWeight + '%' }" />
      <div class="eval-weight-card__bar-qual"  :style="{ width: qualWeight + '%' }" />
    </div>
    <div class="eval-weight-card__bar-labels">
      <span class="eval-weight-card__bar-label--quant">정량 {{ quantWeight }}%</span>
      <span class="eval-weight-card__bar-label--qual">정성 {{ qualWeight }}%</span>
    </div>

    <div class="eval-weight-card__item">
      <div class="eval-weight-card__item-row">
        <span class="eval-weight-card__item-label">정량 평가</span>
        <span class="eval-weight-card__item-value">{{ quantWeight }}%</span>
      </div>
      <input
        type="range"
        min="10" max="90" step="5"
        :value="quantWeight"
        @input="emit('update:quantWeight', Number($event.target.value))"
        class="eval-slider eval-slider--quant"
      />
    </div>

    <div class="eval-weight-card__item">
      <div class="eval-weight-card__item-row">
        <span class="eval-weight-card__item-label">정성 평가 (AI)</span>
        <span class="eval-weight-card__item-value">{{ qualWeight }}%</span>
      </div>
      <div class="eval-weight-card__track">
        <div class="eval-weight-card__track-fill" :style="{ width: qualWeight + '%' }" />
      </div>
    </div>

    <p class="eval-weight-card__total">합계: 100%</p>
  </article>
</template>

<style scoped>
.eval-weight-card {
  padding: 24px;
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.eval-weight-card__title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-500);
}
.eval-weight-card__bar {
  display: flex;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
}
.eval-weight-card__bar-quant {
  background: var(--color-primary-500);
  transition: width 0.2s;
}
.eval-weight-card__bar-qual {
  background: var(--color-mint-500);
  transition: width 0.2s;
}
.eval-weight-card__bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 700;
  margin-top: -12px;
}
.eval-weight-card__bar-label--quant { color: var(--color-primary-600); }
.eval-weight-card__bar-label--qual  { color: var(--color-mint-500); }

.eval-weight-card__item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.eval-weight-card__item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.eval-weight-card__item-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary-800);
}
.eval-weight-card__item-value {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-600);
}
.eval-slider {
  width: 100%;
  accent-color: var(--color-primary-500);
  cursor: pointer;
}
.eval-weight-card__track {
  height: 6px;
  background: var(--color-border-default);
  border-radius: 3px;
  overflow: hidden;
}
.eval-weight-card__track-fill {
  height: 100%;
  background: var(--color-mint-500);
  transition: width 0.2s;
}
.eval-weight-card__total {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-600);
  text-align: right;
}
</style>
