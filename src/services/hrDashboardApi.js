import { hrApi } from '@/services/apiClient'

function unwrap(response) {
  return response.data?.data ?? response.data
}

function toNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
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

function formatScore(value) {
  return toNumber(value).toFixed(1)
}

function formatPercent(value) {
  return `${formatScore(value)}%`
}

function formatOptionalPercent(value) {
  return value == null ? '-' : formatPercent(value)
}

function tierTone(tier) {
  return tier === 'B' ? 'gold' : 'purple'
}

function statusTone(status) {
  if (status === 'CONFIRMED' || status === 'COMPLETE') return 'success'
  if (status === 'NO_INPUT' || status === 'REJECTED') return 'danger'
  return 'warning'
}

function gradeFromTierCounts(summary = {}) {
  const s = tierCount(summary, 'S')
  const a = tierCount(summary, 'A')
  const b = tierCount(summary, 'B')
  const c = tierCount(summary, 'C')
  const total = s + a + b + c
  if (total === 0) return '-'
  const avg = (s * 4 + a * 3 + b * 2 + c * 1) / total
  if (avg >= 3.5) return 'S'
  if (avg >= 2.5) return 'A'
  if (avg >= 1.5) return 'B'
  return 'C'
}

function gradeFromMembers(members = []) {
  const scoreByTier = { S: 4, A: 3, B: 2, C: 1 }
  const scores = members
    .map((member) => scoreByTier[member.tier ?? member.employeeTier ?? member.grade])
    .filter((score) => Number.isFinite(score))
  if (!scores.length) return '-'
  const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length
  if (avg >= 3.5) return 'S'
  if (avg >= 2.5) return 'A'
  if (avg >= 1.5) return 'B'
  return 'C'
}

function mapNotice(notice) {
  return {
    id: notice?.noticeId ?? null,
    badge: '중요 공지',
    title: notice?.noticeTitle ?? '중요 공지가 없습니다',
    description: notice?.noticeContent ?? '',
  }
}

function mapTlDashboardMember(member) {
  const qualitative = toNumber(member.qualitativeScore)
  const tier = member.tier ?? member.grade ?? '-'
  return {
    id: member.employeeId,
    avatar: member.employeeName?.charAt(0) ?? '?',
    avatarTone: tier === 'B' ? 'gold' : tier === 'C' ? 'green' : 'purple',
    name: member.employeeName ?? '-',
    code: member.employeeCode ?? '',
    tier,
    tierTone: tierTone(tier),
    quantitative: formatOptionalPercent(member.quantitativeScore),
    qualitative: formatOptionalPercent(member.qualitativeScore),
    tasks: member.evalStatus ?? '-',
    score: Math.round(qualitative),
    delta: member.grade ?? tier,
    statusTone: statusTone(member.evalStatus),
  }
}

function formatDecimal(value) {
  return toNumber(value).toFixed(2)
}

function formatOptionalDecimal(value) {
  return value == null ? '-' : formatDecimal(value)
}

function formatOptionalScore(value) {
  return value == null ? '-' : formatScore(value)
}

function mapTlKpiRow(item) {
  return {
    id: item.employeeId,
    avatar: item.employeeName?.charAt(0) ?? '?',
    avatarTone: 'purple',
    name: item.employeeName ?? '-',
    tier: item.employeeTier ?? '-',
    actualOutput: formatOptionalDecimal(item.uphScore),
    eIdx: formatOptionalDecimal(item.yieldScore),
    adjustedRate: item.leadTimeScore == null ? '-' : `${formatDecimal(item.leadTimeScore)}%`,
    score: formatOptionalScore(item.tScore),
    trend: '-',
    trendTone: 'success',
    detailLabel: '보기',
    status: item.status,
  }
}

