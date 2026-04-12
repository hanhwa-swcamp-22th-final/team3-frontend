<script setup>
import { BaseButton } from '@/components/common/base'

const STATUS_LABEL = {
  OPERATING:        '운영중',
  STOPPED:          '정지',
  UNDER_INSPECTION: '점검중',
  DISPOSED:         '폐기',
}

const STATUS_STYLE = {
  OPERATING:        { bg: 'var(--color-equip-active-bg)',  border: 'var(--color-equip-active-border)',  color: 'var(--color-equip-active)' },
  UNDER_INSPECTION: { bg: 'var(--color-equip-warning-bg)', border: 'var(--color-equip-warning-border)', color: 'var(--color-equip-warning)' },
  STOPPED:          { bg: 'var(--color-equip-stopped-bg)', border: 'var(--color-equip-stopped-border)', color: 'var(--color-equip-stopped)' },
  DISPOSED:         { bg: 'var(--color-equip-stopped-bg)', border: 'var(--color-equip-stopped-border)', color: 'var(--color-equip-stopped)' },
}

const GRADE_STYLE = {
  S: { bg: '#E8FFF5', border: '#00BF95', color: '#00BF95' },
  A: { bg: '#E8F4FF', border: '#3B82F6', color: '#1A6DB5' },
  B: { bg: '#FFF7ED', border: '#FFD166', color: '#9A3412' },
  C: { bg: '#FFF0F0', border: '#EF476F', color: '#EF476F' },
}

defineProps({
  facilities:   { type: Array,  default: () => [] },
  totalCount:   { type: Number, default: 0 },
  currentPage:  { type: Number, default: 1 },
  totalPages:   { type: Number, default: 1 },
  pageStart:    { type: Number, default: 0 },
  pageEnd:      { type: Number, default: 0 },
  pageButtons:  { type: Array,  default: () => [] },
})

const emit = defineEmits(['editClick', 'deleteClick'])

const statusLabel = (s) => STATUS_LABEL[s] ?? s
const statusStyle = (s) => STATUS_STYLE[s] ?? STATUS_STYLE.STOPPED
const gradeStyle  = (g) => GRADE_STYLE[g] ?? GRADE_STYLE.C
</script>

<template>
  <div class="table-wrap">
    <!-- 헤더 -->
    <div class="table-header">
      <span class="col-code">설비코드</span>
      <span class="col-name">설비명</span>
      <span class="col-status">상태</span>
      <span class="col-grade">등급</span>
      <span class="col-process">공정</span>
      <span class="col-line">라인</span>
      <span class="col-env">환경</span>
      <span class="col-action">관리</span>
    </div>

    <!-- 행 -->
    <div
      v-for="facility in facilities"
      :key="facility.equipmentId"
      class="table-row"
    >
      <span class="col-code">{{ facility.equipmentCode }}</span>
      <span class="col-name">{{ facility.equipmentName }}</span>
      <span class="col-status">
        <span
          class="status-badge"
          :style="{
            background:   statusStyle(facility.equipmentStatus).bg,
            border:      `1px solid ${statusStyle(facility.equipmentStatus).border}`,
            color:        statusStyle(facility.equipmentStatus).color,
          }"
        >{{ statusLabel(facility.equipmentStatus) }}</span>
      </span>
      <span class="col-grade">
        <span
          class="grade-badge"
          :style="{
            background:   gradeStyle(facility.equipmentGrade).bg,
            border:      `1px solid ${gradeStyle(facility.equipmentGrade).border}`,
            color:        gradeStyle(facility.equipmentGrade).color,
          }"
        >{{ facility.equipmentGrade }}</span>
      </span>
      <span class="col-process">{{ facility.equipmentProcessName }}</span>
      <span class="col-line">{{ facility.factoryLineName }}</span>
      <span class="col-env">{{ facility.environmentName }}</span>
      <span class="col-action">
        <BaseButton variant="ghost"  size="sm" @click="emit('editClick',   facility)">수정</BaseButton>
        <BaseButton variant="danger" size="sm" @click="emit('deleteClick', facility)">삭제</BaseButton>
      </span>
    </div>

    <!-- 빈 상태 -->
    <div v-if="facilities.length === 0" class="empty">검색 결과가 없습니다.</div>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <div class="pagination__spacer"></div>
      <div class="pagination__pages">
        <button class="page-btn" @click="emit('pageChange', currentPage - 1)" :disabled="currentPage === 1">&lt;</button>
        <template v-for="p in pageButtons" :key="p">
          <span v-if="p === '...'" class="page-ellipsis">...</span>
          <button
            v-else
            class="page-btn"
            :class="{ 'page-btn--active': p === currentPage }"
            @click="emit('pageChange', p)"
          >{{ p }}</button>
        </template>
        <button class="page-btn" @click="emit('pageChange', currentPage + 1)" :disabled="currentPage === totalPages">&gt;</button>
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
.table-wrap {
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
  padding: 10px 0;
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
  text-align: center;
}

/* 행 */
.table-row {
  display: flex;
  align-items: center;
  height: 56px;
  border-bottom: 1px solid var(--color-border-muted);
  flex-shrink: 0;
}

.table-row:hover { background: var(--color-bg-app); }

.table-row span {
  font-size: 12px;
  color: var(--color-primary-800);
  text-align: center;
}

.table-row .col-code,
.table-row .col-name {
  text-align: left;
}

/* 컬럼 너비 */
.col-code    { width: 300px;  flex-shrink: 0; }
.col-name    { flex: 2; min-width: 0; }
.col-status  { width: 100px;  flex-shrink: 0; }
.col-grade   { width: 50px;  flex-shrink: 0; text-align: center; }
.col-process { flex: 1.2; min-width: 0; }
.col-line    { flex: 1; min-width: 0; }
.col-env     { flex: 1; min-width: 0; }
.col-action  { width: 120px; flex-shrink: 0; display: flex; justify-content: center; gap: 6px; }

.status-badge,
.grade-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 10px;
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
  font-family: var(--font-family-base);
}

.page-btn:disabled { opacity: 0.4; cursor: default; }

.page-btn--active {
  background: var(--color-primary-600);
  color: var(--color-text-inverse);
  border: 1px solid var(--color-primary-500);
}

.page-ellipsis {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--color-text-muted);
}
</style>
