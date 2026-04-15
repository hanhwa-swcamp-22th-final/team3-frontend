<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DepartmentLeaderPerformanceSummary from '@/components/hr/departmentleader/perfomance/DepartmentLeaderPerformanceSummary.vue'
import DepartmentLeaderPerformanceTable from '@/components/hr/departmentleader/perfomance/DepartmentLeaderPerformanceTable.vue'
import { fetchDlPerformance } from '@/services/departmentleader/performanceApi'

const router = useRouter()

const loading = ref(true)
const performanceSummary = ref({
  deptName: '',
  totalMembers: 0,
  totalTeams: 0,
  evalCompleted: 0,
  evalTotal: 0,
  deptAvg: 0,
  deptAvgDelta: 0,
  period: '',
})
const performanceMembers = ref([])
const teamOptions  = ref(['전체'])
const gradeOptions = ref(['전체', 'S', 'A', 'B', 'C'])
const periodOptions = ref(['현재 기간'])
const rawTeams = ref([])

const selectedTeam = ref('전체')

onMounted(async () => {
  try {
    const data = await fetchDlPerformance()
    performanceSummary.value  = data.performanceSummary
    performanceMembers.value  = data.members
    teamOptions.value         = data.teamOptions
    gradeOptions.value        = data.gradeOptions
    periodOptions.value       = data.periodOptions
    rawTeams.value            = data.teams
  } catch (error) {
    console.error('Failed to load performance data:', error)
  } finally {
    loading.value = false
  }
})

// 팀 탭 선택 시 해당 팀 이름 기준으로 팀 요약 계산
const activeSummary = computed(() => {
  if (selectedTeam.value === '전체') return performanceSummary.value

  const selectedMembers = performanceMembers.value.filter((member) => member.team === selectedTeam.value)
  if (selectedMembers.length === 0) return performanceSummary.value

  const memberCount = selectedMembers.length
  const evaluatedCount = selectedMembers.filter((member) => member._evalStatus && member._evalStatus !== 'NO_INPUT').length
  const scoredMembers = selectedMembers.filter((member) => member.qualitative != null && Number.isFinite(Number(member.qualitative)))
  const avg = scoredMembers.length
    ? +(scoredMembers.reduce((sum, member) => sum + Number(member.qualitative), 0) / scoredMembers.length).toFixed(1)
    : 0
  const delta = +(avg - performanceSummary.value.deptAvg).toFixed(1)

  return {
    totalMembers: memberCount,
    totalTeams: 1,
    evalCompleted: evaluatedCount,
    evalTotal: memberCount,
    deptAvg: avg,
    deptAvgDelta: delta,
    period: performanceSummary.value.period,
  }
})

function handleViewCapability(member) {
  router.push({ path: '/departmentleader/team-capability', query: { empId: member.empId } })
}

function handleGoEvaluation() {
  router.push({ path: '/departmentleader/evaluation' })
}
</script>

<template>
  <div class="dl-performance">
    <header class="dl-performance__header">
      <h2 class="dl-performance__title">부서 성과 현황</h2>
      <span v-if="performanceSummary.deptName" class="dl-performance__dept-name">
        {{ performanceSummary.deptName }}
      </span>
      <span v-if="performanceSummary.period" class="dl-performance__period">
        {{ performanceSummary.period }}
      </span>
    </header>

    <div v-if="loading" class="dl-performance__loading">데이터를 불러오는 중...</div>

    <template v-else>
      <DepartmentLeaderPerformanceSummary
        :summary="activeSummary"
        :team-tabs="teamOptions"
        v-model:selectedTeam="selectedTeam"
      />

      <DepartmentLeaderPerformanceTable
        :members="performanceMembers"
        :team-options="teamOptions"
        :grade-options="gradeOptions"
        :period-options="periodOptions"
        @view-capability="handleViewCapability"
        @go-evaluation="handleGoEvaluation"
      />
    </template>
  </div>
</template>

<style scoped>
.dl-performance {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 24px 28px;
  background: var(--color-bg-app);
  overflow-y: auto;
}

.dl-performance__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dl-performance__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-primary-800);
  margin: 0;
}

.dl-performance__dept-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
  background: var(--color-primary-50, #f5f4ff);
  border: 1px solid var(--color-primary-200, #d4cfff);
  border-radius: 99px;
  padding: 3px 12px;
}

.dl-performance__period {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  background: var(--color-bg-surface-muted, #f5f4ff);
  border: 1px solid var(--color-border-default);
  border-radius: 99px;
  padding: 3px 12px;
}

.dl-performance__loading {
  padding: 60px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
}

@media (max-width: 960px) {
  .dl-performance {
    padding: 20px 16px;
  }
}
</style>