function buildTlKpiPanel(member, details = []) {
  const rows = details.length > 0 ? details : []
  const avg = (key) => {
    if (!rows.length) return member?.[key] ?? 0
    return rows.reduce((sum, row) => sum + toNumber(row[key]), 0) / rows.length
  }

  const uphScore = avg('uphScore')
  const yieldScore = avg('yieldScore')
  const leadTimeScore = avg('leadTimeScore')
  const sQuant = avg('sQuant')
  const tScore = avg('tScore')
  const error = avg('actualError')

  return {
    title: `산출 상세 - ${member?.name ?? '팀원'}`,
    steps: [
      {
        step: 1,
        title: 'UPH',
        description: '단위 시간 생산성 점수',
        value: formatDecimal(uphScore),
      },
      {
        step: 2,
        title: 'Yield',
        description: '수율 기반 점수',
        value: formatDecimal(yieldScore),
      },
      {
        step: 3,
        title: 'Lead Time',
        description: '리드타임 보정 점수',
        value: formatDecimal(leadTimeScore),
      },
      {
        step: 4,
        title: '최종 정량',
        description: '설비별 정량 지표를 종합한 최종 점수',
        value: formatDecimal(tScore),
      },
    ],
    chartTitle: '설비별 정량 점수 흐름',
    benchmarkTitle: '평가 지표',
    benchmarkItems: [
      { label: 'S_QUANT', value: formatDecimal(sQuant), delta: '종합' },
      { label: 'T_SCORE', value: formatDecimal(tScore), delta: '최종' },
      { label: 'ACTUAL ERROR', value: formatDecimal(error), delta: '보정' },
    ],
  }
}

export async function getTeamLeaderDashboard() {
  const [summaryResponse, membersResponse, noticeResponse] = await Promise.all([
    hrApi.get('/api/v1/hr/team-leader/dashboard'),
    hrApi.get('/api/v1/hr/team-leader/dashboard/members', { params: { page: 0, size: 50 } }),
    hrApi.get('/api/v1/hr/notices/pinned').catch(() => null),
  ])

  const summary = unwrap(summaryResponse) ?? {}
  const members = unwrap(membersResponse) ?? []
  const notice = noticeResponse ? unwrap(noticeResponse) : null
  const summaryTierAverage = gradeFromTierCounts(summary)
  const tierAverage = summaryTierAverage === '-' ? gradeFromMembers(members) : summaryTierAverage

  return {
    notice: mapNotice(notice),
    metrics: [
      { label: '팀 평균 점수', value: formatScore(summary.teamAvgScore), tone: 'primary' },
      { label: '평가율', value: formatPercent(summary.evaluationRate), tone: 'success' },
      { label: '평가 완료', value: `${toNumber(summary.completedCount)}건`, tone: 'success' },
      { label: '팀 TIER 평균', value: tierAverage, helper: `S ${tierCount(summary, 'S')} / A ${tierCount(summary, 'A')}`, tone: 'primary' },
    ],
    members: members.map(mapTlDashboardMember),
  }
}

export async function getTeamLeaderKpiReport({ year = 2026, evalSequence = 1 } = {}) {
  const response = await hrApi.get('/api/v1/hr/team-leader/kpi', {
    params: { year, evalSequence },
  })
  const rows = unwrap(response) ?? []
  const mappedRows = rows.map(mapTlKpiRow)
  const avgScore = mappedRows.length
    ? mappedRows.reduce((sum, row) => sum + toNumber(row.score), 0) / mappedRows.length
    : 0

  return {
    rows: mappedRows,
    summaryCards: [
      { label: '팀원 수', value: `${mappedRows.length}명`, tone: 'primary' },
      { label: '평균 정량점수', value: formatScore(avgScore), tone: 'success' },
      { label: '확정 건수', value: `${rows.filter((row) => row.status === 'CONFIRMED').length}건`, tone: 'success' },
      { label: '평가 기간', value: `${year}-${evalSequence}`, tone: 'primary' },
    ],
  }
}

