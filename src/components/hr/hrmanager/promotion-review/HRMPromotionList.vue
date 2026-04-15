<script setup>
import { ref, computed, watch } from 'vue'
import { BaseEmptyState } from '@/components/common/base'
import EvaluationMemberCard from '@/components/hr/common/evaluation/EvaluationMemberCard.vue'

const props = defineProps({
  list:       { type: Array,  required: true },
  selectedId: { default: null },
  pageSize:   { type: Number, default: 6 },
})
const emit = defineEmits(['select'])

const search       = ref('')
const currentPage  = ref(1)
const tierFilter   = ref('전체')
const statusFilter = ref('전체')
const tierDropdownOpen   = ref(false)
const statusDropdownOpen = ref(false)

const tierOptions = [
  { value: '전체', label: '전체' },
  { value: 'S',    label: 'S-Tier' },
  { value: 'A',    label: 'A-Tier' },
]

const statusOptions = [
  { value: '전체',                    label: '전체' },
  { value: 'UNDER_REVIEW',            label: '검토 대기' },
  { value: 'CONFIRMATION_OF_PROMOTION', label: '승급 확정' },
  { value: 'TIER_APPLIED',            label: '적용 완료' },
  { value: 'SUSPENSION',              label: '보류' },
]

const tierFilterLabel   = computed(() => tierOptions.find(o => o.value === tierFilter.value)?.label   ?? '전체')
const statusFilterLabel = computed(() => statusOptions.find(o => o.value === statusFilter.value)?.label ?? '전체')

function selectTier(v)   { tierFilter.value   = v; tierDropdownOpen.value   = false }
function selectStatus(v) { statusFilter.value = v; statusDropdownOpen.value = false }
function closeAll()      { tierDropdownOpen.value = false; statusDropdownOpen.value = false }

const filteredList = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  return props.list.filter(item => {
    const matchTier   = tierFilter.value   === '전체' || item.targetTier === tierFilter.value
    const matchStatus = statusFilter.value === '전체' || item.rawStatus  === statusFilter.value
    const matchSearch = !keyword || item.name?.toLowerCase().includes(keyword)
    return matchTier && matchStatus && matchSearch
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredList.value.length / props.pageSize)))
const pagedList  = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  return filteredList.value.slice(start, start + props.pageSize)
})

watch([search, tierFilter, statusFilter], () => { currentPage.value = 1 })
watch(totalPages, (n) => { if (currentPage.value > n) currentPage.value = n })

const statusConfig = {
  UNDER_REVIEW:              { label: '검토 대기', cardStatus: 'in_progress' },
  CONFIRMATION_OF_PROMOTION: { label: '승급 확정', cardStatus: 'submitted' },
  TIER_APPLIED:              { label: '적용 완료', cardStatus: 'submitted' },
  SUSPENSION:                { label: '보류',      cardStatus: 'not_started' },
}
</script>

