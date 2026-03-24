// ── 서비스 상태 카드 ────────────────────────────────
export const SERVICE_STATUS = [
  { label: 'API 서버',    value: '정상 · 42ms',         color: '#00BF95' },
  { label: 'Kafka 브로커', value: '정상 · 1,247msg/s',   color: '#00BF95' },
  { label: '배치 처리',   value: '완료 · 03.09 02:00',  color: '#00BF95' },
  { label: 'Redis 캐시',  value: '정상 · 94.2%',        color: '#00BF95' },
  { label: 'Maria DB',     value: '정상 · avg 12ms',     color: '#00BF95' },
]

// ── 로그 레벨 스타일 ────────────────────────────────
export const LEVEL_STYLE = {
  INFO:  { bg: 'rgba(74, 222, 128, 0.10)', color: '#4ADE80' },
  WARN:  { bg: 'rgba(255, 209, 102, 0.15)', color: '#FFD166' },
  ERROR: { bg: 'rgba(255, 107, 107, 0.10)', color: '#FF6B6B' },
  BATCH: { bg: 'rgba(167, 139, 250, 0.15)', color: '#A78BFA' },
}

// ── 더미 로그 15개 ──────────────────────────────────
export const DUMMY_LOGS = [
  { id: 1,  time: '03.09 14:23:51', level: 'INFO',  message: '배치 실행 완료 — 분기 정량 점수 산출 (26명 처리, 0.3s)' },
  { id: 2,  time: '03.09 14:22:18', level: 'INFO',  message: 'E_idx 갱신 — MCH-01: 0.91 → 0.92 (MES 수신)' },
  { id: 3,  time: '03.09 14:21:44', level: 'WARN',  message: 'MCH-01 E_idx 임계값 근접 (0.92 / 하한 0.80)' },
  { id: 4,  time: '03.09 14:20:33', level: 'INFO',  message: '정성 평가 NLP 처리 — 손창우 신뢰도 0.94' },
  { id: 5,  time: '03.09 14:19:57', level: 'INFO',  message: 'KMS 심사 승인 — Ti-6Al-4V 노하우 (관리자: HR담당)' },
  { id: 6,  time: '03.09 14:18:22', level: 'INFO',  message: '작업 매칭 완료 — ORD-0301 → 손창우 (Tier S, D4)' },
  { id: 7,  time: '03.09 14:15:09', level: 'ERROR', message: 'WLD-01 설비 FAULT — E_idx 0.71 (임계 이하) 알림 발송' },
  { id: 8,  time: '03.09 14:14:33', level: 'INFO',  message: '평가 이의 신청 수신 — 손창우 2026Q1 (담당: HR팀)' },
  { id: 9,  time: '03.09 14:12:01', level: 'INFO',  message: 'Kafka 메시지 수신 — MES 생산 데이터 1,247건' },
  { id: 10, time: '03.09 14:10:44', level: 'WARN',  message: 'Redis 캐시 만료 — 분기 평균 점수 재계산 트리거' },
  { id: 11, time: '03.09 14:09:18', level: 'BATCH', message: '배치 스케줄 등록 — 일일 E_idx 갱신 (02:00 UTC)' },
  { id: 12, time: '03.09 14:07:55', level: 'INFO',  message: '사용자 로그인 — admin@seto.com (IP: 192.168.1.10)' },
  { id: 13, time: '03.09 14:05:30', level: 'INFO',  message: 'Skill Gap 분석 요청 — 손창우 (AI 처리 0.8s)' },
  { id: 14, time: '03.09 14:03:11', level: 'ERROR', message: 'DB 쿼리 지연 — worker_performance (850ms > 임계 500ms)' },
  { id: 15, time: '03.09 14:01:44', level: 'INFO',  message: '시스템 헬스체크 통과 — 전체 서비스 정상' },
]

// ── 배치 실행 이력 ──────────────────────────────────
export const BATCH_HISTORY = [
  { name: '분기 점수 산출',  time: '03.09 02:00', status: '성공', statusBg: '#E3FBEF', statusColor: '#007A60' },
  { name: 'E_idx 일일 갱신', time: '03.09 02:05', status: '성공', statusBg: '#E3FBEF', statusColor: '#007A60' },
  { name: 'KMS 유사도 분석', time: '03.08 02:00', status: '성공', statusBg: '#E3FBEF', statusColor: '#007A60' },
  { name: 'Skill Gap 배치',  time: '03.08 03:00', status: '성공', statusBg: '#E3FBEF', statusColor: '#007A60' },
  { name: 'DB 정합성 검증',  time: '03.07 04:00', status: '경고', statusBg: '#FFF8E0', statusColor: '#A07000' },
]

// ── API 응답시간 차트 데이터 ─────────────────────────
export const API_CHART = {
  label: 'API 응답시간 (ms)',
  sub:   '현재 42ms · 평균 58ms · 최대 120ms',
  threshold: 100,
  points: [65, 80, 42, 58, 110, 45, 42],
}

// ── Kafka 처리량 차트 데이터 ─────────────────────────
export const KAFKA_CHART = {
  label: 'Kafka 메시지 처리량 (msg/s)',
  sub:   '현재 1,247 msg/s · 피크 1,247',
  bars: [900, 1100, 1247, 980, 1050, 1247],
}

// ── 에러 요약 ───────────────────────────────────────
export const ERROR_SUMMARY = {
  title:  '⚠️ 오늘 에러 2건',
  items: [
    '14:15  WLD-01 FAULT 알림 발송 완료',
    '14:03  DB 쿼리 지연 (자동 복구 완료)',
  ],
}

// ── 필터 옵션 ───────────────────────────────────────
export const FILTER_OPTIONS = [
  { key: '전체',  bg: '#5B4FCF', color: '#FFFFFF' },
  { key: 'ERROR', bg: '#FFECF1', color: '#C0103E' },
  { key: 'WARN',  bg: '#FFF8E0', color: '#A07000' },
  { key: 'INFO',  bg: '#F0EEFF', color: '#5B4FCF' },
  { key: 'BATCH', bg: '#E3FBEF', color: '#007A60' },
]