export async function getTeamLeaderKpiMemberDetail(employeeId, { year = 2026, evalSequence = 1 } = {}, member = null) {
  if (!employeeId) return buildTlKpiPanel(member)
  const response = await hrApi.get(`/api/v1/hr/team-leader/kpi/${employeeId}`, {
    params: { year, evalSequence },
  })
  return buildTlKpiPanel(member, unwrap(response) ?? [])
}

function mapDlMember(item) {
  return {
    id: item.employeeId,
    name: item.employeeName ?? '-',
    tier: item.employeeTier ?? '-',
    score: formatScore(item.qualitativeScore),
    grade: item.grade ?? '-',
    status: item.evalStatus ?? '-',
    statusTone: statusTone(item.evalStatus),
  }
}

export async function getDepartmentLeaderDashboard() {
  const [summaryResponse, teamsResponse, membersResponse, noticeResponse] = await Promise.all([
    hrApi.get('/api/v1/hr/department-leader/dashboard'),
    hrApi.get('/api/v1/hr/department-leader/dashboard/teams'),
    hrApi.get('/api/v1/hr/department-leader/members', { params: { page: 0, size: 50 } }),
    hrApi.get('/api/v1/hr/notices/pinned').catch(() => null),
  ])

  const summary = unwrap(summaryResponse) ?? {}
  const teams = unwrap(teamsResponse) ?? []
  const members = unwrap(membersResponse) ?? []
  const notice = noticeResponse ? unwrap(noticeResponse) : null

  return {
    notice: mapNotice(notice),
    metrics: [
      { label: '부서 평균 점수', value: formatScore(summary.deptAvgScore), tone: 'primary' },
      { label: '평가율', value: formatPercent(summary.evaluationRate), tone: 'success' },
      { label: '미평가 직원', value: `${toNumber(summary.unevaluatedCount)}명`, tone: toNumber(summary.unevaluatedCount) > 0 ? 'danger' : 'success' },
      { label: 'S/A Tier', value: `${tierCount(summary, 'S') + tierCount(summary, 'A')}명`, tone: 'primary' },
    ],
    groupKpi: {
      groupAvg: toNumber(summary.deptAvgScore),
      equipRate: formatPercent(summary.evaluationRate),
      qualityRate: `${tierCount(summary, 'S') + tierCount(summary, 'A')}명`,
      tierStats: {
        s: tierCount(summary, 'S'),
        a: tierCount(summary, 'A'),
        b: tierCount(summary, 'B'),
        c: tierCount(summary, 'C'),
      },
    },
    members: members.map(mapDlMember),
    teams: teams.map((team) => ({
      id: team.tlId,
      name: team.teamName ?? `${team.tlName ?? '-'} 팀`,
      tl: team.tlName ?? '-',
      count: toNumber(team.memberCount),
      avg: formatScore(team.teamAvgScore),
      status: team.evaluationStatus ?? '-',
    })),
  }
}

function tierDistribution(summary = {}) {
  return tierDistributionFromCounts({
    S: tierCount(summary, 'S'),
    A: tierCount(summary, 'A'),
    B: tierCount(summary, 'B'),
    C: tierCount(summary, 'C'),
  })
}

function tierDistributionFromCounts(counts = {}) {
  const total = toNumber(counts.S) + toNumber(counts.A) + toNumber(counts.B) + toNumber(counts.C)
  const toItem = (tier, count) => ({
    tier,
    count,
    percent: total ? Math.round((count / total) * 100) : 0,
  })
  return [
    toItem('S', toNumber(counts.S)),
    toItem('A', toNumber(counts.A)),
    toItem('B', toNumber(counts.B)),
    toItem('C', toNumber(counts.C)),
  ]
}

function mapHrmTrend(trend) {
  return {
    month: `${trend.year}-Q${trend.evalSequence}`,
    quarter: `${trend.year}-Q${trend.evalSequence}`,
    S: tierCount(trend, 'S'),
    A: tierCount(trend, 'A'),
    B: tierCount(trend, 'B'),
    C: tierCount(trend, 'C'),
    avgScore: toNumber(trend.avgScore),
  }
}

