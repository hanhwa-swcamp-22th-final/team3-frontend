<script setup>
const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
})

function cardValue(value) {
  if (value == null) return '-'
  return value.toFixed(2)
}

function progressWidth(value) {
  if (value == null) return '0%'
  return `${Math.max(0, Math.min(100, value * 100))}%`
}
</script>

<template>
  <article class="facility-card" :class="`facility-card--${card.tone}`">
    <div class="facility-card__top">
      <div class="facility-card__heading">
        <p class="facility-card__code">{{ card.code }}</p>

        <div class="facility-card__title-row">
          <h3 class="facility-card__title">{{ card.name }}</h3>

          <div class="facility-card__operator-chip">
            <span class="facility-card__avatar" :class="`facility-card__avatar--${card.tone}`">{{ card.initial }}</span>
            <strong>{{ card.operator }}</strong>
            <span v-if="card.tier" class="facility-card__tier" :class="`facility-card__tier--${card.tierTone}`">{{ card.tier }}</span>
          </div>
        </div>
      </div>

      <div class="facility-card__status-wrap">
        <span class="facility-card__dot" :class="`facility-card__dot--${card.dotTone}`"></span>
        <span class="facility-card__status" :class="`facility-card__status--${card.tone}`">{{ card.status }}</span>
      </div>
    </div>

    <div class="facility-card__metric-row">
      <strong class="facility-card__metric" :class="`facility-card__metric--${card.tone}`">{{ cardValue(card.value) }}</strong>
      <span class="facility-card__metric-label">E_idx</span>
    </div>

    <div class="facility-card__progress">
      <div class="facility-card__progress-fill" :class="`facility-card__progress-fill--${card.tone}`" :style="{ width: progressWidth(card.value) }"></div>
    </div>

    <div class="facility-card__bottom">
      <span class="facility-card__time">{{ card.updatedAt }}</span>
    </div>
  </article>
</template>

<style scoped>
.facility-card {
  display: grid;
  gap: 12px;
  padding: 14px 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 18px;
  background: var(--color-bg-surface);
}

.facility-card__top,
.facility-card__bottom,
.facility-card__status-wrap,
.facility-card__metric-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.facility-card__top {
  align-items: flex-start;
}

.facility-card__heading {
  display: grid;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.facility-card__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.facility-card__code {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-300);
}

.facility-card__title {
  margin-top: 2px;
  font-size: 18px;
  color: var(--color-primary-800);
}

.facility-card__operator-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: max-content;
}

.facility-card__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.facility-card__dot--mint {
  background: #18b9a7;
}

.facility-card__dot--warning {
  background: #f0b539;
}

.facility-card__dot--danger {
  background: #ef4f74;
}

.facility-card__dot--soft {
  background: #b8afe9;
}

.facility-card__status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
}

.facility-card__status--mint {
  background: #e8fbf7;
  color: #10a58b;
}

.facility-card__status--warning {
  background: #fff4d7;
  color: #d99a00;
}

.facility-card__status--danger {
  background: #ffe7ed;
  color: #ef4f74;
}

.facility-card__status--soft {
  background: #f2efff;
  color: #aa9ee9;
}

.facility-card__metric {
  font-size: 36px;
  line-height: 0.9;
  font-weight: 800;
}

.facility-card__metric--mint {
  color: #18b9a7;
}

.facility-card__metric--warning {
  color: #f0b539;
}

.facility-card__metric--danger {
  color: #ef4f74;
}

.facility-card__metric--soft {
  color: #b8afe9;
}

.facility-card__metric-label {
  align-self: flex-end;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-200);
}

.facility-card__progress {
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: #eae5ff;
}

.facility-card__progress-fill {
  height: 100%;
  border-radius: 999px;
}

.facility-card__progress-fill--mint {
  background: #18b9a7;
}

.facility-card__progress-fill--warning {
  background: #f0b539;
}

.facility-card__progress-fill--danger {
  background: #ef4f74;
}

.facility-card__progress-fill--soft {
  background: #c9c0f5;
}

.facility-card__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
}

.facility-card__avatar--mint {
  background: var(--color-primary-700);
}

.facility-card__avatar--warning {
  background: #2d8a63;
}

.facility-card__avatar--danger {
  background: #bc8700;
}

.facility-card__avatar--soft {
  background: #b8afe9;
}

.facility-card__tier {
  padding: 2px 7px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
}

.facility-card__tier--primary {
  background: var(--color-primary-600);
  color: #fff;
}

.facility-card__tier--warning {
  background: #ffd66f;
  color: #8d6300;
}

.facility-card__time {
  font-size: 12px;
  color: var(--color-primary-200);
}

@media (max-width: 720px) {
  .facility-card__title-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
