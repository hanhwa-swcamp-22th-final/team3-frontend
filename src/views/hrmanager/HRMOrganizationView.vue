<script setup>
import { ref, computed, onMounted } from 'vue'
import HRMGroupAddModal from '@/components/hr/hrmanager/organization-management/HRMGroupAddModal.vue'
import HRMTeamAddModal  from '@/components/hr/hrmanager/organization-management/HRMTeamAddModalForm.vue'
import { BaseConfirmModal, BaseToast } from '@/components/common/base/overlay'
import hrApi from '@/services/hrApi'

const ROLE_LABELS = { WORKER: '사원', TL: '팀장', DL: '부서장', HRM: 'HR 매니저', ADMIN: '관리자' }
const DEPT_COLORS = [
  '#7c6fcd', '#4b89c8', '#1aaa8e', '#d94f6e',
  '#a07826', '#e07c7c', '#2bbfb0', '#e8a020',
]

// ── 상태 ─────────────────────────────────────────────────────────
const groups      = ref([])   // [{id, name, color, description, teams:[{id, name, memberCount, leader}]}]
const employees   = ref([])   // 전체 직원 목록 (모달 인력풀용)
const teamMembers = ref([])   // 선택된 팀의 멤버 목록

const treeSearch   = ref('')
const selectedTeam = ref(null)        // { groupId, team }
const selectedGroup = ref(null)       // 팀 추가 모달용 그룹
const selectedGroupDetail = ref(null) // 그룹 상세 패널

const showGroupModal      = ref(false)
const showGroupEditModal  = ref(false)
const showTeamModal       = ref(false)
const isEditMode          = ref(false)

const confirmModal = ref({ show: false, title: '', message: '', onConfirm: null })
function openConfirm(title, message, onConfirm) {
  confirmModal.value = { show: true, title, message, onConfirm }
}
function closeConfirm() {
  confirmModal.value = { show: false, title: '', message: '', onConfirm: null }
}
function handleConfirmOk() {
  confirmModal.value.onConfirm?.()
  closeConfirm()
}

const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer = null
function showToast(message, type = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 2500)
}

const tierFilter = ref('')
const posFilter  = ref('')
const nameSearch = ref('')

const TIERS     = ['S', 'A', 'B', 'C']
const POSITIONS = Object.values(ROLE_LABELS)

// 그룹 접기/펼치기
const collapsedGroups = ref(new Set())
function toggleGroup(groupId) {
  const next = new Set(collapsedGroups.value)
  if (next.has(groupId)) next.delete(groupId)
  else next.add(groupId)
  collapsedGroups.value = next
}
function isExpanded(groupId) {
  return !collapsedGroups.value.has(groupId)
}

// ── 데이터 로딩 ───────────────────────────────────────────────────
async function loadOrgTree() {
  try {
    const res = await hrApi.get('/api/v1/hr/org/units')
    const tree = res.data?.data
    if (!tree) return
    const roots = tree.children ?? (tree.type === 'DEPARTMENT' ? [tree] : [])
    groups.value = roots.map((dept, i) => ({
      id:          dept.unitId,
      name:        dept.unitName,
      color:       DEPT_COLORS[i % DEPT_COLORS.length],
      description: '',
      teams: (dept.children ?? []).map(team => ({
        id:          team.unitId,
        name:        team.unitName,
        description: '',
        memberCount: 0,
        leader:      null,
        leaderId:    null,
        memberIds:   [],
      })),
    }))
  } catch (e) {
    console.error('조직도 로딩 실패', e)
  }
}

async function loadEmployees() {
  try {
    const res = await hrApi.get('/api/v1/hr/org/employees', { params: { page: 0, size: 200 } })
    employees.value = res.data?.data ?? []
  } catch (e) {
    console.error('직원 목록 로딩 실패', e)
  }
}

onMounted(async () => {
  await Promise.all([loadOrgTree(), loadEmployees()])
})

// ── 유틸 ─────────────────────────────────────────────────────────
function tierColor(tier) {
  const map = { S: 'var(--tier-s)', A: 'var(--tier-a)', B: 'var(--tier-b)', C: 'var(--tier-c)' }
  return map[tier] ?? '#aaa'
}
function tierTextColor(tier) {
  return tier === 'B' ? '#1a1000' : 'var(--color-white)'
}
function positionOf(emp) {
  return { position: ROLE_LABELS[emp.role] ?? emp.role ?? '사원', dept: emp.departmentName ?? '기타' }
}
function isLeader(team, emp) {
  return emp.role === 'TL'
}
function leaderOf(team) {
  return team?.leader ?? null
}

const COLOR_NAMES = {
  '#7c6fcd': 'Purple Point', '#4b89c8': 'Blue Sky', '#1aaa8e': 'Teal Wave',
  '#d94f6e': 'Rose Red', '#a07826': 'Golden Brown', '#e07c7c': 'Coral Pink',
  '#2bbfb0': 'Cyan Mint', '#e8a020': 'Amber Gold',
}
function colorName(color) {
  return COLOR_NAMES[color?.toLowerCase()] ?? 'Custom'
}

