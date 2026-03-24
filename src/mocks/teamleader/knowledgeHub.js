export const knowledgeHubSummaryCards = [
  { key: 'totalArticles', label: '총 등록 지식', value: '1,284건', helper: '전월 대비 +26건' },
  { key: 'newThisMonth', label: '이달 신규', value: '42건', helper: '이번 주 11건 추가' },
  { key: 'pendingApproval', label: '승인 대기 문서', value: '7건', helper: '오늘 확인 필요 3건' },
]

export const knowledgeHubCategories = [
  { key: 'all', label: '전체' },
  { key: 'popular', label: '인기' },
  { key: 'latest', label: '최신' },
  { key: 'subscribed', label: '내 구독' },
  { key: '정밀가공', label: '정밀가공' },
  { key: '설비점검', label: '설비점검' },
  { key: '품질관리', label: '품질관리' },
]

export const knowledgeHubArticles = [
  {
    id: 1,
    code: 'KMS-2104',
    title: 'Ti-6Al-4V 정밀 가공 시 챔퍼 버 발생 억제 조건',
    preview: '주축 회전수 8,500rpm, 이송 0.06mm/rev 구간에서 절삭열이 급증해 버가 발생했습니다. 냉각제 분사 각도와 공구 교환 주기를 조정하면 안정적입니다.',
    content: '주축 회전수 8,500rpm, 이송 0.06mm/rev 조건에서 Ti-6Al-4V 소재 가공 시 절삭열이 급격히 올라가면서 챔퍼 부위 버가 반복 발생했습니다. 현장 테스트 결과 냉각제 분사 각도를 공구 접촉면 방향으로 재조정하고, 공구 교환 주기를 18개 기준으로 짧게 잡았을 때 버 발생률이 크게 줄었습니다. 작업 전 공구 마모와 냉각제 노즐 위치를 함께 점검하는 것을 권장합니다.',
    category: '정밀가공',
    equipment: 'MCH-01',
    date: '03.17',
    author: '손창우',
    authorInitial: '손',
    authorTier: 'S',
    comments: 12,
    commentList: [
      { id: 1, author: '김신우', date: '03.17 14:10', body: '냉각제 분사 각도 조정 전후 사진도 같이 있으면 현장 적용에 더 도움이 될 것 같습니다.' },
      { id: 2, author: '최민정', date: '03.17 15:25', body: '공구 교환 주기 기준을 작업 표준서에도 반영해 두겠습니다.' },
    ],
    isPopular: true,
    isSubscribed: true,
  },
  {
    id: 2,
    code: 'KMS-2088',
    title: '용접 프레임 스탠드 뒤틀림 보정 체크리스트',
    preview: '용접 후 2시간 이내 1차 측정, 자연 냉각 후 2차 측정을 권장합니다. 고정 지그 토크 기준을 함께 체크하면 재작업률이 내려갑니다.',
    content: '용접 직후에는 열변형 때문에 측정값 편차가 크므로 2시간 이내 1차 측정, 자연 냉각 후 2차 측정을 권장합니다. 특히 고정 지그 토크와 기준면 오차를 함께 기록하면 뒤틀림 원인을 빠르게 추적할 수 있습니다. 재작업 시에는 기준면부터 순차적으로 교정하고 마지막에 최종 수직도 검사를 진행하세요.',
    category: '품질관리',
    equipment: 'WLD-02',
    date: '03.15',
    author: '김신우',
    authorInitial: '김',
    authorTier: 'A',
    comments: 6,
    commentList: [
      { id: 1, author: '임원석', date: '03.15 11:42', body: '자연 냉각 시간 조건을 겨울/여름 기준으로 나눠서 적어도 좋겠습니다.' },
    ],
    isPopular: false,
    isSubscribed: true,
  },
  {
    id: 3,
    code: 'KMS-2054',
    title: '프레스 라인 금형 교체 전 점검 항목',
    preview: '금형 교체 직전 윤활량, 온도, 센서 오차를 동시에 체크해야 초반 30분 불량률이 크게 줄어듭니다.',
    content: '금형 교체 직전에는 윤활량, 라인 온도, 센서 오차를 동시에 확인해야 초반 30분 불량률을 줄일 수 있습니다. 교체 직후 10분 동안은 샘플링 빈도를 높이고, 센서 오차가 허용 범위를 벗어나면 즉시 교정 후 재가동하는 절차가 필요합니다.',
    category: '설비점검',
    equipment: 'PRS-03',
    date: '03.13',
    author: '임원석',
    authorInitial: '임',
    authorTier: 'B',
    comments: 4,
    commentList: [
      { id: 1, author: '황자현', date: '03.13 09:18', body: '센서 오차 기준표 링크도 추가되면 좋겠습니다.' },
    ],
    isPopular: false,
    isSubscribed: false,
  },
  {
    id: 4,
    code: 'KMS-2031',
    title: '표준 브라켓 가공 시 잔류 진동 억제 방법',
    preview: '가공 중 180Hz 대역 진동이 발생하면 지그 체결력보다 공구 마모 상태를 먼저 의심해야 합니다.',
    content: '표준 브라켓 가공 중 180Hz 대역 진동이 반복되면 지그 체결력만 보기보다 공구 마모 상태를 먼저 점검해야 합니다. 공구 마모가 누적된 상태에서는 동일 체결력에서도 잔류 진동이 커지므로, 진동 발생 시점의 공구 사용 시간을 함께 기록하는 것이 중요합니다.',
    category: '정밀가공',
    equipment: 'MCH-02',
    date: '03.11',
    author: '황자현',
    authorInitial: '황',
    authorTier: 'A',
    comments: 7,
    commentList: [
      { id: 1, author: '손창우', date: '03.11 17:08', body: '가공 조건별 진동 로그 예시도 다음 버전에 추가해 주세요.' },
    ],
    isPopular: true,
    isSubscribed: false,
  },
  {
    id: 5,
    code: 'KMS-1997',
    title: '3차원 측정기 교정 전후 관리 절차',
    preview: '교정 이후 24시간 동안은 측정값 drift 체크를 병행해야 합니다. 품질 지표와 연동한 모니터링 기준을 함께 기록해 두세요.',
    content: '3차원 측정기 교정 이후 24시간 동안은 측정값 drift 체크를 병행해야 합니다. 품질 지표와 연동한 모니터링 기준을 함께 기록하면 교정 직후 오차를 조기에 발견할 수 있습니다. 교정 전후 비교값은 최소 3개 샘플로 남겨 두는 것을 권장합니다.',
    category: '품질관리',
    equipment: 'QMS-01',
    date: '03.09',
    author: '최민정',
    authorInitial: '최',
    authorTier: 'S',
    comments: 9,
    commentList: [
      { id: 1, author: '김신우', date: '03.09 13:55', body: '교정 전후 샘플 비교표 형식을 템플릿으로 만들어도 좋겠습니다.' },
      { id: 2, author: '황자현', date: '03.09 16:20', body: '현장 작업자가 바로 볼 수 있게 체크리스트 버전도 필요합니다.' },
    ],
    isPopular: false,
    isSubscribed: true,
  },
]

