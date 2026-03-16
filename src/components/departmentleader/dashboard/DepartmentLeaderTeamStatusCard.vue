<script setup>
defineProps({
  teams: {
    type: Array,
    default: () => [],
  },
})

const statusConfig = {
  평가완료: { label: '평가완료', cls: 'status--done' },
  심사중:   { label: '심사중',   cls: 'status--review' },
  미제출:   { label: '미제출',   cls: 'status--pending' },
}
</script>

<template>
  <section class="dl-team-card">
    <header class="dl-team-card__header">
      <div class="dl-team-card__title-row">
        <span class="dl-team-card__dot">●</span>
        <span class="dl-team-card__title">팀 현황</span>
      </div>
      <button class="dl-team-card__all-btn">전체 →</button>
    </header>

    <ul class="dl-team-card__list">
      <li v-for="team in teams" :key="team.id" class="dl-team-card__item">
        <div class="dl-team-card__icon">👥</div>
        <div class="dl-team-card__info">
          <span class="dl-team-card__name">{{ team.name }} ({{ team.tl }} TL)</span>
          <span class="dl-team-card__sub">{{ team.count }}명 · 평균 {{ team.avg }}점</span>
        </div>
        <span
          class="dl-team-card__status"
          :class="statusConfig[team.status]?.cls"
        >
          {{ statusConfig[team.status]?.label ?? team.status }}
        </span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.dl-team-card {
  padding: 22px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dl-team-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dl-team-card__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dl-team-card__dot {
  font-size: 10px;
  color: var(--color-primary-500);
}

.dl-team-card__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-primary-800);
}

.dl-team-card__all-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary-500);
}
.dl-team-card__all-btn:hover {
  color: var(--color-primary-700);
}

.dl-team-card__list {
  list-style: none;
  display: flex;
  flex-direction: column;
}

.dl-team-card__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border-muted);
}

.dl-team-card__item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.dl-team-card__item:first-child {
  padding-top: 0;
}

.dl-team-card__icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: var(--color-primary-100);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.dl-team-card__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.dl-team-card__name {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-primary-800);
}

.dl-team-card__sub {
  font-size: 12px;
  color: var(--color-text-muted);
}

.dl-team-card__status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}

.status--done {
  background: var(--color-success-soft);
  color: var(--color-success);
}

.status--review {
  background: var(--color-warning-soft);
  color: var(--color-warning);
}

.status--pending {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}
</style>
