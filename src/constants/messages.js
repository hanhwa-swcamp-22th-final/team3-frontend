export const LOGIN_MESSAGES = {
  EMPTY_FIELDS: '이메일과 비밀번호를 입력해주세요.',
  INVALID_CREDENTIALS: '아이디 또는 비밀번호가 일치하지 않습니다.',
  EMPLOYEE_ON_LEAVE: '휴직 중인 사원은 로그인할 수 없습니다.',
  SERVER_ERROR: '서버에 연결할 수 없습니다.',
}

export const AUTH_ERROR_CODE_MAP = {
  AUTH_001: 'INVALID_CREDENTIALS',
  AUTH_002: 'EMPLOYEE_ON_LEAVE',
}

export const EVAL_MESSAGES = {
  DRAFT_SAVED: '임시 저장되었습니다.',
  WEIGHT_SUM_ERROR: '정량 세부 항목 합계가 100%여야 합니다.',
  CHANGES_APPLIED: '변경사항이 적용되었습니다.',
  DATA_LOAD_ERROR: '데이터를 불러오는 중 오류가 발생했습니다.',
}
