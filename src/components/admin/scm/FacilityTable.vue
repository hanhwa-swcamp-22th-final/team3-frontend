<script setup>
defineProps({
  facilities: { type: Array, default: () => [] },
})

const emit = defineEmits(['editClick'])

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
      </span>
    </div>

    <!-- 빈 상태 -->
    <div v-if="facilities.length === 0" class="empty">검색 결과가 없습니다.</div>
  </div>
</template>

<style scoped>
.table-wrap {
  flex: 1;
  border: 1px solid var(--color-border-default);
  border-radius: 10px;
  overflow: hidden;

}

.table-header {
  display: flex;
  align-items: center;
  height: 40px;
  background: var(--color-primary-100);
  padding: 0 14px;
}

.table-header span {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-secondary);
}

.table-row {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 14px;
  border-top: 1px solid var(--color-border-default);
}

.table-row:hover { background: var(--color-bg-app); }

.table-row span {
  font-size: 12px;
  color: var(--color-primary-800);
}

/* 컬럼 너비 */
.col-id     { width: 200px; flex-shrink: 0; }
.col-name   { flex: 1; }
.col-line   { width: 120px; flex-shrink: 0; }
.col-status { width: 120px; flex-shrink: 0; }
.col-action { width: 80px;  flex-shrink: 0; }

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
}

.btn-edit {
  height: 32px;
  padding: 0 14px;
  background: var(--color-primary-100);
  border: 1px solid var(--color-border-default);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-600);

  cursor: pointer;
}

.btn-edit:hover { background: var(--color-border-default); }

.empty {
  padding: 40px 0;
  text-align: center;
  font-size: 13px;
  color: var(--color-text-placeholder);
}
</style>
