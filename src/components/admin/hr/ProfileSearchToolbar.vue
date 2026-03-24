<script setup>
import { BaseInput, BaseSelect, BaseButton } from '@/components/common/base'

defineProps({
  searchQuery:  { type: String, default: '' },
  selectedTier: { type: String, default: '전체' },
  selectedLine: { type: String, default: '전체' },
  lines:        { type: Array,  default: () => [] },
})

const emit = defineEmits(['search', 'tierChange', 'lineChange', 'addClick'])

const TIER_OPTIONS = [
  { value: '전체', label: 'Tier 전체' },
  { value: 'S',   label: 'S 티어' },
  { value: 'A',   label: 'A 티어' },
  { value: 'B',   label: 'B 티어' },
  { value: 'C',   label: 'C 티어' },
]
</script>

<template>
  <div class="toolbar">
    <BaseInput
      class="toolbar__search"
      :model-value="searchQuery"
      placeholder="이름 또는 사번 검색..."
      @update:model-value="emit('search', $event)"
    />
    <BaseSelect
      :model-value="selectedTier"
      :options="TIER_OPTIONS"
      @update:model-value="emit('tierChange', $event)"
    />
    <BaseSelect
      :model-value="selectedLine"
      :options="[{ value: '전체', label: '라인 전체' }, ...lines.slice(1).map(l => ({ value: l, label: l }))]"
      @update:model-value="emit('lineChange', $event)"
    />
    <BaseButton variant="primary" size="sm" @click="emit('addClick')">
      + 테크니션 등록
    </BaseButton>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar__search {
  flex: 1;
}

.toolbar :deep(.base-input),
.toolbar :deep(.base-select) {
  height: 37px;
}
</style>
