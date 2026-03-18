<script setup>
defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="team-stats">
    <h3 class="team-stats__title">팀별 성과 통계</h3>

    <div class="team-stats__table-wrap">
      <table class="team-stats__table">
        <thead>
          <tr>
            <th>팀</th>
            <th>인원</th>
            <th>평균</th>
            <th class="tier-col tier-col--s">S</th>
            <th class="tier-col tier-col--a">A</th>
            <th class="tier-col tier-col--b">B</th>
            <th class="tier-col tier-col--c">C</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td class="team-name">{{ row.team }}</td>
            <td>{{ row.count }}</td>
            <td class="avg-col">{{ row.avg }}</td>
            <td class="tier-col tier-col--s">{{ row.S }}</td>
            <td class="tier-col tier-col--a">{{ row.A }}</td>
            <td class="tier-col tier-col--b">{{ row.B }}</td>
            <td class="tier-col tier-col--c">{{ row.C }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.team-stats {
  padding: 22px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
}

.team-stats__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
  margin-bottom: 18px;
}

.team-stats__table-wrap {
  overflow-x: auto;
}

.team-stats__table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-base);
}

.team-stats__table thead tr {
  border-bottom: 1px solid var(--color-border-default);
}

.team-stats__table th {
  padding: 10px 14px;
  text-align: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
}

.team-stats__table th:first-child {
  text-align: left;
}

.team-stats__table td {
  padding: 14px;
  text-align: center;
  color: var(--color-primary-800);
  border-bottom: 1px solid var(--color-border-muted);
}

.team-stats__table tbody tr:last-child td {
  border-bottom: none;
}

.team-name {
  text-align: left !important;
  font-weight: var(--font-weight-semibold);
}

.avg-col {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700) !important;
}

.tier-col--s { color: var(--tier-s) !important; font-weight: var(--font-weight-bold); }
.tier-col--a { color: var(--tier-a) !important; font-weight: var(--font-weight-bold); }
.tier-col--b { color: var(--tier-b) !important; font-weight: var(--font-weight-bold); }
.tier-col--c { color: var(--tier-c) !important; font-weight: var(--font-weight-bold); }
</style>
