export const taskMatchingSummaryCards = [
  { label: '실시간 생산 인원', value: '18명', helper: '활동중', tone: 'success' },
  { label: '오늘 완료 작업', value: '23건', tone: 'primary' },
  { label: '라인 평균 가동률', value: '87.1%', tone: 'primary' },
  { label: '미배정 오더', value: '3건', tone: 'danger' },
]

export const taskMatchingTabs = [
  { key: 'dashboard', label: '운영 현황' },
  { key: 'assignment', label: '주문 배정' },
]

export const taskMatchingOrders = [
  { id: 301, code: 'ORD-0301', title: '항공 부품 정밀 가공 - Ti-6Al-4V', difficulty: 'D5 최고난도', grade: 'D5', deadline: '남기 D-2', tags: ['MCH-01 전용', '긴급'], line: '정밀가공1라인', status: '미배정', recommendedTechId: 1 },
  { id: 302, code: 'ORD-0302', title: '자동차 샤프트 배치 가공', difficulty: 'D4', grade: 'D4', deadline: '남기 D-5', tags: ['배치 생산'], line: '정밀가공1라인', status: '미배정', recommendedTechId: 2 },
  { id: 303, code: 'ORD-0303', title: '산업용 플랜지 용접', difficulty: 'D3', grade: 'D3', deadline: '남기 D-8', tags: ['용접'], line: '용접라인', status: '배정 대기', recommendedTechId: 3 },
  { id: 304, code: 'ORD-0304', title: '표준 프레스 성형', difficulty: 'D2', grade: 'D2', deadline: '남기 D-12', tags: ['프레스'], line: '프레스라인', status: '배정 완료', recommendedTechId: 4 },
  { id: 305, code: 'ORD-0305', title: '품질 측정 세팅', difficulty: 'D1', grade: 'D1', deadline: '남기 D-15', tags: ['측정'], line: '품질실', status: '배정 완료', recommendedTechId: 2 },
]

export const taskMatchingLineStatuses = [
  { id: 'line-1', title: '정밀가공1라인', percent: '94.2%', tone: 'mint', assignments: [
    { techId: 1, techName: '손창우', tier: 'S', orderCode: 'ORD-0301 항공부품', progress: '35%' },
    { techId: 2, techName: '김신우', tier: 'A', orderCode: 'ORD-0302 샤프트', progress: '60%' },
  ]},
  { id: 'line-2', title: '정밀가공2라인', percent: '87.1%', tone: 'primary', assignments: [
    { techId: 3, techName: '황자현', tier: 'A', orderCode: 'ORD-0309 기어박스', progress: '72%' },
    { techId: 5, techName: '박지훈', tier: 'B', orderCode: 'ORD-0310 브라켓', progress: '45%' },
  ]},
  { id: 'line-3', title: '프레스라인', percent: '71.3%', tone: 'warning', assignments: [
    { techId: 4, techName: '임원석', tier: 'B', orderCode: 'ORD-0304 프레스', progress: '88%' },
    { techId: 0, techName: '대기중 1명', tier: '대기', orderCode: '대기', progress: '—' },
  ]},
  { id: 'line-4', title: '용접라인', percent: '45.2%', tone: 'danger', assignments: [
    { techId: 6, techName: '이수연', tier: 'C', orderCode: '대기중', progress: '—' },
  ], warning: '설비 FAULT - 작업 중단' },
]

export const taskMatchingTimelineRows = [
  {
    id: 1,
    label: '정밀가공1라인',
    bars: [
      { left: '6%', width: '34%', tone: 'primary', label: 'ORD-0301 항공부품' },
      { left: '46%', width: '20%', tone: 'mint', label: 'ORD-0302 샤프트' },
    ],
  },
  {
    id: 2,
    label: '정밀가공2라인',
    bars: [
      { left: '9%', width: '20%', tone: 'mint', label: 'ORD-0309 기어박스' },
      { left: '40%', width: '26%', tone: 'primary', label: 'ORD-0310 브라켓' },
    ],
  },
  {
    id: 3,
    label: '프레스라인',
    bars: [
      { left: '8%', width: '16%', tone: 'mint', label: 'ORD-0304 프레스' },
      { left: '34%', width: '14%', tone: 'primary', label: '금형 세팅' },
      { left: '54%', width: '22%', tone: 'soft', label: '완료 점검' },
    ],
  },
]

export const taskMatchingAlerts = [
  { id: 301, code: 'ORD-0308', grade: 'D4', deadline: '남기 D-6', title: '정밀 기어박스 제작', helper: '즉시 배정 필요' },
  { id: 302, code: 'ORD-0311', grade: 'D3', deadline: '남기 D-9', title: '산업용 커플링', helper: '즉시 배정 필요' },
  { id: 303, code: 'ORD-0312', grade: 'D2', deadline: '남기 D-11', title: '표준 볼트 어셈블리', helper: '배정 대기' },
]

