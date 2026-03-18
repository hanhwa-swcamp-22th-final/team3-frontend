<script setup>
import { ref, computed } from 'vue'
import PermissionRolePanel   from '@/components/admin/scm/PermissionRolePanel.vue'
import PermissionMatrixPanel from '@/components/admin/scm/PermissionMatrixPanel.vue'
import { ROLES, ROLE_DEFINITIONS, DUMMY_MATRIX } from '@/mocks/admin/permission/permissionData.js'

const ROLE_KEYS = ['Admin', 'HR', 'TL', 'DL', 'Worker']

// 원본 스냅샷 (비교용)
const originalMatrix = ref(DUMMY_MATRIX.map(cat => ({
  ...cat,
  items: cat.items.map(item => ({ ...item })),
})))

const selectedRole = ref('Admin')
const matrix = ref(DUMMY_MATRIX.map(cat => ({
  ...cat,
  items: cat.items.map(item => ({ ...item })),
})))

// 원본과 비교해서 실제 변경된 수만 카운트
const pendingChanges = computed(() => {
  let count = 0
  matrix.value.forEach((cat, catIdx) => {
    cat.items.forEach((item, itemIdx) => {
      const orig = originalMatrix.value[catIdx].items[itemIdx]
      ROLE_KEYS.forEach(role => {
        if (item[role] !== orig[role]) count++
      })
    })
  })
  return count
})

const showLog  = ref(false)
const changeLogs = ref([])

const onSelectRole = (role) => { selectedRole.value = role }

const onToggle = (catIdx, itemIdx, roleKey) => {
  matrix.value[catIdx].items[itemIdx][roleKey] = !matrix.value[catIdx].items[itemIdx][roleKey]
}

const onSave = () => {
  const logs = []
  matrix.value.forEach((cat, catIdx) => {
    cat.items.forEach((item, itemIdx) => {
      const orig = originalMatrix.value[catIdx].items[itemIdx]
      ROLE_KEYS.forEach(role => {
        if (item[role] !== orig[role]) {
          logs.push({
            category: cat.category,
            feature:  item.name,
            role,
            from: orig[role],
            to:   item[role],
          })
        }
      })
    })
  })
  changeLogs.value = logs
  showLog.value = logs.length > 0
}

const onConfirmSave = () => {
  originalMatrix.value = matrix.value.map(cat => ({
    ...cat,
    items: cat.items.map(item => ({ ...item })),
  }))
  showLog.value = false
  changeLogs.value = []
}

const onCancelSave = () => {
  matrix.value = originalMatrix.value.map(cat => ({
    ...cat,
    items: cat.items.map(item => ({ ...item })),
  }))
  showLog.value = false
  changeLogs.value = []
}
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
        <div class="btn-save-wrap">
          <button class="btn-save" @click="onSave">저장 적용</button>
          <!-- 변경 로그 -->
          <div v-if="showLog" class="change-log">
            <div class="change-log__header">
              <span>변경 내역 {{ changeLogs.length }}건</span>
              <span class="change-log__close" @click="showLog = false">✕</span>
            </div>
            <div
              v-for="(log, i) in changeLogs"
              :key="i"
              class="change-log__item"
            >
              <span class="log-category">{{ log.category }}</span>
              <span class="log-feature">{{ log.feature }}</span>
              <span class="log-role">{{ log.role }}</span>
              <span class="log-arrow">{{ log.from ? '✅ → ❌' : '❌ → ✅' }}</span>
            </div>
            <div class="change-log__footer">
              <button class="btn-cancel-save" @click="onCancelSave">취소</button>
              <button class="btn-confirm-save" @click="onConfirmSave">확인 저장</button>
            </div>
          </div>
        </div>
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

}

.tab-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1.5px solid var(--color-border-default);
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
  color: var(--color-text-placeholder);
  cursor: pointer;
  border-bottom: 1.5px solid transparent;
  margin-bottom: -1.5px;
  transition: color 0.15s;
  white-space: nowrap;
}

.tab--active {
  color: var(--color-primary-600);
  border-bottom-color: var(--color-primary-600);
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 7px;
}

.badge-pending {
  padding: 5px 12px;
  background: var(--tier-b);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-warning-text);
}

.btn-save {
  height: 28px;
  padding: 0 19px;
  background: var(--color-primary-600);
  border: 1.5px solid var(--color-primary-400);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-white);
  cursor: pointer;

}

.btn-save:hover { background: var(--color-primary-700); }

.btn-save-wrap {
  position: relative;
}

.change-log {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 360px;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(45, 31, 110, 0.1);
  z-index: 100;
  overflow: hidden;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.change-log__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: var(--color-primary-100);
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-600);
}

.change-log__close {
  cursor: pointer;
  font-size: 11px;
  color: var(--color-text-placeholder);
}

.change-log__close:hover { color: var(--color-primary-600); }

.change-log__item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-bottom: 1px solid var(--color-border-row);
  font-size: 11px;
}

.change-log__item:last-child { border-bottom: none; }

.log-category {
  color: var(--color-text-placeholder);
  flex-shrink: 0;
}

.log-feature {
  color: var(--color-primary-800);
  font-weight: 700;
  flex: 1;
}

.log-role {
  background: var(--color-primary-100);
  color: var(--color-primary-600);
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}

.log-arrow {
  flex-shrink: 0;
  font-size: 11px;
}

.change-log__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 14px;
  border-top: 1.5px solid var(--color-border-row);
  background: var(--color-bg-app);
}

.btn-cancel-save {
  height: 28px;
  padding: 0 16px;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-placeholder);
  cursor: pointer;

}

.btn-cancel-save:hover { background: var(--color-primary-100); color: var(--color-primary-600); }

.btn-confirm-save {
  height: 28px;
  padding: 0 16px;
  background: var(--color-primary-600);
  border: 1.5px solid var(--color-primary-400);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-white);
  cursor: pointer;

}

.btn-confirm-save:hover { background: var(--color-primary-700); }

.panels {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
  padding-bottom: 24px;
}
</style>
