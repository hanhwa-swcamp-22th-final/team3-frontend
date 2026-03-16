<script setup>
import DepartmentLeaderDashboardNotice from '@/components/departmentleader/dashboard/DepartmentLeaderDashboardNotice.vue'
import DepartmentLeaderMetricCard     from '@/components/departmentleader/dashboard/DepartmentLeaderMetricCard.vue'
import DepartmentLeaderGroupKpiCard   from '@/components/departmentleader/dashboard/DepartmentLeaderGroupKpiCard.vue'
import DepartmentLeaderTeamStatusCard from '@/components/departmentleader/dashboard/DepartmentLeaderTeamStatusCard.vue'

const notice = {
  badge: '📌 중요 공지',
  title: '2026 상반기 평가 의견 입력 마감: 3월 18일 18:00',
  description:
    '팀리더 정성평가와 HR 검토 항목은 마감 이후 수정이 제한됩니다. 음성인식 불량 건은 텍스트 수동 보정 후 제출해 주세요.',
}

const metrics = [
  { label: '팀 평균 점수', value: '85.4', delta: '▲2.1',  tone: 'primary' },
  { label: '팀 가동률',   value: '91.3%', delta: '▲1.2%', tone: 'success' },
  { label: '이벤트 알람', value: '108건', delta: '▲12',   tone: 'success' },
  { label: '팀 TIER 등급', value: 'A',   tone: 'primary', isTier: true },
]

const teams = [
  { id: 1, name: '제조1팀', tl: '박지훈', count: 12, avg: 81.2, status: '평가완료' },
  { id: 2, name: '제조2팀', tl: '한민수', count: 10, avg: 79.8, status: '심사중'  },
  { id: 3, name: '품질팀',  tl: '오성현', count: 8,  avg: 84.5, status: '평가완료' },
]
</script>

<template>
  <section class="department-leader-dashboard">
    <DepartmentLeaderDashboardNotice
      :badge="notice.badge"
      :title="notice.title"
      :description="notice.description"
    />

    <section class="department-leader-dashboard__metrics">
      <DepartmentLeaderMetricCard
        v-for="m in metrics"
        :key="m.label"
        :label="m.label"
        :value="m.value"
        :delta="m.delta"
        :tone="m.tone"
        :is-tier="m.isTier ?? false"
      />
    </section>

    <section class="department-leader-dashboard__bottom">
      <DepartmentLeaderGroupKpiCard
        :group-avg="83.1"
        equip-rate="91.4%"
        quality-rate="96.2%"
      />
      <DepartmentLeaderTeamStatusCard :teams="teams" />
    </section>
  </section>
</template>

<style scoped>
.department-leader-dashboard {
  width: 100%;
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  display: grid;
  gap: 20px;
  padding: 20px 28px 28px;
  background: var(--color-bg-app);
  align-content: start;
}

.department-leader-dashboard__metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.department-leader-dashboard__bottom {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;
}
</style>
