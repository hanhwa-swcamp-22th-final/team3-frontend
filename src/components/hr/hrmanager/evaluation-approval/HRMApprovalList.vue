<script setup>
import { ref, computed, watch } from 'vue'
import BaseFilterTabs from '@/components/common/base/navigation/BaseFilterTabs.vue'
import { BaseEmptyState } from '@/components/common/base'
import EvaluationMemberCard from '@/components/hr/common/evaluation/EvaluationMemberCard.vue'

const props = defineProps({
  list:           { type: Array,  required: true },
  pendingCount:   { type: Number, required: true },
  heldCount:      { type: Number, default: 0 },
  processedCount: { type: Number, default: 0 },
  tabs:           { type: Array,  required: true },
  activeTab:      { type: String, required: true },
  selectedId:     { default: null },
  pendingLabel:   { type: String, default: '이의신청 검토 대기' },
  heldLabel:      { type: String, default: '보류' },
  processedLabel: { type: String, default: '처리 완료' },
  emptyText:      { type: String, default: '승인 대기 내역이 없습니다.' },
  mode:           { type: String, default: 'appeal' },
  pageSize:       { type: Number, default: 5 },
})
const emit = defineEmits(['tab-change', 'select'])

const search = ref('')
const currentPage = ref(1)
const deptFilter = ref('전체')
const teamFilter = ref('전체')
const statusFilter = ref('전체')
const deptDropdownOpen = ref(false)
const teamDropdownOpen = ref(false)
const statusDropdownOpen = ref(false)

const statusConfig = {
  submitted:   { label: '확정 완료' },
  in_progress: { label: '검토 대기' },
  not_started: { label: '미작성' },
}

const statusOptions = [
  { value: '전체',        label: '전체' },
  { value: 'in_progress', label: '검토 대기' },
  { value: 'submitted',   label: '확정 완료' },
]

const departments = computed(() => ['전체', ...new Set(props.list.map(i => i.department).filter(Boolean))])
const teams = computed(() => {
  const base = props.list.filter(i => deptFilter.value === '전체' || i.department === deptFilter.value)
  return ['전체', ...new Set(base.map(i => i.team).filter(Boolean))]
})

const filteredEvalList = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  return props.list.filter(item => {
    const matchDept   = deptFilter.value   === '전체' || item.department === deptFilter.value
    const matchTeam   = teamFilter.value   === '전체' || item.team       === teamFilter.value
    const matchStatus = statusFilter.value === '전체' || item.status     === statusFilter.value
    const matchSearch = !keyword || item.name?.toLowerCase().includes(keyword)
    return matchDept && matchTeam && matchStatus && matchSearch
  })
})

const statusFilterLabel = computed(() => statusOptions.find(o => o.value === statusFilter.value)?.label ?? '전체')

function selectDept(v)   { deptFilter.value = v;   teamFilter.value = '전체'; deptDropdownOpen.value   = false }
function selectTeam(v)   { teamFilter.value = v;   teamDropdownOpen.value   = false }
function selectStatus(v) { statusFilter.value = v; statusDropdownOpen.value = false }

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredEvalList.value.length / props.pageSize))
)

const pagedList = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  return filteredEvalList.value.slice(start, start + props.pageSize)
})

watch([search, deptFilter, teamFilter, statusFilter], () => {
  currentPage.value = 1
})

watch(totalPages, (count) => {
  if (currentPage.value > count) currentPage.value = count
})
</script>

