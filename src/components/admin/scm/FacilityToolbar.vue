<script setup>
import { ref } from 'vue'
import { BaseInput, BaseSelect, BaseButton } from '@/components/common/base'
import { LINE_OPTIONS } from '@/mocks/admin/facility/facilityData.js'

const props = defineProps({
  searchQuery:  { type: String, default: '' },
  selectedLine: { type: String, default: '전체' },
})

const emit = defineEmits(['search', 'lineChange', 'addClick'])

const localSearch = ref(props.searchQuery)

const onSearch  = ()  => { emit('search', localSearch.value) }
const onKeydown = (e) => { if (e.key === 'Enter') onSearch() }

const lineOptions = LINE_OPTIONS.map(l => ({ value: l, label: l === '전체' ? '라인 전체' : l }))
</script>

<template>
  <div class="toolbar">
    <BaseInput
      class="toolbar__search"
      v-model="localSearch"
      placeholder="설비명, 설비ID 검색"
      @keydown="onKeydown"
      @blur="onSearch"
    />
    <BaseSelect
      :model-value="selectedLine"
      :options="lineOptions"
      @update:model-value="emit('lineChange', $event)"
    />
    <BaseButton variant="primary" size="sm" @click="emit('addClick')">
      + 설비 등록
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

.toolbar__search {
  flex: 1;
}

.toolbar :deep(.base-input),
.toolbar :deep(.base-select) {
  height: 36px;
}
</style>
