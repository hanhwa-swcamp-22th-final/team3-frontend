<script setup>
import { ref } from 'vue'
import { BaseInput, BaseSelect } from '@/components/common/base'

const props = defineProps({
  searchQuery:      { type: String, default: '' },
  selectedCategory: { type: String, default: 'ALL' },
})

const emit = defineEmits(['search', 'categoryChange'])

const localSearch = ref(props.searchQuery)

const onKeydown = (e) => { if (e.key === 'Enter') emit('search', localSearch.value) }
const onBlur    = ()  => emit('search', localSearch.value)

const categoryOptions = [
  { value: 'ALL',                  label: '전체 카테고리' },
  { value: 'TECHNICAL_COMPETENCE', label: '기술역량' },
  { value: 'LEADERSHIP',          label: '리더십' },
  { value: 'SAFETY',              label: '안전' },
  { value: 'INNOVATION',          label: '혁신' },
  { value: 'COLLABORATION',       label: '협업' },
  { value: 'OTHERS',               label: '기타' },
]
</script>

<template>
  <div class="keyword-toolbar">
    <BaseInput
      class="toolbar__search"
      v-model="localSearch"
      placeholder="키워드 검색..."
      @keydown="onKeydown"
      @blur="onBlur"
    />
    <BaseSelect
      class="toolbar__category"
      :model-value="selectedCategory"
      :options="categoryOptions"
      @update:model-value="emit('categoryChange', $event)"
    />
  </div>
</template>

<style scoped>
.keyword-toolbar {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.toolbar__search {
  width: 280px;
  flex-shrink: 0;
}

.toolbar__category {
  width: 160px;
  flex-shrink: 0;
}

.keyword-toolbar :deep(.base-input),
.keyword-toolbar :deep(.base-select) {
  height: 36px;
}
</style>
