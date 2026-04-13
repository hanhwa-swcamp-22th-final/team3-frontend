<script setup>
defineProps({
  algorithms: { type: Array, default: () => [] },
  selectedId: { type: [Number, String], default: null },
  searchQuery: { type: String, default: '' },
  isLoading: { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'search'])
</script>

<template>
  <aside class="section">
    <div class="section-head">
      <div>
        <h2 class="section-title">알고리즘 버전</h2>
        <p class="section-sub">수정할 정책 버전을 선택하세요.</p>
      </div>
      <span class="section-count">{{ algorithms.length }}</span>
    </div>

    <input
      class="search-input"
      type="search"
      :value="searchQuery"
      placeholder="버전, 정책 키, 설명 검색"
      @input="emit('search', $event.target.value)"
    />

    <div v-if="isLoading" class="empty">불러오는 중...</div>
    <div v-else-if="algorithms.length === 0" class="empty">등록된 알고리즘 버전이 없습니다.</div>

    <template v-else>
      <button
        v-for="algorithm in algorithms"
        :key="algorithm.algorithmVersionId"
        type="button"
        class="algorithm-row"
        :class="{ 'algorithm-row--active': algorithm.algorithmVersionId === selectedId }"
        @click="emit('select', algorithm)"
      >
        <div class="algorithm-row__main">
          <span class="algorithm-row__version">{{ algorithm.versionNo }}</span>
          <span class="algorithm-row__key">{{ algorithm.implementationKey }}</span>
        </div>
        <div class="algorithm-row__meta">
          <span class="algorithm-row__desc">{{ algorithm.description || '설명 없음' }}</span>
          <span class="algorithm-row__status" :class="{ 'algorithm-row__status--active': algorithm.isActive }">
            {{ algorithm.isActive ? '활성' : '비활성' }}
          </span>
        </div>
      </button>
    </template>
  </aside>
</template>

<style scoped>
.section {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 380px;
  flex-shrink: 0;
  overflow-y: auto;
}

.section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.section-title {
  margin: 0;
  font-size: 13px;
  font-weight: 900;
  color: var(--color-primary-700);
}

.section-sub {
  margin: 4px 0 0;
  font-size: 11px;
  color: var(--color-primary-300);
}

.section-count {
  min-width: 28px;
  padding: 4px 8px;
  border-radius: 999px;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  font-family: var(--font-family-mono);
  font-size: 12px;
  font-weight: 800;
  text-align: center;
}

.search-input {
  height: 38px;
  border: 1.5px solid var(--color-border-default);
  border-radius: var(--radius-2xs);
  padding: 0 12px;
  font-size: 12px;
  color: var(--color-primary-800);
  background: var(--color-bg-app);
  outline: none;
}

.search-input:focus {
  border-color: var(--color-primary-600);
}

.empty {
  padding: 40px 0;
  text-align: center;
  font-size: 13px;
  color: var(--color-primary-300);
}

.algorithm-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-2xs);
  background: var(--color-bg-app);
  text-align: left;
  cursor: pointer;
}

.algorithm-row--active {
  background: var(--color-primary-100);
  border-color: var(--color-primary-600);
}

.algorithm-row__main,
.algorithm-row__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.algorithm-row__version {
  font-family: var(--font-family-mono);
  font-size: 15px;
  font-weight: 900;
  color: var(--color-primary-700);
}

.algorithm-row__key {
  font-family: var(--font-family-mono);
  font-size: 11px;
  color: var(--color-primary-300);
}

.algorithm-row__desc {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
  color: var(--color-primary-300);
}

.algorithm-row__status {
  padding: 3px 7px;
  border-radius: 999px;
  background: var(--color-border-muted);
  color: var(--color-primary-300);
  font-size: 10px;
  font-weight: 800;
}

.algorithm-row__status--active {
  background: rgba(0, 191, 149, 0.12);
  color: var(--tier-s, #00bf95);
}
</style>