export const CATEGORY_CLASS_MAP = {
  '정밀가공': 'cat--precision',
  '설비점검': 'cat--inspection',
  '품질관리': 'cat--quality',
  'CNC가공': 'cat--cnc',
}

// ── 백엔드 ArticleCategory enum 기준 ──────────────────────────────

// enum → 한국어 라벨 (화면 표시용)
export const ARTICLE_CATEGORY_LABEL = {
  TROUBLESHOOTING: '장애조치',
  PROCESS_IMPROVEMENT: '공정개선',
  EQUIPMENT_OPERATION: '설비운영',
  SAFETY: '안전',
  ETC: '기타',
}

// 폼 드롭다운 옵션 (백엔드 enum 기준)
export const ARTICLE_CATEGORY_OPTIONS = [
  { value: 'TROUBLESHOOTING', label: '장애조치' },
  { value: 'PROCESS_IMPROVEMENT', label: '공정개선' },
  { value: 'EQUIPMENT_OPERATION', label: '설비운영' },
  { value: 'SAFETY', label: '안전' },
  { value: 'ETC', label: '기타' },
]

// ── 백엔드 ArticleStatus enum 기준 ───────────────────────────────

// enum → 한국어 라벨 (화면 표시용)
export const ARTICLE_STATUS_LABEL = {
  DRAFT: '임시저장',
  PENDING: '승인대기',
  APPROVED: '승인완료',
  REJECTED: '반려',
}
