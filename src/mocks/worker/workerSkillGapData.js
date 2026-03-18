/**
 * Mock data for Worker Skill Gap Analysis (KMS)
 * Used by WorkerSkillGapView.vue
 */

export const skillGapSkills = [
  { label: '정밀도', current: 94, target: 96, gap: 2 },
  { label: '작업속도', current: 88, target: 94, gap: 6 },
  { label: '설비숙련', current: 92, target: 95, gap: 3 },
  { label: '협업', current: 85, target: 90, gap: 5 },
  { label: '문제해결', current: 90, target: 93, gap: 3 },
  { label: '안전준수', current: 87, target: 90, gap: 3 },
]

export const skillGapSummary = {
  currentOverall: 91,
  targetOverall: 95,
  totalGap: 4.0,
}

export const aiAnalysisReport = {
  summary:
    '현재 Overall 91점으로 S+ 승급까지 4점 차이입니다. 작업속도(+6)와 협업(+5) 영역에서 가장 큰 Gap이 발견됩니다. 현재 성장 추세를 유지하면 약 2~3개월 내 달성 가능합니다.',
  confidence: 0.96,
  gaps: [
    {
      id: 1,
      priority: '최우선',
      priorityIcon: '🏃',
      color: '#EF476F',
      skillName: '작업속도',
      current: 88,
      target: 94,
      gap: 6,
      recommendation: '다축 동시 가공 루틴 훈련 · 주 3회',
    },
    {
      id: 2,
      priority: '중요',
      priorityIcon: '⚡',
      color: '#FFD166',
      skillName: '협업',
      current: 85,
      target: 90,
      gap: 5,
      recommendation: '크로스 라인 작업 경험 확대 · 월 2회',
    },
    {
      id: 3,
      priority: '권장',
      priorityIcon: '📐',
      color: '#5B4FCF',
      skillName: '정밀도',
      current: 94,
      target: 96,
      gap: 2,
      recommendation: '초정밀 공차 작업 집중 수행',
    },
  ],
  prediction: {
    normalDate: '2026년 5월 (약 2개월)',
    acceleratedDate: '2026년 4월 (약 1개월)',
  },
}

export const learningRecommendations = [
  {
    id: 1,
    priority: '필수',
    priorityColor: '#EF476F',
    category: '작업속도',
    title: '다축 동시 가공 심화 과정',
    description: 'MCH-01/02 5축 동시 가공 루틴 최적화',
    duration: '4주',
    durationDiff: '+3.2점 예상',
    status: '시작하기',
  },
  {
    id: 2,
    priority: '권장',
    priorityColor: '#FFD166',
    category: '협업',
    title: '크로스 라인 협업 실습',
    description: '타 라인 테크니션과 공동 작업 경험',
    duration: '2주',
    durationDiff: '+2.1점 예상',
    status: '시작하기',
  },
  {
    id: 3,
    priority: '권장',
    priorityColor: '#FFD166',
    category: '설비숙련',
    title: '설비 자가 진단 전문가 과정',
    description: 'E_idx 분석 및 예방보전 실무',
    duration: '3주',
    durationDiff: '+1.8점 예상',
    status: '시작하기',
  },
  {
    id: 4,
    priority: '선택',
    priorityColor: '#5B4FCF',
    category: '자격증',
    title: '정밀가공 기능장 자격증',
    description: 'S+ Tier 보유자 87% 취득 완료',
    duration: '8주',
    durationDiff: '+5.0점 예상',
    status: '시작하기',
  },
]

export const relatedKmsArticles = [
  { id: 1, title: 'Ti-6Al-4V 채터링 방지 노하우', likes: 24 },
  { id: 2, title: '용접 전류 보정 체크리스트', likes: 18 },
  { id: 3, title: '5축 가공 공구 경로 최적화', likes: 31 },
]
