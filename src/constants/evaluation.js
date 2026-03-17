export const SCORE_WEIGHT_QUANT = 0.6
export const SCORE_WEIGHT_QUAL = 0.4

export const GRADE_THRESHOLDS = { S: 90, A: 80, B: 70 }

export const AI_TAG_LIMIT = 5

export const GRADE_STYLE = {
  S: { gradeBg: 'var(--tier-s)', gradeColor: 'var(--color-white)' },
  A: { gradeBg: 'var(--tier-a)', gradeColor: 'var(--color-white)' },
  B: { gradeBg: 'var(--tier-b)', gradeColor: '#1a1000' },
  C: { gradeBg: 'var(--tier-c)', gradeColor: 'var(--color-white)' },
}

export const EVAL_TYPE_LABEL = {
  '정기평가': '정기 평가',
  '이의신청': '이의 신청',
  '승급신청': '승급 신청',
}

export const TYPE_STYLE = {
  '정기평가': { typeBg: 'var(--color-primary-100)', typeColor: 'var(--color-primary-600)' },
  '이의신청': { typeBg: '#ffecf1', typeColor: '#c0103e' },
  '승급신청': { typeBg: '#e3fbef', typeColor: '#007a60' },
}

export const POINT_CATEGORY_STYLES = {
  '작업완료': { bg: '#e6fff7', color: '#00BF95' },
  'KMS': { bg: '#e0dcff', color: '#2D1F6E' },
  'AI평가': { bg: '#fef3c7', color: '#92750a' },
  '설비보정': { bg: '#ffe2e8', color: '#c23a5a' },
}

export const SCORE_TO_STARS_THRESHOLDS = [
  { min: 81, stars: 5 },
  { min: 61, stars: 4 },
  { min: 41, stars: 3 },
  { min: 21, stars: 2 },
  { min: 0, stars: 1 },
]

export function scoreToStars(score) {
  for (const { min, stars } of SCORE_TO_STARS_THRESHOLDS) {
    if (score >= min) return stars
  }
  return 1
}

export function scoreToGrade(score) {
  if (score >= GRADE_THRESHOLDS.S) return 'S'
  if (score >= GRADE_THRESHOLDS.A) return 'A'
  if (score >= GRADE_THRESHOLDS.B) return 'B'
  return 'C'
}
