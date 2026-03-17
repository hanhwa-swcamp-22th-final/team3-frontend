<script setup>
defineProps({
  matrix: { type: Array, required: true },
})
const emit = defineEmits(['toggle'])

const ROLE_KEYS = ['Admin', 'HR', 'TL', 'DL', 'Worker']
</script>

<template>
  <div class="matrix-panel">

    <div class="panel-title">🔐 기능별 권한 매트릭스</div>

    <div class="table-header">
      <span class="col-name">기능명</span>
      <span v-for="role in ROLE_KEYS" :key="role" class="col-role">{{ role }}</span>
      <span class="col-note">비고</span>
    </div>

    <div class="table-body">
      <template v-for="(cat, catIdx) in matrix" :key="cat.category">

        <div class="category-row">{{ cat.category }}</div>

        <div
          v-for="(item, itemIdx) in cat.items"
          :key="item.name"
          class="table-row"
        >
          <span class="col-name item-name">{{ item.name }}</span>
          <span v-for="role in ROLE_KEYS" :key="role" class="col-role">
            <span
              class="toggle"
              :class="item[role] ? 'toggle--on' : 'toggle--off'"
              @click="emit('toggle', catIdx, itemIdx, role)"
            ></span>
          </span>
          <span class="col-note note-text">{{ item.note }}</span>
        </div>

      </template>
    </div>

  </div>
</template>

<style scoped>
.matrix-panel {
  flex: 1;
  background: #fff;
  border: 1.5px solid #E0DCFF;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow: hidden;
  min-width: 0;
  font-family: 'Pretendard', sans-serif;
}

.panel-title {
  font-size: 12px;
  font-weight: 900;
  color: #7A6FA8;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.table-header {
  display: flex;
  align-items: center;
  background: #F0EEFF;
  border-radius: 6px;
  height: 26px;
  padding: 0 12px;
  flex-shrink: 0;
}

.table-header span {
  font-size: 10px;
  font-weight: 700;
  color: #7A6FA8;
}

.col-name  { flex: 1.8; }
.col-role  { flex: 1; text-align: center; }
.col-note  { flex: 1.5; padding-left: 8px; }

.table-body {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.category-row {
  background: #2D1F6E;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 0 12px;
  height: 26px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  margin-top: 5px;
  flex-shrink: 0;
}

.table-row {
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  border-bottom: 1.5px solid #EEEBFF;
  flex-shrink: 0;
}

.table-row:last-of-type { border-bottom: none; }

.item-name {
  font-size: 11px;
  color: #2D1F6E;
}

.toggle {
  display: inline-block;
  width: 20px;
  height: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
}

.toggle--on  { background: #5B4FCF; }
.toggle--off { background: #E0DCFF; }

.note-text {
  font-size: 10px;
  color: #A89ED8;
  padding-left: 8px;
}
</style>
