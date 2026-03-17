export const ROLES = ['Admin', 'HR Manager', 'Team Leader', 'Department Leader', 'Worker']

export const ROLE_DEFINITIONS = {
  'Admin': {
    title: '시스템 전체 관리자',
    desc: '모든 메뉴 접근 및 시스템 설정 권한 보유. 평가 알고리즘 파라미터 수정, 권한 관리, 데이터 전체 조회 가능.',
    level: 5,
    accounts: [
      { initial: 'A', name: '관리자A', team: '시스템관리팀장', status: '활성' },
      { initial: 'B', name: '관리자B', team: 'IT운영팀',      status: '활성' },
    ],
  },
  'HR Manager': {
    title: 'HR 관리자',
    desc: '인사 관련 메뉴 접근. 직원 프로필 조회/수정, 승급 심사, 평가 승인 권한 보유.',
    level: 4,
    accounts: [
      { initial: 'H', name: 'HR관리자A', team: '인사팀', status: '활성' },
    ],
  },
  'Team Leader': {
    title: '팀 리더',
    desc: '팀 내 라인 대시보드 조회, 정량 점수 확인, 주문 현황 조회 권한 보유.',
    level: 3,
    accounts: [
      { initial: 'T', name: '팀리더A', team: '제조팀', status: '활성' },
      { initial: 'T', name: '팀리더B', team: '품질팀', status: '활성' },
    ],
  },
  'Department Leader': {
    title: '부서 리더',
    desc: '라인 대시보드 조회, 정성 평가 입력, 주문 현황 조회, 작업 매칭 실행 권한 보유.',
    level: 2,
    accounts: [
      { initial: 'D', name: '부서장A', team: 'A부서', status: '활성' },
    ],
  },
  'Worker': {
    title: '작업자',
    desc: '개인 대시보드 및 본인 점수 조회, 지식 등록, 이의 신청 권한 보유.',
    level: 1,
    accounts: [
      { initial: 'W', name: '작업자A', team: 'A라인', status: '활성' },
      { initial: 'W', name: '작업자B', team: 'B라인', status: '활성' },
    ],
  },
}

export const DUMMY_MATRIX = [
  {
    category: '📊 대시보드 & 조회',
    items: [
      { name: '전사 대시보드',  Admin: true,  HR: true,  TL: false, DL: false, Worker: false, note: '전체현황' },
      { name: '라인 대시보드',  Admin: true,  HR: true,  TL: true,  DL: true,  Worker: false, note: '—' },
      { name: '개인 대시보드',  Admin: true,  HR: true,  TL: true,  DL: true,  Worker: true,  note: '본인만' },
    ],
  },
  {
    category: '⚙️ 평가 & 알고리즘',
    items: [
      { name: '정량 점수 조회',    Admin: true,  HR: true,  TL: true,  DL: true,  Worker: true,  note: '본인만(Worker)' },
      { name: '정성 평가 입력',    Admin: true,  HR: false, TL: false, DL: true,  Worker: false, note: 'GL, TL 입력' },
      { name: '평가 승인/확정',    Admin: true,  HR: true,  TL: false, DL: false, Worker: false, note: '—' },
      { name: '알고리즘 파라미터', Admin: true,  HR: false, TL: false, DL: false, Worker: false, note: 'Admin 전용' },
    ],
  },
  {
    category: '👥 인사 & 승급',
    items: [
      { name: '전체 인원 조회', Admin: true,  HR: true,  TL: false, DL: false, Worker: false, note: '—' },
      { name: '프로필 수정',    Admin: true,  HR: true,  TL: false, DL: false, Worker: false, note: '—' },
      { name: '승급 심사',      Admin: true,  HR: true,  TL: false, DL: false, Worker: false, note: '—' },
      { name: '이의 신청',      Admin: true,  HR: false, TL: false, DL: false, Worker: true,  note: 'Worker 본인' },
    ],
  },
  {
    category: '📦 SCM & 설비',
    items: [
      { name: '주문 현황 조회',   Admin: true,  HR: true,  TL: true,  DL: true,  Worker: false, note: '—' },
      { name: '작업 매칭 실행',   Admin: true,  HR: false, TL: false, DL: true,  Worker: false, note: '—' },
      { name: '설비 E_idx 설정', Admin: true,  HR: false, TL: false, DL: false, Worker: false, note: 'Admin 전용' },
    ],
  },
]
