<script setup>
import { ref, computed } from 'vue'
import { TIER_BADGE_STYLES as tierColors } from '@/constants'

const props = defineProps({
  members: { type: Array, default: () => [] },
  selectedId: { type: Number, default: null },
})

const emit = defineEmits(['select'])

const statusConfig = {
  submitted:    { label: '제출 완료', icon: '✓', cardClass: 'card--submitted' },
  in_progress:  { label: '작성 중',   icon: '✏', cardClass: 'card--in-progress' },
  not_started:  { label: '미작성',    icon: '⊘', cardClass: 'card--not-started' },
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
    const matchTeam   = teamFilter.value   === '전체' || m.team   === teamFilter.value
    const matchStatus = statusFilter.value === '전체' || m.status === statusFilter.value
    const matchSearch = m.name.includes(search.value.trim())
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
    <!-- Header -->
    <h3 class="eval-member-list__title">팀원 평가 현황</h3>

    <!-- Filters -->
    <div class="eval-member-list__filters">
      <!-- Team dropdown -->
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

      <!-- Status dropdown -->
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

    <!-- Search -->
    <div class="eval-member-list__search">
      <span class="eval-member-list__search-icon">🔍</span>
      <input
        v-model="search"
        class="eval-member-list__search-input"
        placeholder="팀원 검색..."
      />
    </div>

    <ul class="eval-member-list__list">
      <li
        v-for="m in filtered"
        :key="m.id"
        class="eval-card"
        :class="[statusConfig[m.status]?.cardClass, { 'eval-card--selected': m.id === selectedId }]"
        @click="emit('select', m)"
      >
        <div class="eval-card__left">
          <div class="eval-card__avatar" :style="{ background: m.avatarColor }">
            {{ m.avatar }}
          </div>
          <div class="eval-card__info">
            <div class="eval-card__name-row">
              <span class="eval-card__name">{{ m.name }}</span>
              <span
                class="eval-card__tier"
                :style="{ background: tierColors[m.tier]?.bg, color: tierColors[m.tier]?.text }"
              >{{ m.tier }}</span>
            </div>
            <span class="eval-card__status">
              {{ statusConfig[m.status]?.icon }} {{ statusConfig[m.status]?.label }}
            </span>
          </div>
        </div>
        <span class="eval-card__date">{{ m.statusDate }}</span>
      </li>
    </ul>

  </section>
</template>

<style scoped>
.eval-member-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.eval-member-list__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-600);
  margin: 0;
}

.eval-member-list__filters {
  display: flex;
  gap: 8px;
}

.eval-member-list__dropdown-wrap {
  position: relative;
  flex: 1;
}

.eval-member-list__filter-btn {
  width: 100%;
  background: var(--color-primary-100);
  border: none;
  border-radius: var(--radius-sm);
  padding: 6px 12px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-700);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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
}

.eval-member-list__dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 10;
  list-style: none;
  min-width: 140px;
  padding: 0;
  margin: 0;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
  overflow: hidden;
}

.eval-member-list__dropdown-item {
  padding: 10px 16px;
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
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  background: var(--color-bg-surface-muted);
}

.eval-member-list__search-icon {
  font-size: var(--font-size-base);
  flex-shrink: 0;
}

.eval-member-list__search-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: var(--font-size-sm);
  color: var(--color-text-default);
  width: 100%;
}
.eval-member-list__search-input::placeholder {
  color: var(--color-text-muted);
}

.eval-member-list__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 2px;
  margin: 0;
  flex: 1;
  overflow-y: auto;
}

/* Card base */
.eval-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s;
}

.eval-card__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Status variants */
.card--submitted {
  background: #e8faf4;
  border-color: #a7e9d0;
}

.card--in-progress {
  background: #1e1650;
  border-color: #3d2fa0;
}

.card--not-started {
  background: #f7f7f9;
  border-color: var(--color-border-soft);
}

.eval-card--selected {
  outline: 2px solid var(--color-primary-400);
}

/* Avatar */
.eval-card__avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
}

/* Info */
.eval-card__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.eval-card__name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.eval-card__name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
}

.card--submitted .eval-card__name,
.card--not-started .eval-card__name {
  color: var(--color-primary-800);
}

.card--in-progress .eval-card__name {
  color: #fff;
}

.eval-card__tier {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-extrabold);
}

.eval-card__status {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}

.card--submitted .eval-card__status {
  color: #16a37a;
}

.card--in-progress .eval-card__status {
  color: #c4b8ff;
}

.card--not-started .eval-card__status {
  color: var(--color-text-muted);
}

/* Date */
.eval-card__date {
  font-size: var(--font-size-xs);
  flex-shrink: 0;
}

.card--submitted .eval-card__date,
.card--not-started .eval-card__date {
  color: var(--color-text-muted);
}

.card--in-progress .eval-card__date {
  color: #c4b8ff;
}
</style>
