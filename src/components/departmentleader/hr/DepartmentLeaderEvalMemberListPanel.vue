<script setup>
import { TIER_BADGE_STYLES as tierColors } from '@/constants'

defineProps({
  members: { type: Array, default: () => [] },
  selectedId: { type: Number, default: null },
})

const emit = defineEmits(['select'])

const statusConfig = {
  submitted:    { label: '제출 완료', icon: '✓', cardClass: 'card--submitted' },
  in_progress:  { label: '작성 중',   icon: '✏', cardClass: 'card--in-progress' },
  not_started:  { label: '미작성',    icon: '⊘', cardClass: 'card--not-started' },
}
</script>

<template>
  <section class="eval-member-list">
    <h3 class="eval-member-list__title">팀원 평가 현황</h3>

    <ul class="eval-member-list__list">
      <li
        v-for="m in members"
        :key="m.id"
        class="eval-card"
        :class="[statusConfig[m.status]?.cardClass, { 'eval-card--selected': m.id === selectedId }]"
        @click="emit('select', m)"
      >
        <div class="eval-card__left">
          <div class="eval-card__avatar" :style="{ background: m.avatarColor }">
            {{ m.avatar }}
          </div>
          <div class="eval-card__info">
            <div class="eval-card__name-row">
              <span class="eval-card__name">{{ m.name }}</span>
              <span
                class="eval-card__tier"
                :style="{ background: tierColors[m.tier]?.bg, color: tierColors[m.tier]?.text }"
              >{{ m.tier }}</span>
            </div>
            <span class="eval-card__status">
              {{ statusConfig[m.status]?.icon }} {{ statusConfig[m.status]?.label }}
            </span>
          </div>
        </div>
        <span class="eval-card__date">{{ m.statusDate }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.eval-member-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
}

.eval-member-list__title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-600);
  margin: 0;
}

.eval-member-list__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0;
  margin: 0;
}

/* Card base */
.eval-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s;
}

.eval-card__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Status variants */
.card--submitted {
  background: #e8faf4;
  border-color: #a7e9d0;
}

.card--in-progress {
  background: #1e1650;
  border-color: #3d2fa0;
}

.card--not-started {
  background: #f7f7f9;
  border-color: var(--color-border-soft);
}

.eval-card--selected {
  outline: 2px solid var(--color-primary-400);
}

/* Avatar */
.eval-card__avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  flex-shrink: 0;
}

/* Info */
.eval-card__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.eval-card__name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.eval-card__name {
  font-size: 14px;
  font-weight: 700;
}

.card--submitted .eval-card__name,
.card--not-started .eval-card__name {
  color: var(--color-primary-800);
}

.card--in-progress .eval-card__name {
  color: #fff;
}

.eval-card__tier {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
}

.eval-card__status {
  font-size: 12px;
  font-weight: 600;
}

.card--submitted .eval-card__status {
  color: #16a37a;
}

.card--in-progress .eval-card__status {
  color: #c4b8ff;
}

.card--not-started .eval-card__status {
  color: var(--color-text-muted);
}

/* Date */
.eval-card__date {
  font-size: 12px;
  flex-shrink: 0;
}

.card--submitted .eval-card__date,
.card--not-started .eval-card__date {
  color: var(--color-text-muted);
}

.card--in-progress .eval-card__date {
  color: #c4b8ff;
}
</style>
