<script setup>
import { ref, computed } from 'vue'
import EvaluationMemberCard from '@/components/hr/common/evaluation/EvaluationMemberCard.vue'

const props = defineProps({
  members: { type: Array, default: () => [] },
  selectedId: { type: Number, default: null },
})

const emit = defineEmits(['select'])

const statusConfig = {
  submitted: { label: '제출 완료' },
  in_progress: { label: '작성 중' },
  not_started: { label: '미작성' },
}

const search = ref('')
const teamFilter   = ref('전체')
const statusFilter = ref('전체')
const teamDropdownOpen   = ref(false)
const statusDropdownOpen = ref(false)

const teams = computed(() => ['전체', ...new Set(props.members.map((m) => m.team).filter(Boolean))])
const statusOptions = [
  { value: '전체',       label: '전체' },
  { value: 'submitted',  label: '제출 완료' },
  { value: 'in_progress', label: '작성 중' },
  { value: 'not_started', label: '미작성' },
]

const filtered = computed(() =>
  props.members.filter((m) => {
    const keyword = search.value.trim()
    const matchTeam   = teamFilter.value   === '전체' || m.team   === teamFilter.value
    const matchStatus = statusFilter.value === '전체' || m.status === statusFilter.value
    const matchSearch = !keyword || m.name.includes(keyword) || m.team?.includes(keyword)
    return matchTeam && matchStatus && matchSearch
  })
)

function selectTeam(t) {
  teamFilter.value = t
  teamDropdownOpen.value = false
}

function selectStatus(s) {
  statusFilter.value = s
  statusDropdownOpen.value = false
}

const statusFilterLabel = computed(
  () => statusOptions.find((o) => o.value === statusFilter.value)?.label ?? '전체'
)
</script>

<template>
  <section class="eval-member-list">
    <div class="eval-member-list__header">
      <div>
        <p class="eval-member-list__eyebrow">평가 대상 현황</p>
        <h3 class="eval-member-list__title">대상자 목록</h3>
      </div>
      <span class="eval-member-list__count">총 {{ members.length }}명</span>
    </div>

    <div class="eval-member-list__filters">
      <div class="eval-member-list__dropdown-wrap">
        <button class="eval-member-list__filter-btn" @click="teamDropdownOpen = !teamDropdownOpen; statusDropdownOpen = false">
          <span class="eval-member-list__filter-label">팀: {{ teamFilter }}</span>
          <span class="eval-member-list__filter-chevron">▾</span>
        </button>
        <ul v-if="teamDropdownOpen" class="eval-member-list__dropdown">
          <li
            v-for="t in teams"
            :key="t"
            class="eval-member-list__dropdown-item"
            :class="{ 'eval-member-list__dropdown-item--active': teamFilter === t }"
            @click="selectTeam(t)"
          >{{ t }}</li>
        </ul>
      </div>

      <div class="eval-member-list__dropdown-wrap">
        <button class="eval-member-list__filter-btn" @click="statusDropdownOpen = !statusDropdownOpen; teamDropdownOpen = false">
          <span class="eval-member-list__filter-label">상태: {{ statusFilterLabel }}</span>
          <span class="eval-member-list__filter-chevron">▾</span>
        </button>
        <ul v-if="statusDropdownOpen" class="eval-member-list__dropdown">
          <li
            v-for="o in statusOptions"
            :key="o.value"
            class="eval-member-list__dropdown-item"
            :class="{ 'eval-member-list__dropdown-item--active': statusFilter === o.value }"
            @click="selectStatus(o.value)"
          >{{ o.label }}</li>
        </ul>
      </div>
    </div>

    <label class="eval-member-list__search" aria-label="평가 대상 검색">
      <span class="eval-member-list__search-icon" aria-hidden="true">⌕</span>
      <input
        v-model="search"
        class="eval-member-list__search-input"
        placeholder="이름 또는 팀명으로 검색"
      />
    </label>

    <ul class="eval-member-list__list">
      <li
        v-for="m in filtered"
        :key="m.id"
        class="eval-member-list__item"
      >
        <EvaluationMemberCard
          :member-id="m.id"
          :name="m.name"
          :avatar="m.avatar"
          :avatar-color="m.avatarColor"
          :tier="m.tier"
          :meta="`${m.team} | ${m.position ?? '직무 정보 없음'}`"
          :status="m.status"
          :status-label="statusConfig[m.status]?.label"
          :status-date="m.statusDate"
          :selected="m.id === selectedId"
          @select="emit('select', m)"
        />
      </li>
    </ul>

  </section>
</template>

<style scoped>
.eval-member-list {
  display: grid;
  grid-template-rows: auto auto auto minmax(0, 1fr);
  gap: 12px;
  padding: 20px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.eval-member-list__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.eval-member-list__eyebrow {
  margin: 0 0 4px;
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-500);
}

.eval-member-list__title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}

.eval-member-list__count {
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

.eval-member-list__filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.eval-member-list__dropdown-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
}

.eval-member-list__filter-btn {
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
  justify-content: flex-start;
  position: relative;
  box-sizing: border-box;
}

.eval-member-list__filter-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.eval-member-list__filter-chevron {
  position: absolute;
  right: 10px;
  flex-shrink: 0;
  color: var(--color-text-muted);
}

.eval-member-list__dropdown {
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

.eval-member-list__dropdown-item {
  padding: 10px 14px;
  font-size: var(--font-size-sm);
  cursor: pointer;
  color: var(--color-text-default);
}

.eval-member-list__dropdown-item:hover {
  background: var(--color-primary-100);
}

.eval-member-list__dropdown-item--active {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
}

.eval-member-list__search {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  padding: 10px 12px;
  background: var(--color-bg-surface-muted);
}

.eval-member-list__search-icon {
  flex-shrink: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-base-plus);
}

.eval-member-list__search-input {
  width: 100%;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font-size: var(--font-size-sm);
  color: var(--color-text-default);
}

.eval-member-list__search-input::placeholder {
  color: var(--color-text-muted);
}

.eval-member-list__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 4px 0 0;
  margin: 0;
  min-height: 0;
  overflow-y: auto;
}

.eval-member-list__item {
  list-style: none;
}

@media (max-width: 720px) {
  .eval-member-list {
    padding: 16px;
  }

  .eval-member-list__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .eval-member-list__filters {
    flex-direction: column;
  }

}
</style>
