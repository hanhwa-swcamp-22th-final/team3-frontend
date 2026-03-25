<script setup>
import { computed } from 'vue'
import { BaseButton } from '@/components/common/base'
import { tierColor as tierBgColor, tierTextColor } from '@/constants'

const props = defineProps({
  employees:         { type: Array,   default: () => [] },
  filteredEmployees: { type: Array,   default: () => [] },
  pagedEmployees:    { type: Array,   default: () => [] },
  pageButtons:       { type: Array,   default: () => [] },
  currentPage:       { type: Number,  default: 1 },
  totalPages:        { type: Number,  default: 1 },
  selectedTier:      { type: String,  default: '전체' },
  isLoading:         { type: Boolean, default: false },
  pageStart:         { type: Number,  default: 0 },
  pageEnd:           { type: Number,  default: 0 },
})

const emit = defineEmits(['tierSelect', 'pageChange', 'editClick', 'deleteClick'])

const tiers = ['전체', 'S', 'A', 'B', 'C']

const totalCount    = computed(() => props.employees.length)
const tierCount     = (tier) => props.employees.filter(e => e.employee_current_tier === tier).length
const AVATAR_COLORS = ['#5B4FCF', '#3D35A0', '#1A8060', '#A07000', '#C0103E', '#7A6FA8', '#00BF95', '#EF476F']
const avatarBgColor = (emp) => AVATAR_COLORS[(emp.id - 1) % AVATAR_COLORS.length]
const formatDate    = (d) => d ? d.substring(0, 7).replace('-', '.') : '-'
</script>

<template>
  <div class="section">

    <div class="section-title">👥 전체 테크니션 목록</div>

    <!-- 필터 탭 -->
    <div class="filter-tabs">
      <button
        v-for="tier in tiers"
        :key="tier"
        class="filter-tab"
        :class="{ 'filter-tab--active': selectedTier === tier }"
        @click="emit('tierSelect', tier)"
      >
        {{ tier === '전체' ? `전체(${totalCount})` : `${tier}티어(${tierCount(tier)})` }}
      </button>
    </div>

    <!-- 테이블 헤더 -->
    <div class="table-header">
      <span class="col col--name">이름</span>
      <span class="col col--code">사번</span>
      <span class="col col--tier">Tier</span>
      <span class="col col--line">소속라인</span>
      <span class="col col--equip">배정설비</span>
      <span class="col col--date">입사일</span>
      <span class="col col--action">관리</span>
    </div>

    <!-- 로딩 -->
    <div v-if="isLoading" class="table-empty">불러오는 중...</div>

    <!-- 데이터 없음 -->
    <div v-else-if="filteredEmployees.length === 0" class="table-empty">
      검색 결과가 없습니다.
    </div>

    <!-- 테이블 행 -->
    <template v-else>
      <div
        v-for="emp in pagedEmployees"
        :key="emp.id"
        class="table-row"
      >
        <div class="col col--name">
          <div class="avatar" :style="{ backgroundColor: avatarBgColor(emp) }">
            {{ emp.employee_name.charAt(0) }}
          </div>
          <span>{{ emp.employee_name }}</span>
        </div>
        <span class="col col--code">{{ emp.employee_code }}</span>
        <span class="col col--tier">
          <span
            class="tier-badge"
            :style="{ backgroundColor: tierBgColor(emp.employee_current_tier), color: tierTextColor(emp.employee_current_tier) }"
          >{{ emp.employee_current_tier }}</span>
        </span>
        <span class="col col--line">{{ emp.employee_line || '—' }}</span>
        <span class="col col--equip">{{ emp.employee_equipment || '—' }}</span>
        <span class="col col--date">{{ formatDate(emp.created_at) }}</span>
        <div class="col col--action">
          <BaseButton variant="ghost"  size="sm" @click="emit('editClick',   emp)">수정</BaseButton>
          <BaseButton variant="danger" size="sm" @click="emit('deleteClick', emp.id)">삭제</BaseButton>
        </div>
      </div>
    </template>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <div class="pagination__spacer"></div>
      <div class="pagination__pages">
        <button class="page-btn" @click="emit('pageChange', currentPage - 1)" :disabled="currentPage === 1">&lt;</button>
        <template v-for="p in pageButtons" :key="p">
          <span v-if="p === '...'" class="page-ellipsis">...</span>
          <button
            v-else
            class="page-btn"
            :class="{ 'page-btn--active': p === currentPage }"
            @click="emit('pageChange', p)"
          >{{ p }}</button>
        </template>
        <button class="page-btn" @click="emit('pageChange', currentPage + 1)" :disabled="currentPage === totalPages">&gt;</button>
      </div>
      <div class="pagination__spacer">
        <span class="pagination__info">
          {{ filteredEmployees.length > 0 ? `${pageStart}-${pageEnd} / ${filteredEmployees.length}명` : '0명' }}
        </span>
      </div>
    </div>

  </div>
</template>

<style scoped>
.section {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 20px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;

}

.section-title {
  font-size: 9px;
  font-weight: 700;
  color: var(--color-primary-300);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

/* 필터 탭 */
.filter-tabs {
  display: flex;
  gap: 16px;
  border-bottom: 1px solid var(--color-border-muted);
  margin-bottom: 12px;
}

.filter-tab {
  padding: 8px 0;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-primary-300);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  margin-bottom: -1px;
}

.filter-tab--active {
  color: var(--color-primary-600);
  border-bottom-color: var(--color-primary-600);
}

/* 테이블 헤더 */
.table-header {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border-default);
  font-size: 10px;
  color: var(--color-primary-300);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 테이블 행 */
.table-row {
  display: flex;
  align-items: center;
  height: 56px;
  border-bottom: 1px solid var(--color-border-muted);
  font-size: 12px;
  color: var(--color-primary-800);
}

.table-empty {
  padding: 40px 0;
  text-align: center;
  font-size: 13px;
  color: var(--color-primary-300);
}

/* 컬럼 */
.col { display: flex; align-items: center; }
.col--name   { flex: 1.4; gap: 8px; }
.col--code   { flex: 1.3; }
.col--tier   { flex: 0.9; }
.col--line   { flex: 1.3; }
.col--equip  { flex: 1.3; }
.col--date   { flex: 1.1; }
.col--action { flex: 1.1; gap: 8px; }

/* 아바타 */
.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 900;
  color: var(--color-text-inverse);
  flex-shrink: 0;
}

/* Tier 뱃지 */
.tier-badge {
  padding: 2px 7px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 900;
}


/* 페이지네이션 */
.pagination {
  display: flex;
  align-items: center;
  padding-top: 16px;
}

.pagination__spacer {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.pagination__info {
  font-size: 11px;
  color: var(--color-primary-300);
}

.pagination__pages {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--color-text-muted);
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.page-btn:disabled { opacity: 0.4; cursor: default; }

.page-btn--active {
  background: var(--color-primary-600);
  color: var(--color-text-inverse);
  border: 1px solid var(--color-primary-500);
}

.page-ellipsis {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--color-text-muted);
}
</style>
