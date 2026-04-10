<script setup>
import { BaseButton } from '@/components/common/base'

const CATEGORY_LABEL = {
  TECHNICAL_COMPETENCE: '기술역량',
  LEADERSHIP:          '리더십',
  SAFETY:              '안전',
  INNOVATION:          '혁신',
  COLLABORATION:       '협업',
  OTHERS:              '기타',
}

const CATEGORY_STYLE = {
  TECHNICAL_COMPETENCE: { bg: '#E8F4FF', border: '#93C5FD', color: '#1A6DB5' },
  LEADERSHIP:          { bg: '#FFF7ED', border: '#FDB07A', color: '#9A3412' },
  SAFETY:              { bg: '#F5F3FF', border: '#C4B5FD', color: '#5B21B6' },
  INNOVATION:          { bg: '#FFF0FB', border: '#F0ABFC', color: '#86198F' },
  COLLABORATION:       { bg: '#F0FFF4', border: '#86EFAC', color: '#166534' },
  OTHERS:              { bg: '#F0F0F0', border: '#D1D5DB', color: '#374151' },
}

defineProps({
  keywords:    { type: Array,  default: () => [] },
  currentPage: { type: Number, default: 1 },
  totalPages:  { type: Number, default: 1 },
  totalCount:  { type: Number, default: 0 },
  pageStart:   { type: Number, default: 0 },
  pageEnd:     { type: Number, default: 0 },
})

const emit = defineEmits(['editClick', 'deleteClick', 'pageChange'])

const categoryLabel = (cat) => CATEGORY_LABEL[cat] ?? cat
const weightColor   = (w) => w >= 1.8 ? '#EF476F' : '#5B4FCF'
</script>

<template>
  <div class="keyword-table">

    <!-- 헤더 -->
    <div class="table-header">
      <span class="col-keyword">키워드</span>
      <span class="col-category">역량 카테고리</span>
      <span class="col-desc">설명</span>
      <span class="col-score">기본점수</span>
      <span class="col-weight">가중치</span>
      <span class="col-action">작업</span>
    </div>

    <!-- 행 -->
    <div
      v-for="kw in keywords"
      :key="kw.domainKeywordId"
      class="table-row"
    >
      <span class="col-keyword">{{ kw.domainKeyword }}</span>
      <span class="col-category">
        <span
          class="category-badge"
          :style="{
            background:   CATEGORY_STYLE[kw.domainCompetencyCategory]?.bg,
            border:      `2px solid ${CATEGORY_STYLE[kw.domainCompetencyCategory]?.border}`,
            color:        CATEGORY_STYLE[kw.domainCompetencyCategory]?.color,
          }"
        >{{ categoryLabel(kw.domainCompetencyCategory) }}</span>
      </span>
      <span class="col-desc">{{ kw.domainKeywordDescription }}</span>
      <span class="col-score">{{ kw.domainBaseScore }}</span>
      <span class="col-weight" :style="{ color: weightColor(kw.domainWeight) }">{{ kw.domainWeight }}</span>
      <span class="col-action">
        <BaseButton variant="ghost"  size="sm" @click="emit('editClick',   kw)">수정</BaseButton>
        <BaseButton variant="danger" size="sm" @click="emit('deleteClick', kw.domainKeywordId)">삭제</BaseButton>
      </span>
    </div>

    <!-- 빈 상태 -->
    <div v-if="keywords.length === 0" class="empty">검색 결과가 없습니다.</div>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <div class="pagination__spacer"></div>
      <div class="pagination__pages">
        <button class="page-btn" :disabled="currentPage === 1" @click="emit('pageChange', currentPage - 1)">&lt;</button>
        <button
          v-for="p in totalPages"
          :key="p"
          class="page-btn"
          :class="{ 'page-btn--active': currentPage === p }"
          @click="emit('pageChange', p)"
        >{{ p }}</button>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="emit('pageChange', currentPage + 1)">&gt;</button>
      </div>
      <div class="pagination__spacer">
        <span class="pagination__info">
          {{ totalCount > 0 ? `${pageStart}-${pageEnd} / ${totalCount}개` : '0개' }}
        </span>
      </div>
    </div>

  </div>
</template>

<style scoped>
.keyword-table {
  flex: 1;
  min-height: 0;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* 헤더 */
.table-header {
  display: flex;
  align-items: center;
  padding: 10px 8px;
  border-bottom: 1px solid var(--color-border-default);
  flex-shrink: 0;
  position: sticky;
  top: 0;
  background: var(--color-bg-surface);
  z-index: 1;
}

.table-header span {
  font-size: 10px;
  font-weight: 700;
  color: var(--color-primary-300);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 행 */
.table-row {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 8px;
  border-bottom: 1px solid var(--color-border-muted);
  flex-shrink: 0;
}

.table-row:hover { background: var(--color-bg-app); }

.table-row span {
  font-size: 12px;
  color: var(--color-primary-800);
}

/* 컬럼 너비 */
.col-keyword   { flex: 1.2; padding-left: 4px; }
.col-category  { flex: 1.2; }
.col-desc      { flex: 2; }
.col-score     { flex: 0.7; text-align: center; font-weight: 700; }
.col-weight    { flex: 0.7; text-align: center; font-weight: 700; }
.col-action    { flex: 1; display: flex; justify-content: center; gap: 8px; }

/* 카테고리 배지 */
.category-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
}


.empty {
  padding: 40px 0;
  text-align: center;
  font-size: 13px;
  color: var(--color-text-placeholder);
}

/* 페이지네이션 — ProfileListTable 동일 패턴 */
.pagination {
  display: flex;
  align-items: center;
  padding-top: 16px;
}

.pagination__spacer {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.pagination__info {
  font-size: 11px;
  color: var(--color-primary-300);
}

.pagination__pages {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--color-text-muted);
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.page-btn:disabled { opacity: 0.4; cursor: default; }

.page-btn--active {
  background: var(--color-primary-600);
  color: var(--color-text-inverse);
  border: 1px solid var(--color-primary-500);
}
</style>
