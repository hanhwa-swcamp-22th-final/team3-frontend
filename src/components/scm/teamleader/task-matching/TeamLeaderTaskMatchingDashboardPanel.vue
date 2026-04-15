<script setup>
const props = defineProps({
  lines: { type: Array, default: () => [] },
  timelineRows: { type: Array, default: () => [] },
  alerts: { type: Array, default: () => [] },
  selectedOrderId: { type: Number, default: null },
})

const emit = defineEmits(['select-order', 'assign-order'])

const timelineHours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']

function tierClass(tier) {
  if (tier === 'S') return 'dashboard__tier--mint'
  if (tier === 'A') return 'dashboard__tier--primary'
  if (tier === 'B') return 'dashboard__tier--warning'
  return 'dashboard__tier--soft'
}
</script>

<template>
  <section class="dashboard-panel">
    <section class="dashboard-panel__lines">
      <article v-for="line in lines" :key="line.id" class="line-card">
        <div class="line-card__head">
          <h3>{{ line.title }}</h3>
          <strong :class="`line-card__percent line-card__percent--${line.tone}`">{{ line.percent }}</strong>
        </div>
        <div class="line-card__progress">
          <div class="line-card__progress-fill" :class="`line-card__progress-fill--${line.tone}`" :style="{ width: line.percent }"></div>
        </div>
        <div class="line-card__list">
          <article v-for="item in line.assignments" :key="item.techId + item.orderCode" class="line-card__row">
            <div class="line-card__person">
              <span class="line-card__avatar">{{ item.techName.slice(0, 1) }}</span>
              <div>
                <div class="line-card__name-row">
                  <strong>{{ item.techName }}</strong>
                  <span class="dashboard__tier" :class="tierClass(item.tier)">{{ item.tier }}</span>
                  <span class="line-card__order">{{ item.orderCode }}</span>
                </div>
              </div>
            </div>
            <span class="line-card__value">{{ item.progress }}</span>
          </article>
        </div>
        <div v-if="line.warning" class="line-card__warning">{{ line.warning }}</div>
      </article>
    </section>

    <section class="dashboard-panel__bottom">
      <article class="timeline-card">
        <div class="timeline-card__head">
          <p class="timeline-card__eyebrow">오늘 작업 타임라인</p>
          <div class="timeline-card__legend">
            <span class="timeline-card__legend-item"><i class="timeline-card__legend-dot timeline-card__legend-dot--primary"></i>주력 작업</span>
            <span class="timeline-card__legend-item"><i class="timeline-card__legend-dot timeline-card__legend-dot--mint"></i>보조 작업</span>
            <span class="timeline-card__legend-item"><i class="timeline-card__legend-dot timeline-card__legend-dot--soft"></i>완료 예정</span>
          </div>
        </div>

        <div class="timeline-card__hours-shell">
          <div class="timeline-card__hours-spacer"></div>
          <div class="timeline-card__hours">
            <span v-for="hour in timelineHours" :key="hour">{{ hour }}</span>
          </div>
        </div>

        <div class="timeline-card__body">
          <div class="timeline-card__grid">
            <span v-for="hour in timelineHours" :key="`grid-${hour}`"></span>
          </div>
          <div class="timeline-card__now">지금</div>

          <div v-for="row in timelineRows" :key="row.id" class="timeline-card__track-row">
            <span class="timeline-card__label">{{ row.label }}</span>
            <div class="timeline-card__lane">
              <div
                v-for="bar in row.bars"
                :key="`${row.id}-${bar.left}-${bar.width}`"
                class="timeline-card__bar"
                :class="`timeline-card__bar--${bar.tone}`"
                :style="{ left: bar.left, width: bar.width }"
              >
                <span class="timeline-card__bar-label">{{ bar.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </article>

      <article class="alerts-card">
        <p class="alerts-card__eyebrow">미배정 오더</p>
        <div class="alerts-card__list">
          <button v-for="item in alerts" :key="item.id" type="button" class="alerts-card__item" :class="{ 'alerts-card__item--active': selectedOrderId === item.id }" @click="emit('select-order', item.id)">
            <div class="alerts-card__item-top">
              <span>{{ item.code }}</span>
              <span>{{ item.grade }}</span>
              <span>{{ item.deadline }}</span>
            </div>
            <strong>{{ item.title }}</strong>
            <div class="alerts-card__item-bottom">
              <span>{{ item.helper }}</span>
              <span class="alerts-card__assign" @click.stop="emit('assign-order', item.id)">배정</span>
            </div>
          </button>
        </div>
      </article>
    </section>
  </section>
</template>

<style scoped>
.dashboard-panel {
  display: grid;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  height: 100%;
  min-height: 0;
}

.dashboard-panel__lines,
.dashboard-panel__bottom {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  height: 100%;
  min-height: 0;
}

.line-card,
.timeline-card,
.alerts-card {
  display: grid;
  min-height: 0;
  gap: 14px;
  padding: 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  background: var(--color-bg-surface);
  overflow: hidden;
  box-sizing: border-box;
}

.line-card {
  grid-template-rows: auto auto minmax(0, 1fr) auto;
}

.timeline-card {
  grid-template-rows: auto auto minmax(0, 1fr);
}

.alerts-card {
  grid-template-rows: auto minmax(0, 1fr);
}

.line-card__head,
.line-card__name-row,
.alerts-card__item-top,
.alerts-card__item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.line-card__head h3 {
  font-size: 18px;
  color: var(--color-primary-800);
}

.alerts-card strong {
  overflow: hidden;
  color: var(--color-primary-800);
  font-size: 14px;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-card__percent {
  font-size: 22px;
  font-weight: 800;
}

.line-card__percent--mint {
  color: #18b9a7;
}

.line-card__percent--primary {
  color: var(--color-primary-600);
}

.line-card__percent--warning {
  color: #f0b539;
}

.line-card__percent--danger {
  color: #ef4f74;
}

.line-card__progress {
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: #ece7ff;
}

.line-card__progress-fill {
  height: 100%;
  border-radius: 999px;
}

.line-card__progress-fill--mint {
  background: #18b9a7;
}

.line-card__progress-fill--primary {
  background: var(--color-primary-600);
}

.line-card__progress-fill--warning {
  background: #f0b539;
}

.line-card__progress-fill--danger {
  background: #ef4f74;
}

.line-card__list {
  display: grid;
  gap: 12px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.line-card__row,
.line-card__person {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.line-card__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary-700);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}

.dashboard__tier,
.line-card__order,
.alerts-card__assign {
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
}

.dashboard__tier--mint {
  background: #e8fbf7;
  color: #10a58b;
}

.dashboard__tier--primary {
  background: #efeaff;
  color: var(--color-primary-700);
}

.dashboard__tier--warning {
  background: #fff1cc;
  color: #d98c00;
}

.dashboard__tier--soft {
  background: #f4f4fb;
  color: var(--color-text-muted);
}

.line-card__order {
  background: #f4f2ff;
  color: var(--color-primary-500);
}

.line-card__value,
.alerts-card__item-top span,
.alerts-card__item-bottom span,
.line-card__warning,
.timeline-card__eyebrow,
.alerts-card__eyebrow,
.timeline-card__hours span,
.timeline-card__label,
.timeline-card__legend-item {
  font-size: 12px;
  color: var(--color-text-muted);
}

.line-card__warning {
  color: #ef4f74;
}

.timeline-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.timeline-card__legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.timeline-card__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.timeline-card__legend-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.timeline-card__legend-dot--primary {
  background: var(--color-primary-600);
}

.timeline-card__legend-dot--mint {
  background: #18b9a7;
}

.timeline-card__legend-dot--soft {
  background: #d9d0ff;
}

.timeline-card__hours-shell {
  display: grid;
  grid-template-columns: 92px 1fr;
  align-items: center;
  gap: 12px;
}

.timeline-card__hours {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  align-items: center;
  gap: 0;
  min-height: 14px;
  padding: 0 4px 2px;
  margin-bottom: -10px;
}

.timeline-card__hours span {
  text-align: center;
  font-size: 10px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.timeline-card__body {
  position: relative;
  display: grid;
  gap: 14px;
  min-height: 0;
  overflow-y: auto;
  padding: 8px 0;
  padding-right: 4px;
}

.timeline-card__grid {
  position: absolute;
  top: 8px;
  right: 0;
  bottom: 8px;
  left: 104px;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  pointer-events: none;
}

.timeline-card__grid span {
  border-left: 1px dashed #e6e1fb;
}

.timeline-card__grid span:last-child {
  border-right: 1px dashed #e6e1fb;
}

.timeline-card__track-row {
  display: grid;
  grid-template-columns: 92px 1fr;
  align-items: center;
  gap: 12px;
  min-height: 28px;
}

.timeline-card__label {
  display: flex;
  align-items: center;
  height: 28px;
  font-weight: 700;
  color: var(--color-primary-700);
}

.timeline-card__lane {
  position: relative;
  height: 28px;
}

.timeline-card__bar {
  position: absolute;
  top: 4px;
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  overflow: hidden;
  border-radius: 8px;
}

.timeline-card__bar--primary {
  background: var(--color-primary-600);
  color: #fff;
}

.timeline-card__bar--mint {
  background: #18b9a7;
  color: #fff;
}

.timeline-card__bar--soft {
  background: #d9d0ff;
  color: var(--color-primary-800);
}

.timeline-card__bar-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 10px;
  font-weight: 800;
}

.timeline-card__now {
  position: absolute;
  top: 0;
  right: 18%;
  z-index: 2;
  color: #ef4f74;
  font-size: 12px;
  font-weight: 700;
}

.timeline-card__now::after {
  content: '';
  position: absolute;
  top: 18px;
  left: 50%;
  width: 2px;
  height: calc(100% - 18px);
  transform: translateX(-50%);
  background: #ef4f74;
}

.alerts-card__list {
  display: grid;
  align-content: start;
  gap: 8px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.alerts-card__item {
  display: grid;
  gap: 6px;
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #ff9db0;
  border-radius: 12px;
  background: #fff7f9;
  cursor: pointer;
  text-align: left;
}

.alerts-card__item--active {
  box-shadow: inset 0 0 0 1px rgba(239, 79, 116, 0.18);
}

.alerts-card__assign {
  background: #ef4f74;
  color: #fff;
}

@media (max-width: 1180px) {
  .dashboard-panel__lines,
  .dashboard-panel__bottom {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .timeline-card__head {
    display: grid;
    gap: 8px;
  }

  .timeline-card__hours-shell,
  .timeline-card__track-row {
    grid-template-columns: 1fr;
  }

  .timeline-card__grid {
    top: 36px;
    left: 0;
  }

  .timeline-card__label {
    height: auto;
    margin-bottom: 4px;
  }
}
</style>

