<script setup>
import { computed, ref, watch } from 'vue'
import EvaluationMemberCard from '@/components/hr/common/evaluation/EvaluationMemberCard.vue'
import ListPagination from '@/components/hr/common/evaluation/ListPagination.vue'
import EvalListLayout from '@/components/hr/common/evaluation/EvalListLayout.vue'

const props = defineProps({
  members: {
    type: Array,
    default: () => [],
  },
  selectedId: {
    type: String,
    default: '',
  },
  pageSize: {
    type: Number,
    default: 4,
  },
})

const emit = defineEmits(['select-member'])

const search = ref('')
const statusFilter = ref('all')
const currentPage = ref(1)
const statusDropdownOpen = ref(false)

const fixedTeamLabel = computed(() =>
  props.members.find((member) => member.teamName || member.team || member.departmentName)?.teamName
  ?? props.members.find((member) => member.teamName || member.team || member.departmentName)?.team
  ?? props.members.find((member) => member.teamName || member.team || member.departmentName)?.departmentName
  ?? '현재 팀'
)

const statusOptions = [
  { value: 'all', label: '전체' },
  { value: 'submitted', label: '제출 완료' },
  { value: 'in_progress', label: '작성 중' },
  { value: 'not_started', label: '미작성' },
]

const statusFilterLabel = computed(() => statusOptions.find((option) => option.value === statusFilter.value)?.label ?? '전체')

const filteredMembers = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return props.members.filter((member) => {
    const matchesStatus = statusFilter.value === 'all' || member.status === statusFilter.value
    const matchesKeyword =
      !keyword ||
      member.name?.toLowerCase().includes(keyword) ||
      member.code?.toLowerCase().includes(keyword)

    return matchesStatus && matchesKeyword
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredMembers.value.length / props.pageSize)))

const pagedMembers = computed(() => {
  const startIndex = (currentPage.value - 1) * props.pageSize
  return filteredMembers.value.slice(startIndex, startIndex + props.pageSize)
})

watch([search, statusFilter], () => {
  currentPage.value = 1
})

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount
  }
})

function selectMember(memberId) {
  emit('select-member', String(memberId))
}

function goToPage(page) {
  currentPage.value = page
}

function selectStatus(value) {
  statusFilter.value = value
  statusDropdownOpen.value = false
}
</script>

<template>
  <EvalListLayout
    eyebrow="평가 대상 현황"
    title="대상자 목록"
    :total-label="`총 ${members.length}명`"
    search-aria-label="평가 대상 검색"
    search-placeholder="이름으로 검색"
    :search-value="search"
    :has-items="filteredMembers.length > 0"
    empty-title="조건에 맞는 평가 대상이 없습니다."
    empty-description="검색어나 상태 필터를 조정해 다른 대상을 확인해보세요."
    @update:search-value="search = $event"
  >
    <template #filters>
      <div class="hrm-panel__dropdown-wrap">
        <button type="button" class="hrm-panel__filter-btn hrm-panel__filter-btn--disabled" disabled>
          <span class="hrm-panel__filter-label">팀: {{ fixedTeamLabel }}</span>
          <span class="hrm-panel__filter-chevron">▾</span>
        </button>
      </div>

      <div class="hrm-panel__dropdown-wrap">
        <button
          type="button"
          class="hrm-panel__filter-btn"
          @click="statusDropdownOpen = !statusDropdownOpen"
        >
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
        v-for="member in pagedMembers"
        :key="member.id"
        :member-id="member.id"
        :name="member.name"
        :avatar="member.avatar"
        :avatar-tone="member.avatarTone"
        :tier="member.tier"
        :meta="member.meta"
        :status="member.status"
        :status-date="member.statusDate"
        :selected="String(member.id) === selectedId"
        @select="selectMember"
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

.hrm-panel__filter-btn--disabled {
  cursor: not-allowed;
  color: var(--color-text-muted);
  background: var(--color-bg-surface-muted);
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
