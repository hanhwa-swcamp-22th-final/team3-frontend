<script setup>
defineProps({
  rows: { type: Array, default: () => [] },
})

function rateColor(rate) {
  return rate >= 70 ? 'var(--tier-s)' : 'var(--tier-b)'
}
</script>

<template>
  <section class="kpi-team-table">
    <p class="kpi-team-table__title">🧑‍💼 팀장별 평가 현황</p>
    <table class="kpi-table">
      <thead>
        <tr>
          <th>팀장</th>
          <th>소속라인</th>
          <th>담당인원</th>
          <th>평가완료</th>
          <th>평균점수</th>
          <th>Tier분포</th>
          <th>완료율</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>
            <div class="kpi-table__leader">
              <div class="kpi-table__avatar" :style="{ background: row.avatarColor }">
                {{ row.name[0] }}
              </div>
              <span class="kpi-table__name">{{ row.name }}</span>
            </div>
          </td>
          <td>{{ row.line }}</td>
          <td>{{ row.members }}명</td>
          <td>{{ row.evaluated }}/{{ row.total }}</td>
          <td class="kpi-table__score">{{ row.avgScore }}</td>
          <td class="kpi-table__tier">{{ row.tierDist }}</td>
          <td>
            <div class="kpi-table__bar-track">
              <div
                class="kpi-table__bar-fill"
                :style="{ width: row.completionRate + '%', background: rateColor(row.completionRate) }"
              ></div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.kpi-team-table {
  padding: 22px;
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.kpi-team-table__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-500);
}

.kpi-table {
  width: 100%;
  border-collapse: collapse;
}
.kpi-table th {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  text-align: left;
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-border-default);
}
.kpi-table td {
  font-size: var(--font-size-sm);
  color: var(--color-text-default);
  padding: 14px 12px;
  border-bottom: 1px solid var(--color-border-muted);
  vertical-align: middle;
}
.kpi-table tbody tr:last-child td {
  border-bottom: none;
}
.kpi-table tbody tr:hover td {
  background: var(--color-bg-surface-muted);
}

.kpi-table__leader {
  display: flex;
  align-items: center;
  gap: 10px;
}
.kpi-table__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-white);
  flex-shrink: 0;
}
.kpi-table__name {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-strong);
}
.kpi-table__score {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}
.kpi-table__tier {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.kpi-table__bar-track {
  width: 120px;
  height: 8px;
  background: var(--color-border-default);
  border-radius: 4px;
  overflow: hidden;
}
.kpi-table__bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}
</style>
