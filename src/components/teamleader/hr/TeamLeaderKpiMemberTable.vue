<script setup>
defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="kpi-table-panel">
    <header class="kpi-table-panel__header">
      <div>
        <p class="kpi-table-panel__eyebrow">팀원별 KPI 현황</p>
        <h2 class="kpi-table-panel__title">핵심 성과 지표 비교</h2>
      </div>
    </header>

    <div class="kpi-table-wrapper">
      <table class="kpi-table">
        <thead>
          <tr>
            <th>팀원</th>
            <th>티어</th>
            <th>생산성</th>
            <th>품질</th>
            <th>협업</th>
            <th>추이</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>
              <div class="kpi-table__member">
                <strong>{{ row.name }}</strong>
                <span>{{ row.code }}</span>
              </div>
            </td>
            <td>
              <span class="kpi-table__tier">{{ row.tier }}</span>
            </td>
            <td>{{ row.productivity }}</td>
            <td>{{ row.quality }}</td>
            <td>{{ row.collaboration }}</td>
            <td>
              <span class="kpi-table__trend" :class="`kpi-table__trend--${row.statusTone}`">
                {{ row.trend }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.kpi-table-panel {
  padding: 20px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
}

.kpi-table-panel__header {
  margin-bottom: 18px;
}

.kpi-table-panel__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-500);
}

.kpi-table-panel__title {
  margin-top: 6px;
  font-size: 18px;
  color: var(--color-primary-800);
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
  padding: 16px 12px;
  border-bottom: 1px solid var(--color-border-soft);
  text-align: left;
  font-size: 14px;
  color: var(--color-text-default);
  white-space: nowrap;
}

.kpi-table th {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-500);
}

.kpi-table__member {
  display: grid;
  gap: 4px;
}

.kpi-table__member strong {
  color: var(--color-primary-800);
}

.kpi-table__member span {
  font-size: 12px;
  color: var(--color-text-muted);
}

.kpi-table__tier {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 10px;
  border-radius: 10px;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  font-size: 13px;
  font-weight: 700;
}

.kpi-table__trend {
  font-weight: 700;
}

.kpi-table__trend--success {
  color: var(--color-mint-500);
}

.kpi-table__trend--danger {
  color: var(--color-danger);
}
</style>
