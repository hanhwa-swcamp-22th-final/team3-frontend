<script setup>
defineProps({
  presets:    { type: Array,  required: true },
  selectedId: { type: Number, default: null },
  activeId:   { type: Number, default: null },
})
const emit = defineEmits(['select'])
</script>

<template>
  <div class="preset-list-panel">
    <div class="panel-title">🏭 산업군 선택</div>

    <div class="preset-items">
      <div
        v-for="preset in presets"
        :key="preset.id"
        class="preset-item"
        :class="{ 'preset-item--active': preset.id === selectedId }"
        @click="emit('select', preset)"
      >
        <div class="preset-icon">{{ preset.icon }}</div>
        <div class="preset-info">
          <div class="preset-name">
            {{ preset.name }}
            <span v-if="preset.id === activeId" class="badge-applied">적용중</span>
          </div>
          <div class="preset-desc">{{ preset.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 적용 전/후 비교 -->
    <div class="compare-box">
      <div class="compare-title">적용 전/후 비교</div>
      <div class="compare-cols">
        <div class="compare-col">
          <div class="compare-col-header">현재</div>
          <div class="compare-values">
            <span>E_exp 120개</span>
            <span>복잡도 0.30</span>
            <span>숙련 A-Tier</span>
          </div>
        </div>
        <div class="compare-col">
          <div class="compare-col-header" style="color: var(--color-primary-600, #5B4FCF)">정밀기계</div>
          <div class="compare-values">
            <span>120개 ✓</span>
            <span>0.32 ↑</span>
            <span>A-Tier ✓</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preset-list-panel {
  display: flex;
  flex-direction: column;
  width: 384px;
  flex-shrink: 0;
  background: #fff;
  border: 1.5px solid var(--color-border-default, #E0DCFF);
  border-radius: 12px;
  padding: 21px;
  gap: 12px;
  overflow-y: auto;
}

.panel-title {
  font-size: 12px;
  font-weight: 900;
  color: #7A6FA8;
  flex-shrink: 0;
}

.preset-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.preset-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  height: 66px;
  background: #FAFBFF;
  border: 1.5px solid var(--color-border-default, #E0DCFF);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.preset-item:hover {
  background: #F0EEFF;
  border-color: var(--color-primary-600, #5B4FCF);
}

.preset-item--active {
  background: #F0EEFF;
  border: 1.5px solid var(--color-primary-600, #5B4FCF);
}

.preset-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: inherit;
  border-radius: 6px;
  font-size: 16px;
  flex-shrink: 0;
}

.preset-item--active .preset-icon {
  background: #F0EEFF;
}

.preset-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.preset-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #2D1F6E;
}

.badge-applied {
  padding: 2px 8px;
  background: #E3FBEF;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  color: #007A60;
}

.preset-desc {
  font-size: 10px;
  color: #A89ED8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 비교 박스 */
.compare-box {
  background: #FAFBFF;
  border: 1.5px solid var(--color-border-default, #E0DCFF);
  border-radius: 8px;
  padding: 13px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.compare-title {
  font-size: 10px;
  font-weight: 700;
  color: #A89ED8;
}

.compare-cols {
  display: flex;
  gap: 0;
}

.compare-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.compare-col-header {
  font-size: 10px;
  color: #A89ED8;
  margin-bottom: 4px;
}

.compare-values {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.compare-values span {
  font-size: 10px;
  color: #7A6FA8;
  line-height: 17px;
}
</style>
