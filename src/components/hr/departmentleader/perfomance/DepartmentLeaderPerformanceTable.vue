<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  members:       { type: Array, default: () => [] },
  teamOptions:   { type: Array, default: () => [] },
  gradeOptions:  { type: Array, default: () => [] },
  periodOptions: { type: Array, default: () => [] },
})

const emit = defineEmits(['view-capability', 'go-evaluation'])

const filterPeriod = ref(props.periodOptions[0] ?? '')
const filterTeam   = ref('전체')
const filterGrade  = ref('전체')
const filterStatus = ref('전체')
const searchName   = ref('')
const selectedMember = ref(null)

const statusOptions = ['전체', '완료', '진행중', '미완료']

const filtered = computed(() => {
  return props.members.filter((m) => {
    const matchTeam   = filterTeam.value   === '전체' || m.team   === filterTeam.value
    const matchGrade  = filterGrade.value  === '전체' || m.grade  === filterGrade.value
    const matchStatus = filterStatus.value === '전체' || m.status === filterStatus.value
    const matchName   = !searchName.value.trim()    || m.name.includes(searchName.value.trim())
    return matchTeam && matchGrade && matchStatus && matchName
  })
})

const PAGE_SIZE = 10
const currentPage = ref(1)

watch(filtered, () => { currentPage.value = 1 })

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))

const pagedMembers = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filtered.value.slice(start, start + PAGE_SIZE)
})

const gradeColors = {
  S: { bg: '#00BF95', text: '#fff' },
  A: { bg: '#5B4FCF', text: '#fff' },
  B: { bg: '#FFD166', text: '#855900' },
  C: { bg: '#EF476F', text: '#fff' },
  D: { bg: '#aaa',    text: '#fff' },
}

const statusColors = {
  '완료':  { color: '#16a37a' },
  '진행중': { color: '#5b4fcf' },
  '미완료': { color: '#e05a5a' },
}

function openDetail(member) { selectedMember.value = member }
function closeDetail()      { selectedMember.value = null }
</script>

<template>
  <div class="dl-perf-table-wrap">
    <!-- Filters -->
    <div class="dl-perf-table-wrap__filters">
      <select v-model="filterPeriod" class="dl-filter-select">
        <option v-for="p in periodOptions" :key="p" :value="p">{{ p }}</option>
      </select>
      <select v-model="filterTeam" class="dl-filter-select">
        <option v-for="t in teamOptions" :key="t" :value="t">팀: {{ t }}</option>
      </select>
      <select v-model="filterGrade" class="dl-filter-select">
        <option v-for="g in gradeOptions" :key="g" :value="g">등급: {{ g }}</option>
      </select>
      <select v-model="filterStatus" class="dl-filter-select">
        <option v-for="s in statusOptions" :key="s" :value="s">상태: {{ s }}</option>
      </select>
      <input
        v-model="searchName"
        class="dl-filter-input"
        type="text"
        placeholder="이름 검색..."
      />
      <span class="dl-perf-table-wrap__count">{{ filtered.length }}명</span>
    </div>

    <!-- Table -->
    <div class="dl-perf-table-scroll">
      <table class="dl-perf-table">
        <thead>
          <tr>
            <th>사번</th>
            <th>등급</th>
            <th>이름</th>
            <th>소속팀</th>
            <th>정량</th>
            <th>정성</th>
            <th>총점</th>
            <th>평가 상태</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="m in pagedMembers"
            :key="m.empId"
            class="dl-perf-table__row"
            @click="openDetail(m)"
          >
            <td class="dl-perf-table__empid">{{ m.empId }}</td>
            <td>
              <span
                class="dl-perf-table__grade"
                :style="{ background: gradeColors[m.grade]?.bg, color: gradeColors[m.grade]?.text }"
              >{{ m.grade }}</span>
            </td>
            <td class="dl-perf-table__name">{{ m.name }}</td>
            <td>{{ m.team }}</td>
            <td class="dl-perf-table__score">{{ m.quantitative }}</td>
            <td class="dl-perf-table__score">{{ m.qualitative }}</td>
            <td class="dl-perf-table__total">{{ m.total }}</td>
            <td>
              <span class="dl-perf-table__status" :style="{ color: statusColors[m.status]?.color }">
                {{ m.status }}
              </span>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="8" class="dl-perf-table__empty">검색 결과가 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="dl-perf-pagination">
      <button
        class="dl-perf-pagination__btn"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >‹</button>
      <template v-for="p in totalPages" :key="p">
        <button
          class="dl-perf-pagination__page"
          :class="{ 'dl-perf-pagination__page--active': p === currentPage }"
          @click="currentPage = p"
        >{{ p }}</button>
      </template>
      <button
        class="dl-perf-pagination__btn"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >›</button>
    </div>

    <!-- Detail modal -->
    <div v-if="selectedMember" class="dl-detail-overlay" @click.self="closeDetail">
      <div class="dl-detail-modal">
        <button class="dl-detail-modal__close" @click="closeDetail">✕</button>

        <div class="dl-detail-modal__header">
          <div
            class="dl-detail-modal__avatar"
            :style="{ background: gradeColors[selectedMember.grade]?.bg }"
          >{{ selectedMember.name[0] }}</div>
          <div>
            <div class="dl-detail-modal__name-row">
              <span class="dl-detail-modal__name">{{ selectedMember.name }}</span>
              <span
                class="dl-detail-modal__grade"
                :style="{ background: gradeColors[selectedMember.grade]?.bg, color: gradeColors[selectedMember.grade]?.text }"
              >{{ selectedMember.grade }}</span>
            </div>
            <span class="dl-detail-modal__meta">{{ selectedMember.team }} · {{ selectedMember.empId }}</span>
          </div>
        </div>

        <div class="dl-detail-modal__scores">
          <div class="dl-detail-modal__score-item">
            <span class="dl-detail-modal__score-label">정량</span>
            <span class="dl-detail-modal__score-value">{{ selectedMember.quantitative }}</span>
          </div>
          <div class="dl-detail-modal__score-item">
            <span class="dl-detail-modal__score-label">정성</span>
            <span class="dl-detail-modal__score-value">{{ selectedMember.qualitative }}</span>
          </div>
          <div class="dl-detail-modal__score-item dl-detail-modal__score-item--total">
            <span class="dl-detail-modal__score-label">총점</span>
            <span class="dl-detail-modal__score-value dl-detail-modal__score-value--total">{{ selectedMember.total }}</span>
          </div>
        </div>

        <div class="dl-detail-modal__status-row">
          <span>평가 상태</span>
          <span :style="{ color: statusColors[selectedMember.status]?.color, fontWeight: 700 }">
            {{ selectedMember.status }}
          </span>
        </div>

        <div class="dl-detail-modal__actions">
          <button class="dl-detail-modal__btn dl-detail-modal__btn--secondary" @click="closeDetail">닫기</button>
          <button
            v-if="selectedMember.status !== '완료'"
            class="dl-detail-modal__btn dl-detail-modal__btn--warn"
            @click="emit('go-evaluation', selectedMember); closeDetail()"
          >
            2차 평가 작성 →
          </button>
          <button
            class="dl-detail-modal__btn dl-detail-modal__btn--primary"
            @click="emit('view-capability', selectedMember); closeDetail()"
          >
            팀원 역량 조회 →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dl-perf-table-wrap {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px;
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  background: var(--color-bg-surface);
}

