<script setup>
import { useAuthStore } from '@/stores/auth'
import { computed} from "vue";
import { useRouter } from 'vue-router'

const notice = {
  badge: '중요 공지',
  title: '2026 상반기 평가 의견 입력 마감: 3월 18일 18:00',
  description: '팀리더 정성평가와 HR 검토 항목은 마감 이후 수정이 제한됩니다.',
}

const metrics = [
  { label: '팀 평균 점수', value: '85.4', delta: '+2.1', tone: 'primary' },
  { label: '평가율', value: '91.3%', delta: '+1.2%', tone: 'success' },
  { label: '이번달 완료', value: '108건', delta: '+12', tone: 'success' },
  { label: '팀 TIER 평균', value: 'A', helper: '상위권 유지', tone: 'primary' },
]

const members = [
  {
    id: 1,
    avatar: '손',
    avatarTone: 'purple',
    name: '손창우',
    code: 'MCH-01',
    tier: 'S',
    tierTone: 'purple',
    quantitative: '94.2%',
    qualitative: '89.4%',
    tasks: '47건',
    score: '91',
    delta: '+3.2',
    statusTone: 'success',
  },
]
const alerts = [
  {
    id: 1,
    title: '손창우 S-Tier 달성',
    description: '전체 팀 최상위 등급 진입',
    time: '1시간 전',
    tone: 'mint',
  },
]

</script>

<template>


</template>

<style scoped>
</style>