// ── 트리 필터링 ───────────────────────────────────────────────────
const filteredGroups = computed(() => {
  const q = treeSearch.value.trim().toLowerCase()
  if (!q) return groups.value
  return groups.value
    .map(g => ({
      ...g,
      teams: g.teams.filter(t => t.name.toLowerCase().includes(q)),
    }))
    .filter(g => g.name.toLowerCase().includes(q) || g.teams.length > 0)
})

// ── 팀원 목록 필터링 ──────────────────────────────────────────────
const filteredMembers = computed(() => {
  if (!selectedTeam.value) return []
  return teamMembers.value.filter(emp => {
    if (tierFilter.value && emp.currentTier !== tierFilter.value) return false
    if (posFilter.value) {
      const { position } = positionOf(emp)
      if (position !== posFilter.value) return false
    }
    if (nameSearch.value && !emp.name.includes(nameSearch.value)) return false
    return true
  })
})

const selectedGroup$ = computed(() =>
  selectedTeam.value ? groups.value.find(g => g.id === selectedTeam.value.groupId) : null
)

// ── 그룹 전체 인원 수 ─────────────────────────────────────────────
const groupTotalMemberCount = computed(() => {
  if (!selectedGroupDetail.value) return 0
  return selectedGroupDetail.value.teams.reduce((s, t) => s + (t.memberCount ?? 0), 0)
})

// ── 인력풀 (모달용) ───────────────────────────────────────────────
const availableEmployees = computed(() => {
  const currentTeamId = isEditMode.value ? selectedTeam.value?.team?.id : null
  const usedIds = new Set()
  groups.value.forEach(g => g.teams.forEach(t => {
    if (t.id !== currentTeamId) (t.memberIds ?? []).forEach(id => usedIds.add(id))
  }))
  return employees.value.filter(e => e.employeeId && !usedIds.has(e.employeeId))
})

// ── 이벤트 핸들러 ─────────────────────────────────────────────────
async function selectGroup(group) {
  selectedGroupDetail.value = group
  selectedTeam.value = null
  // 팀별 멤버 수 갱신
  try {
    const res = await hrApi.get(`/api/v1/hr/org/departments/${group.id}`)
    const detail = res.data?.data
    if (detail?.teams) {
      detail.teams.forEach(t => {
        const team = group.teams.find(gt => gt.id === t.teamId)
        if (team) team.memberCount = t.memberCount
      })
    }
  } catch { /* ignore */ }
}

async function selectTeam(group, team) {
  selectedTeam.value = { groupId: group.id, team }
  selectedGroupDetail.value = null
  tierFilter.value = ''
  posFilter.value  = ''
  nameSearch.value = ''
  // 팀원 로딩
  try {
    const res = await hrApi.get(`/api/v1/hr/org/teams/${team.id}/members`)
    const data = res.data?.data
    if (data) {
      const leader  = data.leaderInfo
      const members = data.members ?? []
      teamMembers.value = leader ? [leader, ...members] : members
      team.leader      = leader
      team.leaderId    = leader?.employeeId ?? null
      team.memberIds   = teamMembers.value.map(m => m.employeeId)
      team.memberCount = teamMembers.value.length
    } else {
      teamMembers.value = []
    }
  } catch {
    teamMembers.value = []
  }
}

function openTeamModal(group) {
  selectedGroup.value = group
  isEditMode.value    = false
  showTeamModal.value = true
}

function openEditModal() {
  isEditMode.value    = true
  showTeamModal.value = true
}

function openGroupEditFromTree(group) {
  selectGroup(group)
  showGroupEditModal.value = true
}

function openTeamEditFromTree(group, team) {
  selectTeam(group, team)
  openEditModal()
}

// ── CRUD ──────────────────────────────────────────────────────────
async function handleGroupSubmit(data) {
  try {
    const res = await hrApi.post('/api/v1/hr/org/departments', {
      departmentName: data.name,
      depth: 'DEPARTMENT',
    })
    const newId = res.data?.data
    const color = DEPT_COLORS[groups.value.length % DEPT_COLORS.length]
    groups.value.push({ id: newId, name: data.name, color, description: data.description ?? '', teams: [] })
    showGroupModal.value = false
    showToast(`'${data.name}' 그룹이 추가되었습니다.`)
  } catch {
    showToast('그룹 추가에 실패했습니다.', 'error')
  }
}

async function handleGroupEditSubmit(data) {
  const group = selectedGroupDetail.value
  try {
    await hrApi.put(`/api/v1/hr/org/departments/${group.id}`, {
      departmentName: data.name,
      depth: 'DEPARTMENT',
    })
    group.name        = data.name
    group.description = data.description ?? ''
    group.color       = data.color
    showGroupEditModal.value = false
    showToast(`'${data.name}' 그룹이 수정되었습니다.`)
  } catch {
    showToast('그룹 수정에 실패했습니다.', 'error')
  }
}

