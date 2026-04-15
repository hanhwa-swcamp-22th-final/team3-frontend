<script setup>
import { computed } from 'vue'
import { TIER_BADGE_STYLES as tierColors } from '@/constants'

const props = defineProps({
  memberId: { type: [String, Number], required: true },
  name: { type: String, required: true },
  avatar: { type: String, default: '?' },
  avatarTone: { type: String, default: '' },
  avatarColor: { type: String, default: '' },
  previousTier: { type: String, default: '' },
  tier: { type: String, default: '' },
  meta: { type: String, default: '' },
  status: { type: String, default: 'not_started' },
  statusLabel: { type: String, default: '' },
  statusDate: { type: String, default: '' },
  selected: { type: Boolean, default: false },
})

const emit = defineEmits(['select'])
const avatarStyle = computed(() => (props.avatarColor ? { background: props.avatarColor } : null))
</script>

<template>
  <article
    class="evaluation-member-card"
    :class="[`evaluation-member-card--${status}`, { 'evaluation-member-card--selected': selected }]"
    tabindex="0"
    @click="emit('select', memberId)"
    @keydown.enter="emit('select', memberId)"
    @keydown.space.prevent="emit('select', memberId)"
  >
    <div class="evaluation-member-card__left">
      <div
        class="evaluation-member-card__avatar"
        :class="avatarTone ? `evaluation-member-card__avatar--${avatarTone}` : ''"
        :style="avatarStyle"
      >
        {{ avatar }}
      </div>
      <div class="evaluation-member-card__copy">
        <div class="evaluation-member-card__name-row">
          <strong class="evaluation-member-card__name">{{ name }}</strong>
          <span
            v-if="previousTier"
            class="evaluation-member-card__tier"
            :style="{ background: tierColors[previousTier]?.bg, color: tierColors[previousTier]?.text }"
          >
            {{ previousTier }}
          </span>
          <span class="evaluation-member-card__tier-arrow" v-if="previousTier && tier">→</span>
          <span
            v-if="tier"
            class="evaluation-member-card__tier"
            :style="{ background: tierColors[tier]?.bg, color: tierColors[tier]?.text }"
          >
            {{ tier }}
          </span>
        </div>
        <p v-if="meta" class="evaluation-member-card__meta">{{ meta }}</p>
      </div>
    </div>
    <span
      v-if="statusDate"
      class="evaluation-member-card__date"
      :class="`evaluation-member-card__date--${status}`"
    >
      {{ statusDate }}
    </span>
  </article>
</template>

<style scoped>
.evaluation-member-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid var(--color-border-soft);
  background: #f4f5f9;
  cursor: pointer;
  transition:
    border-color 0.16s ease,
    background-color 0.16s ease,
    transform 0.16s ease;
}

.evaluation-member-card:hover {
  transform: none;
}

.evaluation-member-card--submitted {
  background: #e8faf4;
  border-color: #a7e9d0;
}

.evaluation-member-card--in_progress,
.evaluation-member-card--in-progress {
  background: #f7f4ff;
  border-color: #e5dfff;
}

.evaluation-member-card--not_started,
.evaluation-member-card--not-started {
  background: #f4f5f9;
  border-color: #e0e3eb;
}

.evaluation-member-card--submitted.evaluation-member-card--selected {
  background: #dff8ee;
  border-color: #9fdcc5;
}

.evaluation-member-card--in_progress.evaluation-member-card--selected,
.evaluation-member-card--in-progress.evaluation-member-card--selected {
  background: #e4dbff;
  border-color: #c8baff;
}

.evaluation-member-card--not_started.evaluation-member-card--selected,
.evaluation-member-card--not-started.evaluation-member-card--selected {
  background: #ececf1;
  border-color: #d8dbe6;
}

.evaluation-member-card__left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.evaluation-member-card__avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-inverse);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
}

.evaluation-member-card__avatar--purple {
  background: #5f50d6;
}

.evaluation-member-card__avatar--green {
  background: #269063;
}

.evaluation-member-card__avatar--gold {
  background: #c08b00;
}

.evaluation-member-card__copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.evaluation-member-card__name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.evaluation-member-card__name {
  color: var(--color-primary-800);
  font-size: var(--font-size-base-plus);
  white-space: nowrap;
}

.evaluation-member-card__tier {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  border-radius: 7px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-extrabold);
  flex-shrink: 0;
}

.evaluation-member-card__tier-arrow {
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
}

.evaluation-member-card__meta {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-xs-plus);
  line-height: 1.5;
  white-space: normal;
  word-break: keep-all;
}

.evaluation-member-card__date {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: var(--color-bg-surface-muted);
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
  flex-shrink: 0;
}

.evaluation-member-card__date--submitted {
  background: #e8faf4;
  color: #1d7f5b;
}

.evaluation-member-card__date--in_progress,
.evaluation-member-card__date--in-progress {
  background: #f1edff;
  color: #5f50d6;
}

.evaluation-member-card__date--not_started,
.evaluation-member-card__date--not-started {
  background: #eef1f6;
  color: #7c8798;
}

@media (max-width: 720px) {
  .evaluation-member-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .evaluation-member-card__date {
    padding-left: 54px;
  }
}
</style>
