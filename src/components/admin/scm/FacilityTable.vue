<script setup>
defineProps({
  facilities: { type: Array, default: () => [] },
})

const emit = defineEmits(['editClick'])

const statusStyle = (status) => {
  if (status === '운영중')  return { bg: '#E3FBEF', border: '#B4EFD9', color: '#007A60' }
  if (status === '점검 예정') return { bg: '#FFF8E0', border: '#FFE49E', color: '#9A6A00' }
  return                           { bg: '#FFF0F3', border: '#FFC3D2', color: '#C42B56' }
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
  border: 1px solid #e0dcff;
  border-radius: 10px;
  overflow: hidden;
  font-family: 'Pretendard', sans-serif;
}

.table-header {
  display: flex;
  align-items: center;
  height: 40px;
  background: #f0eeff;
  padding: 0 14px;
}

.table-header span {
  font-size: 11px;
  font-weight: 700;
  color: #7a6fa8;
}

.table-row {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 14px;
  border-top: 1px solid #e0dcff;
}

.table-row:hover { background: #fafbff; }

.table-row span {
  font-size: 12px;
  color: #2d1f6e;
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
  background: #f0eeff;
  border: 1px solid #e0dcff;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #5b4fcf;
  font-family: 'Pretendard', sans-serif;
  cursor: pointer;
}

.btn-edit:hover { background: #e0dcff; }

.empty {
  padding: 40px 0;
  text-align: center;
  font-size: 13px;
  color: #a89ed8;
}
</style>
