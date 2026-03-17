/**
 * Mock data for Worker My Knowledge Management (KMS)
 * Used by MyKnowledgeManagementView.vue
 */

export const knowledgeOverallCount = {
  total: 128,
  totalSub: '전월 대비 +12건',
  approved: 86,
  approvedSub: '이번 주 7건 승인',
  pending: 14,
  pendingSub: '오늘 검토 필요 4건',
  draft: 9,
  draftSub: '작성 중 문서 포함',
}

export const myKnowledgeArticles = [
  {
    id: 1,
    category: '정밀가공',
    equipment: 'MCH-01',
    status: '승인 완료',
    date: '2026.03.03',
    title: 'Ti-6Al-4V 채터링 방지 노하우',
    summary:
      '고속 가공 시 스핀들 RPM을 8,500 → 7,200으로 낮추고 이송 속도를 15% 감속하면 채터링이 안정적으로 줄어듭니다.',
    views: 156,
    comments: 8,
    reuses: 12,
  },
  {
    id: 2,
    category: '설비점검',
    equipment: 'WLD-01',
    status: '승인 대기',
    date: '2026.02.15',
    title: '용접 전류 보정 체크리스트',
    summary:
      '작업 전 반드시 전류값 기준치 ±5A 이내 확인. 습도 70% 이상 시 전류 3A 추가 보정 권장.',
    views: 203,
    comments: 12,
    reuses: 8,
  },
  {
    id: 3,
    category: '품질관리',
    equipment: 'INS-01',
    status: '승인 완료',
    date: '2026.01.28',
    title: '3D 검사 측정 오차 최소화 팁',
    summary:
      '측정 전 15분 워밍업 필수. 온도 변화 1°C당 0.003mm 오차 발생하므로 항온실 사용 권장.',
    views: 289,
    comments: 15,
    reuses: 21,
  },
  {
    id: 4,
    category: '정밀가공',
    equipment: 'MCH-02',
    status: '반려',
    date: '2026.01.10',
    title: '샤프트 배치 가공 지그 세팅 최적화',
    summary:
      '지그 고정 토크 42N·m 기준, 진동 감지 시 즉시 재세팅. 연속 가공 5회마다 토크 재확인.',
    views: 178,
    comments: 6,
    reuses: 4,
  },
  {
    id: 5,
    category: '설비점검',
    equipment: 'HP-02',
    status: '임시 저장',
    date: '2026.03.10',
    title: '유압 프레스 실린더 패킹 교체 주기 가이드',
    summary:
      '가압 횟수 50,000회 또는 6개월 중 먼저 도래 시 교체 권장. 오일 누유 발견 시 즉시 교체.',
    views: 0,
    comments: 0,
    reuses: 0,
  },
  {
    id: 6,
    category: '품질관리',
    equipment: 'CNC-05',
    status: '승인 대기',
    date: '2026.03.08',
    title: '스테인리스강 표면 조도 개선 방법',
    summary:
      'SUS316 가공 시 절삭 속도 120m/min, 이송 0.08mm/rev로 Ra 0.8μm 이하 달성 가능.',
    views: 167,
    comments: 7,
    reuses: 5,
  },
]

export const approvalStatus = {
  approved: 86,
  pending: 14,
  rejected: 5,
  draft: 9,
}

export const editHistory = [
  {
    id: 1,
    title: 'Ti-6Al-4V 채터링 방지 노하우',
    date: '2026.03.17',
    status: '승인 완료',
  },
  {
    id: 2,
    title: '3D 검사 측정 오차 최소화 팁',
    date: '2026.03.12',
    status: '반려',
  },
  {
    id: 3,
    title: '3D 검사 측정 오차 최소화 팁',
    date: '2026.03.12',
    status: '반려',
  },
]
