// ── 복잡도 기준 ──────────────────────────────────────
const PRECISION_COMPLEXITY = [
  { stage: '1단계(D1)', processes: '5단계 이하',  tolerance: '±0.5mm',      weight: 1.0 },
  { stage: '2단계(D2)', processes: '6~10단계',    tolerance: '±0.1mm',      weight: 1.3 },
  { stage: '3단계(D3)', processes: '11~15단계',   tolerance: '±0.05mm',     weight: 1.7 },
  { stage: '4단계(D4)', processes: '16~20단계',   tolerance: '±0.02mm',     weight: 2.2 },
  { stage: '5단계(D5)', processes: '20단계 초과', tolerance: '±0.01mm 이하', weight: 3.0 },
]

// ── 정량 평가 가중치 ─────────────────────────────────
const PRECISION_WEIGHTS = [
  { label: '생산량 달성률', value: 0.40 },
  { label: '품질 합격률',   value: 0.25 },
  { label: '설비 가동률',   value: 0.20 },
  { label: '납기 준수율',   value: 0.10 },
  { label: '안전 준수',     value: 0.05 },
]

// ── Tier 승급 기준점 ─────────────────────────────────
const TIER_THRESHOLDS = [
  { tier: 'S', score: 95, desc: '최상위 전문가 · 멘토 자격', bg: '#E3FBEF', color: '#007A60' },
  { tier: 'A', score: 85, desc: '숙련 엔지니어',             bg: '#F0EEFF', color: '#5B4FCF' },
  { tier: 'B', score: 70, desc: '일반 작업자',               bg: '#FFF8E0', color: '#A07000' },
  { tier: 'C', score: 0,  desc: '기초 역량 개발 단계',       bg: '#FFECF1', color: '#C0103E' },
]

// ── 비교 박스 ────────────────────────────────────────
export const COMPARE_DATA = {
  current: [
    { label: 'E_exp', value: '120개'  },
    { label: '복잡도', value: '0.30'  },
    { label: '숙련',   value: 'A-Tier' },
  ],
  preset: [
    { value: '120개 ✓'  },
    { value: '0.32 ↑'   },
    { value: 'A-Tier ✓' },
  ],
}

// ── 산업군 프리셋 목록 ───────────────────────────────
export const INDUSTRY_PRESETS = [
  {
    id: 'precision',
    icon: '⚙️',
    name: '정밀 기계',
    nameEn: 'Precision Machinery',
    desc: '항공·자동차·반도체 부품 정밀 가공',
    active: true,
    complexity: PRECISION_COMPLEXITY,
    weights:    PRECISION_WEIGHTS,
    tiers:      TIER_THRESHOLDS,
  },
  {
    id: 'electronics',
    icon: '🔌',
    name: '전자 제품 조립',
    nameEn: 'Electronics Assembly',
    desc: 'SMT·PCB 조립·검사',
    active: false,
    complexity: PRECISION_COMPLEXITY,
    weights:    PRECISION_WEIGHTS,
    tiers:      TIER_THRESHOLDS,
  },
  {
    id: 'chemical',
    icon: '🏗',
    name: '장치 산업/화학',
    nameEn: 'Process & Chemical',
    desc: '화학·정유·제약 공정',
    active: false,
    complexity: PRECISION_COMPLEXITY,
    weights:    PRECISION_WEIGHTS,
    tiers:      TIER_THRESHOLDS,
  },
  {
    id: 'general',
    icon: '🔧',
    name: '일반 기계 제조',
    nameEn: 'General Machinery',
    desc: '범용 부품·설비 제작',
    active: false,
    complexity: PRECISION_COMPLEXITY,
    weights:    PRECISION_WEIGHTS,
    tiers:      TIER_THRESHOLDS,
  },
  {
    id: 'custom',
    icon: '➕',
    name: '커스텀 프리셋 생성',
    nameEn: 'Custom Preset',
    desc: '직접 파라미터 입력',
    active: false,
    complexity: PRECISION_COMPLEXITY,
    weights:    PRECISION_WEIGHTS,
    tiers:      TIER_THRESHOLDS,
  },
]
