export const kpiSummaryCards = [
  { label: '라인 평균 정량', value: '83.1점', helper: '▲ 1.4', tone: 'primary' },
  { label: '설비 평균 E_idx', value: '0.92', helper: '', tone: 'warning' },
  { label: '최고 / 최저', value: '94.2 / 74.1', helper: '', tone: 'primary' },
]

export const kpiRows = [
  { id: 1, name: '손창우', tier: 'S', actualOutput: '110.4개', eIdx: '0.92', adjustedRate: '100.0%', score: '83.4', trend: '▼0.6', trendTone: 'danger', detailLabel: '상세', avatar: '손', avatarTone: 'purple' },
  { id: 2, name: '김신우', tier: 'A', actualOutput: '98.2개', eIdx: '0.96', adjustedRate: '85.5%', score: '86.1', trend: '▲2.1', trendTone: 'success', detailLabel: '상세', avatar: '김', avatarTone: 'purple' },
  { id: 3, name: '이지훈', tier: 'A', actualOutput: '95.7개', eIdx: '0.94', adjustedRate: '83.8%', score: '84.2', trend: '▲0.9', trendTone: 'success', detailLabel: '상세', avatar: '이', avatarTone: 'slate' },
  { id: 4, name: '박지훈', tier: 'B', actualOutput: '88.3개', eIdx: '0.88', adjustedRate: '82.2%', score: '79.4', trend: '▲1.2', trendTone: 'success', detailLabel: '상세', avatar: '박', avatarTone: 'red' },
  { id: 5, name: '정미래', tier: 'B', actualOutput: '72.1개', eIdx: '0.71', adjustedRate: '66.7%', score: '74.1', trend: '▼2.3', trendTone: 'danger', detailLabel: '상세', avatar: '정', avatarTone: 'gold' },
  { id: 6, name: '최윤호', tier: 'A', actualOutput: '101.6개', eIdx: '0.95', adjustedRate: '90.4%', score: '85.9', trend: '▲1.5', trendTone: 'success', detailLabel: '상세', avatar: '최', avatarTone: 'purple' },
  { id: 7, name: '오세훈', tier: 'B', actualOutput: '84.9개', eIdx: '0.86', adjustedRate: '80.7%', score: '78.6', trend: '▲0.4', trendTone: 'success', detailLabel: '상세', avatar: '오', avatarTone: 'slate' },
  { id: 8, name: '류민재', tier: 'A', actualOutput: '96.8개', eIdx: '0.93', adjustedRate: '84.6%', score: '84.8', trend: '▲0.8', trendTone: 'success', detailLabel: '상세', avatar: '류', avatarTone: 'red' },
  { id: 9, name: '한도윤', tier: 'S', actualOutput: '112.0개', eIdx: '0.97', adjustedRate: '98.3%', score: '89.7', trend: '▲2.7', trendTone: 'success', detailLabel: '상세', avatar: '한', avatarTone: 'purple' },
  { id: 10, name: '문서연', tier: 'B', actualOutput: '79.5개', eIdx: '0.82', adjustedRate: '75.4%', score: '76.2', trend: '▼0.5', trendTone: 'danger', detailLabel: '상세', avatar: '문', avatarTone: 'gold' },
  { id: 11, name: '배지후', tier: 'A', actualOutput: '93.4개', eIdx: '0.91', adjustedRate: '82.9%', score: '82.7', trend: '▲1.1', trendTone: 'success', detailLabel: '상세', avatar: '배', avatarTone: 'slate' },
  { id: 12, name: '서예린', tier: 'B', actualOutput: '81.7개', eIdx: '0.84', adjustedRate: '77.2%', score: '77.1', trend: '▼1.4', trendTone: 'danger', detailLabel: '상세', avatar: '서', avatarTone: 'red' },
]

export const kpiTrendPanelMap = {
  default: {
    stepTemplates: [
      { step: 1, title: '기준 생산량 설정', descriptionTemplate: 'E_exp = 120개/일', valueTemplate: '120개' },
      { step: 2, title: '실제 생산량 집계', descriptionTemplate: 'P = {actualOutput} (MES 수신)', valueTemplate: '{actualOutput}' },
      { step: 3, title: '임시 E값', descriptionTemplate: '{actualBase} / 120 = {eIdx}', valueTemplate: '{eRate}%' },
      { step: 4, title: '설비 E_idx 수신', descriptionTemplate: '{name} 가동 E_idx = {eIdx}', valueTemplate: '{eIdx}' },
      { step: 5, title: '보정 달성률', descriptionTemplate: '보정 달성률 = {adjustedRate}', valueTemplate: '{adjustedRate}' },
      { step: 6, title: '정량 점수 산출', descriptionTemplate: '최종 산출 점수 = {score}', valueTemplate: '{score}점' },
    ],
    chartTitleTemplate: '{name} E_idx 월별 추이',
    chartMetaTemplate: '선택 인원 {name} · 최근 산출 지표 기준',
    benchmarkTitle: '라인 내 비교',
    benchmarkTemplates: [
      { labelTemplate: '라인 평균', valueTemplate: '83.1', deltaTemplate: '기준' },
      { labelTemplate: '{name}', valueTemplate: '{score}', deltaTemplate: '{trend}' },
      { labelTemplate: '라인 최고', valueTemplate: '86.1', deltaTemplate: '▲3.0' },
    ],
  },
}
