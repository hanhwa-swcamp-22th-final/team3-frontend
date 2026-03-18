<script setup>
defineProps({
  searchQuery:  { type: String,  default: '' },
  selectedTier: { type: String,  default: '전체' },
  selectedLine: { type: String,  default: '전체' },
  lines:        { type: Array,   default: () => [] },
})

const emit = defineEmits(['search', 'tierChange', 'lineChange', 'addClick'])
</script>

<template>
  <div class="toolbar">
    <input
      :value="searchQuery"
      class="toolbar__search"
      type="text"
      placeholder="🔍 이름 또는 사번 검색..."
      @input="emit('search', $event.target.value)"
    />
    <select
      class="toolbar__select"
      :value="selectedTier"
      @change="emit('tierChange', $event.target.value)"
    >
      <option value="전체">Tier 전체</option>
      <option v-for="t in ['S','A','B','C']" :key="t" :value="t">{{ t }} 티어</option>
    </select>
    <select
      class="toolbar__select"
      :value="selectedLine"
      @change="emit('lineChange', $event.target.value)"
    >
      <option value="전체">라인 전체</option>
      <option v-for="l in lines.slice(1)" :key="l" :value="l">{{ l }}</option>
    </select>
    <button class="toolbar__btn" @click="emit('addClick')">+ 테크니션 등록</button>
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
  height: 37px;
  padding: 0 14px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-2xs);
  font-size: 12px;
  color: var(--color-primary-800);
  outline: none;
}

.toolbar__search:focus { border-color: var(--color-primary-600); }

.toolbar__select {
  height: 37px;
  padding: 0 10px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-2xs);
  font-size: 12px;
  color: var(--color-primary-800);
  background: var(--color-bg-surface);
  cursor: pointer;
  outline: none;
}

.toolbar__select:focus { border-color: var(--color-primary-600); }

.toolbar__btn {
  height: 37px;
  padding: 0 16px;
  background: var(--color-primary-600);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}
</style>
