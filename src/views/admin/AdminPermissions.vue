<script setup>
import { ref } from 'vue'
import PermissionRolePanel   from '@/components/admin/scm/PermissionRolePanel.vue'
import PermissionMatrixPanel from '@/components/admin/scm/PermissionMatrixPanel.vue'
import { ROLES, ROLE_DEFINITIONS, DUMMY_MATRIX } from '@/mocks/admin/permission/permissionData.js'

const selectedRole   = ref('Admin')
const pendingChanges = ref(3)
const matrix = ref(DUMMY_MATRIX.map(cat => ({
  ...cat,
  items: cat.items.map(item => ({ ...item })),
})))

const onSelectRole = (role) => { selectedRole.value = role }

const onToggle = (catIdx, itemIdx, roleKey) => {
  matrix.value[catIdx].items[itemIdx][roleKey] = !matrix.value[catIdx].items[itemIdx][roleKey]
  pendingChanges.value++
}

const onSave = () => { pendingChanges.value = 0 }
</script>

<template>
  <div class="admin-permissions">

    <!-- 탭 바 -->
    <div class="tab-bar">
      <div class="tabs">
        <div
          v-for="role in ROLES"
          :key="role"
          class="tab"
          :class="{ 'tab--active': selectedRole === role }"
          @click="onSelectRole(role)"
        >{{ role }}</div>
      </div>
      <div class="actions">
        <span v-if="pendingChanges > 0" class="badge-pending">변경사항 {{ pendingChanges }}건</span>
        <button class="btn-save" @click="onSave">저장 적용</button>
      </div>
    </div>

    <!-- 패널 -->
    <div class="panels">
      <PermissionRolePanel
        :roleData="ROLE_DEFINITIONS[selectedRole]"
        :selectedRole="selectedRole"
      />
      <PermissionMatrixPanel
        :matrix="matrix"
        @toggle="onToggle"
      />
    </div>

  </div>
</template>

<style scoped>
.admin-permissions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 24px 0;
  flex: 1;
  min-width: 0;
  height: calc(100vh - 58px);
  box-sizing: border-box;
  overflow: hidden;
  font-family: 'Pretendard', sans-serif;
}

.tab-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1.5px solid #E0DCFF;
  flex-shrink: 0;
  height: 43px;
}

.tabs {
  display: flex;
}

.tab {
  padding: 0 18px;
  height: 41px;
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
  color: #A89ED8;
  cursor: pointer;
  border-bottom: 1.5px solid transparent;
  margin-bottom: -1.5px;
  transition: color 0.15s;
  white-space: nowrap;
}

.tab--active {
  color: #5B4FCF;
  border-bottom-color: #5B4FCF;
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 7px;
}

.badge-pending {
  padding: 5px 12px;
  background: #FFD166;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: #A07000;
}

.btn-save {
  height: 28px;
  padding: 0 19px;
  background: #5B4FCF;
  border: 1.5px solid #7F75DB;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  font-family: 'Pretendard', sans-serif;
}

.btn-save:hover { background: #4A3FB0; }

.panels {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
  padding-bottom: 24px;
}
</style>
