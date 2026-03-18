<script setup>
defineProps({
  totalCount:     { type: Number, default: 0 },
  topTierCount:   { type: Number, default: 0 },
  topTierPercent: { type: [Number, String], default: 0 },
  avgScore:       { type: [Number, String], default: 0 },
})
</script>

<template>
  <div class="stat-cards">
    <div class="stat-card">
      <span class="stat-card__label">전체 인원</span>
      <span class="stat-card__value">{{ totalCount }}명</span>
    </div>
    <div class="stat-card">
      <span class="stat-card__label">S+A Tier</span>
      <span class="stat-card__value">{{ topTierCount }}명</span>
      <span class="stat-card__sub">({{ topTierPercent }}%)</span>
    </div>
    <div class="stat-card">
      <span class="stat-card__label">평균 종합점수</span>
      <span class="stat-card__value">{{ avgScore }}</span>
    </div>
  </div>
</template>

<style scoped>
.stat-cards {
  display: flex;
  gap: 16px;

}

.stat-card {
  flex: 1;
  padding: 15px 17px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-card__label {
  font-size: 10px;
  color: var(--color-primary-300);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-card__value {
  font-size: 30px;
  font-weight: 900;
  color: var(--color-primary-800);
  line-height: 1;
}

.stat-card__sub {
  font-size: 11px;
  color: var(--color-text-muted);
}
</style>
