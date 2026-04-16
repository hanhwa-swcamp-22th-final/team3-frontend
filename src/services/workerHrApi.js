import { hrApi } from '@/services/apiClient'
import { formatEvaluationPeriodLabel } from '@/utils/evaluationPeriod'

function unwrap(response) {
  return response.data?.data ?? response.data
}

async function optionalGet(url, config = {}, fallback = null) {
  try {
    const response = await hrApi.get(url, config)
    return unwrap(response) ?? fallback
  } catch {
    return fallback
  }
}

function toNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function roundToOne(value) {
  return Math.round(toNumber(value) * 10) / 10
}

function normalizeTier(tier) {
  return tier || 'C'
}

function formatPeriodLabel(value, sequence, fallback = '-') {
  return formatEvaluationPeriodLabel(
    { evalYear: value, evalSequence: sequence },
    { fallback },
  )
}

function translateSkillName(skillName) {
  const skillNameMap = {
    EQUIPMENT_RESPONSE: '설비대응',
    TECHNICAL_TRANSFER: '기술전수',
    INNOVATION_PROPOSAL: '혁신제안',
    SAFETY_COMPLIANCE: '안전준수',
    QUALITY_MANAGEMENT: '품질관리',
    PRODUCTIVITY: '생산성',
  }
  return skillNameMap[skillName] ?? skillName ?? '-'
}

function formatCareerPeriod(hireDate) {
  if (!hireDate) return '-'
  const start = new Date(hireDate)
  if (Number.isNaN(start.getTime())) return '-'

  const today = new Date()
  let years = today.getFullYear() - start.getFullYear()
  let months = today.getMonth() - start.getMonth()

  if (today.getDate() < start.getDate()) {
    months -= 1
  }
  if (months < 0) {
    years -= 1
    months += 12
  }
  if (years <= 0 && months <= 0) return '1개월 미만'
  if (years <= 0) return `${months}개월`
  if (months <= 0) return `${years}년`
  return `${years}년 ${months}개월`
}

function formatDate(value) {
  if (!value) return '-'
  return String(value).slice(0, 10)
}

function toSkillViewModel(skill) {
  return {
    id: skill.skillId,
    label: translateSkillName(skill.skillName),
    value: Math.round(toNumber(skill.skillScore)),
  }
}

function calculateOverallSkillScore(skills) {
  const scoreTargetSkillNames = new Set([
    'EQUIPMENT_RESPONSE',
    'TECHNICAL_TRANSFER',
    'INNOVATION_PROPOSAL',
    'SAFETY_COMPLIANCE',
    'QUALITY_MANAGEMENT',
    'PRODUCTIVITY',
  ])
  const scores = (skills ?? [])
    .filter((skill) => scoreTargetSkillNames.has(skill.skillName))
    .map((skill) => Number(skill.skillScore))
    .filter(Number.isFinite)

  if (!scores.length) return 0
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
}

function toTierHistoryMilestone(item) {
  const tier = normalizeTier(item.toTier)
  const isInitial = item.eventType === 'INITIAL'
  const label = isInitial
    ? '입사 티어'
    : `${normalizeTier(item.fromTier)} -> ${tier} 승급`

  return {
    tier,
    label,
    date: formatDate(item.occurredDate ?? item.occurredAt),
    score: item.tierAccumulatedPoint ?? item.targetPromotionPoint ?? '-',
  }
}

function toMissionViewModel(mission) {
  const current = toNumber(mission.currentValue)
  const target = Math.max(toNumber(mission.conditionValue), 1)
  const progressRate = Math.min(Math.max(toNumber(mission.progressRate), 0), 100)

  return {
    id: mission.missionProgressId ?? mission.missionTemplateId,
    title: mission.missionName ?? '-',
    subtitle: mission.missionType ?? '',
    targetTier: mission.upgradeToTier ?? '',
    points: toNumber(mission.rewardPoint),
    current,
    target,
    progressRate,
    status: mission.status ?? '',
    icon: mission.status === 'COMPLETED' ? '✓' : '•',
    completed: mission.status === 'COMPLETED',
    barColor: mission.status === 'COMPLETED' ? '#00BF95' : '#5B4FCF',
  }
}

