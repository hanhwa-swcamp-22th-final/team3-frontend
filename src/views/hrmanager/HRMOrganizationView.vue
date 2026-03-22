<script setup>
import { ref, computed, onMounted } from 'vue'
import { mockOrganization, POSITION_MAP } from '@/mocks/hrmanager/organization.js'
import HRMGroupAddModal from '@/components/hr/hrmanager/organization-management/HRMGroupAddModal.vue'
import HRMTeamAddModal  from '@/components/hr/hrmanager/organization-management/HRMTeamAddModalForm.vue'

const API = 'http://localhost:3001'

// ── 상태 ─────────────────────────────────────────────────────────
const employees    = ref([])
const groups       = ref(mockOrganization.map(g => ({ ...g, teams: g.teams.map(t => ({ ...t, memberIds: [...t.memberIds] })) })))

const treeSearch   = ref('')
const selectedTeam = ref(null)   // { groupId, team }
const selectedGroup = ref(null)  // 팀 추가 모달 열 때 어느 그룹인지

const showGroupModal     = ref(false)
const showGroupEditModal = ref(false)
const showTeamModal      = ref(false)
const isEditMode         = ref(false)
const selectedGroupDetail = ref(null)

const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer = null
function showToast(message, type = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 2500)
}

const tierFilter   = ref('')
const posFilter    = ref('')
const nameSearch   = ref('')

const TIERS    = ['S', 'A', 'B', 'C']
const POSITIONS = ['팀장', '선임연구원', '대리', '주임', '사원', '과장']

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
function leaderOf(team) {
  if (!team.leaderId) return null
  return employees.value.find(e => e.employee_id === team.leaderId) ?? null
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

// ── 인력풀 필터링 (이미 다른 팀에 속한 직원 제외) ──────────────────
const availableEmployees = computed(() => {
  const currentTeamId = isEditMode.value ? selectedTeam.value?.team?.id : null
  const usedIds = new Set()
  groups.value.forEach(g => g.teams.forEach(t => {
    if (t.id !== currentTeamId) t.memberIds.forEach(id => usedIds.add(id))
  }))
  return employees.value.filter(e => e.employee_id && !usedIds.has(e.employee_id))
})

// ── 이벤트 핸들러 ─────────────────────────────────────────────────
function selectGroup(group) {
  selectedGroupDetail.value = group
  selectedTeam.value = null
}

function selectTeam(group, team) {
  selectedTeam.value = { groupId: group.id, team }
  selectedGroupDetail.value = null
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
  showToast(`'${data.name}' 그룹이 추가되었습니다.`)
}

function handleGroupEditSubmit(data) {
  const group = selectedGroupDetail.value
  group.name        = data.name
  group.description = data.description
  group.color       = data.color
  showGroupEditModal.value = false
  showToast(`'${data.name}' 그룹이 수정되었습니다.`)
}

function handleTeamSubmit(data) {
  if (isEditMode.value) {
    const team = selectedTeam.value.team
    team.name        = data.name
    team.description = data.description
    team.memberIds   = data.memberIds
    showToast(`'${data.name}' 팀 정보가 수정되었습니다.`)
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
    showToast(`'${data.name}' 팀이 추가되었습니다.`)
  }
  showTeamModal.value = false
}

function setLeader(team, emp) {
  const wasLeader = team.leaderId === emp.employee_id
  team.leaderId = wasLeader ? null : emp.employee_id
  showToast(wasLeader ? '팀장을 해제했습니다.' : `${emp.employee_name}님을 팀장으로 지정했습니다.`)
}

function removeMember(team, emp) {
  if (!confirm(`${emp.employee_name}님을 팀에서 제거하시겠습니까?`)) return
  const idx = team.memberIds.indexOf(emp.employee_id)
  if (idx !== -1) team.memberIds.splice(idx, 1)
  if (team.leaderId === emp.employee_id) team.leaderId = null
  showToast(`${emp.employee_name}님을 팀에서 제거했습니다.`)
}

function deleteTeam(group, team) {
  if (!confirm(`'${team.name}' 팀을 삭제하시겠습니까?`)) return
  group.teams = group.teams.filter(t => t.id !== team.id)
  if (selectedTeam.value?.team?.id === team.id) selectedTeam.value = null
  showToast(`'${team.name}' 팀이 삭제되었습니다.`)
}

function deleteGroup(group) {
  if (!confirm(`'${group.name}' 그룹을 삭제하시겠습니까?\n소속된 모든 팀 정보도 함께 삭제됩니다.`)) return
  groups.value = groups.value.filter(g => g.id !== group.id)
  if (group.teams.some(t => t.id === selectedTeam.value?.team?.id)) selectedTeam.value = null
  selectedGroupDetail.value = null
  showToast(`'${group.name}' 그룹이 삭제되었습니다.`)
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
                  <div class="team-node__leader-avatar">{{ leaderOf(team).employee_name[0] }}</div>
                  <span class="team-node__leader-name">{{ leaderOf(team).employee_name }}</span>
                </div>
                <div class="team-node__leader" v-else>
                  <span class="team-node__leader-label team-node__leader-label--empty">팀장 미지정</span>
                </div>
              </div>
              <span class="team-node__count">{{ team.memberIds.length }}명</span>
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
              <span class="group-detail__stat-num">{{ selectedGroupDetail.teams.reduce((s, t) => s + t.memberIds.length, 0) }}</span>
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
              {{ team.memberIds.length }}명
            </div>
            <div class="group-detail__team-card-leader" v-if="leaderOf(team)">
              팀장 :
              <div class="group-detail__team-card-avatar">{{ leaderOf(team).employee_name[0] }}</div>
              {{ leaderOf(team).employee_name }}
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

    <Transition name="org-toast">
      <div v-if="toast.show" class="org-toast" :class="`org-toast--${toast.type}`">
        <span class="org-toast__icon">{{ toast.type === 'error' ? '!' : '✓' }}</span>
        {{ toast.message }}
      </div>
    </Transition>

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
  color: var(--color-primary-300);
  transition: color .12s;
}
.group-detail__team-card:hover .group-detail__team-card-arrow { color: var(--color-primary-500); }

/* ── 토스트 ── */
.org-toast {
  position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 8px;
  padding: 12px 20px; border-radius: 10px;
  font-size: var(--font-size-sm); font-weight: var(--font-weight-bold);
  color: var(--color-white); z-index: 9999;
  box-shadow: 0 4px 16px rgba(0,0,0,.15);
}
.org-toast--success { background: var(--color-primary-700); }
.org-toast--error   { background: var(--color-danger); }
.org-toast__icon {
  width: 18px; height: 18px; border-radius: 50%;
  background: rgba(255,255,255,.25);
  display: flex; align-items: center; justify-content: center;
  font-size: var(--font-size-xs); font-weight: var(--font-weight-extrabold); flex-shrink: 0;
}
.org-toast-enter-active,
.org-toast-leave-active { transition: all 0.25s ease; }
.org-toast-enter-from   { opacity: 0; transform: translateX(-50%) translateY(12px); }
.org-toast-leave-to     { opacity: 0; transform: translateX(-50%) translateY(12px); }
</style>
