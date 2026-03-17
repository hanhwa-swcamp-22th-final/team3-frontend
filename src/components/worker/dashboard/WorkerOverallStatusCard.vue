<script setup>
import { tierColor } from '@/constants'

defineProps({
  worker: { type: Object, required: true },
})
</script>

<template>
  <div class="status-card">
    <!-- Top row: score + tier -->
    <div class="status-card__top">
      <div class="status-card__score-block">
        <span class="status-card__score">{{ worker.score }}</span>
        <span class="status-card__score-label">OVERALL</span>
      </div>
      <div class="status-card__type">
        <span class="status-card__type-label">{{ worker.type }}</span>
        <span class="status-card__type-sub">등급 가능</span>
      </div>
      <div
        class="status-card__tier"
        :style="{ background: tierColor(worker.tier) }"
      >
        {{ worker.tier }}
      </div>
    </div>

    <!-- Profile -->
    <div class="status-card__profile">
      <div class="status-card__avatar">
        <span class="status-card__avatar-text">{{ worker.name.charAt(0) }}</span>
      </div>
      <p class="status-card__name">{{ worker.name }}</p>
      <p class="status-card__name-en">{{ worker.nameEn }}</p>
    </div>

    <!-- Skill scores 2x3 grid -->
    <div class="status-card__skills">
      <div v-for="(s, i) in worker.skillGrid" :key="i" class="status-card__skill">
        <span class="status-card__skill-score">{{ s.value }}</span>
        <span class="status-card__skill-label">{{ s.label }}</span>
      </div>
    </div>

    <!-- Stats row -->
    <div class="status-card__stats">
      <div class="status-card__stat">
        <span class="status-card__stat-value">{{ worker.historyPeriod }}</span>
      </div>
      <div class="status-card__stat">
        <span class="status-card__stat-value">{{ worker.worksDone }}</span>
      </div>
      <div class="status-card__stat">
        <span class="status-card__stat-value">{{ worker.finishRate }}%</span>
      </div>
      <div class="status-card__stat">
        <span class="status-card__stat-value">{{ worker.aiEval }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-card {
  background: linear-gradient(160deg, #1a1147 0%, var(--color-primary-800) 40%, #3a2a7a 100%);
  border-radius: var(--radius-card);
  padding: 24px 20px 20px;
  color: var(--color-white);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Top row */
.status-card__top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.status-card__score-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.status-card__score {
  font-size: 48px;
  font-weight: 800;
  line-height: 1;
}

.status-card__score-label {
  font-size: 10px;
  font-weight: 600;
  opacity: 0.5;
  letter-spacing: 2px;
}

.status-card__type {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: auto;
}

.status-card__type-label {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
}

.status-card__type-sub {
  font-size: 10px;
  opacity: 0.5;
}

.status-card__tier {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  color: var(--color-white);
}

/* Profile */
.status-card__profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.status-card__avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-card__avatar-text {
  font-size: 32px;
  font-weight: 700;
  opacity: 0.8;
}

.status-card__name {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 1px;
}

.status-card__name-en {
  font-size: 10px;
  opacity: 0.45;
  letter-spacing: 1.5px;
  margin: 0;
  text-transform: uppercase;
}

/* Skill scores — 2x3 grid */
.status-card__skills {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.status-card__skill {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm);
  padding: 10px 0 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.status-card__skill-score {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
}

.status-card__skill-label {
  font-size: 9px;
  opacity: 0.5;
  letter-spacing: 0.3px;
}

/* Stats row */
.status-card__stats {
  display: flex;
  gap: 6px;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 12px;
}

.status-card__stat {
  text-align: center;
  flex: 1;
}

.status-card__stat-value {
  font-size: 13px;
  font-weight: 600;
}
</style>