function resolveAiEvaluationScore(missions = []) {
  const aiMission = missions.find((mission) => mission.missionType === 'AI_SCORE')
  if (!aiMission) return '-'

  const score = toNumber(aiMission.currentValue)
  return Number.isFinite(score) ? Number(score.toFixed(1)) : '-'
}

function toNoticeBannerViewModel(notice) {
  if (!notice) return null
  return {
    id: notice.noticeId,
    title: notice.noticeTitle ?? '중요 공지',
    description: notice.noticeContent ?? '',
  }
}

function toPointCategory(history) {
  const type = history.pointType ?? history.pointSourceType ?? ''
  const labelMap = {
    WORK_COMPLETE: '작업완료',
    WORK_COMPLETION: '작업완료',
    AI_EVALUATION: 'AI평가',
    EVALUATION: 'AI평가',
    KMS: 'KMS',
    EQUIPMENT: '설비보정',
  }
  return labelMap[type] ?? type ?? '기타'
}

function summarizePointDistribution(history) {
  const colors = {
    작업완료: '#00BF95',
    AI평가: '#FBBF24',
    KMS: '#5B4FCF',
    설비보정: '#EF476F',
    기타: '#9CA3AF',
  }
  const grouped = history.reduce((acc, item) => {
    const category = item.category || '기타'
    acc[category] = (acc[category] ?? 0) + item.points
    return acc
  }, {})

  const distribution = Object.entries(grouped).map(([label, value]) => ({
    label,
    value,
    color: colors[label] ?? colors.기타,
  }))

  return distribution.length > 0
    ? distribution
    : [{ label: '누적', value: 0, color: colors.기타 }]
}

function toPointHistoryViewModel(history) {
  return {
    id: history.performancePointId,
    date: history.pointEarnedDate ?? '-',
    category: toPointCategory(history),
    description: history.pointDescription ?? history.pointSourceType ?? '-',
    points: toNumber(history.pointAmount),
  }
}

