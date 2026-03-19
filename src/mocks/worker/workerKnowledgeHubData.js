/**
 * Mock data for Worker Knowledge Hub (KMS)
 * Used by WorkerKnowledgeHubView.vue
 */

export const knowledgeStats = {
  totalArticles: 1247,
  newThisMonth: 38,
  newThisMonthDiff: 12,
  myArticles: 18,
  myArticlesDiff: 3.1,
}

export const knowledgeCategories = [
  { key: 'all', label: '전체' },
  { key: 'popular', label: '인기' },
  { key: 'latest', label: '최신' },
  { key: 'subscribed', label: '내 구독' },
  { key: '정밀가공', label: '정밀가공' },
  { key: '설비점검', label: '설비점검' },
  { key: '품질관리', label: '품질관리' },
]

export const knowledgeArticles = [
  {
    id: 1,
    title: 'Ti-6Al-4V 채터링 방지 노하우',
    preview: '고속 가공 시 스핀들 RPM을 8,500→7,200으로 낮추고 이송속도 15% 감속하면...',
    category: '정밀가공',
    equipment: 'MCH-01',
    date: '03.03',
    author: '손창우',
    authorInitial: '손',
    authorTier: 'S',
    views: 156,
    comments: 8,
    isPopular: true,
  },
  {
    id: 2,
    title: '용접 전류 보정 체크리스트',
    preview: '작업 전 전류값 기준치 ±5A 이내 확인 필수...',
    category: '설비점검',
    equipment: 'WLD-01',
    date: '02.15',
    author: '손창우',
    authorInitial: '손',
    authorTier: 'S',
    views: 203,
    comments: 12,
    isPopular: false,
  },
  {
    id: 3,
    title: '3D 검사 측정 오차 최소화 팁',
    preview: '측정 전 15분 워밍업 필수. 온도 변화 1°C당 0.003mm 오차...',
    category: '품질관리',
    equipment: 'INS-01',
    date: '01.28',
    author: '손창우',
    authorInitial: '손',
    authorTier: 'S',
    views: 289,
    comments: 15,
    isPopular: false,
  },
  {
    id: 4,
    title: '샤프트 배치 가공 지그 세팅 최적화',
    preview: '지그 고정 토크 42N·m 기준, 진동 감지 시 즉시 재세팅...',
    category: 'CNC가공',
    equipment: 'MCH-02',
    date: '01.10',
    author: '김신우',
    authorInitial: '김',
    authorTier: 'A',
    views: 178,
    comments: 6,
    isPopular: false,
  },
  {
    id: 5,
    title: '유압 프레스 실린더 패킹 교체 주기 가이드',
    preview: '가압 횟수 50,000회 또는 6개월 중 먼저 도래 시 교체 권장...',
    category: '설비점검',
    equipment: 'HP-02',
    date: '01.05',
    author: '황자현',
    authorInitial: '황',
    authorTier: 'A',
    views: 134,
    comments: 9,
    isPopular: false,
  },
  {
    id: 6,
    title: '알루미늄 합금 가공 시 BUE 방지 전략',
    preview: 'AL7075 가공 시 절삭유 농도 8% 유지, 코팅 인서트 TiAlN 사용 시 빌트업 에지 90% 감소...',
    category: '정밀가공',
    equipment: 'MCH-03',
    date: '12.22',
    author: '김신우',
    authorInitial: '김',
    authorTier: 'A',
    views: 221,
    comments: 14,
    isPopular: true,
  },
  {
    id: 7,
    title: 'CNC 공구 수명 예측 모델 적용기',
    preview: 'VB 마모량 0.3mm 도달 시간을 Taylor 공식 기반으로 예측, 실측 대비 오차 ±8%...',
    category: 'CNC가공',
    equipment: 'MCH-01',
    date: '12.15',
    author: '손창우',
    authorInitial: '손',
    authorTier: 'S',
    views: 312,
    comments: 22,
    isPopular: true,
  },
  {
    id: 8,
    title: '스테인리스강 표면 조도 개선 방법',
    preview: 'SUS316 가공 시 절삭 속도 120m/min, 이송 0.08mm/rev로 Ra 0.8μm 이하 달성...',
    category: '품질관리',
    equipment: 'CNC-05',
    date: '12.08',
    author: '황자현',
    authorInitial: '황',
    authorTier: 'A',
    views: 167,
    comments: 7,
    isPopular: false,
  },
]

export const monthlyRanking = [
  {
    rank: 1,
    name: '손창우',
    initial: '손',
    tier: 'S',
    articles: 12,
    avatarColor: '#5B4FCF',
  },
  {
    rank: 2,
    name: '김신우',
    initial: '김',
    tier: 'A',
    articles: 7,
    avatarColor: '#5B4FCF',
  },
  {
    rank: 3,
    name: '황자현',
    initial: '황',
    tier: 'A',
    articles: 4,
    avatarColor: '#00BF95',
  },
]

export const ongoingMentoring = [
  {
    id: 1,
    mentorInitial: '손',
    mentorColor: '#00BF95',
    menteeInitial: '임',
    menteeColor: '#8B5E3C',
    field: '정밀가공',
    status: '진행중',
  },
  {
    id: 2,
    mentorInitial: '김',
    mentorColor: '#5B4FCF',
    menteeInitial: '박',
    menteeColor: '#C62828',
    field: 'CNC가공',
    status: '진행중',
  },
]

export const mentoringRequests = [
  {
    id: 1,
    name: '이수연',
    initial: '이',
    avatarColor: '#5B4FCF',
    message: '용접 기술 멘토 구합니다',
    field: '정밀가공',
    period: '2주',
    priority: '높음',
    reason:
      '최근 항공 부품 용접 공정 전환 배치가 예정되어 있어, 사전 숙련도 보완을 위해 멘토링이 필요합니다. 특히 용접 조건 보정과 불량 판정 기준을 우선 학습하고 싶습니다.',
    managementMemo:
      '현재 동일 분야 진행중 멘토링 1건 보유. 주 2회, 회당 1시간 운영 시 병행 가능. 수락 시 TL과 GL에게도 매칭 진행 상태 공유.',
  },
]

export const mentoringRequestFormDefaults = {
  myName: '손창우',
  myInitial: '손',
  myAvatarColor: '#00BF95',
  myTitle: '정밀가공 Specialist / 항공 부품 정밀 가공',
  field: '정밀가공',
  period: '2주',
  frequency: '주 2회',
  purpose:
    'Ti-6Al-4V 소재 가공 시 공구 마모 보정과 셋업 기준을 빠르게 익히고 싶습니다. 다음 달 항공 부품 공정 전환 예정이라 사전 준비가 필요합니다.',
  requestDetails:
    '1. 정밀가공 셋업 체크리스트 공유\n2. 채터링 방지 조건 설명\n3. 실습 기준 피드백 2회 진행',
  operatingMemo:
    '주간조 기준 화 / 목 15:00 이후 참여 가능합니다. 수락 시 TL과 GL에게 동시에 일일 전송됩니다.',
}

export const aiRecommendations = [
  { id: 1, title: '5축 가공 심화 과정' },
  { id: 2, title: 'GD&T 공차 분석' },
  { id: 3, title: '설비 진단 자격증' },
]
