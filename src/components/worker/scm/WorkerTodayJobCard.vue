<script setup>
import { computed } from 'vue'

const props = defineProps({
  job: { type: Object, required: true },
})

const emit = defineEmits(['start', 'finish'])

const isInProgress = computed(() => props.job.status === 'in_progress')
const isDone = computed(() => props.job.status === 'done')
const progressPercent = computed(() => {
  if (!props.job.target) return 0
  return Math.min(100, Math.round((props.job.current / props.job.target) * 100))
})

function difficultyClass(level) {
  if (level >= 5) return 'diff--d5'
  if (level >= 4) return 'diff--d4'
  return 'diff--d2'
}
</script>

<template>
  <div class="jk" :class="{ 'jk--active': isInProgress, 'jk--done': isDone }">
    <div class="jk__top">
      <span class="jk__code">{{ job.orderCode }}</span>
      <span class="jk__diff" :class="difficultyClass(job.difficulty)">
        D{{ job.difficulty }} {{ job.difficultyLabel }}
      </span>
      <span class="jk__status" :class="'jk__status--' + job.status">
        {{ job.statusLabel }}
      </span>
    </div>

    <h4 class="jk__title">{{ job.title }}</h4>

    <div class="jk__tags">
      <span class="jk__tag">⚙ {{ job.equipment }}</span>
      <span class="jk__tag">⏱ 예상 {{ job.estimatedTime }}</span>
      <span class="jk__tag">📦 납기 D-{{ job.deadlineDays }}</span>
    </div>

    <div class="jk__progress">
      <div class="jk__progress-bar">
        <div
          class="jk__progress-fill"
          :style="{ width: progressPercent + '%' }"
        ></div>
      </div>
    </div>

    <div class="jk__actions">
      <button
        v-if="!isInProgress && !isDone"
        class="jk__btn jk__btn--start"
        @click="emit('start', job)"
      >
        작업 시작
      </button>
      <button
        v-else-if="isInProgress"
        class="jk__btn jk__btn--finish"
        @click="emit('finish', job)"
      >
        작업 완료 보고
      </button>
      <span v-else class="jk__done-label">완료</span>
    </div>
  </div>
</template>

<style scoped>
.jk {
  background: #ffffff;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  padding: 22px 26px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.jk--active {
  border-left: 4px solid var(--color-primary-700);
  background: var(--color-primary-100);
  padding-left: 23px;
}

.jk--done {
  opacity: 0.6;
}

.jk__top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.jk__code {
  font-size: 13px;
  color: var(--color-text-muted);
}

.jk__diff {
  font-size: 12px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 6px;
  color: #ffffff;
}

.diff--d5 {
  background: var(--color-primary-800);
}

.diff--d4 {
  background: var(--color-primary-600);
}

.diff--d2 {
  background: var(--color-primary-300);
  color: var(--color-primary-800);
}

.jk__status {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 6px;
}

.jk__status--waiting {
  background: var(--color-neutral-100);
  color: var(--color-text-muted);
}

.jk__status--in_progress {
  background: var(--color-primary-200);
  color: var(--color-primary-800);
}

.jk__status--done {
  background: #dcfce7;
  color: #166534;
}

.jk__title {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-strong);
  margin: 0;
}

.jk__tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.jk__tag {
  font-size: 13px;
  color: var(--color-text-default);
  background: var(--color-neutral-100);
  border: 1px solid var(--color-border-muted);
  border-radius: 8px;
  padding: 4px 12px;
}

.jk__progress {
  padding: 4px 0;
}

.jk__progress-bar {
  width: 100%;
  height: 6px;
  background: var(--color-neutral-200);
  border-radius: 3px;
  overflow: hidden;
}

.jk__progress-fill {
  height: 100%;
  background: var(--color-primary-700);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.jk__actions {
  display: flex;
  justify-content: flex-end;
}

.jk__btn {
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.jk__btn--start {
  background: #ffffff;
  border: 1px solid var(--color-border-default);
  color: var(--color-text-default);
}

.jk__btn--start:hover {
  border-color: var(--color-primary-300);
  color: var(--color-primary-700);
}

.jk__btn--finish {
  background: var(--color-primary-800);
  border: none;
  color: #ffffff;
}

.jk__btn--finish:hover {
  background: var(--color-primary-700);
}

.jk__done-label {
  font-size: 14px;
  font-weight: 600;
  color: #16a34a;
}
</style>