<template>
  <!-- 평가 승인 / 이의신청 공통 대형 패널 모드 -->
  <article v-if="mode === 'evaluation' || mode === 'appeal'" class="hrm-panel hrm-panel--evaluation">
    <div class="hrm-panel__header">
      <div>
        <p class="hrm-panel__eyebrow">{{ mode === 'appeal' ? '이의신청 현황' : '평가 대상 현황' }}</p>
        <h3 class="hrm-panel__title">대상자 목록</h3>
      </div>
      <span class="hrm-panel__total">총 {{ pendingCount + processedCount }}명</span>
    </div>

    <div class="hrm-panel__filters">
      <!-- 부서 -->
      <div class="hrm-panel__dropdown-wrap">
        <button class="hrm-panel__filter-btn" @click="deptDropdownOpen = !deptDropdownOpen; teamDropdownOpen = false; statusDropdownOpen = false">
          <span class="hrm-panel__filter-label">부서: {{ deptFilter }}</span>
          <span class="hrm-panel__filter-chevron">▾</span>
        </button>
        <ul v-if="deptDropdownOpen" class="hrm-panel__dropdown">
          <li v-for="d in departments" :key="d" class="hrm-panel__dropdown-item"
              :class="{ 'hrm-panel__dropdown-item--active': deptFilter === d }"
              @click="selectDept(d)">{{ d }}</li>
        </ul>
      </div>
      <!-- 팀 -->
      <div class="hrm-panel__dropdown-wrap">
        <button class="hrm-panel__filter-btn" @click="teamDropdownOpen = !teamDropdownOpen; deptDropdownOpen = false; statusDropdownOpen = false">
          <span class="hrm-panel__filter-label">팀: {{ teamFilter }}</span>
          <span class="hrm-panel__filter-chevron">▾</span>
        </button>
        <ul v-if="teamDropdownOpen" class="hrm-panel__dropdown">
          <li v-for="t in teams" :key="t" class="hrm-panel__dropdown-item"
              :class="{ 'hrm-panel__dropdown-item--active': teamFilter === t }"
              @click="selectTeam(t)">{{ t }}</li>
        </ul>
      </div>
      <!-- 상태 -->
      <div class="hrm-panel__dropdown-wrap">
        <button class="hrm-panel__filter-btn" @click="statusDropdownOpen = !statusDropdownOpen; deptDropdownOpen = false; teamDropdownOpen = false">
          <span class="hrm-panel__filter-label">상태: {{ statusFilterLabel }}</span>
          <span class="hrm-panel__filter-chevron">▾</span>
        </button>
        <ul v-if="statusDropdownOpen" class="hrm-panel__dropdown">
          <li v-for="o in statusOptions" :key="o.value" class="hrm-panel__dropdown-item"
              :class="{ 'hrm-panel__dropdown-item--active': statusFilter === o.value }"
              @click="selectStatus(o.value)">{{ o.label }}</li>
        </ul>
      </div>
    </div>

    <label class="hrm-panel__search" aria-label="평가 대상 검색">
      <span class="hrm-panel__search-icon" aria-hidden="true">⌕</span>
      <input
        v-model="search"
        type="text"
        class="hrm-panel__search-input"
        :placeholder="mode === 'appeal' ? '이름으로 검색' : '이름으로 검색'"
      />
    </label>

    <template v-if="filteredEvalList.length">
      <div class="hrm-eval-list">
        <EvaluationMemberCard
          v-for="item in pagedList"
          :key="item.id"
          :member-id="item.id"
          :name="item.name"
          :avatar="item.avatar"
          :avatar-tone="item.avatarTone"
          :tier="item.tier"
          :meta="item.meta"
          :status="item.status"
          :status-label="statusConfig[item.status]?.label"
          :status-date="item.statusDate"
          :selected="selectedId === item.id"
          @select="emit('select', item.id)"
        />
      </div>

      <div v-if="totalPages > 1" class="hrm-panel__pagination">
        <button
          v-for="page in totalPages"
          :key="page"
          type="button"
          class="hrm-panel__page"
          :class="{ 'hrm-panel__page--active': page === currentPage }"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
      </div>
    </template>

    <BaseEmptyState
      v-else
      icon="⌕"
      :title="mode === 'appeal' ? '조건에 맞는 이의신청 대상이 없습니다.' : '조건에 맞는 평가 대상이 없습니다.'"
      description="검색어나 필터를 조정해 다른 대상을 확인해보세요."
      class="hrm-panel__empty"
    />
  </article>

  <!-- 사용 안 하는 구형 리스트 모드 -->
  <article v-else class="hrm-panel">
    <p class="hrm-panel__header">
      <template v-if="activeTab === '처리 완료'">✅ {{ processedLabel }} ({{ processedCount }}건)</template>
      <template v-else-if="activeTab === '보류'">⏳ {{ heldLabel }} ({{ heldCount }}건)</template>
      <template v-else>📋 {{ pendingLabel }} ({{ pendingCount }}건)</template>
    </p>

    <BaseFilterTabs
      :items="tabs"
      :modelValue="activeTab"
      variant="underline"
      size="md"
      @change="emit('tab-change', $event)"
    />

    <div class="hrm-list">
      <div v-if="list.length === 0" class="hrm-list__empty">
        {{ emptyText }}
      </div>
      <div
        v-for="item in list"
        :key="item.id"
        class="hrm-list-item"
        :class="{ 'hrm-list-item--selected': selectedId === item.id }"
        @click="emit('select', item.id)"
      >
        <div class="hrm-list-item__info">
          <div class="hrm-list-item__row1">
            <span class="hrm-badge" :style="{ background: item.typeBg, color: item.typeColor }">{{ item.type }}</span>
            <span class="hrm-list-item__name">{{ item.name }}</span>
            <span class="hrm-grade" :style="{ background: item.gradeBg, color: item.gradeColor }">{{ item.grade }}</span>
            <span v-if="item.processedLabel" class="hrm-processed-badge" :style="{ background: item.processedBg, color: item.processedColor }">{{ item.processedLabel }}</span>
          </div>
          <p class="hrm-list-item__desc">{{ item.desc }}</p>
          <p class="hrm-list-item__date">{{ item.date }}</p>
        </div>
        <div class="hrm-list-item__check" :class="{ 'hrm-list-item__check--filled': selectedId === item.id }"></div>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* 공통 */
