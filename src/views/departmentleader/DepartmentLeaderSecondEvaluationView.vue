<script setup>
import { ref, computed } from 'vue'
import DepartmentLeaderEvalMemberListPanel from '@/components/departmentleader/hr/DepartmentLeaderEvalMemberListPanel.vue'
import DepartmentLeaderEvalFormPanel from '@/components/departmentleader/hr/DepartmentLeaderEvalFormPanel.vue'

const members = ref([
  {
    id: 1,
    name: '손창우',
    avatar: '손',
    avatarColor: '#5f50d6',
    tier: 'S',
    code: 'MCH-01',
    team: '정밀가공 1팀',
    experience: '경력 3년 2월',
    status: 'submitted',
    statusDate: '03.05',
    aiRecommended: { quantitative: 94.2, qualitative: 89.4, composite: 91.8 },
    evaluations: [
      { category: '직무 태도',   stars: 5, score: 95, comment: '작업 숙련도 매우 높음' },
      { category: '팀 기여도',   stars: 5, score: 93, comment: '팀 전체 생산성 향상 기여' },
      { category: '문제 해결',   stars: 5, score: 92, comment: '설비 이상 신속 대응' },
      { category: '커뮤니케이션', stars: 4, score: 88, comment: '명확한 의사소통' },
      { category: '성장 가능성', stars: 5, score: 96, comment: '꾸준한 자기 개발' },
    ],
  },
  {
    id: 2,
    name: '김신우',
    avatar: '김',
    avatarColor: '#5f50d6',
    tier: 'A',
    code: 'MCH-02',
    team: '정밀가공 1팀',
    experience: '경력 2년 5월',
    status: 'submitted',
    statusDate: '03.06',
    aiRecommended: { quantitative: 86.1, qualitative: 82.7, composite: 84.0 },
    evaluations: [
      { category: '직무 태도',   stars: 4, score: 85, comment: '성실한 업무 태도' },
      { category: '팀 기여도',   stars: 4, score: 82, comment: '팀 작업 적극 참여' },
      { category: '문제 해결',   stars: 4, score: 80, comment: '문제 인식 및 보고 우수' },
      { category: '커뮤니케이션', stars: 4, score: 84, comment: '원활한 소통' },
      { category: '성장 가능성', stars: 4, score: 83, comment: '기술 습득 속도 양호' },
    ],
  },
  {
    id: 3,
    name: '황자현',
    avatar: '황',
    avatarColor: '#269063',
    tier: 'A',
    code: 'PRS-01',
    team: '정밀가공 2팀',
    experience: '경력 2년 8월',
    status: 'in_progress',
    statusDate: '오늘',
    aiRecommended: { quantitative: 83.4, qualitative: 79.1, composite: 81.2 },
    evaluations: [
      { category: '직무 태도',   stars: 4, score: 82, comment: '팀 내 협력 우수, 지각 없음' },
      { category: '팀 기여도',   stars: 4, score: 80, comment: 'PRS-01 설비 최적화 기여' },
      { category: '문제 해결',   stars: 4, score: 79, comment: '트러블슈팅 능력 향상 중' },
      { category: '커뮤니케이션', stars: 3, score: 75, comment: '' },
      { category: '성장 가능성', stars: 4, score: 85, comment: '' },
    ],
  },
  {
    id: 4,
    name: '임원석',
    avatar: '임',
    avatarColor: '#c08b00',
    tier: 'B',
    code: 'WLD-01',
    team: '정밀가공 2팀',
    experience: '경력 1년 3월',
    status: 'not_started',
    statusDate: '—',
    aiRecommended: { quantitative: 72.8, qualitative: 75.3, composite: 74.0 },
    evaluations: [
      { category: '직무 태도',   stars: 3, score: 72, comment: '' },
      { category: '팀 기여도',   stars: 3, score: 70, comment: '' },
      { category: '문제 해결',   stars: 3, score: 68, comment: '' },
      { category: '커뮤니케이션', stars: 3, score: 74, comment: '' },
      { category: '성장 가능성', stars: 4, score: 76, comment: '' },
    ],
  },
])

const selectedMember = ref(members.value[2]) // 황자현 selected by default

const deadline = '2026.03.10'
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
  font-size: 13px;
  font-weight: 600;
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
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-700);
  white-space: nowrap;
}

.dl-eval-view__deadline {
  font-size: 13px;
  color: #e05a5a;
  font-weight: 600;
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
