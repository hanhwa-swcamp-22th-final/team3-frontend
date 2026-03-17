<script setup>
import { CATEGORY_STYLE } from '@/mocks/admin/keyword/keywordData.js'

defineProps({
  keywords: { type: Array, default: () => [] },
})

const emit = defineEmits(['editClick', 'deleteClick'])

const weightColor = (w) => w >= 1.8 ? '#EF476F' : '#5B4FCF'
</script>

<template>
  <div class="keyword-table">

    <!-- 헤더 -->
    <div class="table-header">
      <span class="col-keyword">키워드</span>
      <span class="col-category">역량 카테고리</span>
      <span class="col-desc">설명</span>
      <span class="col-weight">가중치</span>
      <span class="col-action">작업</span>
    </div>

    <!-- 행 -->
    <div
      v-for="(kw, i) in keywords"
      :key="kw.id"
      class="table-row"
      :class="{ 'table-row--alt': i % 2 !== 0 }"
    >
      <span class="col-keyword">{{ kw.keyword }}</span>
      <span class="col-category">
        <span
          class="category-badge"
          :style="{
            background:   CATEGORY_STYLE[kw.category]?.bg,
            border:      `2px solid ${CATEGORY_STYLE[kw.category]?.border}`,
            color:        CATEGORY_STYLE[kw.category]?.color,
          }"
        >{{ kw.category }}</span>
      </span>
      <span class="col-desc">{{ kw.description }}</span>
      <span class="col-weight" :style="{ color: weightColor(kw.weight) }">{{ kw.weight }}</span>
      <span class="col-action">
        <button class="btn-edit"   @click="emit('editClick',   kw)">수정</button>
        <button class="btn-delete" @click="emit('deleteClick', kw.id)">삭제</button>
      </span>
    </div>

    <!-- 빈 상태 -->
    <div v-if="keywords.length === 0" class="empty">검색 결과가 없습니다.</div>

  </div>
</template>

<style scoped>
.keyword-table {
  flex: 1;
  background: var(--color-bg-surface);
  border: 2px solid var(--color-border-default);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(45, 31, 110, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: var(--font-family-base);
}

/* 헤더 */
.table-header {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 24px;
  background: var(--color-primary-100);
  border-bottom: 2px solid var(--color-border-default);
  flex-shrink: 0;
}

.table-header span {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-800);
}

/* 행 */
.table-row {
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 24px;
  border-bottom: 2px solid var(--color-border-default);
  flex-shrink: 0;
}

.table-row--alt { background: var(--color-bg-app); }
.table-row:hover { background: #f5f3ff; }

.table-row span {
  font-size: 13px;
  color: var(--color-primary-800);
}

/* 컬럼 너비 */
.col-keyword   { width: 216px; flex-shrink: 0; }
.col-category  { width: 216px; flex-shrink: 0; }
.col-desc      { flex: 1; }
.col-weight    { width: 116px; flex-shrink: 0; text-align: center; font-weight: 700; }
.col-action    { width: 172px; flex-shrink: 0; display: flex; justify-content: center; gap: 8px; }

/* 카테고리 배지 */
.category-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
}

/* 버튼 */
.btn-edit {
  height: 26px;
  padding: 0 14px;
  background: var(--color-primary-100);
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-600);
  font-family: var(--font-family-base);
  cursor: pointer;
}

.btn-edit:hover { background: var(--color-border-default); }

.btn-delete {
  height: 26px;
  padding: 0 14px;
  background: #fff0f3;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-danger);
  font-family: var(--font-family-base);
  cursor: pointer;
}

.btn-delete:hover { background: #ffd6e0; }

.empty {
  padding: 40px 0;
  text-align: center;
  font-size: 13px;
  color: #a89ed8;
}
</style>
