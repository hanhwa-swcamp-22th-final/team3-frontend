<script setup>
import { getTierColors } from '@/utils/tierColors'
import BaseDataTable from '@/components/common/base/data-display/BaseDataTable.vue'

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

const tierColors = getTierColors()

const columns = [
  { key: 'name', label: '이름' },
  { key: 'tier', label: 'TIER' },
  { key: 'actualOutput', label: '실생산량' },
  { key: 'eIdx', label: 'E_IDX' },
  { key: 'adjustedRate', label: '보정달성률' },
  { key: 'score', label: '정량점수' },
  { key: 'trend', label: '전분기' },
  { key: 'detail', label: '상세' },
]

function tierBadgeStyle(tier) {
  const background = tierColors[tier] || '#6b5de0'
  return {
    backgroundColor: background,
    color: tier === 'B' ? '#3f2f00' : '#ffffff',
  }
}

function handleRowClick(row) {
  emit('select-row', row.id)
}

function handlePageChange(page) {
  const start = (page - 1) * props.pageSize
  const firstRow = props.rows[start]
  if (firstRow) {
    emit('select-row', firstRow.id)
  }
}
</script>

<template>
  <section class="kpi-table-panel">
    <header class="kpi-table-panel__header">
      <p class="kpi-table-panel__eyebrow">팀원별 정량 점수 산출 내역</p>
    </header>

    <BaseDataTable
      :columns="columns"
      :rows="rows"
      :page-size="pageSize"
      :selected-row-key="selectedId"
      row-key="id"
      @click-row="handleRowClick"
      @change-page="handlePageChange"
    >
      <template #cell-name="{ row }">
        <div class="kpi-table__member">
          <span class="kpi-table__avatar" :class="`kpi-table__avatar--${row.avatarTone}`">{{ row.avatar }}</span>
          <strong>{{ row.name }}</strong>
        </div>
      </template>

      <template #cell-tier="{ row }">
        <span class="kpi-table__tier" :style="tierBadgeStyle(row.tier)">{{ row.tier }}</span>
      </template>

      <template #cell-eIdx="{ row }">
        <span class="kpi-table__metric">{{ row.eIdx }}</span>
      </template>

      <template #cell-adjustedRate="{ row }">
        <span class="kpi-table__rate">{{ row.adjustedRate }}</span>
      </template>

      <template #cell-score="{ row }">
        <span class="kpi-table__score">{{ row.score }}</span>
      </template>

      <template #cell-trend="{ row }">
        <span class="kpi-table__trend" :class="`kpi-table__trend--${row.trendTone}`">{{ row.trend }}</span>
      </template>

      <template #cell-detail="{ row }">
        <button type="button" class="kpi-table__detail" @click.stop="emit('select-row', row.id)">
          {{ row.detailLabel }}
        </button>
      </template>
    </BaseDataTable>

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
