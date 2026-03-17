<script setup>
import { ref, computed, onMounted } from 'vue'
import { mockOrganization, POSITION_MAP } from '@/mocks/hrmanager/organization.js'
import HRMGroupAddModal from '@/components/hrmanager/hr/HRMGroupAddModal.vue'
import HRMTeamAddModal  from '@/components/hrmanager/hr/HRMTeamAddModal.vue'

const API = 'http://localhost:3001'

// ── 상태 ─────────────────────────────────────────────────────────
const employees    = ref([])
const groups       = ref(mockOrganization.map(g => ({ ...g, teams: g.teams.map(t => ({ ...t, memberIds: [...t.memberIds] })) })))

const treeSearch   = ref('')
const selectedTeam = ref(null)   // { groupId, team }
const selectedGroup = ref(null)  // 팀 추가 모달 열 때 어느 그룹인지

const showGroupModal = ref(false)
const showTeamModal  = ref(false)
const isEditMode     = ref(false)

const tierFilter   = ref('')
const posFilter    = ref('')
const nameSearch   = ref('')

const TIERS    = ['S', 'A', 'B', 'C']
const POSITIONS = ['팀장', '선임연구원', '대리', '주임', '사원', '과장']

// ── 데이터 로딩 ───────────────────────────────────────────────────
onMounted(async () => {
  try {
    const data = await fetch(`${API}/employees`).then(r => r.json())
    employees.value = data
  } catch (e) {
    console.error('직원 데이터 로딩 실패', e)
  }
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
  return POSITION_MAP[emp.employee_id] ?? { position: '사원', dept: '기타' }
}
function employeesOfTeam(team) {
  return employees.value.filter(e => team.memberIds.includes(e.employee_id))
}
function isLeader(team, emp) {
  return team.leaderId === emp.employee_id
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
  const members = employeesOfTeam(selectedTeam.value.team)
  return members.filter(emp => {
    if (tierFilter.value && emp.employee_current_tier !== tierFilter.value) return false
    const { position } = positionOf(emp)
    if (posFilter.value && position !== posFilter.value) return false
    if (nameSearch.value && !emp.employee_name.includes(nameSearch.value)) return false
    return true
  })
})

const selectedGroup$ = computed(() =>
  selectedTeam.value ? groups.value.find(g => g.id === selectedTeam.value.groupId) : null
)

