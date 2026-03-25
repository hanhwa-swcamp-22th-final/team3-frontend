<script setup>
import { ref } from 'vue'
import { BaseInput, BaseSelect } from '@/components/common/base'
import { CATEGORY_OPTIONS } from '@/mocks/admin/keyword/keywordData.js'

const props = defineProps({
  searchQuery:      { type: String, default: '' },
  selectedCategory: { type: String, default: '전체 카테고리' },
})

const emit = defineEmits(['search', 'categoryChange'])

const localSearch = ref(props.searchQuery)

const onKeydown = (e) => { if (e.key === 'Enter') emit('search', localSearch.value) }
const onBlur    = ()  => emit('search', localSearch.value)

const categoryOptions = CATEGORY_OPTIONS.map(c => ({ value: c, label: c }))
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