/* Filters */
.dl-perf-table-wrap__filters {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.dl-filter-select,
.dl-filter-input {
  height: 36px;
  padding: 0 12px;
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  font-size: var(--font-size-sm);
  color: var(--color-text-default);
  background: var(--color-bg-surface);
  outline: none;
  cursor: pointer;
}

.dl-filter-input { width: 140px; cursor: text; }
.dl-filter-input::placeholder { color: var(--color-text-muted); }

.dl-perf-table-wrap__count {
  margin-left: auto;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-600);
}

/* Table */
.dl-perf-table-scroll {
  overflow-x: auto;
}

.dl-perf-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.dl-perf-table th {
  padding: 10px 14px;
  text-align: left;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-muted);
  border-bottom: 2px solid var(--color-border-default);
  white-space: nowrap;
}

.dl-perf-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border-soft);
  color: var(--color-text-default);
  white-space: nowrap;
}

.dl-perf-table__row {
  cursor: pointer;
  transition: background 0.12s;
}
.dl-perf-table__row:hover { background: var(--color-primary-50, #f7f5ff); }

.dl-perf-table__empid { color: var(--color-text-muted); font-size: var(--font-size-xs); }
.dl-perf-table__name  { font-weight: var(--font-weight-bold); color: var(--color-primary-800); }
.dl-perf-table__score { color: var(--color-primary-600); font-weight: var(--font-weight-semibold); }
.dl-perf-table__total { font-weight: var(--font-weight-extrabold); color: var(--color-primary-800); }

.dl-perf-table__grade {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 7px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-extrabold);
}

.dl-perf-table__status { font-weight: var(--font-weight-semibold); font-size: var(--font-size-xs); }

.dl-perf-table__empty {
  text-align: center;
  padding: 32px;
  color: var(--color-text-muted);
}

/* Pagination */
.dl-perf-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.dl-perf-pagination__btn,
.dl-perf-pagination__page {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  background: var(--color-bg-surface);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-primary-600);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s;
}

.dl-perf-pagination__btn:hover:not(:disabled),
.dl-perf-pagination__page:hover {
  background: var(--color-primary-50, #f7f5ff);
}

.dl-perf-pagination__btn:disabled {
  opacity: 0.35;
  cursor: default;
}

.dl-perf-pagination__page--active {
  background: var(--color-primary-600);
  color: #fff;
  border-color: var(--color-primary-600);
}

/* Detail modal */
.dl-detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.dl-detail-modal {
  position: relative;
  width: 420px;
  max-width: 92vw;
  background: #fff;
  border-radius: 24px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.18);
}

.dl-detail-modal__close {
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  cursor: pointer;
}

.dl-detail-modal__header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dl-detail-modal__avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-extrabold);
  flex-shrink: 0;
}

.dl-detail-modal__name-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dl-detail-modal__name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-primary-800);
}

.dl-detail-modal__grade {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 7px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-extrabold);
}

.dl-detail-modal__meta {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.dl-detail-modal__scores {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.dl-detail-modal__score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px;
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  background: #faf9ff;
}

.dl-detail-modal__score-item--total {
  background: #f0eeff;
  border-color: var(--color-primary-300);
}

.dl-detail-modal__score-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-semibold);
}

.dl-detail-modal__score-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-primary-700);
}

.dl-detail-modal__score-value--total {
  color: var(--color-primary-600);
  font-size: var(--font-size-xl);
}

.dl-detail-modal__status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-base);
  color: var(--color-text-default);
  padding: 0 2px;
}

.dl-detail-modal__actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.dl-detail-modal__btn {
  height: 40px;
  padding: 0 20px;
  border-radius: 10px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  border: none;
}

.dl-detail-modal__btn--secondary {
  background: var(--color-bg-surface-muted);
  color: var(--color-text-default);
  border: 1px solid var(--color-border-default);
}

.dl-detail-modal__btn--primary {
  background: var(--color-primary-600);
  color: #fff;
}

.dl-detail-modal__btn--warn {
  background: #fff4e6;
  color: #c47a00;
  border: 1px solid #f4c54b;
}
</style>