function formatPointMonthLabel(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    const raw = String(value)
    const matched = raw.match(/^(\d{4})-(\d{2})/)
    if (matched) {
      return `${matched[1]}년 ${Number(matched[2])}월`
    }
    return raw
  }
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`
}

function getQuarterKey(value) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    const matched = String(value).match(/^(\d{4})-(\d{2})/)
    if (!matched) return null
    const year = Number(matched[1])
    const month = Number(matched[2])
    return `${year}-Q${Math.floor((month - 1) / 3) + 1}`
  }
  return `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`
}

function formatQuarterLabel(value) {
  const matched = String(value ?? '').match(/^(\d{4})-Q([1-4])$/)
  if (!matched) return value ?? '-'
  return `${matched[1]}년 ${matched[2]}분기`
}

function buildQuarterPointTotals(pointHistory = []) {
  const grouped = [...(pointHistory ?? [])]
    .filter((item) => item?.date)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .reduce((acc, item) => {
      const key = getQuarterKey(item.date)
      if (!key) return acc
      acc[key] = (acc[key] ?? 0) + toNumber(item.points)
      return acc
    }, {})

  return Object.entries(grouped)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, total]) => ({
      key,
      label: formatQuarterLabel(key),
      total: roundToOne(total),
    }))
}

function buildSkillGapViewModel(skillGap) {
  const currentSkills = skillGap.currentSkills ?? []
  const targetTier = skillGap.targetTier ?? 'S+'

  const skills = currentSkills.map((skill) => {
    const current = Math.round(toNumber(skill.skillScore))
    const target = Math.min(100, Math.max(current, current + 5))
    return {
      label: translateSkillName(skill.skillName),
      current,
      target,
      gap: Math.max(target - current, 0),
    }
  })

  const currentOverall = skills.length
    ? Math.round(skills.reduce((sum, skill) => sum + skill.current, 0) / skills.length)
    : 0
  const targetOverall = skills.length
    ? Math.round(skills.reduce((sum, skill) => sum + skill.target, 0) / skills.length)
    : 0
  const totalGap = Math.max(targetOverall - currentOverall, 0)
  const topGaps = [...skills].sort((a, b) => b.gap - a.gap).slice(0, 3)

  return {
    skills,
    summary: {
      currentOverall,
      targetOverall,
      totalGap,
    },
    report: {
      summary: skills.length
        ? `현재 보유 스킬 기준 ${targetTier} 목표까지 평균 ${totalGap}점 차이가 있습니다. 목표 스킬 기준 API가 완성되면 더 정확한 Gap 분석이 가능합니다.`
        : '현재 조회 가능한 스킬 데이터가 없습니다.',
      confidence: skills.length ? '0.70' : '0.00',
      gaps: topGaps.map((skill, index) => ({
        id: index + 1,
        priority: index === 0 ? '최우선' : index === 1 ? '중요' : '권장',
        priorityIcon: index === 0 ? '!' : index === 1 ? '*' : '+',
        color: index === 0 ? '#EF476F' : index === 1 ? '#FFD166' : '#5B4FCF',
        skillName: skill.label,
        current: skill.current,
        target: skill.target,
        gap: skill.gap,
        recommendation: `${skill.label} 역량 보강 교육을 우선 확인하세요.`,
      })),
      prediction: {
        normalDate: '목표 기준 데이터 연동 후 산정',
        acceleratedDate: '목표 기준 데이터 연동 후 산정',
      },
    },
    courses: (skillGap.recommendedCourses ?? []).map((course, index) => ({
      id: course.courseId ?? index,
      priority: index === 0 ? '필수' : '권장',
      priorityColor: index === 0 ? '#EF476F' : '#FFD166',
      category: course.targetSkillName ?? '스킬',
      title: course.courseTitle ?? '-',
      description: course.targetSkillName ? `${course.targetSkillName} 역량 추천 교육` : '',
      duration: '-',
      durationDiff: '',
      status: '시작하기',
    })),
    articles: [],
  }
}

export async function getWorkerProfileDashboard() {
  const [
    profile,
    skills,
    tierChart,
    missions,
    notice,
    tierHistory,
  ] = await Promise.all([
    optionalGet('/api/v1/hr/workers/me/profile', {}, {}),
    optionalGet('/api/v1/hr/workers/me/skills', {}, []),
    optionalGet('/api/v1/hr/workers/me/tier-chart', {}, []),
    optionalGet('/api/v1/hr/workers/me/missions/upgrade', {}, []),
    optionalGet('/api/v1/hr/notices/pinned', {}, null),
    optionalGet('/api/v1/hr/workers/me/tier-history', {}, []),
  ])

  const tier = normalizeTier(profile.currentTier)
  const skillGrid = skills.map(toSkillViewModel).slice(0, 6)
  const aiEval = resolveAiEvaluationScore(missions)

  return {
    worker: {
      id: profile.employeeId,
      name: profile.employeeName ?? '-',
      nameEn: profile.employeeCode ?? '',
      score: calculateOverallSkillScore(skills),
      type: 'TECH',
      tier,
      skillGrid,
      historyPeriod: formatCareerPeriod(profile.hireDate),
      worksDone: toNumber(profile.completedTaskCount),
      finishRate: toNumber(profile.taskCompletionRate),
      aiEval,
      departmentName: profile.departmentName,
      teamName: profile.teamName,
    },
    notice: toNoticeBannerViewModel(notice),
    skills: skills.map(toSkillViewModel),
    milestones: tierHistory.map(toTierHistoryMilestone),
    chartData: tierChart.map((point) => ({
      period: formatPeriodLabel(point.year, point.evalSequence),
      value: Math.round(toNumber(point.totalScore)),
      tier: normalizeTier(point.tier),
    })),
    missions: missions.map(toMissionViewModel),
  }
}

export async function getWorkerPointMission() {
  const [summaryResponse, historyResponse, missionsResponse, profile] = await Promise.all([
    hrApi.get('/api/v1/hr/workers/me/point-summary'),
    hrApi.get('/api/v1/hr/workers/me/point-history'),
    hrApi.get('/api/v1/hr/workers/me/missions/upgrade'),
    optionalGet('/api/v1/hr/workers/me/profile', {}, {}),
  ])

  const summary = unwrap(summaryResponse) ?? {}
  const history = (unwrap(historyResponse) ?? []).map(toPointHistoryViewModel)
  const missions = (unwrap(missionsResponse) ?? []).map(toMissionViewModel)
  const totalPoints = toNumber(summary.totalPoints)

  return {
    summary: {
      totalPoints,
      monthGain: 0,
      monthGainPercent: 0,
      distribution: summarizePointDistribution(history),
    },
    history,
    missions,
    currentTier: normalizeTier(profile.currentTier),
  }
}

export async function getWorkerSkillGap(targetTier = 'S+') {
  const response = await hrApi.get('/api/v1/hr/workers/me/skill-gap', {
    params: { targetTier },
  })
  return buildSkillGapViewModel(unwrap(response) ?? {})
}

function toEvalHistoryViewModel(item) {
  return {
    id: item.qualitativeEvaluationId,
    qualitativeEvaluationId: item.qualitativeEvaluationId,
    evalPeriodId: item.evalPeriodId,
    evalYear: item.evalYear,
    evalSequence: item.evalSequence,
    grade: normalizeTier(item.grade),
    statusBadge: item.status === 'CONFIRMED' ? '확정' : '검토중',
    score: toNumber(item.score),
    firstScore: toNumber(item.firstScore),
    secondScore: toNumber(item.secondScore),
    quantScore: toNumber(item.quantScore),
    underReview: !!item.underReview,
    appealable: !!item.appealable,
  }
}

const appealStatusLabelMap = {
  SUBMITTED: '제출됨',
  RECEIVING: '접수중',
  REVIEWING: '검토중',
  COMPLETED: '처리완료',
}

function toAppealDetailViewModel(appeal) {
  if (!appeal) return null

  const statusStepMap = {
    SUBMITTED: 1,
    RECEIVING: 2,
    REVIEWING: 2,
    COMPLETED: 3,
  }

  return {
    appealId: appeal.appealId,
    evalPeriodId: appeal.evaluationPeriodId,
    evalYear: appeal.evalYear,
    evalSequence: appeal.evalSequence,
    title: appeal.title ?? '-',
    content: appeal.content ?? '',
    appealType: appeal.appealType ?? 'OTHERS',
    status: appeal.status ?? 'SUBMITTED',
    processStatus: statusStepMap[appeal.status] ?? 1,
    submittedDate: formatDate(appeal.filedAt),
    filedAt: appeal.filedAt ?? null,
    reviewResult: appeal.reviewResult ?? '',
    attachments: (appeal.attachments ?? []).map((attachment) => ({
      attachmentId: attachment.attachmentId,
      fileName: attachment.fileName,
      fileSize: toNumber(attachment.fileSize, null),
    })),
  }
}

function toComparablePeriod(item) {
  const year = String(item?.evalYear ?? '')
  const sequence = String(item?.evalSequence ?? '').padStart(2, '0')
  return `${year}${sequence}`
}

async function fetchAllWorkerEvalHistory(pageSize = 100) {
  const history = []
  let page = 0
  let totalPages = 1

  while (page < totalPages) {
    const response = await hrApi.get('/api/v1/hr/workers/me/evaluations/history', {
      params: { page, size: pageSize },
    })
    const data = unwrap(response) ?? {}
    history.push(...(data.content ?? []).map(toEvalHistoryViewModel))
    totalPages = data.totalPages ?? 0
    page += 1
  }

  return history
}

function mergeAppealHistory(history, appeals) {
  const appealByPeriodId = new Map(
    appeals
      .filter((appeal) => appeal?.evalPeriodId != null)
      .map((appeal) => [appeal.evalPeriodId, appeal]),
  )

  const mergedHistory = history
    .map((item) => {
      const appeal = appealByPeriodId.get(item.evalPeriodId)

      if (!appeal) {
        return {
          ...item,
          hasAppeal: false,
          displayBadge: item.underReview ? '검토중' : item.appealable ? '이의신청 가능' : '확정',
          displayBadgeTone: item.underReview ? 'review' : item.appealable ? 'appealable' : 'confirmed',
        }
      }

      const status = appeal.status ?? 'SUBMITTED'

      return {
        ...item,
        hasAppeal: true,
        appealId: appeal.appealId,
        appealStatus: status,
        appealFiledAt: appeal.filedAt,
        displayBadge: appealStatusLabelMap[status] ?? status,
        displayBadgeTone: status === 'COMPLETED' ? 'completed' : 'appeal',
      }
    })

  const historyPeriodIds = new Set(history.map((item) => item.evalPeriodId))
  const appealOnlyHistory = appeals
    .filter((appeal) => appeal?.evalPeriodId != null && !historyPeriodIds.has(appeal.evalPeriodId))
    .map((appeal) => {
      const status = appeal.status ?? 'SUBMITTED'

      return {
        id: -(appeal.appealId ?? appeal.evalPeriodId),
        qualitativeEvaluationId: null,
        evalPeriodId: appeal.evalPeriodId,
        evalYear: appeal.evalYear,
        evalSequence: appeal.evalSequence,
        grade: null,
        statusBadge: null,
        score: null,
        firstScore: null,
        secondScore: null,
        quantScore: null,
        underReview: false,
        appealable: false,
        hasAppeal: true,
        appealId: appeal.appealId,
        appealStatus: status,
        appealFiledAt: appeal.filedAt,
        displayBadge: appealStatusLabelMap[status] ?? status,
        displayBadgeTone: status === 'COMPLETED' ? 'completed' : 'appeal',
      }
    })

  return [...mergedHistory, ...appealOnlyHistory].sort((a, b) => {
    if (a.hasAppeal && b.hasAppeal) {
      return String(b.appealFiledAt ?? '').localeCompare(String(a.appealFiledAt ?? ''))
    }
    if (a.hasAppeal !== b.hasAppeal) {
      return a.hasAppeal ? -1 : 1
    }
    return toComparablePeriod(b).localeCompare(toComparablePeriod(a))
  })
}

export async function getWorkerAppealRequestData() {
  const [historyResponse, appealsResponse] = await Promise.all([
    fetchAllWorkerEvalHistory(),
    hrApi.get('/api/v1/hr/appeals/me'),
  ])

  const appealSummaries = unwrap(appealsResponse) ?? []
  const appealDetails = await Promise.all(
    appealSummaries.map(async (appeal) => {
      const detailResponse = await hrApi.get(`/api/v1/hr/appeals/${appeal.appealId}`)
      return toAppealDetailViewModel({
        ...appeal,
        ...(unwrap(detailResponse) ?? {}),
      })
    }),
  )
  const appeals = appealDetails.filter(Boolean)
  const history = mergeAppealHistory(
    historyResponse,
    appeals,
  )

  return {
    history,
    appeals,
  }
}

export async function registerAppeal(payload) {
  const response = await hrApi.post('/api/v1/hr/appeals', payload)
  return unwrap(response)
}

export async function uploadAppealAttachments(appealId, files = []) {
  if (!appealId || !files.length) return

  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))

  await hrApi.post(`/api/v1/hr/appeals/${appealId}/attachments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function updateAppeal(appealId, payload) {
  const response = await hrApi.put(`/api/v1/hr/appeals/${appealId}`, payload)
  return unwrap(response)
}

