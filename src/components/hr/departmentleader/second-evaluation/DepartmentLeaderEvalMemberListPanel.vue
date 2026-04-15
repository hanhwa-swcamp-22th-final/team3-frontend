<script setup>
import { ref, computed, watch } from 'vue'
import EvaluationMemberCard from '@/components/hr/common/evaluation/EvaluationMemberCard.vue'
import ListPagination from '@/components/hr/common/evaluation/ListPagination.vue'
import EvalListLayout from '@/components/hr/common/evaluation/EvalListLayout.vue'

const props = defineProps({
  members: { type: Array, default: () => [] },
  selectedId: { type: Number, default: null },
  pageSize: { type: Number, default: 4 },
})

const emit = defineEmits(['select'])

const search = ref('')
const teamFilter = ref('전체')
const statusFilter = ref('전체')
const currentPage = ref(1)
const teamDropdownOpen = ref(false)
const statusDropdownOpen = ref(false)

const teams = computed(() => ['전체', ...new Set(props.members.map((m) => m.team).filter(Boolean))])
const statusOptions = [
  { value: '전체', label: '전체' },
  { value: 'submitted', label: '제출 완료' },
  { value: 'in_progress', label: '작성 중' },
  { value: 'not_started', label: '미작성' },
]

const filtered = computed(() =>
  props.members.filter((m) => {
    const keyword = search.value.trim()
    const matchTeam = teamFilter.value === '전체' || m.team === teamFilter.value
    const matchStatus = statusFilter.value === '전체' || m.status === statusFilter.value
    const matchSearch = !keyword || m.name.includes(keyword)
    return matchTeam && matchStatus && matchSearch
  })
)

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / props.pageSize)))

const pagedMembers = computed(() => {
  const startIndex = (currentPage.value - 1) * props.pageSize
  return filtered.value.slice(startIndex, startIndex + props.pageSize)
})

watch([search, teamFilter, statusFilter], () => {
  currentPage.value = 1
})

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount
  }
})

function selectTeam(t) {
  teamFilter.value = t
  teamDropdownOpen.value = false
}

function selectStatus(s) {
  statusFilter.value = s
  statusDropdownOpen.value = false
}

function goToPage(page) {
  currentPage.value = page
}

const statusFilterLabel = computed(
  () => statusOptions.find((o) => o.value === statusFilter.value)?.label ?? '전체'
)
</script>

<template>
  <EvalListLayout
    eyebrow="평가 대상 현황"
    title="대상자 목록"
    :total-label="`총 ${members.length}명`"
    search-aria-label="평가 대상 검색"
    search-placeholder="이름으로 검색"
    :search-value="search"
    :has-items="filtered.length > 0"
    empty-title="조건에 맞는 평가 대상이 없습니다."
    empty-description="검색어나 상태 필터를 조정해 다른 대상을 확인해보세요."
    @update:search-value="search = $event"
  >
    <template #filters>
      <div class="hrm-panel__dropdown-wrap">
        <button class="hrm-panel__filter-btn" @click="teamDropdownOpen = !teamDropdownOpen; statusDropdownOpen = false">
          <span class="hrm-panel__filter-label">팀: {{ teamFilter }}</span>
          <span
            class="hrm-panel__filter-chevron"
            :class="{ 'hrm-panel__filter-chevron--open': teamDropdownOpen }"
          >▾</span>
        </button>
        <ul v-if="teamDropdownOpen" class="hrm-panel__dropdown">
          <li
            v-for="team in teams"
            :key="team"
            class="hrm-panel__dropdown-item"
            :class="{ 'hrm-panel__dropdown-item--active': teamFilter === team }"
            @click="selectTeam(team)"
          >
            {{ team }}
          </li>
        </ul>
      </div>

      <div class="hrm-panel__dropdown-wrap">
        <button class="hrm-panel__filter-btn" @click="statusDropdownOpen = !statusDropdownOpen; teamDropdownOpen = false">
          <span class="hrm-panel__filter-label">상태: {{ statusFilterLabel }}</span>
          <span
            class="hrm-panel__filter-chevron"
            :class="{ 'hrm-panel__filter-chevron--open': statusDropdownOpen }"
          >▾</span>
        </button>
        <ul v-if="statusDropdownOpen" class="hrm-panel__dropdown">
          <li
            v-for="option in statusOptions"
            :key="option.value"
            class="hrm-panel__dropdown-item"
            :class="{ 'hrm-panel__dropdown-item--active': statusFilter === option.value }"
            @click="selectStatus(option.value)"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>
    </template>

    <template #default>
      <EvaluationMemberCard
        v-for="m in pagedMembers"
        :key="m.id"
        :member-id="m.id"
        :name="m.name"
        :avatar="m.avatar"
        :avatar-color="m.avatarColor"
        :tier="m.tier"
        :meta="m.meta"
        :status="m.status"
        :status-date="m.statusDate"
        :selected="m.id === selectedId"
        @select="emit('select', m)"
      />
    </template>

    <template v-if="totalPages > 1" #pagination>
      <ListPagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @change="goToPage"
      />
    </template>
  </EvalListLayout>
</template>

<style scoped>
.hrm-panel__dropdown-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
}

.hrm-panel__filter-btn {
  appearance: none;
  -webkit-appearance: none;
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
  outline: none;
}

.hrm-panel__filter-btn:hover:not(:disabled) {
  border-color: var(--color-border-strong);
}

.hrm-panel__filter-btn:focus-visible:not(:disabled) {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(91, 80, 214, 0.08);
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
  transition: transform 0.2s ease;
}

.hrm-panel__filter-chevron--open {
  transform: rotate(180deg);
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
  list-style: none;
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
</style>
