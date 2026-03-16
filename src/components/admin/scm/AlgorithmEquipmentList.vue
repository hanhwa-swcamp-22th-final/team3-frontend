<script setup>
const props = defineProps({
  equipments:      { type: Array,  required: true },
  selectedId:      { type: Number, default: null },
  globalThreshold: { type: Number, default: 0.80 },
  isLoading:       { type: Boolean, default: false },
})
const emit = defineEmits(['select', 'thresholdChange'])

const oeeColor = (val) => {
  if (val >= 95) return '#00BF95'
  if (val >= 85) return '#5B4FCF'
  if (val >= 70) return '#FFD166'
  return '#EF476F'
}
</script>

<template>
  <div class="equip-list">
    <!-- 전역 임계값 -->
    <div class="threshold-bar">
      <span class="threshold-label">E_idx 임계값 (전체)</span>
      <div class="threshold-input-wrap">
        <input
          type="number"
          :value="globalThreshold"
          step="0.01" min="0" max="1"
          class="threshold-input"
          @input="emit('thresholdChange', parseFloat($event.target.value))"
        />
      </div>
    </div>

    <!-- 헤더 -->
    <div class="list-header">
      <span class="col-name">설비</span>
      <span class="col-stat">가동률</span>
      <span class="col-stat">품질률</span>
      <span class="col-stat">성능률</span>
    </div>

    <!-- 목록 -->
    <div v-if="isLoading" class="loading">불러오는 중...</div>
    <div v-else class="list-body">
      <div
        v-for="eq in equipments"
        :key="eq.id"
        class="equip-row"
        :class="{ 'equip-row--active': eq.id === selectedId }"
        @click="emit('select', eq)"
      >
        <div class="col-name">
          <span class="eq-code">{{ eq.code }}</span>
          <span class="eq-name">{{ eq.name }}</span>
        </div>
        <span class="col-stat" :style="{ color: oeeColor(eq.availability) }">
          {{ eq.availability }}%
        </span>
        <span class="col-stat" :style="{ color: oeeColor(eq.quality_rate) }">
          {{ eq.quality_rate }}%
        </span>
        <span class="col-stat" :style="{ color: oeeColor(eq.performance_rate) }">
          {{ eq.performance_rate }}%
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.equip-list {
  display: flex;
  flex-direction: column;
  width: 320px;
  flex-shrink: 0;
  background: #fff;
  border: 1.5px solid var(--color-border-default, #E0DCFF);
  border-radius: 12px;
  overflow: hidden;
}

.threshold-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1.5px solid var(--color-border-default, #E0DCFF);
  background: #FAFBFF;
}

.threshold-label {
  font-size: 11px;
  font-weight: 700;
  color: #7A6FA8;
}

.threshold-input-wrap {
  display: flex;
  align-items: center;
}

.threshold-input {
  width: 70px;
  height: 28px;
  padding: 0 8px;
  border: 1.5px solid var(--color-primary-600, #5B4FCF);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-600, #5B4FCF);
  text-align: center;
  background: #fff;
}

.list-header {
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 32px;
  border-bottom: 1.5px solid var(--color-border-soft, #EEEBFF);
  background: #fff;
}

.col-name {
  flex: 1;
  font-size: 10px;
  font-weight: 700;
  color: #A89ED8;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.col-stat {
  width: 60px;
  text-align: right;
  font-size: 10px;
  font-weight: 700;
  color: #A89ED8;
  text-transform: uppercase;
}

.list-body {
  flex: 1;
  overflow-y: auto;
}

.equip-row {
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 56px;
  border-bottom: 1.5px solid var(--color-border-soft, #EEEBFF);
  cursor: pointer;
  transition: background 0.15s;
}

.equip-row:hover {
  background: #FAFBFF;
}

.equip-row--active {
  background: #F0EEFF;
  border-left: 3px solid var(--color-primary-600, #5B4FCF);
}

.eq-code {
  font-size: 10px;
  font-weight: 700;
  color: var(--color-primary-600, #5B4FCF);
  font-family: 'JetBrains Mono', monospace;
}

.eq-name {
  font-size: 12px;
  font-weight: 400;
  color: #2D1F6E;
}

.equip-row .col-stat {
  font-size: 11px;
  font-weight: 700;
}

.loading {
  padding: 20px;
  text-align: center;
  font-size: 12px;
  color: #A89ED8;
}
</style>