function toEvalStatusViewModel(
  status,
  quantitative = null,
  qualitative = null,
  pointHistory = [],
  profile = null,
  history = [],
  tierChart = [],
) {
  const tier = normalizeTier(profile?.currentTier ?? profile?.employeeTier ?? '-')
  const quantitativeScore = roundToOne(quantitative?.sQuant)
  const qualitativeScore = roundToOne(qualitative?.score)
  const quarterTotals = buildQuarterPointTotals(pointHistory)
  const overallScore = quarterTotals.length
    ? quarterTotals[quarterTotals.length - 1].total
    : null
  const previousHistory = history.find((item) => item?.evalPeriodId !== status?.evalPeriodId) ?? null

  const quantitativeDiff = previousHistory ? roundToOne(quantitativeScore - toNumber(previousHistory.quantScore)) : 0
  const qualitativeDiff = previousHistory ? roundToOne(qualitativeScore - toNumber(previousHistory.score)) : 0

  if (!status) {
    return {
      evalPeriodId: null,
      periodLabel: '-',
      overallScore,
      tier,
      quantitative: { score: 0, diff: 0 },
      qualitative: { score: 0, diff: 0 },
      rank: '-',
      rankTotal: '-',
      rankDiff: 0,
    }
  }

  return {
    evalPeriodId: status.evalPeriodId,
    periodLabel: formatPeriodLabel(status.evalYear, status.evalSequence),
    overallScore,
    tier,
    quantitative: { score: quantitativeScore, diff: quantitativeDiff },
    qualitative: { score: qualitativeScore, diff: qualitativeDiff },
    rank: status.rank ?? '-',
    rankTotal: status.rankTotal ?? '-',
    rankDiff: 0,
  }
}

