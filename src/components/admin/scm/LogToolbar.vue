<script setup>
import { ref } from 'vue'
import { FILTER_OPTIONS } from '@/mocks/admin/logs/logData.js'

const props = defineProps({
  selectedFilter: { type: String, default: '전체' },
  searchQuery:    { type: String, default: '' },
})

const emit = defineEmits(['filterChange', 'search'])

const localSearch = ref(props.searchQuery)

const onKeydown = (e) => { if (e.key === 'Enter') emit('search', localSearch.value) }
const onBlur    = ()  => emit('search', localSearch.value)
</script>

<template>
  <div class="log-toolbar">
    <!-- 필터 버튼 -->
    <div
      v-for="f in FILTER_OPTIONS"
      :key="f.key"
      class="filter-btn"
      :class="{ 'filter-btn--active': selectedFilter === f.key }"
      :style="selectedFilter === f.key
        ? { background: f.bg, color: f.color }
        : { background: '#ffffff', color: '#a89ed8', border: '1.5px solid #e0dcff' }
      "
      @click="emit('filterChange', f.key)"
    >
      {{ f.key }}
    </div>

    <!-- 검색 -->
    <input
      v-model="localSearch"
      class="search-input"
      type="text"
      placeholder="로그 검색..."
      @keydown="onKeydown"
      @blur="onBlur"
    />
  </div>
</template>

<style scoped>
.log-toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  font-family: 'Pretendard', sans-serif;
}

.filter-btn {
  height: 35px;
  padding: 0 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  white-space: nowrap;
  border: 1.5px solid transparent;
  box-sizing: border-box;
}

.search-input {
  flex: 1;
  height: 35px;
  padding: 0 11.5px;
  background: #ffffff;
  border: 1.5px solid #e0dcff;
  border-radius: 4px;
  font-size: 11px;
  color: #2d1f6e;
  font-family: 'Pretendard', sans-serif;
  outline: none;
  box-sizing: border-box;
}

.search-input::placeholder { color: #a89ed8; }
.search-input:focus { border-color: #5b4fcf; }
</style>