async function handleTeamSubmit(data) {
  if (isEditMode.value) {
    const team = selectedTeam.value.team
    try {
      await hrApi.put(`/api/v1/hr/org/teams/${team.id}`, { teamName: data.name, leaderId: team.leaderId })

      const currentIds = new Set(team.memberIds ?? [])
      const newIds     = new Set(data.memberIds ?? [])
      const toAdd    = [...newIds].filter(id => !currentIds.has(id))
      const toRemove = [...currentIds].filter(id => !newIds.has(id))

      if (toAdd.length > 0)
        await hrApi.post(`/api/v1/hr/org/teams/${team.id}/members`, { employeeIds: toAdd })
      for (const id of toRemove)
        await hrApi.delete(`/api/v1/hr/org/teams/${team.id}/members/${id}`)

      team.name = data.name
      // 팀원 목록 재로딩
      await selectTeam(selectedGroup$?.value ?? groups.value.find(g => g.id === selectedTeam.value.groupId), team)
      showToast(`'${data.name}' 팀 정보가 수정되었습니다.`)
    } catch {
      showToast('팀 수정에 실패했습니다.', 'error')
    }
  } else {
    const group = groups.value.find(g => g.id === selectedGroup.value.id)
    if (!group) return
    try {
      const res = await hrApi.post(`/api/v1/hr/org/departments/${group.id}/teams`, {
        teamName: data.name,
        leaderId: null,
      })
      const newId = res.data?.data
      if (data.memberIds?.length > 0)
        await hrApi.post(`/api/v1/hr/org/teams/${newId}/members`, { employeeIds: data.memberIds })

      group.teams.push({
        id:          newId,
        name:        data.name,
        description: data.description ?? '',
        memberCount: data.memberIds?.length ?? 0,
        leader:      null,
        leaderId:    null,
        memberIds:   data.memberIds ?? [],
      })
      showToast(`'${data.name}' 팀이 추가되었습니다.`)
    } catch {
      showToast('팀 추가에 실패했습니다.', 'error')
    }
  }
  showTeamModal.value = false
}

function setLeader(team, emp) {
  showToast('팀장 지정은 역할 변경 메뉴에서 처리합니다.')
}

function removeMember(team, emp) {
  openConfirm(
    '팀원 제거',
    `${emp.name}님을 팀에서 제거하시겠습니까?`,
    async () => {
      try {
        await hrApi.delete(`/api/v1/hr/org/teams/${team.id}/members/${emp.employeeId}`)
        const idx = teamMembers.value.findIndex(m => m.employeeId === emp.employeeId)
        if (idx !== -1) teamMembers.value.splice(idx, 1)
        team.memberCount = Math.max(0, (team.memberCount ?? 1) - 1)
        team.memberIds = team.memberIds.filter(id => id !== emp.employeeId)
        showToast(`${emp.name}님을 팀에서 제거했습니다.`)
      } catch {
        showToast('팀원 제거에 실패했습니다.', 'error')
      }
    }
  )
}

function deleteTeam(group, team) {
  openConfirm(
    '팀 삭제',
    `'${team.name}' 팀을 삭제하시겠습니까?`,
    async () => {
      try {
        await hrApi.delete(`/api/v1/hr/org/teams/${team.id}`)
        group.teams = group.teams.filter(t => t.id !== team.id)
        if (selectedTeam.value?.team?.id === team.id) selectedTeam.value = null
        showToast(`'${team.name}' 팀이 삭제되었습니다.`)
      } catch {
        showToast('팀 삭제에 실패했습니다.', 'error')
      }
    }
  )
}

function deleteGroup(group) {
  openConfirm(
    '그룹 삭제',
    `'${group.name}' 그룹을 삭제하시겠습니까?\n소속된 모든 팀 정보도 함께 삭제됩니다.`,
    async () => {
      try {
        await hrApi.delete(`/api/v1/hr/org/departments/${group.id}`)
        groups.value = groups.value.filter(g => g.id !== group.id)
        if (group.teams.some(t => t.id === selectedTeam.value?.team?.id)) selectedTeam.value = null
        selectedGroupDetail.value = null
        showToast(`'${group.name}' 그룹이 삭제되었습니다.`)
      } catch {
        showToast('그룹 삭제에 실패했습니다.', 'error')
      }
    }
  )
}
</script>

