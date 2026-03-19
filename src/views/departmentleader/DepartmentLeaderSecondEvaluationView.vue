<script setup>
import { ref, computed } from 'vue'
import DepartmentLeaderEvalMemberListPanel from '@/components/hr/departmentleader/second-evaluation/DepartmentLeaderEvalMemberListPanel.vue'
import DepartmentLeaderEvalFormPanel from '@/components/hr/departmentleader/second-evaluation/DepartmentLeaderEvalFormPanel.vue'
import { evalMembers, evalDeadline } from '@/mocks/departmentleader/secondEvaluation.js'

const members = ref(evalMembers.map((m) => ({ ...m, evaluations: m.evaluations.map((e) => ({ ...e })) })))
const selectedMember = ref(members.value[2]) // 황자현 selected by default
const deadline = evalDeadline
const totalCount = members.value.length
const submittedCount = computed(() => members.value.filter((m) => m.status === 'submitted').length)
const progressPercent = computed(() => (submittedCount.value / totalCount) * 100)

function handleSave(evals) {
  const m = members.value.find((m) => m.id === selectedMember.value.id)
  if (!m) return
  m.evaluations = evals.map((e) => ({ ...e }))
  if (m.status === 'not_started') m.status = 'in_progress'
  selectedMember.value = { ...m }
  alert('임시저장 되었습니다.')
}

function handleSubmit(evals) {
  const m = members.value.find((m) => m.id === selectedMember.value.id)
  if (!m) return
  m.evaluations = evals.map((e) => ({ ...e }))
  m.status = 'submitted'
  const today = new Date()
  m.statusDate = `${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`
  selectedMember.value = { ...m }
  alert('최종 제출 완료되었습니다.')
}
</script>

<template>
  <section class="dl-eval-view">
    <!-- Progress bar -->
    <div class="dl-eval-view__progress-bar">
      <span class="dl-eval-view__progress-label">1분기 평가 진행률</span>
      <div class="dl-eval-view__bar-track">
        <div class="dl-eval-view__bar-fill" :style="{ width: progressPercent + '%' }" />
      </div>
      <span class="dl-eval-view__progress-count">{{ submittedCount }} / {{ totalCount }}명 완료</span>
      <span class="dl-eval-view__deadline">마감: {{ deadline }}</span>
    </div>

    <!-- Content -->
    <div class="dl-eval-view__content">
      <DepartmentLeaderEvalMemberListPanel
        :members="members"
        :selected-id="selectedMember?.id ?? null"
        @select="selectedMember = $event"
      />
      <DepartmentLeaderEvalFormPanel
        :member="selectedMember"
        @save="handleSave"
        @submit="handleSubmit"
      />
    </div>
  </section>
</template>

<style scoped>
.dl-eval-view {
  width: 100%;
  min-width: 0;
  padding: 20px 28px 28px;
  background: var(--color-bg-app);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Progress bar */
.dl-eval-view__progress-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  background: var(--color-bg-surface);
}

.dl-eval-view__progress-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  white-space: nowrap;
}

.dl-eval-view__bar-track {
  flex: 1;
  height: 10px;
  border-radius: 99px;
  background: var(--color-border-soft);
  overflow: hidden;
}

.dl-eval-view__bar-fill {
  height: 100%;
  border-radius: 99px;
  background: var(--color-primary-600);
  transition: width 0.4s ease;
}

.dl-eval-view__progress-count {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
  white-space: nowrap;
}

.dl-eval-view__deadline {
  font-size: var(--font-size-sm);
  color: #e05a5a;
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
}

/* Content grid */
.dl-eval-view__content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  align-items: start;
}

@media (max-width: 900px) {
  .dl-eval-view__content {
    grid-template-columns: 1fr;
  }
}
</style>
