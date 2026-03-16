<script setup>
import { computed, ref, watch } from 'vue'
import { getTierColors } from '@/utils/tierColors'

const emit = defineEmits(['select-row'])

const props = defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
  pageSize: {
    type: Number,
    default: 4,
  },
  selectedId: {
    type: Number,
    default: null,
  },
})

const currentPage = ref(1)

const tierColors = getTierColors()

const totalPages = computed(() => Math.max(1, Math.ceil(props.rows.length / props.pageSize)))
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  return props.rows.slice(start, start + props.pageSize)
})

watch(
  () => [props.rows.length, props.pageSize],
  () => {
    currentPage.value = 1
  }
)

watch(
  () => props.selectedId,
  (selectedId) => {
    if (!selectedId) return
    const selectedIndex = props.rows.findIndex((row) => row.id === selectedId)
    if (selectedIndex === -1) return
    currentPage.value = Math.floor(selectedIndex / props.pageSize) + 1
  },
  { immediate: true }
)

function goToPage(page) {
  currentPage.value = page
  const firstRow = paginatedRows.value[0]
  if (firstRow) {
    emit('select-row', firstRow.id)
  }
}

function selectRow(rowId) {
  emit('select-row', rowId)
}

function tierBadgeStyle(tier) {
  const background = tierColors[tier] || '#6b5de0'
  return {
    backgroundColor: background,
    color: tier === 'B' ? '#3f2f00' : '#ffffff',
  }
}
</script>

<template>
  <section class="kpi-table-panel">
    <header class="kpi-table-panel__header">
      <p class="kpi-table-panel__eyebrow">팀원별 정량 점수 산출 내역</p>
    </header>

    <div class="kpi-table-wrapper">
      <table class="kpi-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>TIER</th>
            <th>실생산량</th>
            <th>E_IDX</th>
            <th>보정달성률</th>
            <th>정량점수</th>
            <th>전분기</th>
            <th>상세</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in paginatedRows"
            :key="row.id"
            class="kpi-table__row"
            :class="{ 'kpi-table__row--selected': row.id === selectedId }"
            @click="selectRow(row.id)"
          >
            <td>
              <div class="kpi-table__member">
                <span class="kpi-table__avatar" :class="`kpi-table__avatar--${row.avatarTone}`">{{ row.avatar }}</span>
                <strong>{{ row.name }}</strong>
              </div>
            </td>
            <td><span class="kpi-table__tier" :style="tierBadgeStyle(row.tier)">{{ row.tier }}</span></td>
            <td>{{ row.actualOutput }}</td>
            <td class="kpi-table__metric">{{ row.eIdx }}</td>
            <td class="kpi-table__rate">{{ row.adjustedRate }}</td>
            <td class="kpi-table__score">{{ row.score }}</td>
            <td>
              <span class="kpi-table__trend" :class="`kpi-table__trend--${row.trendTone}`">{{ row.trend }}</span>
            </td>
            <td><button type="button" class="kpi-table__detail">{{ row.detailLabel }}</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <footer v-if="totalPages > 1" class="kpi-table-panel__pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        type="button"
        class="kpi-table-panel__page"
        :class="{ 'kpi-table-panel__page--active': page === currentPage }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
    </footer>

    <div class="kpi-table-panel__warning">
      정미래 팀원의 낮은 점수는 WLD-01 FAULT(E_idx 0.71) 영향입니다. 설비 보정 적용 중.
    </div>
  </section>
</template>

<style scoped>
.kpi-table-panel {
  padding: 18px;
  border: 1px solid #ddd7ff;
  border-radius: 20px;
  background: #fff;
}

.kpi-table-panel__header {
  margin-bottom: 12px;
}

.kpi-table-panel__eyebrow {
  font-size: 13px;
  font-weight: 800;
  color: var(--color-primary-600);
}

.kpi-table-wrapper {
  overflow-x: auto;
}

.kpi-table {
  width: 100%;
  border-collapse: collapse;
}

.kpi-table th,
.kpi-table td {
  padding: 14px 10px;
  border-bottom: 1px solid #eeeaff;
  white-space: nowrap;
  font-size: 14px;
  text-align: left;
}

.kpi-table th {
  color: #a8a0d7;
  font-size: 12px;
  font-weight: 800;
  background: #f5f2ff;
}

.kpi-table__row {
  cursor: pointer;
  transition: background-color 0.18s ease, box-shadow 0.18s ease;
}

.kpi-table__row--selected td {
  background: #f6f3ff;
}

.kpi-table__row--selected td:first-child {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.kpi-table__row--selected td:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

.kpi-table__member {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  color: var(--color-primary-800);
}

.kpi-table__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
}

.kpi-table__avatar--purple { background: #5f50d6; }
.kpi-table__avatar--slate { background: #6f659f; }
.kpi-table__avatar--red { background: #d64067; }
.kpi-table__avatar--gold { background: #c59400; }

.kpi-table__tier {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 800;
}

.kpi-table__metric {
  color: #7d73d9;
  font-weight: 800;
}

.kpi-table__rate {
  color: #19b897;
  font-weight: 800;
}

.kpi-table__score {
  color: var(--color-primary-800);
  font-weight: 800;
}

.kpi-table__trend {
  font-weight: 800;
}

.kpi-table__trend--success { color: #19b897; }
.kpi-table__trend--danger { color: #ef4b6b; }

.kpi-table__detail {
  border: none;
  background: transparent;
  color: #6b5de0;
  font-weight: 800;
  cursor: pointer;
}

.kpi-table-panel__pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 14px;
}

.kpi-table-panel__page {
  width: 34px;
  height: 34px;
  border: 1px solid #ddd7ff;
  border-radius: 10px;
  background: #fff;
  color: var(--color-primary-500);
  font-weight: 700;
  cursor: pointer;
}

.kpi-table-panel__page--active {
  border-color: var(--color-primary-600);
  background: var(--color-primary-600);
  color: #fff;
}

.kpi-table-panel__warning {
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #fff1f4;
  color: #e05373;
  font-size: 13px;
  font-weight: 700;
}
</style>