<template>
  <div class="org-view">

    <!-- ── 좌측: 조직 구조 ── -->
    <aside class="org-tree">
      <div class="org-tree__header">
        <span class="org-tree__title">조직 구조</span>
        <button class="org-tree__add-btn" @click="showGroupModal = true">+ 그룹 추가</button>
      </div>

      <div class="org-tree__search-wrap">
        <span class="org-tree__search-icon">&#128269;</span>
        <input v-model="treeSearch" class="org-tree__search" placeholder="그룹 · 팀 검색" />
      </div>

      <div class="org-tree__list">
        <div v-for="group in filteredGroups" :key="group.id" class="group-node">

          <!-- 그룹 행 -->
          <div
            class="group-node__row"
            :class="{ 'group-node__row--active': selectedGroupDetail?.id === group.id }"
            @click="selectGroup(group)"
          >
            <button
              class="group-node__chevron"
              :class="{ 'group-node__chevron--open': isExpanded(group.id) }"
              @click.stop="toggleGroup(group.id)"
            >&gt;</button>
            <span class="group-node__dot" :style="{ background: group.color }" />
            <span class="group-node__name">{{ group.name }}</span>
            <div class="group-node__actions" @click.stop>
              <button class="group-node__action-btn group-node__action-btn--edit" @click.stop="openGroupEditFromTree(group)" title="편집">
                <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              </button>
              <button class="group-node__action-btn group-node__action-btn--add" @click.stop="openTeamModal(group)" title="팀 추가">
                <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M8 10H5V7H3v3H0v2h3v3h2v-3h3v-2zm10 1c1.66 0 2.99-1.34 2.99-3S19.66 5 18 5c-.32 0-.63.05-.91.14.57.81.9 1.79.9 2.86 0 1.07-.34 2.05-.9 2.86.28.09.59.14.91.14zm-5 0c1.66 0 2.99-1.34 2.99-3S14.66 5 13 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm6.62 2.16c.83.73 1.38 1.66 1.38 2.84v2h3v-2c0-1.54-2.37-2.49-4.38-3.84zM13 13c-2 0-6 1-6 3v2h12v-2c0-2-4-3-6-3z"/></svg>
              </button>
              <button class="group-node__action-btn group-node__action-btn--del" @click.stop="deleteGroup(group)" title="그룹 삭제">
                <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              </button>
            </div>
            <span class="group-node__count">{{ group.teams.length }}</span>
          </div>

          <!-- 팀 행들 -->
          <template v-if="isExpanded(group.id) || treeSearch.trim()">
            <div
              v-for="(team, idx) in group.teams"
              :key="team.id"
              class="team-node"
              :class="{ 'team-node--active': selectedTeam?.team?.id === team.id }"
              @click="selectTeam(group, team)"
            >
              <div
                class="team-node__connector"
                :class="{ 'team-node__connector--last': idx === group.teams.length - 1 }"
              />
              <svg class="team-node__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              <div class="team-node__info">
                <span class="team-node__name">{{ team.name }}</span>
                <div class="team-node__leader" v-if="leaderOf(team)">
                  <span class="team-node__leader-label">팀장 :</span>
                  <div class="team-node__leader-avatar">{{ leaderOf(team).name[0] }}</div>
                  <span class="team-node__leader-name">{{ leaderOf(team).name }}</span>
                </div>
                <div class="team-node__leader" v-else>
                  <span class="team-node__leader-label team-node__leader-label--empty">팀장 미지정</span>
                </div>
              </div>
              <div class="team-node__actions" @click.stop>
                <button class="team-node__edit-btn" @click.stop="openTeamEditFromTree(group, team)" title="편집">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                </button>
                <button class="team-node__del-btn" @click.stop="deleteTeam(group, team)" title="팀 삭제">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
              </div>
              <span class="team-node__count">{{ team.memberCount ?? 0 }}명</span>
            </div>
          </template>

        </div>

        <div v-if="filteredGroups.length === 0" class="org-tree__empty">검색 결과가 없습니다.</div>
      </div>
    </aside>

    <!-- ── 우측: 팀 상세 ── -->
    <section class="team-detail" v-if="selectedTeam">
      <!-- 헤더 -->
      <div class="team-detail__header">
        <div class="team-detail__breadcrumb">
          <span class="team-detail__dot" :style="{ background: selectedGroup$?.color }" />
          <span class="team-detail__group">{{ selectedGroup$?.name }}</span>
          <span class="team-detail__arrow"> &gt; </span>
          <span class="team-detail__team-name">{{ selectedTeam.team.name }}</span>
          <span class="team-detail__badge">팀</span>
        </div>
        <div class="team-detail__actions">
          <button class="team-detail__edit-btn" @click="openEditModal">편집</button>
          <button class="team-detail__delete-btn" @click="deleteTeam(selectedGroup$, selectedTeam.team)">삭제</button>
        </div>
      </div>
      <p class="team-detail__desc">{{ selectedTeam.team.description || '설명 없음' }}</p>

      <!-- 멤버 목록 -->
      <div class="team-detail__member-header">
        <span class="team-detail__member-title">팀원 목록</span>
        <div class="team-detail__filters">
          <select v-model="tierFilter" class="team-detail__select">
            <option value="">전체 Tier</option>
            <option v-for="t in TIERS" :key="t" :value="t">Tier {{ t }}</option>
          </select>
          <select v-model="posFilter" class="team-detail__select">
            <option value="">전체 직위</option>
            <option v-for="p in POSITIONS" :key="p" :value="p">{{ p }}</option>
          </select>
          <div class="team-detail__search-wrap">
            <span class="team-detail__search-icon">&#128269;</span>
            <input v-model="nameSearch" class="team-detail__search" placeholder="이름 검색" />
          </div>
        </div>
      </div>

      <div class="member-list">
        <div v-if="filteredMembers.length === 0" class="member-list__empty">
          해당 조건의 팀원이 없습니다.
        </div>
        <div v-for="emp in filteredMembers" :key="emp.employeeId" class="member-card">
          <div class="member-card__avatar"
            :style="{ background: tierColor(emp.currentTier) }"
          >{{ emp.name[0] }}</div>
          <div class="member-card__info">
            <div class="member-card__row1">
              <span class="member-card__name">{{ emp.name }}</span>
              <span class="member-card__tier"
                :style="{ background: tierColor(emp.currentTier), color: tierTextColor(emp.currentTier) }"
              >{{ emp.currentTier }}</span>
              <span v-if="isLeader(selectedTeam.team, emp)" class="member-card__leader-badge">팀장</span>
            </div>
            <p class="member-card__sub">
              {{ positionOf(emp).position }}·{{ positionOf(emp).dept }}
            </p>
          </div>
          <div class="member-card__actions">
            <button
              class="member-card__assign-btn"
              @click="setLeader(selectedTeam.team, emp)"
            >{{ isLeader(selectedTeam.team, emp) ? '팀장 해제' : '팀장 지정' }}</button>
            <button
              class="member-card__remove-btn"
              @click="removeMember(selectedTeam.team, emp)"
            >제거</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 그룹 상세 -->
    <section class="team-detail" v-else-if="selectedGroupDetail">
      <div class="team-detail__header">
        <div class="team-detail__breadcrumb">
          <span class="team-detail__dot" :style="{ background: selectedGroupDetail.color }" />
          <span class="team-detail__team-name">{{ selectedGroupDetail.name }}</span>
          <span class="team-detail__badge">그룹</span>
        </div>
        <div class="team-detail__actions">
          <button class="team-detail__edit-btn" @click="showGroupEditModal = true">편집</button>
          <button class="team-detail__delete-btn" @click="deleteGroup(selectedGroupDetail); selectedGroupDetail = null">삭제</button>
        </div>
      </div>
      <p class="team-detail__desc">{{ selectedGroupDetail.description || '설명 없음' }}</p>

      <!-- 통계 카드 -->
      <div class="group-detail__stats">
        <div class="group-detail__stat-card">
          <div class="group-detail__stat-icon group-detail__stat-icon--team">
            <svg class="org-icon org-icon--lg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </div>
          <div class="group-detail__stat-info">
            <span class="group-detail__stat-label">소속 팀</span>
            <div class="group-detail__stat-value">
              <span class="group-detail__stat-num">{{ selectedGroupDetail.teams.length }}</span>
              <span class="group-detail__stat-unit">개</span>
            </div>
          </div>
        </div>
        <div class="group-detail__stat-card">
          <div class="group-detail__stat-icon group-detail__stat-icon--person">
            <svg class="org-icon org-icon--lg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div class="group-detail__stat-info">
            <span class="group-detail__stat-label">전체 인원</span>
            <div class="group-detail__stat-value">
              <span class="group-detail__stat-num">{{ groupTotalMemberCount }}</span>
              <span class="group-detail__stat-unit">명</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 팀 구성 & 상세 -->
      <div class="group-detail__team-list">
        <div class="group-detail__team-list-header">
          <span class="team-detail__member-title">팀 구성 &amp; 상세</span>
          <button class="group-node__team-btn" @click="openTeamModal(selectedGroupDetail)">+ 팀 추가</button>
        </div>
        <div v-if="selectedGroupDetail.teams.length === 0" class="member-list__empty">소속 팀이 없습니다.</div>
        <div
          v-for="team in selectedGroupDetail.teams"
          :key="team.id"
          class="group-detail__team-card"
          @click="selectTeam(selectedGroupDetail, team)"
        >
          <div class="group-detail__team-card-icon" :style="{ background: selectedGroupDetail.color + '22', color: selectedGroupDetail.color }">
            <svg class="org-icon org-icon--md" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </div>
          <div class="group-detail__team-card-info">
            <span class="group-detail__team-card-name">{{ team.name }}</span>
            <p class="group-detail__team-card-desc">{{ team.description || '설명 없음' }}</p>
          </div>
          <div class="group-detail__team-card-stats">
            <div class="group-detail__team-card-count">
              <svg class="org-icon org-icon--sm" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              {{ team.memberCount ?? 0 }}명
            </div>
            <div class="group-detail__team-card-leader" v-if="leaderOf(team)">
              팀장 :
              <div class="group-detail__team-card-avatar">{{ leaderOf(team).name[0] }}</div>
              {{ leaderOf(team).name }}
            </div>
            <div class="group-detail__team-card-leader group-detail__team-card-leader--empty" v-else>팀장 미지정</div>
          </div>
          <svg class="group-detail__team-card-arrow" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
          </svg>
        </div>
      </div>
    </section>

    <!-- 미선택 시 -->
    <section class="team-detail team-detail--empty" v-else>
      <p>좌측에서 그룹 또는 팀을 선택하세요.</p>
    </section>

    <!-- ── 모달 ── -->
    <HRMGroupAddModal
      v-if="showGroupModal"
      @close="showGroupModal = false"
      @submit="handleGroupSubmit"
    />
    <HRMGroupAddModal
      v-if="showGroupEditModal && selectedGroupDetail"
      :edit-mode="true"
      :initial-name="selectedGroupDetail.name"
      :initial-description="selectedGroupDetail.description"
      :initial-color="selectedGroupDetail.color"
      @close="showGroupEditModal = false"
      @submit="handleGroupEditSubmit"
    />
    <HRMTeamAddModal
      v-if="showTeamModal"
      :all-employees="availableEmployees"
      :edit-mode="isEditMode"
      :initial-name="isEditMode ? selectedTeam?.team?.name : ''"
      :initial-description="isEditMode ? selectedTeam?.team?.description : ''"
      :initial-member-ids="isEditMode ? [...(selectedTeam?.team?.memberIds ?? [])] : []"
      @close="showTeamModal = false"
      @submit="handleTeamSubmit"
    />

    <BaseConfirmModal
      v-if="confirmModal.show"
      :title="confirmModal.title"
      :confirm-text="'삭제'"
      :cancel-text="'취소'"
      :width="'400px'"
      @close="closeConfirm"
      @cancel="closeConfirm"
      @confirm="handleConfirmOk"
    >
      <p class="org-confirm__message">{{ confirmModal.message }}</p>
    </BaseConfirmModal>

    <BaseToast :show="toast.show" :message="toast.message" :type="toast.type" />

  </div>
