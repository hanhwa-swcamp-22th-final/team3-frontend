<script setup>
import { ref } from 'vue'
import { CATEGORY_OPTIONS } from '@/mocks/admin/keyword/keywordData.js'

const props = defineProps({
  searchQuery:      { type: String, default: '' },
  selectedCategory: { type: String, default: '전체 카테고리' },
})

const emit = defineEmits(['search', 'categoryChange'])

const localSearch = ref(props.searchQuery)

const onKeydown = (e) => { if (e.key === 'Enter') emit('search', localSearch.value) }
const onBlur    = ()  => emit('search', localSearch.value)
</script>

<template>
  <div class="keyword-toolbar">
    <input
      v-model="localSearch"
      class="search-input"
      type="text"
      placeholder="🔍 키워드 검색..."
      @keydown="onKeydown"
      @blur="onBlur"
    />
    <select
      class="category-select"
      :value="selectedCategory"
      @change="emit('categoryChange', $event.target.value)"
    >
      <option v-for="c in CATEGORY_OPTIONS" :key="c" :value="c">{{ c }}</option>
    </select>
  </div>
</template>

<style scoped>
.keyword-toolbar {
  display: flex;
  gap: 8px;
  flex-shrink: 0;

}

.search-input {
  width: 280px;
  height: 36px;
  padding: 0 12px;
  background: var(--color-bg-surface);
  border: 2px solid var(--color-border-default);
  border-radius: 6px;
  font-size: 13px;
  color: var(--color-primary-800);

  outline: none;
  box-sizing: border-box;
  flex-shrink: 0;
}

.search-input::placeholder { color: var(--color-text-placeholder); }
.search-input:focus { border-color: var(--color-primary-600); }

.category-select {
  width: 160px;
  height: 36px;
  padding: 0 12px;
  background: var(--color-bg-surface);
  border: 2px solid var(--color-border-default);
  border-radius: 6px;
  font-size: 13px;
  color: var(--color-primary-800);

  outline: none;
  cursor: pointer;
  flex-shrink: 0;
}

.category-select:focus { border-color: var(--color-primary-600); }
</style>
