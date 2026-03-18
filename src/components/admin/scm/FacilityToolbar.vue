<script setup>
import { ref } from 'vue'
import { LINE_OPTIONS } from '@/mocks/admin/facility/facilityData.js'

const props = defineProps({
  searchQuery:  { type: String, default: '' },
  selectedLine: { type: String, default: '전체' },
})

const emit = defineEmits(['search', 'lineChange', 'addClick'])

const localSearch = ref(props.searchQuery)

const onSearch  = ()  => { emit('search', localSearch.value) }
const onKeydown = (e) => { if (e.key === 'Enter') onSearch() }
</script>

<template>
  <div class="toolbar">
    <input
      v-model="localSearch"
      class="search-input"
      type="text"
      placeholder="🔍 설비명, 설비ID 검색"
      @keydown="onKeydown"
      @blur="onSearch"
    />

    <select
      class="select-line"
      :value="selectedLine"
      @change="emit('lineChange', $event.target.value)"
    >
      <option v-for="line in LINE_OPTIONS" :key="line" :value="line">
        {{ line === '전체' ? '라인 전체' : line }}
      </option>
    </select>

    <button class="btn-add" @click="emit('addClick')">+ 설비 등록</button>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 36px;
  flex-shrink: 0;
  font-family: var(--font-family-base);
}

.search-input {
  flex: 1;
  height: 36px;
  padding: 0 12px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  font-size: 12px;
  color: var(--color-primary-800);
  font-family: var(--font-family-base);
  box-sizing: border-box;
  outline: none;
}

.search-input::placeholder { color: var(--color-text-placeholder); }
.search-input:focus { border-color: var(--color-primary-600); }

.select-line {
  height: 32px;
  padding: 0 12px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-secondary);
  font-family: var(--font-family-base);
  cursor: pointer;
  outline: none;
  flex-shrink: 0;
}

.select-line:focus { border-color: var(--color-primary-600); }

.btn-add {
  height: 32px;
  padding: 0 14px;
  background: var(--color-primary-600);
  border: 1px solid var(--color-primary-500);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-bg-surface);
  font-family: var(--font-family-base);
  cursor: pointer;
  flex-shrink: 0;
  white-space: nowrap;
}

.btn-add:hover { background: var(--color-primary-700); }
</style>
