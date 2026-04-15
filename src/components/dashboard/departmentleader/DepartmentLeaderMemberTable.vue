<script setup>
defineProps({
  members: {
    type: Array,
    default: () => [],
  },
})

const tierClass = (tier) => {
  if (tier === 'S') return 'tier--s'
  if (tier === 'A') return 'tier--a'
  if (tier === 'B') return 'tier--b'
  if (tier === 'C') return 'tier--c'
  return ''
}

const statusConfig = {
  CONFIRMED: { label: '확정', cls: 'status--done' },
  SUBMITTED:  { label: '제출완료', cls: 'status--review' },
  DRAFT:      { label: '초안저장', cls: 'status--draft' },
  NO_INPUT:   { label: '미작성', cls: 'status--pending' },
}
</script>

<template>
  <section class="dl-member-table">
    <header class="dl-member-table__header">
      <div class="dl-member-table__title-row">
        <span class="dl-member-table__dot">●</span>
        <span class="dl-member-table__title">팀원 역량 현황</span>
      </div>
      <span class="dl-member-table__count">{{ members.length }}명</span>
    </header>

    <div class="dl-member-table__wrap">
      <table class="dl-member-table__table">
        <thead>
          <tr>
            <th class="col-name">이름</th>
            <th>현재 TIER</th>
            <th>정성 점수</th>
            <th>평가 등급</th>
            <th>평가 상태</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in members" :key="m.id">
            <td class="col-name">{{ m.name }}</td>
            <td>
              <span class="tier-badge" :class="tierClass(m.tier)">{{ m.tier }}</span>
            </td>
            <td class="col-score">{{ m.score }}</td>
            <td>
              <span class="tier-badge" :class="tierClass(m.grade)">{{ m.grade }}</span>
            </td>
            <td>
              <span
                class="status-chip"
                :class="statusConfig[m.status]?.cls ?? 'status--pending'"
              >
                {{ statusConfig[m.status]?.label ?? m.status }}
              </span>
            </td>
          </tr>
          <tr v-if="members.length === 0">
            <td colspan="5" class="col-empty">평가 기간 중 데이터가 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.dl-member-table {
  padding: 22px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dl-member-table__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dl-member-table__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dl-member-table__dot {
  font-size: var(--font-size-2xs);
  color: var(--color-primary-500);
}

.dl-member-table__title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}

.dl-member-table__count {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.dl-member-table__wrap {
  overflow-x: auto;
}

.dl-member-table__table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-base);
}

.dl-member-table__table thead tr {
  border-bottom: 1px solid var(--color-border-default);
}

.dl-member-table__table th {
  padding: 10px 14px;
  text-align: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
}

.dl-member-table__table th.col-name {
  text-align: left;
}

.dl-member-table__table td {
  padding: 13px 14px;
  text-align: center;
  color: var(--color-primary-800);
  border-bottom: 1px solid var(--color-border-muted);
}

.dl-member-table__table tbody tr:last-child td {
  border-bottom: none;
}

.col-name {
  text-align: left !important;
  font-weight: var(--font-weight-semibold);
}

.col-score {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700) !important;
}

.col-empty {
  text-align: center !important;
  color: var(--color-text-muted);
  padding: 24px 0 !important;
}

.tier-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.tier--s { background: #fdf3ff; color: var(--tier-s, #9c27b0); }
.tier--a { background: #fff3e0; color: var(--tier-a, #e65100); }
.tier--b { background: #e3f2fd; color: var(--tier-b, #1565c0); }
.tier--c { background: #f1f8e9; color: var(--tier-c, #2e7d32); }

.status-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}

.status--done    { background: var(--color-success-soft); color: var(--color-success); }
.status--review  { background: var(--color-warning-soft); color: var(--color-warning); }
.status--draft   { background: #f0edff; color: var(--color-primary-700); }
.status--pending { background: var(--color-danger-soft);  color: var(--color-danger); }
</style>
