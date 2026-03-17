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

export const FILTER_TABS = ['게시중', '예약', '임시 저장']

export const MOCK_TEAMS = ['전체', '정밀가공1팀', '정밀가공2팀', '품질검사팀', 'HRM']

let _id = 5
export const mockNotices = [
  {
    id: 1,
    title: '3월 18일 정기 설비 점검으로 인한 작업 배치 변경 안내',
    status: '게시중',
    targets: ['TL', 'GL', 'Worker'],
    date: '2026.03.13',
    isImportant: false,
    content: '오전 09:00~11:00 동안 2라인 검사설비 정기 점검이 진행됩니다.',
    attachment: '',
  },
  {
    id: 2,
    title: '평가 결과 공개 일정 및 이의신청 운영 정책',
    status: '중요',
    targets: ['Worker'],
    date: '2026.03.12',
    isImportant: true,
    content: '평가 결과 공개 및 이의신청 관련 운영 정책을 안내드립니다.',
    attachment: '',
  },
  {
    id: 3,
    title: '신규 KMS 등록 가이드 배포',
    status: '예약',
    targets: ['GL', 'TL'],
    date: '2026.03.14',
    isImportant: false,
    content: '신규 KMS 등록 가이드가 배포될 예정입니다.',
    attachment: '',
  },
  {
    id: 4,
    title: '조직도 관리 메뉴 개편 안내',
    status: '임시',
    targets: ['HRM'],
    date: null,
    isImportant: false,
    content: '조직도 관리 메뉴가 개편될 예정입니다.',
    attachment: '',
  },
]

export function nextId() { return ++_id }
