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
  font-family: 'Pretendard', sans-serif;
}

.search-input {
  flex: 1;
  height: 36px;
  padding: 0 12px;
  background: #ffffff;
  border: 1px solid #e0dcff;
  border-radius: 8px;
  font-size: 12px;
  color: #2d1f6e;
  font-family: 'Pretendard', sans-serif;
  box-sizing: border-box;
  outline: none;
}

.search-input::placeholder { color: #a89ed8; }
.search-input:focus { border-color: #5b4fcf; }

.select-line {
  height: 32px;
  padding: 0 12px;
  background: #ffffff;
  border: 1px solid #e0dcff;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #7a6fa8;
  font-family: 'Pretendard', sans-serif;
  cursor: pointer;
  outline: none;
  flex-shrink: 0;
}

.select-line:focus { border-color: #5b4fcf; }

.btn-add {
  height: 32px;
  padding: 0 14px;
  background: #5b4fcf;
  border: 1px solid #7f75db;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  font-family: 'Pretendard', sans-serif;
  cursor: pointer;
  flex-shrink: 0;
  white-space: nowrap;
}

.btn-add:hover { background: #4a3fb0; }
</style>
