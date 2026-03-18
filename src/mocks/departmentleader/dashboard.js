export const dashboardNotice = {
  badge: '📌 중요 공지',
  title: '2026 상반기 평가 의견 입력 마감: 3월 18일 18:00',
  description:
    '팀리더 정성평가와 HR 검토 항목은 마감 이후 수정이 제한됩니다. 음성인식 불량 건은 텍스트 수동 보정 후 제출해 주세요.',
}

export const dashboardMetrics = [
  { label: '팀 평균 점수', value: '85.4', delta: '▲2.1',  tone: 'primary' },
  { label: '팀 가동률',   value: '91.3%', delta: '▲1.2%', tone: 'success' },
  { label: '이벤트 알람', value: '108건', delta: '▲12',   tone: 'success' },
  { label: '팀 TIER 등급', value: 'A',   tone: 'primary', isTier: true },
]

export const dashboardTeams = [
  { id: 1, name: '제조1팀', tl: '박지훈', count: 12, avg: 81.2, status: '평가완료' },
  { id: 2, name: '제조2팀', tl: '한민수', count: 10, avg: 79.8, status: '심사중'  },
  { id: 3, name: '품질팀',  tl: '오성현', count: 8,  avg: 84.5, status: '평가완료' },
]

export const dashboardGroupKpi = {
  groupAvg: 83.1,
  equipRate: '91.4%',
  qualityRate: '96.2%',
}