</template>

<style scoped>
.org-view {
  flex: 1; display: flex; gap: 20px;
  padding: 24px 28px;
  background: var(--color-bg-app);
  overflow: auto; min-height: 0;
}

/* ── 트리 ── */
.org-tree {
  width: 300px; flex-shrink: 0;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 14px;
  padding: 20px;
  display: flex; flex-direction: column; gap: 12px;
  align-self: flex-start;
}
.org-tree__header {
  display: flex; align-items: center; justify-content: space-between;
}
.org-tree__title {
  font-size: var(--font-size-lg); font-weight: var(--font-weight-extrabold); color: var(--color-primary-800);
}
.org-tree__add-btn {
  height: 30px; padding: 0 14px;
  background: var(--color-primary-600); color: var(--color-white);
  border: none; border-radius: 8px; font-size: var(--font-size-xs); font-weight: var(--font-weight-bold);
  cursor: pointer;
}
.org-tree__search-wrap {
  display: flex; align-items: center;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px; padding: 0 10px; height: 36px;
  background: var(--color-bg-app);
}
.org-tree__search-icon { font-size: var(--font-size-xs); color: #a89ed8; margin-right: 6px; }
.org-tree__search {
  border: none; outline: none; background: transparent;
  font-size: var(--font-size-sm); width: 100%; color: var(--color-primary-800);
}
.org-tree__list { display: flex; flex-direction: column; gap: 6px; }
.org-tree__empty { font-size: var(--font-size-xs); color: #a89ed8; text-align: center; padding: 16px 0; }

/* 그룹 노드 */
.group-node { display: flex; flex-direction: column; gap: 3px; }
.group-node__row {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 4px; border-radius: 8px; cursor: pointer;
  transition: background .12s;
}
.group-node__row:hover { background: var(--color-primary-100); }
.group-node__row--active { background: var(--color-primary-100); }

.group-node__chevron {
  background: none; border: none; cursor: pointer;
  font-size: 11px; color: var(--color-primary-400);
  padding: 0; width: 18px; text-align: center; flex-shrink: 0; line-height: 1;
  transition: transform .2s ease; display: inline-flex; align-items: center; justify-content: center;
}
.group-node__chevron--open {
  transform: rotate(90deg);
}
.group-node__dot {
  width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
}
.group-node__name {
  flex: 1; font-size: var(--font-size-base); font-weight: var(--font-weight-bold); color: var(--color-primary-800);
}
.group-node__team-btn {
  height: 32px; padding: 0 16px;
  background: var(--color-primary-100); color: var(--color-primary-600);
  border: 1.5px solid var(--color-primary-300);
  border-radius: 8px; font-size: var(--font-size-xs); font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: background .12s, border-color .12s;
}
.group-node__team-btn:hover { background: var(--color-primary-200); border-color: var(--color-primary-400); }
.group-node__count {
  min-width: 20px; height: 20px; padding: 0 6px;
  background: var(--color-primary-100); color: var(--color-primary-600);
  border-radius: 10px; font-size: var(--font-size-xs); font-weight: var(--font-weight-bold);
  display: flex; align-items: center; justify-content: center;
}
.group-node__actions {
  display: flex; align-items: center; gap: 4px;
  opacity: 0; pointer-events: none;
  transition: opacity .15s;
}
.group-node__row:hover .group-node__actions,
.group-node__row--active .group-node__actions {
  opacity: 1; pointer-events: auto;
}
.group-node__action-btn {
  height: 22px; padding: 0 8px;
  background: var(--color-primary-100); color: var(--color-primary-600);
  border: 1.5px solid var(--color-primary-300);
  border-radius: 6px; font-size: var(--font-size-2xs); font-weight: var(--font-weight-bold);
  cursor: pointer; white-space: nowrap;
  transition: background .12s, border-color .12s;
}
.group-node__action-btn--edit,
.group-node__action-btn--add {
  background: var(--color-primary-100); color: var(--color-primary-600);
  border-color: var(--color-primary-300);
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; padding: 0;
}
.group-node__action-btn--edit:hover,
.group-node__action-btn--add:hover { background: var(--color-primary-200); border-color: var(--color-primary-400); }
.group-node__action-btn--del {
  background: #fff0f0; color: #c53030;
  border-color: #f5bcbc;
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; padding: 0;
}
.group-node__action-btn--del:hover { background: #ffe0e0; border-color: #e88080; }

/* 팀 노드 */
.team-node {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 8px 7px 4px;
  border-radius: 8px; cursor: pointer;
  transition: background .12s;
}
.team-node:hover { background: var(--color-primary-100); }
.team-node--active { background: var(--color-primary-100); }

/* 트리 연결선 */
.team-node__connector {
  width: 20px; flex-shrink: 0;
  position: relative; align-self: stretch;
}
.team-node__connector::before {
  content: '';
  position: absolute;
  left: 10px; top: 0; bottom: 0;
  border-left: 1.5px solid var(--color-border-default);
}
.team-node__connector::after {
  content: '';
  position: absolute;
  left: 10px; top: 50%;
  width: 10px; height: 0;
  border-top: 1.5px solid var(--color-border-default);
}
.team-node__connector--last::before { bottom: 50%; }

.team-node__icon { width: 16px; height: 16px; flex-shrink: 0; color: var(--color-primary-500); }
.team-node__info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.team-node__name {
  font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-primary-700);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.team-node__leader { display: flex; align-items: center; gap: 4px; }
.team-node__leader-label { font-size: var(--font-size-2xs); color: var(--color-text-muted); }
.team-node__leader-label--empty { font-style: italic; }
.team-node__leader-avatar {
  width: 16px; height: 16px; border-radius: 50%;
  background: var(--color-primary-200); color: var(--color-primary-700);
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: var(--font-weight-bold); flex-shrink: 0;
}
.team-node__leader-name {
  font-size: var(--font-size-2xs); color: var(--color-primary-600); font-weight: var(--font-weight-semibold);
}
.team-node__count { font-size: var(--font-size-xs); color: #a89ed8; flex-shrink: 0; }
.team-node__actions {
  display: flex; align-items: center; gap: 4px;
  opacity: 0; pointer-events: none;
  transition: opacity .15s;
}
.team-node:hover .team-node__actions,
.team-node--active .team-node__actions {
  opacity: 1; pointer-events: auto;
}
.team-node__edit-btn {
  height: 22px; width: 22px; padding: 0;
  background: var(--color-primary-100); color: var(--color-primary-600);
  border: 1.5px solid var(--color-primary-300);
  border-radius: 6px; cursor: pointer; flex-shrink: 0;
  display: inline-flex; align-items: center; justify-content: center;
  transition: background .12s, border-color .12s;
}
.team-node__edit-btn:hover { background: var(--color-primary-200); border-color: var(--color-primary-400); }
.team-node__del-btn {
  height: 22px; width: 22px; padding: 0;
  background: #fff0f0; color: #c53030;
  border: 1.5px solid #f5bcbc;
  border-radius: 6px; cursor: pointer; flex-shrink: 0;
  display: inline-flex; align-items: center; justify-content: center;
  transition: background .12s, border-color .12s;
}
.team-node__del-btn:hover { background: #ffe0e0; border-color: #e88080; }

/* ── 팀 상세 ── */
.team-detail {
  flex: 1; background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 14px; padding: 24px;
  display: flex; flex-direction: column; gap: 16px;
  align-self: flex-start; min-width: 0;
}
.team-detail--empty {
  align-items: center; justify-content: center;
  color: #a89ed8; font-size: var(--font-size-base);
}

.team-detail__header {
  display: flex; align-items: center; justify-content: space-between;
}
.team-detail__actions {
  display: flex; align-items: center; gap: 10px; margin-left: auto;
}
.team-detail__breadcrumb {
  display: flex; align-items: center; gap: 6px;
}
.team-detail__dot {
  width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
}
.team-detail__group { font-size: var(--font-size-base); color: var(--color-primary-600); font-weight: var(--font-weight-semibold); }
.team-detail__arrow { font-size: var(--font-size-sm); color: #a89ed8; }
.team-detail__team-name { font-size: var(--font-size-base); font-weight: var(--font-weight-extrabold); color: var(--color-primary-800); }
.team-detail__badge {
  padding: 2px 8px; background: var(--color-primary-100);
  color: var(--color-primary-600); border-radius: 6px;
  font-size: var(--font-size-xs); font-weight: var(--font-weight-bold);
}
.team-detail__edit-btn {
  height: 32px; padding: 0 16px;
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px; font-size: var(--font-size-sm); font-weight: var(--font-weight-bold);
  color: var(--color-primary-600); cursor: pointer;
}
.team-detail__delete-btn {
  height: 32px; padding: 0 14px;
  background: var(--color-danger); color: var(--color-white);
  border: none; border-radius: 8px; font-size: var(--font-size-xs); font-weight: var(--font-weight-bold);
  cursor: pointer;
}
.team-detail__desc { font-size: var(--font-size-sm); color: #7a6fa8; }

.team-detail__member-header {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;
}
.team-detail__member-title {
  font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-primary-800);
}
.team-detail__filters { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.team-detail__select {
  height: 32px; padding: 0 10px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px; font-size: var(--font-size-xs);
  color: var(--color-primary-600); background: var(--color-bg-app); cursor: pointer;
}
.team-detail__search-wrap {
  display: flex; align-items: center;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px; padding: 0 10px; height: 32px;
  background: var(--color-bg-app);
}
.team-detail__search-icon { font-size: var(--font-size-xs); color: #a89ed8; margin-right: 4px; }
.team-detail__search {
  border: none; outline: none; background: transparent;
  font-size: var(--font-size-xs); color: var(--color-primary-800); width: 130px;
}

/* 멤버 카드 */
.member-list {
  display: flex; flex-direction: column; gap: 8px;
}
.member-list__empty {
  font-size: var(--font-size-sm); color: #a89ed8; text-align: center; padding: 24px 0;
}
.member-card {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px;
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-border-default);
  border-radius: 10px;
}
.member-card__avatar {
  width: 38px; height: 38px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: var(--font-size-base); font-weight: var(--font-weight-extrabold); color: var(--color-white);
  flex-shrink: 0;
}
.member-card__info { flex: 1; }
.member-card__row1 { display: flex; align-items: center; gap: 6px; }
.member-card__name { font-size: var(--font-size-base); font-weight: var(--font-weight-bold); color: var(--color-primary-800); }
.member-card__tier {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 50%;
  font-size: var(--font-size-2xs); font-weight: var(--font-weight-extrabold);
}
.member-card__leader-badge {
  padding: 2px 6px;
  background: var(--color-primary-600); color: var(--color-white);
  border-radius: 4px; font-size: var(--font-size-2xs); font-weight: var(--font-weight-bold);
}
.member-card__sub { font-size: var(--font-size-xs); color: #7a6fa8; margin-top: 2px; }
.member-card__actions { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }
.member-card__assign-btn {
  height: 32px; padding: 0 14px;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px; font-size: var(--font-size-xs); font-weight: var(--font-weight-bold);
  color: var(--color-primary-600); cursor: pointer;
}
.member-card__remove-btn {
  height: 32px; padding: 0 14px;
  background: var(--color-danger); color: var(--color-white);
  border: none; border-radius: 8px; font-size: var(--font-size-xs); font-weight: var(--font-weight-bold);
  cursor: pointer;
}

/* ── 그룹 상세 ── */
.group-detail__stats { display: flex; gap: 16px; }
.group-detail__stat-card {
  flex: 1; display: flex; align-items: center; gap: 14px;
  padding: 18px 20px;
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-border-default);
  border-radius: 12px;
}
/* SVG 아이콘 공통 */
.org-icon { display: block; flex-shrink: 0; }
.org-icon--lg { width: 26px; height: 26px; }
.org-icon--md { width: 22px; height: 22px; }
.org-icon--sm { width: 15px; height: 15px; }

.group-detail__stat-icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.group-detail__stat-icon--team { background: var(--color-primary-100); color: var(--color-primary-600); }
.group-detail__stat-icon--person { background: #ededf7; color: var(--color-primary-600); }
.group-detail__stat-info { display: flex; flex-direction: column; gap: 4px; }
.group-detail__stat-label { font-size: var(--font-size-xs); color: var(--color-text-muted); }
.group-detail__stat-value { display: flex; align-items: baseline; gap: 3px; }
.group-detail__stat-num {
  font-size: 26px; font-weight: var(--font-weight-extrabold); color: var(--color-primary-800);
}
.group-detail__stat-unit {
  font-size: var(--font-size-sm); color: var(--color-primary-700); font-weight: var(--font-weight-semibold);
}

.group-detail__team-list { display: flex; flex-direction: column; gap: 10px; }
.group-detail__team-list-header {
  display: flex; align-items: center; justify-content: space-between;
}

/* 팀 카드 */
.group-detail__team-card {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px;
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-border-default);
  border-radius: 12px;
  cursor: pointer;
  transition: border-color .15s, background .12s;
}
.group-detail__team-card:hover { border-color: var(--color-primary-300); background: var(--color-primary-50, #f7f5ff); }
.group-detail__team-card-icon {
  width: 46px; height: 46px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.group-detail__team-card-info { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.group-detail__team-card-name {
  font-size: var(--font-size-base); font-weight: var(--font-weight-bold); color: var(--color-primary-800);
}
.group-detail__team-card-desc {
  font-size: var(--font-size-xs); color: var(--color-text-muted);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.group-detail__team-card-stats {
  display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0;
}
.group-detail__team-card-count {
  display: flex; align-items: center; gap: 4px;
  font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-primary-700);
}
.group-detail__team-card-leader {
  display: flex; align-items: center; gap: 5px;
  font-size: var(--font-size-xs); color: var(--color-text-muted);
}
.group-detail__team-card-avatar {
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--color-primary-200); color: var(--color-primary-700);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: var(--font-weight-bold); flex-shrink: 0;
}
.group-detail__team-card-leader--empty { font-style: italic; }
.group-detail__team-card-arrow {
  width: 18px; height: 18px; flex-shrink: 0;
  color: var(--color-text-muted);
}

.org-confirm__message {
  font-size: var(--font-size-sm); color: var(--color-primary-800);
  white-space: pre-line;
}
</style>
