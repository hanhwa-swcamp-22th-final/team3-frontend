<script setup>
import { computed, ref, watch } from 'vue'
import { BaseEmptyState, BaseFilterTabs } from '@/components/common/base'
import { TIER_BADGE_STYLES as tierColors } from '@/constants'

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

const statusConfig = {
  submitted: { label: '제출 완료', toneClass: 'member-card--submitted', metaClass: 'member-card__status--submitted' },
  in_progress: { label: '작성 중', toneClass: 'member-card--in-progress', metaClass: 'member-card__status--in-progress' },
  not_started: { label: '미작성', toneClass: 'member-card--not-started', metaClass: 'member-card__status--not-started' },
}

const statusTabs = computed(() => {
  const counts = props.members.reduce(
    (acc, member) => {
      acc.all += 1
      if (acc[member.status] !== undefined) {
        acc[member.status] += 1
      }
      return acc
    },
    { all: 0, submitted: 0, in_progress: 0, not_started: 0 },
  )

  return [
    { key: 'all', label: '전체', count: counts.all },
    { key: 'submitted', label: '제출 완료', count: counts.submitted },
    { key: 'in_progress', label: '작성 중', count: counts.in_progress },
    { key: 'not_started', label: '미작성', count: counts.not_started },
  ]
})

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
</script>

<template>
  <section class="member-list-panel">
    <div class="member-list-panel__header">
      <div>
        <p class="member-list-panel__eyebrow">평가 대상 현황</p>
        <h3 class="member-list-panel__title">대상자 목록</h3>
      </div>
      <span class="member-list-panel__count">총 {{ members.length }}명</span>
    </div>

    <BaseFilterTabs
      v-model="statusFilter"
      :items="statusTabs"
      variant="chip"
      size="sm"
      :show-count="true"
      class="member-list-panel__tabs"
    />

    <label class="member-list-panel__search" aria-label="평가 대상 검색">
      <span class="member-list-panel__search-icon" aria-hidden="true">⌕</span>
      <input
        v-model="search"
        type="text"
        class="member-list-panel__search-input"
        placeholder="이름 또는 사번으로 검색"
      />
    </label>

    <template v-if="filteredMembers.length">
      <div class="member-list-panel__list">
        <article
          v-for="member in pagedMembers"
          :key="member.id"
          class="member-card"
          :class="[
            statusConfig[member.status]?.toneClass,
            { 'member-card--selected': String(member.id) === selectedId },
          ]"
          tabindex="0"
          @click="selectMember(member.id)"
          @keydown.enter="selectMember(member.id)"
          @keydown.space.prevent="selectMember(member.id)"
        >
          <div class="member-card__left">
            <div class="member-card__avatar" :class="`member-card__avatar--${member.avatarTone}`">
              {{ member.avatar }}
            </div>
            <div class="member-card__copy">
              <div class="member-card__name-row">
                <strong class="member-card__name">{{ member.name }}</strong>
                <span
                  class="member-card__tier"
                  :style="{ background: tierColors[member.tier]?.bg, color: tierColors[member.tier]?.text }"
                >
                  {{ member.tier }}
                </span>
              </div>
              <p class="member-card__meta">{{ member.code }} | {{ member.scoreHint }}</p>
              <span class="member-card__status" :class="statusConfig[member.status]?.metaClass">
                {{ statusConfig[member.status]?.label }}
              </span>
            </div>
          </div>
          <span v-if="member.statusDate" class="member-card__date">{{ member.statusDate }}</span>
        </article>
      </div>

      <div v-if="filteredMembers.length > pageSize" class="member-list-panel__pagination">
        <button
          v-for="page in totalPages"
          :key="page"
          type="button"
          class="member-list-panel__page"
          :class="{ 'member-list-panel__page--active': page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>
    </template>

    <BaseEmptyState
      v-else
      icon="⌕"
      title="조건에 맞는 평가 대상이 없습니다."
      description="검색어나 상태 필터를 조정해 다른 대상을 확인해보세요."
      class="member-list-panel__empty"
    />
  </section>
</template>

<style scoped>
.member-list-panel {
  display: grid;
  grid-template-rows: auto auto auto minmax(0, 1fr) auto;
  gap: 12px;
  padding: 20px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
  height: 100%;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
}

.member-list-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.member-list-panel__eyebrow {
  margin: 0 0 4px;
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-500);
}

.member-list-panel__title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}

.member-list-panel__count {
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

.member-list-panel__search {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  background: var(--color-bg-surface-muted);
}

.member-list-panel__search-icon {
  flex-shrink: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-base-plus);
}

.member-list-panel__search-input {
  width: 100%;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font-size: var(--font-size-sm);
  color: var(--color-primary-800);
}

.member-list-panel__search-input::placeholder {
  color: var(--color-text-muted);
}

.member-list-panel__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.member-list-panel__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 34px;
}

.member-list-panel__page {
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

.member-list-panel__page--active {
  border-color: var(--color-primary-600);
  background: var(--color-primary-600);
  color: var(--color-text-inverse);
}

.member-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid transparent;
  background: #fcfbff;
  cursor: pointer;
  transition:
    border-color 0.16s ease,
    background-color 0.16s ease,
    transform 0.16s ease;
}

.member-card:hover {
  transform: translateY(-1px);
}

.member-card--selected {
  border-color: var(--color-primary-300);
  box-shadow: 0 0 0 3px rgba(107, 86, 246, 0.12);
}

.member-card--submitted {
  background: #eefbf6;
  border-color: #b8ead5;
}

.member-card--in-progress {
  background: #f6f3ff;
  border-color: #ddd5ff;
}

.member-card--not-started {
  background: #f8f8fb;
  border-color: var(--color-border-soft);
}

.member-card__left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.member-card__avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-inverse);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
}

.member-card__avatar--purple {
  background: #5f50d6;
}

.member-card__avatar--green {
  background: #269063;
}

.member-card__avatar--gold {
  background: #c08b00;
}

.member-card__copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.member-card__name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.member-card__name {
  color: var(--color-primary-800);
  font-size: var(--font-size-base-plus);
  white-space: nowrap;
}

.member-card__tier {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 7px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-extrabold);
  flex-shrink: 0;
}

.member-card__meta {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-xs-plus);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.member-card__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}

.member-card__status--submitted {
  color: #168765;
}

.member-card__status--in-progress {
  color: var(--color-primary-700);
}

.member-card__status--not-started {
  color: var(--color-text-muted);
}

.member-card__date {
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
  flex-shrink: 0;
}

@media (max-width: 720px) {
  .member-list-panel {
    padding: 16px;
  }

  .member-list-panel__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .member-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .member-card__date {
    padding-left: 54px;
  }

  .member-list-panel__pagination {
    flex-wrap: wrap;
  }
}
</style>
