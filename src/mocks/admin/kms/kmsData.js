// ── 통계 카드 ────────────────────────────────────────
export const KMS_STATS = [
  { label: '등록 지식 총',  value: '1,247', unit: '건', trend: null },
  { label: '이달 신규',     value: '38',    unit: '건', trend: '▲12' },
  { label: '평균 좋아요',   value: '18.4',  unit: '',   trend: '▲3.1' },
]

// ── 필터 탭 ──────────────────────────────────────────
export const KMS_FILTERS = [
  { key: '전체',   bg: '#2D1F6E', color: '#FFFFFF', activeBg: '#2D1F6E' },
  { key: '인기',   bg: '#FFFFFF', color: '#7A6FA8', activeBg: '#2D1F6E' },
  { key: '최신',   bg: '#FFFFFF', color: '#7A6FA8', activeBg: '#2D1F6E' },
  { key: '내 구독', bg: '#FFFFFF', color: '#7A6FA8', activeBg: '#2D1F6E' },
]

export const KMS_TAG_FILTERS = [
  { key: '정밀가공', bg: '#E3FBEF', color: '#007A60' },
  { key: '설비점검', bg: '#F0EEFF', color: '#5B4FCF' },
  { key: '품질관리', bg: '#FFF8E0', color: '#A07000' },
  { key: '+ 더보기', bg: '#FFFFFF', color: '#7A6FA8' },
]

// ── 지식 카드 태그 스타일 ────────────────────────────
export const TAG_STYLE = {
  '🔥 인기':  { bg: '#FFECF1', color: '#C0103E' },
  '정밀가공':  { bg: '#E3FBEF', color: '#007A60' },
  '설비점검':  { bg: '#F0EEFF', color: '#5B4FCF' },
  '품질관리':  { bg: '#FFF8E0', color: '#A07000' },
  'CNC가공':   { bg: '#F0EEFF', color: '#5B4FCF' },
  'MCH-01':    { bg: '#F0EEFF', color: '#5B4FCF' },
  'MCH-02':    { bg: '#F0EEFF', color: '#5B4FCF' },
  'WLD-01':    { bg: '#F0EEFF', color: '#5B4FCF' },
  'INS-01':    { bg: '#F0EEFF', color: '#5B4FCF' },
}

// ── Tier 배지 색상 ───────────────────────────────────
export const TIER_BADGE = {
  S: { bg: '#00BF95', color: '#FFFFFF' },
  A: { bg: '#5B4FCF', color: '#FFFFFF' },
  B: { bg: '#FFD166', color: '#1A1000' },
  C: { bg: '#EF476F', color: '#FFFFFF' },
}

// ── 지식 피드 더미 카드 ──────────────────────────────
export const DUMMY_KNOWLEDGE = [
  {
    id: 1,
    tags: ['🔥 인기', '정밀가공', 'MCH-01'],
    date: '03.03',
    title: 'Ti-6Al-4V 채터링 방지 노하우',
    summary: '고속 가공 시 스핀들 RPM을 8,500→7,200으로 낮추고 이송속도 15% 감속하면..',
    author: { name: '손창우', initial: '손', color: '#5B4FCF', tier: 'S' },
    views: 156,
    comments: 8,
    subscribed: true,
  },
  {
    id: 2,
    tags: ['설비점검', 'WLD-01'],
    date: '02.15',
    title: '용접 전류 보정 체크리스트',
    summary: '작업 전 전류값 기준치 ±5A 이내 확인 필수...',
    author: { name: '손창우', initial: '손', color: '#5B4FCF', tier: 'S' },
    views: 203,
    comments: 12,
    subscribed: false,
  },
  {
    id: 3,
    tags: ['품질관리', 'INS-01'],
    date: '01.28',
    title: '3D 검사 측정 오차 최소화 팁',
    summary: '측정 전 15분 워밍업 필수. 온도 변화 1°C당 0.003mm 오차...',
    author: { name: '손창우', initial: '손', color: '#5B4FCF', tier: 'S' },
    views: 289,
    comments: 15,
    subscribed: true,
  },
  {
    id: 4,
    tags: ['CNC가공', 'MCH-02'],
    date: '01.10',
    title: '샤프트 배치 가공 지그 세팅 최적화',
    summary: '지그 고정 토크 42N·m 기준, 진동 감지 시 즉시 재세팅...',
    author: { name: '김신우', initial: '김', color: '#3D35A0', tier: 'A' },
    views: 178,
    comments: 6,
    subscribed: false,
  },
]

// ── 기여자 TOP 3 ─────────────────────────────────────
export const TOP_CONTRIBUTORS = [
  { rank: '👑', name: '손창우', initial: '손', color: '#5B4FCF', tier: 'S', tierBg: '#00BF95', count: 12 },
  { rank: '🥈', name: '김신우', initial: '김', color: '#3D35A0', tier: 'A', tierBg: '#5B4FCF', count: 7 },
  { rank: '🥉', name: '황자현', initial: '황', color: '#1A8060', tier: 'A', tierBg: '#5B4FCF', count: 4 },
]

// ── 멘토링 매칭 현황 ─────────────────────────────────
export const MENTORING_ACTIVE = [
  {
    mentor: { initial: '손', color: '#5B4FCF' },
    mentee: { initial: '임', color: '#A07000' },
    tag: '정밀가공',
    tagBg: '#E3FBEF', tagColor: '#007A60',
    status: '진행중',
  },
  {
    mentor: { initial: '김', color: '#3D35A0' },
    mentee: { initial: '박', color: '#C0103E' },
    tag: 'CNC가공',
    tagBg: '#F0EEFF', tagColor: '#5B4FCF',
    status: '진행중',
  },
]

export const MENTORING_REQUEST = {
  applicant: { initial: '이', name: '이수연', color: '#8A7FC5' },
  subText: '용접 기술 멘토 구합니다',
  text: '이수연 · 용접 기술 멘토 구합니다',
  field: '정밀가공',
  duration: '2주',
  priority: '높음',
  reason: '현재 용접 작업 중 전류값 보정이 어려워 숙련 멘토의 실무 지도가 필요합니다. 기초 이론은 숙지했으나 현장 적용이 미숙합니다.',
  memo: '',
}

// ── AI 추천 학습 ─────────────────────────────────────
export const AI_RECOMMENDATIONS = [
  '5축 가공 심화 과정',
  'GD&T 공차 분석',
  '설비 진단 자격증',
]
