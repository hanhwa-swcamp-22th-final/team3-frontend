export const knowledgeHubInitialStats = {
  totalArticles: 1247,
  newThisMonth: 38,
}

export const knowledgeHubSummaryCards = [
  { key: 'totalArticles', label: '등록 지식 수',  value: '1,247건', helper: '전월 대비 +19건' },
  { key: 'newThisMonth',  label: '이달 신규',     value: '38건',    helper: '▲12' },
  { key: 'avgViews',      label: '평균 조회수',   value: '18.4',    helper: '▲0.6' },
]

export const knowledgeHubContributors = [
  { rank: 1, name: '손창우', initial: '손', tier: 'S', articles: 12, points: '+18.2', avatarColor: '#5b50d6' },
  { rank: 2, name: '김신우', initial: '김', tier: 'A', articles:  7, points: '+10.8', avatarColor: '#5b50d6' },
  { rank: 3, name: '황자현', initial: '황', tier: 'A', articles:  4, points: '+6.3',  avatarColor: '#269063' },
]

export const knowledgeHubAiRecommendations = [
  { id: 1, title: 'S측 가공 심화 과정',  subtitle: '손창우 등록 문서 기반 추천' },
  { id: 2, title: 'GD&T 공차 분석',      subtitle: '품질관리 카테고리 인기 주제' },
]
