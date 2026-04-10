<script setup>
defineProps({
  presets:    { type: Array,            default: () => [] },
  selectedId: { type: [Number, String], default: null },
})

const emit = defineEmits(['select', 'create'])
</script>

<template>
  <div class="preset-list">

    <!-- 섹션 타이틀 -->
    <span class="section-title">산업군 프리셋 목록</span>

    <!-- 산업군 목록 -->
    <div
      v-for="p in presets"
      :key="p.configId"
      class="preset-item"
      :class="{ 'preset-item--active': p.configId === selectedId }"
      @click="emit('select', p.configId)"
    >
      <div class="item-info">
        <span class="item-name">{{ p.industryPresetName }}</span>
        <span class="item-desc">적용일: {{ p.effectiveDate ?? '—' }}</span>
      </div>
    </div>

    <!-- 새 프리셋 추가 버튼 -->
    <button class="btn-add" @click="emit('create')">+ 새 프리셋 추가</button>

  </div>
</template>

<style scoped>
.preset-list {
  width: 384px;
  flex-shrink: 0;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: var(--radius-base);
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
  color: var(--color-text-secondary);
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
  border-radius: var(--radius-xs);
  cursor: pointer;
  flex-shrink: 0;
  box-sizing: border-box;
}

.preset-item--active {
  background: var(--color-primary-100);
  border-color: var(--color-primary-600);
}

.preset-item:not(.preset-item--active):hover {
  background: var(--color-primary-50);
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
  color: var(--color-text-placeholder);
}

/* 추가 버튼 */
.btn-add {
  margin-top: auto;
  height: 42px;
  background: var(--color-bg-app);
  border: 1.5px dashed var(--color-border-default);
  border-radius: var(--radius-xs);
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-secondary);
  cursor: pointer;
  flex-shrink: 0;
}

.btn-add:hover {
  background: var(--color-primary-50);
  border-color: var(--color-primary-600);
  color: var(--color-primary-600);
}
</style>