.hrm-panel {
  width: 100%;
  min-width: 0;
  flex-shrink: 1;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 12px;
  padding: 20px;
}

/* 평가 승인 모드 */
.hrm-panel--evaluation {
  display: grid;
  grid-template-rows: auto auto auto minmax(0, 1fr) auto;
  gap: 12px;
  border-radius: 24px;
  padding: 20px;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.hrm-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.hrm-panel__eyebrow {
  margin: 0 0 4px;
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-500);
}

.hrm-panel__total {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
}

.hrm-panel__title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}

.hrm-panel__filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.hrm-panel__dropdown-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
}

.hrm-panel__filter-btn {
  width: 100%;
  height: 38px;
  padding: 0 36px 0 14px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-700);
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
}

.hrm-panel__filter-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hrm-panel__filter-chevron {
  position: absolute;
  right: 10px;
  flex-shrink: 0;
  color: var(--color-text-muted);
}

.hrm-panel__dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 10;
  list-style: none;
  width: 100%;
  padding: 0;
  margin: 0;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.hrm-panel__dropdown-item {
  padding: 10px 14px;
  font-size: var(--font-size-sm);
  cursor: pointer;
  color: var(--color-text-default);
}

.hrm-panel__dropdown-item:hover {
  background: var(--color-primary-100);
}

.hrm-panel__dropdown-item--active {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
}

.hrm-panel__search {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  background: var(--color-bg-surface-muted);
}

.hrm-panel__search-icon {
  flex-shrink: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-base-plus);
}

.hrm-panel__search-input {
  width: 100%;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font-size: var(--font-size-sm);
  color: var(--color-primary-800);
}

.hrm-panel__search-input::placeholder {
  color: var(--color-text-muted);
}

.hrm-eval-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.hrm-panel__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 34px;
}

.hrm-panel__page {
  border: 1px solid var(--color-border-default);
  background: var(--color-bg-surface);
  color: var(--color-primary-700);
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  width: 34px;
  height: 34px;
  border-radius: 10px;
}

.hrm-panel__page--active {
  border-color: var(--color-primary-600);
  background: var(--color-primary-600);
  color: var(--color-text-inverse);
}

.hrm-panel__empty {
  align-self: center;
}

/* 이의신청 모드 */
.hrm-panel__header {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: #a89ed8;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

:deep(.base-filter-tabs) { margin-bottom: 12px; }

.hrm-list { display: flex; flex-direction: column; gap: 8px; }
.hrm-list__empty { padding: 32px 0; text-align: center; font-size: var(--font-size-sm); color: #a89ed8; }

.hrm-list-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 14px;
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-border-default);
  border-radius: 6px; cursor: pointer;
}
.hrm-list-item:hover { border-color: var(--color-border-strong); }
.hrm-list-item--selected { border-color: var(--color-primary-600); background: var(--color-primary-100); }
.hrm-list-item__info { display: flex; flex-direction: column; gap: 2px; }
.hrm-list-item__row1 { display: flex; align-items: center; gap: 6px; }
.hrm-list-item__name { font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-primary-800); }
.hrm-list-item__desc { font-size: var(--font-size-sm); color: #7a6fa8; }
.hrm-list-item__date { font-size: var(--font-size-2xs); color: #a89ed8; }

.hrm-badge {
  display: inline-flex; align-items: center; height: 14px; padding: 0 7px;
  border-radius: 3px; font-size: var(--font-size-2xs); font-weight: 900; white-space: nowrap;
}
.hrm-grade {
  display: inline-flex; align-items: center; height: 14px; padding: 0 7px;
  border-radius: 3px; font-size: var(--font-size-2xs); font-weight: 900;
}
.hrm-processed-badge {
  display: inline-flex; align-items: center; height: 14px; padding: 0 7px;
  border-radius: 3px; font-size: var(--font-size-2xs); font-weight: 900;
}

.hrm-list-item__check {
  width: 14px; height: 14px; border: 1.5px solid var(--color-border-strong);
  border-radius: 7px; flex-shrink: 0;
}
.hrm-list-item__check--filled { background: var(--color-primary-600); border-color: var(--color-primary-600); }

@media (max-width: 720px) {
  .hrm-panel--evaluation {
    padding: 16px;
  }

  .hrm-panel__meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .hrm-panel__pagination {
    flex-wrap: wrap;
  }
}
</style>
