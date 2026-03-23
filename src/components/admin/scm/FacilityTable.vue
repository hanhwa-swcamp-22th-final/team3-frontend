<script setup>
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

const statusStyle = (status) => {
  if (status === '운영중')  return { bg: 'var(--color-equip-active-bg)',  border: 'var(--color-equip-active-border)',  color: 'var(--color-equip-active)' }
  if (status === '점검 예정') return { bg: 'var(--color-equip-warning-bg)', border: 'var(--color-equip-warning-border)', color: 'var(--color-equip-warning)' }
  return                           { bg: 'var(--color-equip-stopped-bg)', border: 'var(--color-equip-stopped-border)', color: 'var(--color-equip-stopped)' }
}
</script>

<template>
  <div class="table-wrap">
    <!-- 헤더 -->
    <div class="table-header">
      <span class="col-id">설비 ID</span>
      <span class="col-name">설비명</span>
      <span class="col-line">라인</span>
      <span class="col-status">상태</span>
      <span class="col-action">관리</span>
    </div>

    <!-- 행 -->
    <div
      v-for="facility in facilities"
      :key="facility.id"
      class="table-row"
    >
      <span class="col-id">{{ facility.equipment_code }}</span>
      <span class="col-name">{{ facility.equipment_name }}</span>
      <span class="col-line">{{ facility.equipment_line }}</span>
      <span class="col-status">
        <span
          class="status-badge"
          :style="{
            background:   statusStyle(facility.equipment_status).bg,
            border:      `1px solid ${statusStyle(facility.equipment_status).border}`,
            color:        statusStyle(facility.equipment_status).color,
          }"
        >{{ facility.equipment_status }}</span>
      </span>
      <span class="col-action">
        <button class="btn-edit" @click="emit('editClick', facility)">수정</button>
        <button class="btn-delete" @click="emit('deleteClick', facility)">삭제</button>
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
}

/* 컬럼 너비 */
.col-id     { flex: 1.8; }
.col-name   { flex: 2; }
.col-line   { flex: 1.4; }
.col-status { flex: 1.4; }
.col-action { flex: 1; display: flex; gap: 6px; }

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
}

.btn-edit {
  height: 26px;
  padding: 0 14px;
  background: var(--color-primary-100);
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-600);
  cursor: pointer;
}

.btn-edit:hover { background: var(--color-border-default); }

.btn-delete {
  height: 26px;
  padding: 0 14px;
  background: var(--color-equip-stopped-bg);
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-danger);
  cursor: pointer;
}

.btn-delete:hover { background: var(--color-danger-light); }

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
