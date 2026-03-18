<script setup>
import { computed } from 'vue'

const props = defineProps({
  missions: {
    type: Array,
    required: true,
    // [{ title, subtitle, points, current, target, icon, completed, barColor }]
  },
  overallCurrent: { type: Number, default: 91 },
  overallTarget: { type: Number, default: 95 },
})

const overallPercent = computed(() => {
  const completed = props.missions.filter((m) => m.completed).length
  return Math.round((completed / props.missions.length) * 100)
})

function missionPercent(m) {
  return Math.min(Math.round((m.current / m.target) * 100), 100)
}

function progressLabel(m) {
  if (m.completed) return '달성 완료'
  const unit = m.target >= 50 ? '점' : m.target >= 10 ? '회' : '건'
  return `${m.current} / ${m.target}${unit}`
}
</script>

<template>
  <div class="pm">
    <div class="pm__header">
      <span class="pm__header-icon">🎯</span>
      <span class="pm__header-title">S+ 승급 미션</span>
    </div>

    <div class="pm__overall">
      <div class="pm__overall-label">
        <strong>Overall {{ overallCurrent }} → {{ overallTarget }} 목표</strong>
        <span class="pm__overall-pct">{{ overallPercent }}%</span>
      </div>
      <div class="pm__bar-track pm__bar-track--overall">
        <div
          class="pm__bar-fill pm__bar-fill--overall"
          :style="{ width: overallPercent + '%' }"
        ></div>
      </div>
    </div>

    <div class="pm__list">
      <div
        v-for="m in missions"
        :key="m.id"
        class="pm__card"
        :class="{ 'pm__card--completed': m.completed }"
      >
        <div class="pm__card-top">
          <span class="pm__card-icon">{{ m.icon }}</span>
          <div class="pm__card-info">
            <span class="pm__card-title">{{ m.title }}</span>
            <span class="pm__card-subtitle">{{ m.subtitle }}</span>
          </div>
          <span
            class="pm__card-points"
            :class="{ 'pm__card-points--badge': !m.completed }"
          >
            +{{ m.points }} pts
          </span>
        </div>
        <div class="pm__bar-track">
          <div
            class="pm__bar-fill"
            :style="{ width: missionPercent(m) + '%', background: m.barColor }"
          ></div>
        </div>
        <div class="pm__card-bottom">
          <span class="pm__card-progress" :class="{ 'pm__card-progress--done': m.completed }">
            <template v-if="m.completed">✓ </template>
            {{ progressLabel(m) }}
          </span>
          <span class="pm__card-pct" :style="{ color: m.barColor }">
            {{ missionPercent(m) }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pm {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.pm__header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pm__header-icon {
  font-size: 16px;
}

.pm__header-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary-700);
}

.pm__overall {
  background: var(--color-primary-100);
  border-radius: var(--radius-base);
  padding: 16px 18px;
}

.pm__overall-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.pm__overall-label strong {
  font-size: 15px;
  color: var(--color-text-strong);
}

.pm__overall-pct {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-primary-800);
}

.pm__bar-track {
  height: 8px;
  background: var(--color-primary-100);
  border-radius: 4px;
  overflow: hidden;
}

.pm__bar-track--overall {
  background: var(--color-primary-200);
}

.pm__bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}

.pm__bar-fill--overall {
  background: var(--color-primary-800);
}

.pm__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pm__card {
  background: var(--color-bg-surface-muted);
  border: 1px solid var(--color-border-muted);
  border-radius: var(--radius-md);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pm__card--completed {
  background: #e8fff7;
  border-color: var(--tier-s);
  border-width: 2px;
}

.pm__card-top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.pm__card-icon {
  width: 36px;
  height: 36px;
  background: var(--color-primary-100);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.pm__card--completed .pm__card-icon {
  background: #d0f5eb;
}

.pm__card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pm__card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-strong);
}

.pm__card-subtitle {
  font-size: 13px;
  color: var(--color-text-muted);
}

.pm__card-points {
  font-size: 13px;
  font-weight: 600;
  color: var(--tier-s);
  white-space: nowrap;
  flex-shrink: 0;
}

.pm__card-points--badge {
  background: var(--tier-s);
  color: var(--color-white);
  padding: 4px 10px;
  border-radius: var(--radius-xs);
}

.pm__card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pm__card-progress {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-default);
}

.pm__card-progress--done {
  color: var(--tier-s);
  font-weight: 600;
}

.pm__card-pct {
  font-size: 13px;
  font-weight: 600;
}
</style>
