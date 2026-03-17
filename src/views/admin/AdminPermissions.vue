<script setup>
import { ref, computed } from 'vue'
import PermissionRolePanel   from '@/components/admin/scm/PermissionRolePanel.vue'
import PermissionMatrixPanel from '@/components/admin/scm/PermissionMatrixPanel.vue'

const ROLES = ['Admin', 'HR Manager', 'Team Leader', 'Department Leader', 'Worker']

const ROLE_DEFINITIONS = {
  'Admin': {
    title: '시스템 전체 관리자',
    desc: '모든 메뉴 접근 및 시스템 설정 권한 보유. 평가 알고리즘 파라미터 수정, 권한 관리, 데이터 전체 조회 가능.',
    level: 5,
    accounts: [
      { initial: 'A', name: '관리자A', team: '시스템관리팀장', status: '활성' },
      { initial: 'B', name: '관리자B', team: 'IT운영팀',      status: '활성' },
    ],
  },
  'HR Manager': {
    title: 'HR 관리자',
    desc: '인사 관련 메뉴 접근. 직원 프로필 조회/수정, 승급 심사, 평가 승인 권한 보유.',
    level: 4,
    accounts: [
      { initial: 'H', name: 'HR관리자A', team: '인사팀', status: '활성' },
    ],
  },
  'Team Leader': {
    title: '팀 리더',
    desc: '팀 내 라인 대시보드 조회, 정량 점수 확인, 주문 현황 조회 권한 보유.',
    level: 3,
    accounts: [
      { initial: 'T', name: '팀리더A', team: '제조팀', status: '활성' },
      { initial: 'T', name: '팀리더B', team: '품질팀', status: '활성' },
    ],
  },
  'Department Leader': {
    title: '부서 리더',
    desc: '라인 대시보드 조회, 정성 평가 입력, 주문 현황 조회, 작업 매칭 실행 권한 보유.',
    level: 2,
    accounts: [
      { initial: 'D', name: '부서장A', team: 'A부서', status: '활성' },
    ],
  },
  'Worker': {
    title: '작업자',
    desc: '개인 대시보드 및 본인 점수 조회, 지식 등록, 이의 신청 권한 보유.',
    level: 1,
    accounts: [
      { initial: 'W', name: '작업자A', team: 'A라인', status: '활성' },
      { initial: 'W', name: '작업자B', team: 'B라인', status: '활성' },
    ],
  },
}

const DUMMY_MATRIX = [
  {
    category: '📊 대시보드 & 조회',
    items: [
      { name: '전사 대시보드',  Admin: true,  HR: true,  TL: false, DL: false, Worker: false, note: '전체현황' },
      { name: '라인 대시보드',  Admin: true,  HR: true,  TL: true,  DL: true,  Worker: false, note: '—' },
      { name: '개인 대시보드',  Admin: true,  HR: true,  TL: true,  DL: true,  Worker: true,  note: '본인만' },
    ],
  },
  {
    category: '⚙️ 평가 & 알고리즘',
    items: [
      { name: '정량 점수 조회',    Admin: true,  HR: true,  TL: true,  DL: true,  Worker: true,  note: '본인만(Tech)' },
      { name: '정성 평가 입력',    Admin: true,  HR: false, TL: false, DL: true,  Worker: false, note: 'GL, TL 입력' },
      { name: '평가 승인/확정',    Admin: true,  HR: true,  TL: false, DL: false, Worker: false, note: '—' },
      { name: '알고리즘 파라미터', Admin: true,  HR: false, TL: false, DL: false, Worker: false, note: 'Admin 전용' },
    ],
  },
  {
    category: '👥 인사 & 승급',
    items: [
      { name: '전체 인원 조회', Admin: true,  HR: true,  TL: false, DL: false, Worker: false, note: '—' },
      { name: '프로필 수정',    Admin: true,  HR: true,  TL: false, DL: false, Worker: false, note: '—' },
      { name: '승급 심사',      Admin: true,  HR: true,  TL: false, DL: false, Worker: false, note: '—' },
      { name: '이의 신청',      Admin: true,  HR: false, TL: false, DL: false, Worker: true,  note: 'Tech 본인' },
    ],
  },
  {
    category: '📦 SCM & 설비',
    items: [
      { name: '주문 현황 조회',   Admin: true,  HR: true,  TL: true,  DL: true,  Worker: false, note: '—' },
      { name: '작업 매칭 실행',   Admin: true,  HR: false, TL: false, DL: true,  Worker: false, note: '—' },
      { name: '설비 E_idx 설정', Admin: true,  HR: false, TL: false, DL: false, Worker: false, note: 'Admin 전용' },
    ],
  },
]

const ROLE_KEYS = ['Admin', 'HR', 'TL', 'DL', 'Worker']

// 원본 스냅샷 (비교용)
const originalMatrix = DUMMY_MATRIX.map(cat => ({
  ...cat,
  items: cat.items.map(item => ({ ...item })),
}))

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
      const orig = originalMatrix[catIdx].items[itemIdx]
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
      const orig = originalMatrix[catIdx].items[itemIdx]
      ROLE_KEYS.forEach(role => {
        if (item[role] !== orig[role]) {
          logs.push({
            category: cat.category,
            feature:  item.name,
            role,
            from: orig[role],
            to:   item[role],
          })
          // 원본 스냅샷 갱신
          originalMatrix[catIdx].items[itemIdx][role] = item[role]
        }
      })
    })
  })
  changeLogs.value = logs
  showLog.value = logs.length > 0
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