export const knowledgeHubContributors = [
  { rank: 1, name: '손창우', initial: '손', tier: 'S', articles: 12, points: '+18.2', avatarColor: '#5b50d6' },
  { rank: 2, name: '김신우', initial: '김', tier: 'A', articles: 8, points: '+11.4', avatarColor: '#5b50d6' },
  { rank: 3, name: '최민정', initial: '최', tier: 'A', articles: 6, points: '+9.1', avatarColor: '#18b9a7' },
]

export const knowledgeHubMentoring = {
  ongoing: [
    { id: 1, mentor: '손창우', mentee: '이재훈', field: '정밀가공', status: '진행중' },
    { id: 2, mentor: '김신우', mentee: '박준호', field: '품질관리', status: '피드백 대기' },
  ],
  pending: [
    {
      id: 1,
      name: '정밀 기어박스 제작',
      requester: 'PRS-02',
      summary: '가공 조건 리뷰 요청',
      requestedBy: '이재훈',
      requestedAt: '03.17 10:25',
      priority: '높음',
      reason: '신규 주문 대응을 위해 가공 조건 표준화와 공정별 주의사항 정리가 필요합니다.',
      details: '정밀 가공 단계별 세팅 포인트, 공구 교환 주기, 검사 기준까지 한 번에 리뷰받고자 합니다.',
    },
    {
      id: 2,
      name: '챔퍼 버 재발 방지',
      requester: 'MCH-03',
      summary: '공정 표준화 검토 필요',
      requestedBy: '박준호',
      requestedAt: '03.16 15:10',
      priority: '중간',
      reason: '반복 이슈 문서를 교육용 체크리스트까지 연결하고 싶습니다.',
      details: '신규 작업자도 바로 적용할 수 있도록 단계별 예시와 사진 자료가 있으면 좋겠습니다.',
    },
  ],
}

export const knowledgeHubMentoringRequestDefaults = {
  field: '정밀가공',
  period: '2주',
  frequency: '주 1회',
  purpose: '팀 내 신규 작업자를 위한 지식 전파와 현장 문서 보완을 함께 진행하고 싶습니다.',
  requestDetails: '적용 사례 리뷰, 표준서 정리, 문서 품질 점검 항목을 중심으로 요청합니다.',
}

export const knowledgeHubAiRecommendations = [
  { id: 1, title: '가공 지식 문서를 OJT 체크리스트로 자동 변환', subtitle: '최근 3건의 인기 문서를 기준으로 추천' },
  { id: 2, title: '설비 점검 문서와 불량 이력 연결', subtitle: '반복 이슈 추적에 유용한 구조' },
  { id: 3, title: '신규 작업자용 요약본 생성', subtitle: '문서 5건을 1페이지로 압축' },
]

export const knowledgeWriteModalOptions = {
  categories: ['정밀가공', '설비점검', '품질관리', '안전관리'],
  equipments: ['MCH-01', 'MCH-02', 'PRS-03', 'WLD-02', 'QMS-01'],
}
