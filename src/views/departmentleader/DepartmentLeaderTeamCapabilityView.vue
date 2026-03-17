<script setup>
import { ref } from 'vue'
import DepartmentLeaderMemberListPanel from '@/components/departmentleader/hr/DepartmentLeaderMemberListPanel.vue'
import DepartmentLeaderCapabilityDetailPanel from '@/components/departmentleader/hr/DepartmentLeaderCapabilityDetailPanel.vue'

const members = [
  {
    id: 1,
    name: '손창우',
    avatar: '손',
    avatarColor: '#5f50d6',
    tier: 'S',
    code: 'MCH-01',
    score: 91,
    team: '정밀가공 1팀',
    line: '정밀가공 1라인',
    experience: '경력 3년 2월',
    quantitative: 94.2,
    qualitative: 89.4,
    composite: 91.8,
    skills: [
      { label: '정밀도',  value: 94 },
      { label: '설비숙련', value: 92 },
      { label: '문제해결', value: 90 },
      { label: '안전준수', value: 87 },
      { label: '작업속도', value: 88 },
      { label: '협업',   value: 85 },
    ],
    tierHistory: [
      { tier: 'C', score: 58, date: '2023.01' },
      { tier: 'B', score: 74, date: '2025.01' },
      { tier: 'A', score: 84, date: '2025.08' },
      { tier: 'S', score: 91, date: '2026.02' },
    ],
  },
  {
    id: 2,
    name: '김신우',
    avatar: '김',
    avatarColor: '#5f50d6',
    tier: 'A',
    code: 'MCH-02',
    score: 84,
    team: '정밀가공 1팀',
    line: '정밀가공 1라인',
    experience: '경력 2년 5월',
    quantitative: 86.1,
    qualitative: 82.7,
    composite: 84.0,
    skills: [
      { label: '정밀도',  value: 85 },
      { label: '설비숙련', value: 83 },
      { label: '문제해결', value: 80 },
      { label: '안전준수', value: 88 },
      { label: '작업속도', value: 82 },
      { label: '협업',   value: 79 },
    ],
    tierHistory: [
      { tier: 'C', score: 61, date: '2024.01' },
      { tier: 'B', score: 76, date: '2025.03' },
      { tier: 'A', score: 84, date: '2025.11' },
    ],
  },
  {
    id: 3,
    name: '황자현',
    avatar: '황',
    avatarColor: '#269063',
    tier: 'A',
    code: 'PRS-01',
    score: 81,
    team: '정밀가공 2팀',
    line: '프레스라인',
    experience: '경력 2년 8월',
    quantitative: 83.4,
    qualitative: 79.1,
    composite: 81.2,
    skills: [
      { label: '정밀도',  value: 80 },
      { label: '설비숙련', value: 78 },
      { label: '문제해결', value: 82 },
      { label: '안전준수', value: 85 },
      { label: '작업속도', value: 79 },
      { label: '협업',   value: 76 },
    ],
    tierHistory: [
      { tier: 'C', score: 60, date: '2023.08' },
      { tier: 'B', score: 73, date: '2025.02' },
      { tier: 'A', score: 81, date: '2025.10' },
    ],
  },
  {
    id: 4,
    name: '임원석',
    avatar: '임',
    avatarColor: '#c08b00',
    tier: 'B',
    code: 'WLD-01',
    score: 74,
    team: '정밀가공 2팀',
    line: '용접라인',
    experience: '경력 1년 3월',
    quantitative: 72.8,
    qualitative: 75.3,
    composite: 74.0,
    skills: [
      { label: '정밀도',  value: 71 },
      { label: '설비숙련', value: 74 },
      { label: '문제해결', value: 70 },
      { label: '안전준수', value: 79 },
      { label: '작업속도', value: 73 },
      { label: '협업',   value: 77 },
    ],
    tierHistory: [
      { tier: 'C', score: 62, date: '2025.01' },
      { tier: 'B', score: 74, date: '2026.01' },
    ],
  },
]

const selectedMember = ref(members[0])
</script>

<template>
  <section class="dl-capability-view">
    <DepartmentLeaderMemberListPanel
      :members="members"
      :selected-id="selectedMember?.id ?? null"
      @select="selectedMember = $event"
    />
    <DepartmentLeaderCapabilityDetailPanel :member="selectedMember" />
  </section>
</template>

<style scoped>
.dl-capability-view {
  width: 100%;
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  padding: 20px 28px 28px;
  background: var(--color-bg-app);
  align-items: start;
}
</style>
