export const STATUS = {
  PUBLISHED: '게시중',
  IMPORTANT: '중요',
  SCHEDULED: '예약',
  DRAFT:     '임시',
}

export const STATUS_STYLE = {
  게시중: { bg: '#e3fbef', color: '#007a60' },
  중요:   { bg: 'var(--color-primary-100)', color: 'var(--color-primary-600)' },
  예약:   { bg: '#fff8e1', color: '#b45309' },
  임시:   { bg: '#ffecf1', color: '#c0103e' },
}

export const FILTER_TABS = ['전체', '중요', '게시중', '예약', '임시']

export const MOCK_TEAMS = ['전체', 'TL', 'GL', 'Worker', 'HRM']

let _id = 14
export const mockNotices = [
  {
    id: 1,
    title: 'KPI 리포트 반영 일정 및 평가 결과 공개 기준',
    status: '게시중',
    targets: ['TL', 'GL', 'Worker'],
    date: '2026.03.18',
    author: 'HRM_평가운영팀',
    views: 128,
    isImportant: true,
    content: `이번 달 평가 결과는 3월 21일(토) 18:00 이후 시스템에서 확인 가능합니다.

■ 일정 안내
- 평가 결과 공개: 2026.03.21 18:00
- 이의신청 기간: 2026.03.21 ~ 2026.03.24 (3일)
- 최종 확정 공지: 2026.03.27

■ KPI 리포트 반영 기준
- 1분기 정량 평가: AI 산출 E_idx 기준
- 1분기 정성 평가: TL 1차 + GL 2차 평가 합산
- 이의신청은 시스템 내 이의신청 메뉴에서 진행

■ 문의
- HRM 평가운영팀 내선 2150`,
    attachment: '',
  },
  {
    id: 2,
    title: '2026년 1분기 승진 심사 대상자 안내',
    status: '게시중',
    targets: ['TL', 'GL'],
    date: '2026.03.15',
    author: 'HRM_인사운영팀',
    views: 74,
    isImportant: true,
    content: `2026년 1분기 승진 심사 대상자를 아래와 같이 안내드립니다.

■ 심사 일정
- 서류 제출 마감: 2026.03.20
- 심사 기간: 2026.03.21 ~ 2026.03.25
- 결과 발표: 2026.03.28

■ 제출 서류
- 승진 추천서 (TL 작성)
- 최근 2개년 평가 결과
- 역량 개발 이력

■ 문의
- HRM 인사운영팀 내선 2130`,
    attachment: '',
  },
  {
    id: 3,
    title: '4월 정기 교육 일정 사전 안내',
    status: '예약',
    targets: ['TL', 'GL', 'Worker'],
    date: '2026.03.25',
    author: 'HRM_교육운영팀',
    views: 0,
    isImportant: false,
    content: `4월 정기 교육 일정을 사전 안내드립니다. 대상자는 반드시 사전 신청 후 참석해 주시기 바랍니다.

■ 교육 일정
- 안전 보건 교육: 2026.04.03 (목) 14:00 ~ 16:00
- 품질 관리 역량 교육: 2026.04.08 (화) 10:00 ~ 12:00
- 리더십 향상 과정 (TL/GL): 2026.04.10 (목) 13:00 ~ 17:00

■ 신청 방법
- HRM 포털 > 교육신청 메뉴에서 신청
- 신청 마감: 2026.03.28

■ 문의
- HRM 교육운영팀 내선 2160`,
    attachment: '',
  },
  {
    id: 4,
    title: '조직도 관리 메뉴 개편 안내 (초안)',
    status: '임시',
    targets: ['HRM'],
    date: null,
    author: 'HRM_시스템팀',
    views: 0,
    isImportant: false,
    content: `조직도 관리 메뉴 개편 내용을 안내드립니다. (작성 중)

■ 주요 변경 사항
- 팀 편성 화면 UI 개편
- 다중 팀 이동 기능 추가
- 조직도 엑셀 내보내기 지원

■ 예정 배포일
- 미정`,
    attachment: '',
  },
  {
    id: 5,
    title: '2026년 상반기 연차 사용 촉진 안내',
    status: '게시중',
    targets: ['TL', 'GL', 'Worker'],
    date: '2026.03.10',
    author: 'HRM_인사운영팀',
    views: 95,
    isImportant: false,
    content: `근로기준법에 따라 상반기 연차 사용 촉진을 안내드립니다.\n\n■ 촉진 대상\n- 2025년 미사용 연차 보유 직원 전체\n\n■ 사용 권장 기간\n- 2026.04.01 ~ 2026.06.30\n\n■ 신청 방법\n- HRM 포털 > 근태 > 연차 신청\n\n■ 문의\n- HRM 인사운영팀 내선 2130`,
    attachment: '',
  },
  {
    id: 6,
    title: '설비 점검에 따른 시스템 일시 중단 안내',
    status: '게시중',
    targets: ['TL', 'GL', 'Worker'],
    date: '2026.03.08',
    author: 'HRM_시스템팀',
    views: 210,
    isImportant: true,
    content: `서버 정기 점검으로 인해 아래 일정에 시스템이 일시 중단됩니다.\n\n■ 중단 일시\n- 2026.03.22 (일) 02:00 ~ 06:00\n\n■ 영향 범위\n- HRM 포털 전체 서비스\n\n■ 유의사항\n- 점검 시간 내 데이터 저장 불가\n- 긴급 문의: HRM 시스템팀 내선 2170`,
    attachment: '',
  },
  {
    id: 7,
    title: '2026년 복리후생 제도 변경 안내',
    status: '게시중',
    targets: ['TL', 'GL', 'Worker'],
    date: '2026.03.05',
    author: 'HRM_인사운영팀',
    views: 183,
    isImportant: false,
    content: `2026년부터 적용되는 복리후생 제도 변경 사항을 안내드립니다.\n\n■ 주요 변경 내용\n- 자기개발비 연 30만원 → 50만원으로 상향\n- 건강검진 지원 항목 확대 (배우자 포함)\n- 사내 카페테리아 포인트 월 3만원 지급\n\n■ 적용 시점\n- 2026.04.01부터 적용`,
    attachment: '',
  },
  {
    id: 8,
    title: '1분기 안전 교육 미이수자 재공지',
    status: '게시중',
    targets: ['Worker'],
    date: '2026.03.03',
    author: 'HRM_교육운영팀',
    views: 47,
    isImportant: true,
    content: `1분기 안전 교육 미이수자를 대상으로 추가 교육 일정을 안내드립니다.\n\n■ 대상\n- 2026년 1분기 안전 교육 미이수 Worker\n\n■ 추가 교육 일정\n- 2026.03.26 (목) 15:00 ~ 17:00 / 현장 교육장 A동\n\n■ 유의사항\n- 미이수 시 인사 불이익 발생 가능`,
    attachment: '',
  },
  {
    id: 9,
    title: '5월 노사협의회 의제 사전 수렴 안내',
    status: '예약',
    targets: ['TL', 'GL', 'Worker'],
    date: '2026.04.10',
    author: 'HRM_인사운영팀',
    views: 0,
    isImportant: false,
    content: `5월 노사협의회 개최에 앞서 직원 의제를 사전 수렴합니다.\n\n■ 수렴 기간\n- 2026.04.01 ~ 2026.04.07\n\n■ 협의회 예정일\n- 2026.05.15 (금)`,
    attachment: '',
  },
  {
    id: 10,
    title: '하계 휴가 일정 사전 조율 안내',
    status: '예약',
    targets: ['TL', 'GL', 'Worker'],
    date: '2026.04.20',
    author: 'HRM_인사운영팀',
    views: 0,
    isImportant: false,
    content: `하계 휴가 일정 조율을 위해 사전 희망 일정을 취합합니다.\n\n■ 취합 기간\n- 2026.04.14 ~ 2026.04.18\n\n■ 하계 휴가 권장 기간\n- 2026.07.21 ~ 2026.08.15 중 5일`,
    attachment: '',
  },
]

export function nextId() { return ++_id }
