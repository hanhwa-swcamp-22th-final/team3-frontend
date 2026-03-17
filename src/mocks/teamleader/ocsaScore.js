export const ocsaSummaryCards = [
  { label: '분석 주문 수', value: '47건', tone: 'primary' },
  { label: '평균 난이도', value: 'D3.2', tone: 'primary' },
  { label: '최고 난이도', value: 'D5', helper: '고난도 주문 포함', tone: 'danger' },
  { label: '매칭 성공률', value: '91.5%', helper: '▲ 1.8%', tone: 'success' },
]

export const ocsaFilterConfigs = [
  { key: 'all', label: '전체' },
  { key: 'D5', label: 'D5' },
  { key: 'D4', label: 'D4' },
  { key: 'D3', label: 'D3' },
  { key: 'D2', label: 'D2 이하' },
]

export const ocsaOrders = [
  { id: 1, code: 'ORD-0301', title: 'Ti-6Al-4V 항공부품', grade: 'D5', deadline: 'D-4', gradeTone: 'danger' },
  { id: 2, code: 'ORD-0302', title: '정밀 샤프트 Ø12', grade: 'D4', deadline: 'D-6', gradeTone: 'warning' },
  { id: 3, code: 'ORD-0303', title: '표준 기어 M2', grade: 'D2', deadline: 'D-14', gradeTone: 'success' },
  { id: 4, code: 'ORD-0304', title: '유압 프레스 금형', grade: 'D3', deadline: 'D-9', gradeTone: 'primary' },
  { id: 5, code: 'ORD-0305', title: '반도체 지그 정밀', grade: 'D5', deadline: 'D-3', gradeTone: 'danger' },
  { id: 6, code: 'ORD-0308', title: '정밀 기어박스', grade: 'D4', deadline: 'D-6', gradeTone: 'warning' },
  { id: 7, code: 'ORD-0309', title: '산업용 커플링', grade: 'D3', deadline: 'D-9', gradeTone: 'primary' },
  { id: 8, code: 'ORD-0311', title: '볼트 어셈블리', grade: 'D1', deadline: 'D-11', gradeTone: 'success' },
  { id: 9, code: 'ORD-0313', title: '로봇 암 브래킷', grade: 'D4', deadline: 'D-8', gradeTone: 'warning' },
  { id: 10, code: 'ORD-0314', title: '터빈 플랜지', grade: 'D5', deadline: 'D-2', gradeTone: 'danger' },
  { id: 11, code: 'ORD-0315', title: '정밀 커버 플레이트', grade: 'D2', deadline: 'D-10', gradeTone: 'success' },
  { id: 12, code: 'ORD-0316', title: '스테인리스 파이프 조립', grade: 'D3', deadline: 'D-7', gradeTone: 'primary' },
]

