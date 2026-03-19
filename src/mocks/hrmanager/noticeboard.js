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

export const FILTER_TABS = ['전체', '게시중', '예약', '임시']

export const MOCK_TEAMS = ['전체', 'TL', 'GL', 'Worker', 'HRM']

let _id = 5
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
]

export function nextId() { return ++_id }