function mapHrmDetailRow(item) {
  return {
    id: item.employeeId,
    team: item.employeeName ?? '-',
    count: 1,
    avg: formatScore(item.qualitativeScore),
    S: item.employeeTier === 'S' ? 1 : 0,
    A: item.employeeTier === 'A' ? 1 : 0,
    B: item.employeeTier === 'B' ? 1 : 0,
    C: item.employeeTier === 'C' ? 1 : 0,
  }
}

function mapHrmTeamStatsRow(item) {
  return {
    id: item.departmentId,
    team: item.departmentName ?? '-',
    count: toNumber(item.memberCount),
    avg: formatScore(item.avgScore),
    S: tierCount(item, 'S'),
    A: tierCount(item, 'A'),
    B: tierCount(item, 'B'),
    C: tierCount(item, 'C'),
  }
}

function sumTierCounts(rows = []) {
  return rows.reduce(
    (acc, row) => ({
      S: acc.S + toNumber(row.S),
      A: acc.A + toNumber(row.A),
      B: acc.B + toNumber(row.B),
      C: acc.C + toNumber(row.C),
    }),
    { S: 0, A: 0, B: 0, C: 0 }
  )
}

function mapHrmKpiLeaderRow(item, index) {
  const status = item.evalStatus ?? ''
  const completionRate = status === 'CONFIRMED' ? 100 : status === 'NO_INPUT' ? 0 : 50
  return {
    id: item.employeeId,
    name: item.employeeName ?? '-',
    line: item.employeeTier ? `${item.employeeTier}-Tier` : '-',
    members: 1,
    evaluated: status === 'NO_INPUT' ? 0 : 1,
    total: 1,
    avgScore: formatScore(item.qualitativeScore),
    tierDist: item.grade ?? item.employeeTier ?? '-',
    completionRate,
    avatarColor: ['#5b4fcf', '#00bf95', '#f59e0b', '#ef476f'][index % 4],
  }
}

function mapHrmTeamStatsReportRow(item, index, completionRate = 0, quarter = '') {
  const total = toNumber(item.count)
  const evaluated = Math.round((total * toNumber(completionRate)) / 100)
  return {
    id: item.id,
    name: item.team,
    quarter,
    line: '부서',
    members: total,
    evaluated,
    total,
    avgScore: item.avg,
    tierDist: `S ${item.S} / A ${item.A} / B ${item.B} / C ${item.C}`,
    completionRate: toNumber(completionRate),
    avatarColor: ['#5b4fcf', '#00bf95', '#f59e0b', '#ef476f'][index % 4],
  }
}

async function resolveHrmKpiPeriod(period = {}) {
  if (period.year && period.evalSequence) return period
  try {
    const response = await hrApi.get('/api/v1/hr/evaluation-periods', {
      params: { status: 'IN_PROGRESS', page: 0, size: 1 },
    })
    const latest = unwrap(response)?.content?.[0]
    if (latest?.evalYear && latest?.evalSequence) {
      return { year: latest.evalYear, evalSequence: latest.evalSequence }
    }
  } catch {
    // KPI 화면은 평가기간 조회 실패 시 기존 기본 기간으로 fallback한다.
  }
  return { year: 2026, evalSequence: 1 }
}

