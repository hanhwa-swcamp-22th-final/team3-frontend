<script setup>
import { computed } from 'vue'

const props = defineProps({
  equipments:        { type: Array,  default: () => [] },
  selectedId:        { type: Number, default: null },
  globalThreshold:   { type: Number, default: 0.80 },
  isLoading:         { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'thresholdChange'])

const calcEIdx = (eq) =>
  (eq.availability / 100) * (eq.quality_rate / 100) * (eq.performance_rate / 100)

const dotColor = (eq) => {
  const v = calcEIdx(eq)
  if (v >= 0.95) return '#00BF95'
  if (v >= props.globalThreshold) return '#FFD166'
  return '#EF476F'
}
</script>

<template>
  <div class="section">
    <div class="section-title">🏭 설비별 E_idx 현황</div>

    <div v-if="isLoading" class="empty">불러오는 중...</div>

    <template v-else>
      <div
        v-for="eq in equipments"
        :key="eq.id"
        class="equip-row"
        :class="{ 'equip-row--active': eq.id === selectedId }"
        @click="emit('select', eq)"
      >
        <div class="equip-row__info">
          <span class="equip-row__code">{{ eq.code }}</span>
          <span class="equip-row__name">{{ eq.name }}</span>
        </div>
        <div class="equip-row__right">
          <span class="equip-row__eidx">{{ calcEIdx(eq).toFixed(2) }}</span>
          <span class="equip-row__dot" :style="{ backgroundColor: dotColor(eq) }"></span>
        </div>
      </div>

      <!-- 일괄 임계값 -->
      <div class="threshold-box">
        <div class="threshold-box__top">
          <span class="threshold-box__label">일괄 E_idx 임계값</span>
          <span class="threshold-box__value">{{ globalThreshold.toFixed(2) }}</span>
        </div>
        <input
          class="threshold-box__slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          :value="globalThreshold"
          @input="emit('thresholdChange', parseFloat($event.target.value))"
        />
        <span class="threshold-box__hint">이하 시 자동 경고 발송 · 설비 색상이 실시간 반영됩니다</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.section {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 380px;
  flex-shrink: 0;
  overflow-y: auto;
}

.section-title {
  font-size: 12px;
  font-weight: 900;
  color: var(--color-primary-300);
  margin-bottom: 4px;
}

.empty {
  padding: 40px 0;
  text-align: center;
  font-size: 13px;
  color: var(--color-primary-300);
}

/* 설비 행 */
.equip-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 14px;
  height: 60px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-2xs);
  background: var(--color-bg-app);
  cursor: pointer;
  flex-shrink: 0;
}

.equip-row--active {
  background: var(--color-primary-100);
  border-color: var(--color-primary-600);
}

.equip-row__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.equip-row__code {
  font-family: var(--font-family-mono);
  font-size: 16px;
  font-weight: 700;
  color: var(--color-primary-600);
}

.equip-row__name {
  font-size: 11px;
  color: var(--color-primary-300);
}

.equip-row__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.equip-row__eidx {
  font-family: var(--font-family-mono);
  font-size: 16px;
  font-weight: 700;
  color: var(--color-primary-800);
}

.equip-row__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* 임계값 박스 */
.threshold-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-2xs);
  background: var(--color-bg-app);
  margin-top: 4px;
  flex-shrink: 0;
}

.threshold-box__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.threshold-box__label {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-primary-600);
}

.threshold-box__value {
  font-family: var(--font-family-mono);
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-600);
}

.threshold-box__slider {
  width: 100%;
  height: 4px;
  accent-color: var(--color-primary-600);
  cursor: pointer;
}

.threshold-box__hint {
  font-size: 10px;
  color: var(--color-primary-300);
  opacity: 0.7;
}
</style>
