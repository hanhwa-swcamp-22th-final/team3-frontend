<script setup>
import { ref, watch } from 'vue'
import { BaseInput, BaseSelect, BaseButton } from '@/components/common/base'

const props = defineProps({
  searchQuery: { type: String, default: '' },
  selectedLine: { type: String, default: 'ALL' },
  lineOptions: {
    type: Array,
    default: () => [{ value: 'ALL', label: '라인 전체' }],
  },
})

const emit = defineEmits(['search', 'lineChange', 'addClick', 'manageLineProcessClick'])

const localSearch = ref(props.searchQuery)

watch(
  () => props.searchQuery,
  (value) => {
    localSearch.value = value
  }
)

function onSearch() {
  emit('search', localSearch.value)
}

function onKeydown(event) {
  if (event.key === 'Enter') onSearch()
}
</script>

<template>
  <div class="toolbar">
    <BaseInput
      v-model="localSearch"
      class="toolbar__input"
      placeholder="설비명, 설비 Code 검색"
      @keydown="onKeydown"
      @blur="onSearch"
    />
    <BaseSelect
      class="toolbar__select"
      :model-value="selectedLine"
      :options="lineOptions"
      @update:model-value="emit('lineChange', $event)"
    />
    <BaseButton variant="primary" size="sm" @click="emit('addClick')">
      + 설비 등록
    </BaseButton>
    <BaseButton variant="ghost" size="sm" @click="emit('manageLineProcessClick')">
      라인/공정/환경 설정
    </BaseButton>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  flex-shrink: 0;
}

.toolbar__input {
  flex: 8;
}

.toolbar__select {
  flex: 2;
}

.toolbar :deep(.base-button) {
  flex-shrink: 0;
}

.toolbar :deep(.base-input),
.toolbar :deep(.base-select) {
  height: 36px;
}
</style>
