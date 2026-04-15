import hrApi from '@/services/hrApi'

function toNumber(v, fallback = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function tierCount(source = {}, tier) {
  const upper = tier.toUpperCase()
  const lower = tier.toLowerCase()
  return toNumber(
    source[`tier${upper}Count`] ??
    source[`${lower}TierCount`] ??
    source[`${lower}tierCount`] ??
    source[`${upper}TierCount`] ??
    source[`${upper}tierCount`]
  )
}

function evalStatusToKo(status) {
  if (status === 'CONFIRMED') return '완료'
  if (status === 'SUBMITTED' || status === 'DRAFT') return '진행중'
  return '미완료'
}

function mapMember(item) {
  const tier = item.employeeTier ?? '-'
  const qualitativeScore = item.qualitativeScore == null ? null : toNumber(item.qualitativeScore)
  return {
    empId: String(item.employeeCode ?? item.employeeId ?? '-'),
    name: item.employeeName ?? '-',
    position: '',
    team: item.teamName ?? '',
    quantitative: null,
    qualitative: qualitativeScore,
    total: qualitativeScore,
    grade: item.grade ?? tier,
    status: evalStatusToKo(item.evalStatus),
    _evalStatus: item.evalStatus,
  }
}

export async function fetchDlPerformance() {
  const [summaryRes, teamsRes, membersRes] = await Promise.all([
    hrApi.get('/api/v1/hr/department-leader/dashboard'),
    hrApi.get('/api/v1/hr/department-leader/dashboard/teams'),
    hrApi.get('/api/v1/hr/department-leader/members', { params: { page: 0, size: 100 } }),
  ])

  const summary = summaryRes.data?.data ?? {}
  const teams   = teamsRes.data?.data   ?? []
  const items   = membersRes.data?.data ?? []

  const members = items.map(mapMember)
  const tierTotal = tierCount(summary, 'S') + tierCount(summary, 'A') + tierCount(summary, 'B') + tierCount(summary, 'C')
  const totalMembers = tierTotal > 0 ? tierTotal : members.length
  const evalCompleted = Math.max(0, Math.min(totalMembers, totalMembers - toNumber(summary.unevaluatedCount)))

  const performanceSummary = {
    deptName: '',
    totalMembers,
    totalTeams: teams.length,
    evalCompleted,
    evalTotal: totalMembers,
    deptAvg: toNumber(summary.deptAvgScore),
    deptAvgDelta: 0,
    period: '',
  }

  const teamNames = [...new Set(teams.map((t) => t.teamName).filter(Boolean))]
  const teamOptions = ['전체', ...teamNames]

  const gradeOptions  = ['전체', 'S', 'A', 'B', 'C']
  const periodOptions = [performanceSummary.period || '현재 기간']

  return { performanceSummary, members, teamOptions, gradeOptions, periodOptions, teams }
}
