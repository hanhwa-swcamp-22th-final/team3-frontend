import hrApi from '@/services/hrApi'

function unwrap(response) {
  return response.data?.data ?? response.data
}

async function optionalGet(url, fallback = null) {
  try {
    const response = await hrApi.get(url)
    return unwrap(response) ?? fallback
  } catch (error) {
    console.warn(`Optional HR request failed: ${url}`, error)
    return fallback
  }
}

function toNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function normalizeTier(tier) {
  return tier || 'C'
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
    optionalGet('/api/v1/hr/workers/me/profile', {}),
    optionalGet('/api/v1/hr/workers/me/skills', []),
    optionalGet('/api/v1/hr/workers/me/tier-chart', []),
    optionalGet('/api/v1/hr/workers/me/missions/upgrade', []),
    optionalGet('/api/v1/hr/notices/pinned', null),
    optionalGet('/api/v1/hr/workers/me/tier-history', []),
  ])

  const tier = normalizeTier(profile.currentTier)

  return {
    worker: {
      id: profile.employeeId,
      name: profile.employeeName ?? '-',
      nameEn: profile.employeeCode ?? '',
      score: Math.round(toNumber(profile.totalScore)),
      type: 'TECH',
      tier,
      skillGrid: skills.map(toSkillViewModel).slice(0, 6),
      historyPeriod: formatCareerPeriod(profile.hireDate),
      worksDone: '-',
      finishRate: 0,
      aiEval: '-',
      departmentName: profile.departmentName,
      teamName: profile.teamName,
    },
    notice: toNoticeBannerViewModel(notice),
    skills: skills.map(toSkillViewModel),
    milestones: tierHistory.map(toTierHistoryMilestone),
    chartData: tierChart.map((point) => ({
      period: `${point.year ?? '-'}-${point.evalSequence ?? '-'}`,
      value: Math.round(toNumber(point.totalScore)),
      tier: normalizeTier(point.tier),
    })),
    missions: missions.map(toMissionViewModel),
  }
}

export async function getWorkerPointMission() {
  const [summaryResponse, historyResponse, missionsResponse] = await Promise.all([
    hrApi.get('/api/v1/hr/workers/me/point-summary'),
    hrApi.get('/api/v1/hr/workers/me/point-history'),
    hrApi.get('/api/v1/hr/workers/me/missions/upgrade'),
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
  }
}

export async function getWorkerSkillGap(targetTier = 'S+') {
  const response = await hrApi.get('/api/v1/hr/workers/me/skill-gap', {
    params: { targetTier },
  })
  return buildSkillGapViewModel(unwrap(response) ?? {})
}
