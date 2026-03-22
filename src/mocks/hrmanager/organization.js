export const GROUP_COLORS = [
  '#7c6fcd', '#4b89c8', '#1aaa8e', '#d94f6e',
  '#a07826', '#e07c7c', '#2bbfb0', '#e8a020',
]

export const mockOrganization = [
  {
    id: 1,
    name: '생산본부',
    color: '#7c6fcd',
    description: '생산 및 가공 총괄',
    teams: [
      { id: 1, name: '정밀가공1팀', description: '정밀가공 1라인 운영', memberIds: [1, 3, 4], leaderId: 4 },
      { id: 2, name: '정밀가공2팀', description: '정밀가공 2라인 운영', memberIds: [5],        leaderId: null },
    ],
  },
  {
    id: 2,
    name: '품질관리본부',
    color: '#1aaa8e',
    description: '제품 품질 관리 총괄',
    teams: [
      { id: 3, name: '품질검사팀', description: '제품 품질 검사 및 인증', memberIds: [2], leaderId: null },
    ],
  },
]

/** 직위 목록 (필터 드롭다운용) */
export const POSITIONS = ['팀장', '선임연구원', '대리', '주임', '사원', '과장']

/** employee_id → 직위·부서 (db.json에 없는 필드 보완) */
export const POSITION_MAP = {
  1:  { position: '팀장',      dept: '생산' },
  2:  { position: '과장',      dept: 'HR'   },
  3:  { position: '선임연구원', dept: '생산' },
  4:  { position: '대리',      dept: '생산' },
  5:  { position: '사원',      dept: '생산' },
  6:  { position: '주임',      dept: '생산' },
  7:  { position: '사원',      dept: '생산' },
  8:  { position: '사원',      dept: '품질' },
  9:  { position: '사원',      dept: '생산' },
  10: { position: '대리',      dept: '품질' },
  11: { position: '선임연구원', dept: '생산' },
  12: { position: '주임',      dept: '생산' },
  13: { position: '사원',      dept: '품질' },
  14: { position: '사원',      dept: '생산' },
  15: { position: '대리',      dept: '생산' },
}