export const ocsaDetailMap = {
  1: {
    confidence: '0.95',
    formula: 'D = V1(4.8)×0.32 + V2(4.4)×0.28 + V3(3.5)×0.22 + V4(4.6)×0.18 = 4.39',
    grade: 'D5',
    metrics: [
      { key: 'V1 제품 복잡도', value: '4.8', description: '공정 18단계 · 허용공차 ±0.01mm', barWidth: '36%', tone: 'primary' },
      { key: 'V2 납기 긴박도', value: '4.4', description: '{deadline} · 우선순위 High', barWidth: '28%', tone: 'warning' },
      { key: 'V3 설비 가용성', value: '3.5', description: '가용 장비 3대 · 설비지수 반영', barWidth: '30%', tone: 'success' },
      { key: 'V4 숙련도 요구', value: '4.6', description: '최소 A-Tier · 세부 숙련도 90+ 필요', barWidth: '22%', tone: 'danger' },
    ],
  },
  2: {
    confidence: '0.97',
    formula: 'D = V1(4.2)×0.32 + V2(3.8)×0.28 + V3(3.1)×0.22 + V4(4.0)×0.18 = 3.84',
    grade: 'D4',
    metrics: [
      { key: 'V1 제품 복잡도', value: '4.2', description: '공정 18단계 · 허용공차 ±0.01mm', barWidth: '36%', tone: 'primary' },
      { key: 'V2 납기 긴박도', value: '3.8', description: '{deadline} · 우선순위 High', barWidth: '28%', tone: 'warning' },
      { key: 'V3 설비 가용성', value: '3.1', description: '가용 장비 3대 · 설비지수 반영', barWidth: '30%', tone: 'success' },
      { key: 'V4 숙련도 요구', value: '4.0', description: '최소 A-Tier · 세부 숙련도 90+ 필요', barWidth: '22%', tone: 'danger' },
    ],
  },
  3: {
    confidence: '0.91',
    formula: 'D = V1(2.4)×0.32 + V2(2.0)×0.28 + V3(2.6)×0.22 + V4(2.3)×0.18 = 2.31',
    grade: 'D2',
    metrics: [
      { key: 'V1 제품 복잡도', value: '2.4', description: '표준 공정 · 반복 생산 품목', barWidth: '22%', tone: 'primary' },
      { key: 'V2 납기 긴박도', value: '2.0', description: '{deadline} · 여유 일정 확보', barWidth: '18%', tone: 'warning' },
      { key: 'V3 설비 가용성', value: '2.6', description: '가용 장비 5대 · 설비 여유 있음', barWidth: '24%', tone: 'success' },
      { key: 'V4 숙련도 요구', value: '2.3', description: '기본 작업자 배치 가능', barWidth: '20%', tone: 'danger' },
    ],
  },
  4: {
    confidence: '0.92',
    formula: 'D = V1(3.1)×0.32 + V2(3.0)×0.28 + V3(2.8)×0.22 + V4(3.2)×0.18 = 3.04',
    grade: 'D3',
    metrics: [
      { key: 'V1 제품 복잡도', value: '3.1', description: '중간 공정 복잡도 · 치공구 요구', barWidth: '27%', tone: 'primary' },
      { key: 'V2 납기 긴박도', value: '3.0', description: '{deadline} · 일반 우선순위', barWidth: '24%', tone: 'warning' },
      { key: 'V3 설비 가용성', value: '2.8', description: '가용 장비 4대 · 보통 수준', barWidth: '25%', tone: 'success' },
      { key: 'V4 숙련도 요구', value: '3.2', description: '숙련 작업자 우선 배치 권장', barWidth: '26%', tone: 'danger' },
    ],
  },
}

export const ocsaTechnicianRecommendationMap = {
  D5: [
    { id: 1, name: '손창우', tier: 'S', avatar: '손', avatarTone: 'purple', score: '97.2%' },
    { id: 2, name: '김신우', tier: 'A', avatar: '김', avatarTone: 'purple', score: '89.4%' },
    { id: 3, name: '이지훈', tier: 'A', avatar: '이', avatarTone: 'slate', score: '82.1%' },
    { id: 4, name: '황자현', tier: 'A', avatar: '황', avatarTone: 'green', score: '80.6%' },
  ],
  D4: [
    { id: 5, name: '손창우', tier: 'S', avatar: '손', avatarTone: 'purple', score: '97.2%' },
    { id: 6, name: '김신우', tier: 'A', avatar: '김', avatarTone: 'purple', score: '89.4%' },
    { id: 7, name: '이지훈', tier: 'A', avatar: '이', avatarTone: 'slate', score: '82.1%' },
    { id: 8, name: '류민재', tier: 'A', avatar: '류', avatarTone: 'gold', score: '78.8%' },
    { id: 9, name: '문서연', tier: 'B', avatar: '문', avatarTone: 'gold', score: '72.5%' },
  ],
  D3: [
    { id: 10, name: '김신우', tier: 'A', avatar: '김', avatarTone: 'purple', score: '88.0%' },
    { id: 11, name: '박지훈', tier: 'B', avatar: '박', avatarTone: 'gold', score: '79.2%' },
    { id: 12, name: '오세훈', tier: 'B', avatar: '오', avatarTone: 'slate', score: '74.6%' },
  ],
  D2: [
    { id: 13, name: '정미래', tier: 'B', avatar: '정', avatarTone: 'gold', score: '77.8%' },
    { id: 14, name: '문서연', tier: 'B', avatar: '문', avatarTone: 'gold', score: '74.3%' },
    { id: 15, name: '서예린', tier: 'C', avatar: '서', avatarTone: 'slate', score: '69.2%' },
  ],
}