// ── 이벤트 핸들러 ─────────────────────────────────────────────────
function selectTeam(group, team) {
  selectedTeam.value = { groupId: group.id, team }
  tierFilter.value = ''
  posFilter.value  = ''
  nameSearch.value = ''
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

function handleGroupSubmit(data) {
  groups.value.push({
    id:          Date.now(),
    name:        data.name,
    description: data.description,
    color:       data.color,
    teams:       [],
  })
  showGroupModal.value = false
}

function handleTeamSubmit(data) {
  if (isEditMode.value) {
    const team = selectedTeam.value.team
    team.name        = data.name
    team.description = data.description
    team.memberIds   = data.memberIds
  } else {
    const group = groups.value.find(g => g.id === selectedGroup.value.id)
    if (!group) return
    group.teams.push({
      id:          Date.now(),
      name:        data.name,
      description: data.description,
      memberIds:   data.memberIds,
      leaderId:    null,
    })
  }
  showTeamModal.value = false
}

function setLeader(team, emp) {
  team.leaderId = team.leaderId === emp.employee_id ? null : emp.employee_id
}

function removeMember(team, emp) {
  const idx = team.memberIds.indexOf(emp.employee_id)
  if (idx !== -1) team.memberIds.splice(idx, 1)
  if (team.leaderId === emp.employee_id) team.leaderId = null
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
          <div class="group-node__row">
            <span class="group-node__dot" :style="{ background: group.color }" />
            <span class="group-node__name">{{ group.name }}</span>
            <button class="group-node__team-btn" @click="openTeamModal(group)">+팀 추가</button>
            <span class="group-node__count">{{ group.teams.length }}</span>
          </div>

          <!-- 팀 행들 -->
          <div
            v-for="team in group.teams"
            :key="team.id"
            class="team-node"
            :class="{ 'team-node--active': selectedTeam?.team?.id === team.id }"
            @click="selectTeam(group, team)"
          >
            <span class="team-node__icon">&#128101;</span>
            <span class="team-node__name">{{ team.name }}</span>
            <span class="team-node__count">{{ team.memberIds.length }}명</span>
          </div>
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
        <button class="team-detail__edit-btn" @click="openEditModal">편집</button>
      </div>
      <p class="team-detail__desc">{{ selectedTeam.team.description || '설명 없음' }}</p>

      <!-- 멤버 목록 -->
      <div class="team-detail__member-header">
        <span class="team-detail__member-title">탈원 목록</span>
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
        <div v-for="emp in filteredMembers" :key="emp.employee_id" class="member-card">
          <div class="member-card__avatar"
            :style="{ background: tierColor(emp.employee_current_tier) }"
          >{{ emp.employee_name[0] }}</div>
          <div class="member-card__info">
            <div class="member-card__row1">
              <span class="member-card__name">{{ emp.employee_name }}</span>
              <span class="member-card__tier"
                :style="{ background: tierColor(emp.employee_current_tier), color: tierTextColor(emp.employee_current_tier) }"
              >{{ emp.employee_current_tier }}</span>
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

    <!-- 팀 미선택 시 -->
    <section class="team-detail team-detail--empty" v-else>
      <p>좌측에서 팀을 선택하세요.</p>
    </section>

    <!-- ── 모달 ── -->
    <HRMGroupAddModal
      v-if="showGroupModal"
      @close="showGroupModal = false"
      @submit="handleGroupSubmit"
    />
    <HRMTeamAddModal
      v-if="showTeamModal"
      :all-employees="employees"
      :edit-mode="isEditMode"
      :initial-name="isEditMode ? selectedTeam?.team?.name : ''"
      :initial-description="isEditMode ? selectedTeam?.team?.description : ''"
      :initial-member-ids="isEditMode ? [...(selectedTeam?.team?.memberIds ?? [])] : []"
      @close="showTeamModal = false"
      @submit="handleTeamSubmit"
    />

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
  font-size: 15px; font-weight: 800; color: var(--color-primary-800);
}
.org-tree__add-btn {
  height: 30px; padding: 0 14px;
  background: var(--color-primary-600); color: var(--color-white);
  border: none; border-radius: 8px; font-size: 12px; font-weight: 700;
  cursor: pointer;
}
.org-tree__search-wrap {
  display: flex; align-items: center;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px; padding: 0 10px; height: 36px;
  background: var(--color-bg-app);
}
.org-tree__search-icon { font-size: 12px; color: #a89ed8; margin-right: 6px; }
.org-tree__search {
  border: none; outline: none; background: transparent;
  font-size: 13px; width: 100%; color: var(--color-primary-800);
}
.org-tree__list { display: flex; flex-direction: column; gap: 6px; }
.org-tree__empty { font-size: 12px; color: #a89ed8; text-align: center; padding: 16px 0; }

/* 그룹 노드 */
.group-node { display: flex; flex-direction: column; gap: 3px; }
.group-node__row {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 4px;
}
.group-node__dot {
  width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
}
.group-node__name {
  flex: 1; font-size: 14px; font-weight: 700; color: var(--color-primary-800);
}
.group-node__team-btn {
  height: 22px; padding: 0 8px;
  background: var(--color-primary-100); color: var(--color-primary-600);
  border: 1px solid var(--color-primary-200);
  border-radius: 6px; font-size: 10px; font-weight: 700;
  cursor: pointer;
}
.group-node__count {
  min-width: 20px; height: 20px; padding: 0 6px;
  background: var(--color-primary-100); color: var(--color-primary-600);
  border-radius: 10px; font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}

/* 팀 노드 */
.team-node {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 8px 7px 20px;
  border-radius: 8px; cursor: pointer;
  transition: background .12s;
}
.team-node:hover { background: var(--color-primary-100); }
.team-node--active { background: var(--color-primary-100); }
.team-node__icon { font-size: 13px; }
.team-node__name { flex: 1; font-size: 13px; font-weight: 600; color: var(--color-primary-700); }
.team-node__count { font-size: 11px; color: #a89ed8; }

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
  color: #a89ed8; font-size: 14px;
}

.team-detail__header {
  display: flex; align-items: center; justify-content: space-between;
}
.team-detail__breadcrumb {
  display: flex; align-items: center; gap: 6px;
}
.team-detail__dot {
  width: 10px; height: 10px; border-radius: 50;
}
.team-detail__group { font-size: 14px; color: var(--color-primary-600); font-weight: 600; }
.team-detail__arrow { font-size: 13px; color: #a89ed8; }
.team-detail__team-name { font-size: 15px; font-weight: 800; color: var(--color-primary-800); }
.team-detail__badge {
  padding: 2px 8px; background: var(--color-primary-100);
  color: var(--color-primary-600); border-radius: 6px;
  font-size: 11px; font-weight: 700;
}
.team-detail__edit-btn {
  height: 32px; padding: 0 16px;
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px; font-size: 13px; font-weight: 700;
  color: var(--color-primary-600); cursor: pointer;
}
.team-detail__desc { font-size: 13px; color: #7a6fa8; }

.team-detail__member-header {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;
}
.team-detail__member-title {
  font-size: 13px; font-weight: 700; color: var(--color-primary-800);
}
.team-detail__filters { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.team-detail__select {
  height: 32px; padding: 0 10px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px; font-size: 12px;
  color: var(--color-primary-600); background: var(--color-bg-app); cursor: pointer;
}
.team-detail__search-wrap {
  display: flex; align-items: center;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px; padding: 0 10px; height: 32px;
  background: var(--color-bg-app);
}
.team-detail__search-icon { font-size: 12px; color: #a89ed8; margin-right: 4px; }
.team-detail__search {
  border: none; outline: none; background: transparent;
  font-size: 12px; color: var(--color-primary-800); width: 130px;
}

/* 멤버 카드 */
.member-list {
  display: flex; flex-direction: column; gap: 8px;
}
.member-list__empty {
  font-size: 13px; color: #a89ed8; text-align: center; padding: 24px 0;
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
  font-size: 14px; font-weight: 800; color: var(--color-white);
  flex-shrink: 0;
}
.member-card__info { flex: 1; }
.member-card__row1 { display: flex; align-items: center; gap: 6px; }
.member-card__name { font-size: 14px; font-weight: 700; color: var(--color-primary-800); }
.member-card__tier {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 50%;
  font-size: 10px; font-weight: 800;
}
.member-card__leader-badge {
  padding: 2px 6px;
  background: var(--color-primary-600); color: var(--color-white);
  border-radius: 4px; font-size: 10px; font-weight: 700;
}
.member-card__sub { font-size: 12px; color: #7a6fa8; margin-top: 2px; }
.member-card__actions { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }
.member-card__assign-btn {
  height: 32px; padding: 0 14px;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px; font-size: 12px; font-weight: 700;
  color: var(--color-primary-600); cursor: pointer;
}
.member-card__remove-btn {
  height: 32px; padding: 0 14px;
  background: var(--color-danger); color: var(--color-white);
  border: none; border-radius: 8px; font-size: 12px; font-weight: 700;
  cursor: pointer;
}
</style>