function toQuantitativeViewModel(quant) {
  if (!quant) {
    return {
      steps: [],
    }
  }

  // Map raw scores to steps
  const steps = [
    { label: 'UPH 점수', value: quant.uphScore != null ? `${quant.uphScore}점` : '-' },
    { label: '수율 점수', value: quant.yieldScore != null ? `${quant.yieldScore}점` : '-' },
    { label: '리드타임 점수', value: quant.leadTimeScore != null ? `${quant.leadTimeScore}점` : '-' },
    { label: '실제 에러율', value: quant.actualError != null ? `${quant.actualError}%` : '-' },
  ]

  return {
    steps,
  }
}

function toQualitativeViewModel(qual) {
  if (!qual) {
    return {
      evaluator: '-',
      grade: '-',
      score: 0,
      categories: [],
      evaluators: [],
    }
  }

  let categories = []
  try {
    if (qual.evalItems) {
      const items = typeof qual.evalItems === 'string' ? JSON.parse(qual.evalItems) : qual.evalItems
      categories = Object.entries(items).map(([label, score]) => ({
        label,
        score: toNumber(score),
        tags: [],
        barColor: '#5B4FCF',
      }))
    }
  } catch (e) {
    console.warn('Failed to parse evalItems:', e)
  }

  return {
    evaluator: [
      qual.firstEvaluatorName ? `1차. ${qual.firstEvaluatorName}` : null,
      qual.secondEvaluatorName ? `2차. ${qual.secondEvaluatorName}` : null,
    ].filter(Boolean).join(' / ') || '-',
    evaluators: [
      qual.firstEvaluatorName ? { label: '1차', name: qual.firstEvaluatorName } : null,
      qual.secondEvaluatorName ? { label: '2차', name: qual.secondEvaluatorName } : null,
    ].filter(Boolean),
    grade: qual.grade ?? '-',
    score: toNumber(qual.score),
    categories,
  }
}