export async function getHrmDashboard(period = {}) {
  const { year, evalSequence } = await resolveHrmKpiPeriod(period)
  const [summaryResponse, trendsResponse, teamStatsResponse, noticeResponse] = await Promise.all([
    hrApi.get('/api/v1/hr/kpi/summary', { params: { year, evalSequence } }),
    hrApi.get('/api/v1/hr/kpi/trends', { params: { year } }),
    hrApi.get('/api/v1/hr/kpi/team-stats', { params: { year, evalSequence } }),
    hrApi.get('/api/v1/hr/notices/pinned').catch(() => null),
  ])

  const summary = unwrap(summaryResponse) ?? {}
  const trends = unwrap(trendsResponse) ?? []
  const teamStats = (unwrap(teamStatsResponse) ?? []).map(mapHrmTeamStatsRow)
  const notice = noticeResponse ? unwrap(noticeResponse) : null
  const summaryTierCounts = {
    S: tierCount(summary, 'S'),
    A: tierCount(summary, 'A'),
    B: tierCount(summary, 'B'),
    C: tierCount(summary, 'C'),
  }
  const teamTierCounts = sumTierCounts(teamStats)
  const tierCounts =
    summaryTierCounts.S + summaryTierCounts.A + summaryTierCounts.B + summaryTierCounts.C > 0
      ? summaryTierCounts
      : teamTierCounts

  return {
    notification: mapNotice(notice),
    dashboard: {
      avgScore: formatScore(summary.avgScore),
      totalEmployees: toNumber(summary.totalEmployees),
      evaluationRate: formatScore(summary.evaluationRate),
      unevaluatedCount: toNumber(summary.unevaluatedCount),
      tierDelta: `현재 평가기간 ${year}-Q${evalSequence}`,
    },
    tierDistribution: tierDistributionFromCounts(tierCounts),
    tierTrend: trends.map(mapHrmTrend),
    teamStats,
    tierSummary: {
      S: tierCounts.S,
      A: tierCounts.A,
      B: tierCounts.B,
      C: tierCounts.C,
      processLabel: '평가 완료율',
      processPercent: toNumber(summary.evaluationRate),
    },
  }
}

export async function getHrmKpiReport(period = {}) {
  const { year, evalSequence } = await resolveHrmKpiPeriod(period)
  const [summaryResponse, trendsResponse, detailsResponse, teamStatsResponse] = await Promise.all([
    hrApi.get('/api/v1/hr/kpi/summary', { params: { year, evalSequence } }),
    hrApi.get('/api/v1/hr/kpi/trends', { params: { year } }),
    hrApi.get('/api/v1/hr/kpi/details', { params: { year, evalSequence, page: 0, size: 50 } }),
    hrApi.get('/api/v1/hr/kpi/team-stats', { params: { year, evalSequence } }),
  ])

  const summary = unwrap(summaryResponse) ?? {}
  const trends = unwrap(trendsResponse) ?? []
  const details = unwrap(detailsResponse) ?? []
  const teamStats = (unwrap(teamStatsResponse) ?? []).map(mapHrmTeamStatsRow)
  const completionRate = toNumber(summary.evaluationRate)

  return {
    report: {
      quarter: `${year}년 ${evalSequence}분기`,
      avgScore: formatScore(summary.avgScore),
      avgScoreDelta: '-',
      saRatio: toNumber(summary.totalEmployees)
        ? Math.round(((tierCount(summary, 'S') + tierCount(summary, 'A')) / toNumber(summary.totalEmployees)) * 100)
        : 0,
      saRatioDelta: 0,
      completedTasks: details.filter((item) => item.evalStatus === 'CONFIRMED').length,
      completedTasksDelta: '-',
      avgMtbf: '-',
      avgMtbfDelta: '-',
      completionRate,
      inProgressRate: 0,
      pendingRate: Math.max(0, 100 - completionRate),
    },
    teamScores: teamStats.map((item) => ({
      team: item.team,
      score: toNumber(item.avg),
      quarter: `${year}년 ${evalSequence}분기`,
    })),
    tierTrend: trends.map(mapHrmTrend),
    teamLeaders: teamStats.map((item, index) =>
      mapHrmTeamStatsReportRow(item, index, completionRate, `${year}년 ${evalSequence}분기`)
    ),
  }
}

export async function downloadHrmKpiReport(period = {}) {
  const { year, evalSequence } = await resolveHrmKpiPeriod(period)
  const response = await hrApi.get('/api/v1/hr/kpi/report/download', {
    params: { year, evalSequence },
    responseType: 'blob',
  })

  const blob = new Blob([response.data], {
    type: response.headers['content-type'] ?? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `전사_KPI_보고서_${year}_Q${evalSequence}.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
