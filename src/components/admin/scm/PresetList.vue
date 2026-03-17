<script setup>
import { COMPARE_DATA } from '@/mocks/admin/preset/presetData.js'

defineProps({
  presets:      { type: Array,  default: () => [] },
  selectedId:   { type: String, default: '' },
  activePreset: { type: Object, default: null },
})

const emit = defineEmits(['select'])
</script>

<template>
  <div class="preset-list">

    <!-- 섹션 타이틀 -->
    <span class="section-title">🏭 산업군 선택</span>

    <!-- 산업군 목록 -->
    <div
      v-for="p in presets"
      :key="p.id"
      class="preset-item"
      :class="{ 'preset-item--active': p.id === selectedId }"
      @click="emit('select', p.id)"
    >
      <div class="item-icon" :class="{ 'item-icon--active': p.id === selectedId }">
        {{ p.icon }}
      </div>
      <div class="item-info">
        <span class="item-name">{{ p.name }}<template v-if="p.nameEn"> ({{ p.nameEn }})</template></span>
        <span class="item-desc">{{ p.desc }}</span>
      </div>
      <span v-if="p.active" class="badge-active">적용중</span>
    </div>

    <!-- 비교 박스 -->
    <div class="compare-box">
      <span class="compare-title">적용 전/후 비교</span>
      <div class="compare-grid">
        <div class="compare-col">
          <span class="compare-col-label">현재</span>
          <span v-for="row in COMPARE_DATA.current" :key="row.label" class="compare-row">
            {{ row.label }} {{ row.value }}
          </span>
        </div>
        <div class="compare-col">
          <span class="compare-col-label" style="color: var(--color-primary-600);">
            {{ activePreset?.name ?? '—' }}
          </span>
          <span v-for="row in COMPARE_DATA.preset" :key="row.value" class="compare-row">
            {{ row.value }}
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.preset-list {
  width: 384px;
  flex-shrink: 0;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 12px;
  padding: 21px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  box-sizing: border-box;
}

/* 섹션 타이틀 */
.section-title {
  font-size: 12px;
  font-weight: 900;
  color: #7a6fa8;
  margin-bottom: 4px;
  flex-shrink: 0;
}

/* 산업군 아이템 */
.preset-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  height: 66px;
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px;
  cursor: pointer;
  flex-shrink: 0;
  box-sizing: border-box;
}

.preset-item--active {
  background: var(--color-primary-100);
  border-color: var(--color-primary-600);
}

.preset-item:not(.preset-item--active):hover {
  background: #f5f3ff;
}

/* 아이콘 박스 */
.item-icon {
  width: 36px;
  height: 36px;
  background: var(--color-bg-app);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.item-icon--active {
  background: var(--color-primary-100);
}

/* 텍스트 */
.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-800);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-desc {
  font-size: 10px;
  color: #a89ed8;
}

/* 적용중 배지 */
.badge-active {
  font-size: 10px;
  font-weight: 700;
  color: #007a60;
  background: #e3fbef;
  border-radius: 4px;
  padding: 3px 8px;
  flex-shrink: 0;
}

/* 비교 박스 */
.compare-box {
  margin-top: 4px;
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-border-default);
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
  color: #a89ed8;
}

.compare-grid {
  display: flex;
  flex-direction: row;
  gap: 0;
}

.compare-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.compare-col-label {
  font-size: 10px;
  color: #a89ed8;
  margin-bottom: 2px;
}

.compare-row {
  font-size: 10px;
  color: #7a6fa8;
  line-height: 17px;
}
</style>