function buildPointGrowthChartData(pointHistory = []) {
  const quarterTotals = buildQuarterPointTotals(pointHistory)
  if (quarterTotals.length) {
    let cumulative = 0
    return quarterTotals.map((item) => {
      cumulative += item.total
      return {
        label: item.label,
        overall: roundToOne(cumulative),
        team: null,
        company: null,
      }
    })
  }
  return []
}

function toGrowthViewModel(pointHistory = []) {
  const chartData = buildPointGrowthChartData(pointHistory)
  const currentPoints = chartData.length
    ? roundToOne(chartData[chartData.length - 1].overall)
    : null

  return {
    chartData,
    nextQuarterGoals: [
      {
        label: '이번 분기 포인트 목표',
        current: currentPoints,
        target: currentPoints == null ? null : roundToOne(toNumber(currentPoints) + 5),
      },
    ],
  }
}

export async function getWorkerEvaluationData() {
  const [status, quantitative, qualitative, pointHistory, profile, history, tierChart] = await Promise.all([
    optionalGet('/api/v1/hr/workers/me/evaluations/status', {}, null),
    optionalGet('/api/v1/hr/workers/me/evaluations/quantitative', {}, null),
    optionalGet('/api/v1/hr/workers/me/evaluations/qualitative', {}, null),
    optionalGet('/api/v1/hr/workers/me/point-history', {}, []),
    optionalGet('/api/v1/hr/workers/me/profile', {}, null),
    optionalGet('/api/v1/hr/workers/me/evaluations/history', { params: { page: 0, size: 20 } }, null),
    optionalGet('/api/v1/hr/workers/me/tier-chart', {}, []),
  ])

  const historyItems = history?.content?.map(toEvalHistoryViewModel) ?? []

  return {
    status: toEvalStatusViewModel(
      status,
      quantitative,
      qualitative,
      (pointHistory ?? []).map(toPointHistoryViewModel),
      profile,
      historyItems,
      tierChart ?? [],
    ),
    quantitative: toQuantitativeViewModel(quantitative),
    qualitative: toQualitativeViewModel(qualitative),
    feedback: toGrowthViewModel((pointHistory ?? []).map(toPointHistoryViewModel)),
  }
}