<template>
  <article class="promo-panel">
    <div class="promo-panel__header">
      <div>
        <p class="promo-panel__eyebrow">승급 심사 현황</p>
        <h3 class="promo-panel__title">대상자 목록</h3>
      </div>
      <span class="promo-panel__total">총 {{ list.length }}명</span>
    </div>

    <div class="promo-panel__filters">
      <!-- Tier 필터 -->
      <div class="promo-panel__dropdown-wrap">
        <button class="promo-panel__filter-btn" @click="tierDropdownOpen = !tierDropdownOpen; statusDropdownOpen = false">
          <span class="promo-panel__filter-label">Tier: {{ tierFilterLabel }}</span>
          <span class="promo-panel__filter-chevron">▾</span>
        </button>
        <ul v-if="tierDropdownOpen" class="promo-panel__dropdown" @click.stop>
          <li
            v-for="o in tierOptions"
            :key="o.value"
            class="promo-panel__dropdown-item"
            :class="{ 'promo-panel__dropdown-item--active': tierFilter === o.value }"
            @click="selectTier(o.value)"
          >{{ o.label }}</li>
        </ul>
      </div>

      <!-- 상태 필터 -->
      <div class="promo-panel__dropdown-wrap">
        <button class="promo-panel__filter-btn" @click="statusDropdownOpen = !statusDropdownOpen; tierDropdownOpen = false">
          <span class="promo-panel__filter-label">상태: {{ statusFilterLabel }}</span>
          <span class="promo-panel__filter-chevron">▾</span>
        </button>
        <ul v-if="statusDropdownOpen" class="promo-panel__dropdown" @click.stop>
          <li
            v-for="o in statusOptions"
            :key="o.value"
            class="promo-panel__dropdown-item"
            :class="{ 'promo-panel__dropdown-item--active': statusFilter === o.value }"
            @click="selectStatus(o.value)"
          >{{ o.label }}</li>
        </ul>
      </div>
    </div>

    <label class="promo-panel__search" aria-label="대상자 검색">
      <span class="promo-panel__search-icon" aria-hidden="true">⌕</span>
      <input
        v-model="search"
        type="text"
        class="promo-panel__search-input"
        placeholder="이름으로 검색"
        @focus="closeAll"
      />
    </label>

    <template v-if="filteredList.length">
      <div class="promo-eval-list">
        <EvaluationMemberCard
          v-for="item in pagedList"
          :key="item.id"
          :member-id="item.id"
          :name="item.name"
          :avatar="item.avatar"
          :avatar-tone="item.avatarTone"
          :previous-tier="item.currentTier"
          :tier="item.tierBadge"
          :meta="item.meta"
          :status="statusConfig[item.rawStatus]?.cardStatus ?? 'not_started'"
          :status-label="statusConfig[item.rawStatus]?.label"
          :status-date="item.statusDate"
          :selected="selectedId === item.id"
          @select="emit('select', item.id)"
        />
      </div>

      <div v-if="totalPages > 1" class="promo-panel__pagination">
        <button
          v-for="page in totalPages"
          :key="page"
          type="button"
          class="promo-panel__page"
          :class="{ 'promo-panel__page--active': page === currentPage }"
          @click="currentPage = page"
        >{{ page }}</button>
      </div>
    </template>

    <BaseEmptyState
      v-else
      icon="⌕"
      title="조건에 맞는 대상자가 없습니다."
      description="검색어나 필터를 조정해보세요."
      class="promo-panel__empty"
    />
  </article>
</template>

<style scoped>
.promo-panel {
  display: grid;
  grid-template-rows: auto auto auto minmax(0, 1fr) auto;
  gap: 12px;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 24px;
  padding: 20px;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.promo-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.promo-panel__eyebrow {
  margin: 0 0 4px;
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-500);
}

.promo-panel__title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}

.promo-panel__total {
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

.promo-panel__filters {
  display: flex;
  gap: 8px;
}

.promo-panel__dropdown-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
}

.promo-panel__filter-btn {
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

.promo-panel__filter-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.promo-panel__filter-chevron {
  position: absolute;
  right: 10px;
  color: var(--color-text-muted);
}

.promo-panel__dropdown {
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

.promo-panel__dropdown-item {
  padding: 10px 14px;
  font-size: var(--font-size-sm);
  cursor: pointer;
  color: var(--color-text-default);
}

.promo-panel__dropdown-item:hover { background: var(--color-primary-100); }
.promo-panel__dropdown-item--active { font-weight: var(--font-weight-bold); color: var(--color-primary-700); }

.promo-panel__search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  background: var(--color-bg-surface-muted);
}

.promo-panel__search-icon {
  flex-shrink: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-base-plus);
}

.promo-panel__search-input {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: var(--font-size-sm);
  color: var(--color-primary-800);
}

.promo-panel__search-input::placeholder { color: var(--color-text-muted); }

.promo-eval-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.promo-panel__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 34px;
}

.promo-panel__page {
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

.promo-panel__page--active {
  border-color: var(--color-primary-600);
  background: var(--color-primary-600);
  color: var(--color-text-inverse);
}

.promo-panel__empty { align-self: center; }
</style>