export const taskMatchingAssignmentStats = { assignedToday: '18', accuracy: '96%', reassigned: '2', unassigned: '1' }

export const taskMatchingCandidates = [
  { id: 1, name: '손창우', initial: '손', line: '정밀 MCH-01', tier: 'S-Tier', score: 91, fit: '98%', tone: 'mint' },
  { id: 2, name: '김신우', initial: '김', line: 'CNC', tier: 'A-Tier', score: 84, fit: '72%', tone: 'primary' },
  { id: 3, name: '황자현', initial: '황', line: 'PRS', tier: 'A-Tier', score: 81, fit: '65%', tone: 'green' },
  { id: 4, name: '임원석', initial: '임', line: '대기', tier: 'B-Tier', score: 74, fit: '41%', tone: 'gold' },
  { id: 5, name: '박지훈', initial: '박', line: '프레스', tier: 'B-Tier', score: 69, fit: '37%', tone: 'danger' },
  { id: 6, name: '이수연', initial: '이', line: '용접', tier: 'C-Tier', score: 56, fit: '21%', tone: 'soft' },
]

export const taskMatchingRebalanceSummary = [
  { label: '전체 인원', value: '26명', tone: 'primary' },
  { label: '최적 배치', value: '21명', helper: '80.8%', tone: 'success' },
  { label: '재배치 권고', value: '3명', tone: 'warning' },
  { label: '설비 미배정', value: '2명', tone: 'danger' },
]

export const taskMatchingRebalanceLines = [
  { id: 'r1', title: '정밀가공1', count: '5명', segments: [ { label: 'S:1', value: 28, tone: 'mint' }, { label: 'A:2', value: 36, tone: 'primary' }, { label: 'B:2', value: 36, tone: 'warning' } ], helper: '최적 배치 ✓' },
  { id: 'r2', title: '정밀가공2', count: '5명', segments: [ { label: 'A:2', value: 38, tone: 'primary' }, { label: 'B:2', value: 42, tone: 'warning' }, { label: 'C:1', value: 20, tone: 'danger' } ], helper: '재배치 권고' },
  { id: 'r3', title: '프레스', count: '8명', segments: [ { label: 'A:1', value: 22, tone: 'primary' }, { label: 'B:5', value: 54, tone: 'warning' }, { label: 'C:2', value: 24, tone: 'danger' } ], helper: 'C-Tier 과다' },
  { id: 'r4', title: '용접', count: 'FAULT', segments: [ { label: 'S:1', value: 34, tone: 'mint' }, { label: 'A:1', value: 14, tone: 'primary' }, { label: 'B:3', value: 40, tone: 'warning' }, { label: 'C:1', value: 12, tone: 'danger' } ], helper: '설비 FAULT - 배치 재검토 필요', warning: true },
]

export const taskMatchingMatrixColumns = ['낮음(<70)', '보통(70~85)', '높음(85~95)', '최고(95+)']
export const taskMatchingMatrixRows = [
  { tier: 'S-Tier', cells: [[], [], [{ initial: '손', tone: 'primary' }], [{ initial: '김', tone: 'primary' }, { initial: '이', tone: 'soft' }]] },
  { tier: 'A-Tier', cells: [[], [{ initial: '황', tone: 'green' }], [{ initial: '박', tone: 'danger' }, { initial: '최', tone: 'gold' }, { initial: '이', tone: 'soft' }], []] },
  { tier: 'B-Tier', cells: [[], [{ initial: '임', tone: 'gold' }, { initial: '정', tone: 'soft' }], [{ initial: '한', tone: 'primary' }, { initial: '오', tone: 'primary' }, { initial: '외', tone: 'green' }], []] },
  { tier: 'C-Tier', cells: [[{ initial: '이', tone: 'soft' }], [{ initial: '최', tone: 'danger' }], [], []] },
]
export const taskMatchingMatrixTechnicians = [
  { id: 1, name: '손창우', initial: '손', tier: 'S', tone: 'primary' },
  { id: 2, name: '김신우', initial: '김', tier: 'A', tone: 'primary' },
  { id: 3, name: '임원석', initial: '임', tier: 'B', tone: 'gold' },
  { id: 4, name: '이수연', initial: '이', tier: 'C', tone: 'soft' },
  { id: 5, name: '황자현', initial: '황', tier: 'A', tone: 'green' },
]
export const taskMatchingAiSuggestions = [
  '이수연(C/용접) → 프레스라인 이동 시 I-E_idx 예측 +18%',
  '임원석(B/프레스) → 정밀가공2라인 이동 시 성과 예측 +4.2점',
]


