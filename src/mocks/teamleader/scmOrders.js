export const scmSummaryCards = [
  { label: '전체 주문', value: '42건', tone: 'primary' },
  { label: '진행중', value: '18건', tone: 'primary' },
  { label: '납기 위험', value: '3건', tone: 'danger' },
  { label: '평균 달성률', value: '94.2%', helper: '▲ 2.1%', tone: 'success' },
]

export const scmFilters = [
  { key: 'all', label: '전체' },
  { key: 'urgent', label: '긴급' },
  { key: 'machining', label: '정밀가공' },
  { key: 'press', label: '프레스' },
  { key: 'welding', label: '용접' },
]

export const scmBaseColumns = [
  {
    key: 'received',
    label: '접수',
    items: [
      { id: 1, orderCode: 'ORD-0306 D3', title: '산업용 볼트', line: '납기 D-10', daysLabel: '라인: 정밀가공', tone: 'primary', tags: ['machining'] },
      { id: 2, orderCode: 'ORD-0307 D2', title: '표준 브라켓', line: '납기 D-14', daysLabel: '라인: 프레스', tone: 'primary', tags: ['press'] },
      { id: 3, orderCode: 'ORD-0310 D5', title: '제어 패널 하우징', line: '납기 D-9', daysLabel: '라인: 프레스', tone: 'primary', tags: ['press'] },
      { id: 4, orderCode: 'ORD-0312 D4', title: '알루미늄 고정 프레임', line: '납기 D-8', daysLabel: '라인: 정밀가공', tone: 'primary', tags: ['machining'] },
      { id: 5, orderCode: 'ORD-0315 D6', title: '정밀 와셔 세트', line: '납기 D-12', daysLabel: '라인: 정밀가공', tone: 'primary', tags: ['machining'] },
    ],
  },
  {
    key: 'queued',
    label: '배정 대기',
    items: [
      { id: 6, orderCode: 'ORD-0303 D3', title: '산업용 플랜지', line: '납기 D-8', daysLabel: '배정 후보 2', tone: 'warning', tags: ['machining'] },
      { id: 7, orderCode: 'ORD-0308 D4', title: '정밀 기어박스', line: '납기 D-6', daysLabel: '배정 후보 3', tone: 'warning', tags: ['urgent', 'machining'] },
      { id: 8, orderCode: 'ORD-0314 D5', title: '프레스 금형 지지대', line: '납기 D-7', daysLabel: '배정 후보 2', tone: 'warning', tags: ['press'] },
      { id: 9, orderCode: 'ORD-0318 D2', title: '용접 프레임 스탠드', line: '납기 D-4', daysLabel: '배정 후보 1', tone: 'warning', tags: ['urgent', 'welding'] },
      { id: 10, orderCode: 'ORD-0321 D4', title: '고정 브릿지 바', line: '납기 D-6', daysLabel: '배정 후보 2', tone: 'warning', tags: ['machining'] },
      { id: 11, orderCode: 'ORD-0324 D1', title: '자동차 샤프트 블랭크', line: '납기 D-3', daysLabel: '배정 후보 4', tone: 'warning', tags: ['urgent', 'machining'] },
    ],
  },
  {
    key: 'producing',
    label: '생산중',
    items: [
      { id: 12, orderCode: 'ORD-0301 D5', title: '항공 부품 Ti-6Al-4V', line: '납기 D-2', daysLabel: '진행률 35%', tone: 'danger', tags: ['urgent', 'machining'] },
      { id: 13, orderCode: 'ORD-0302 D4', title: '자동차 샤프트', line: '납기 D-5', daysLabel: '진행률 60%', tone: 'primary', tags: ['machining'] },
      { id: 14, orderCode: 'ORD-0311 D3', title: '절곡 지그 베이스', line: '납기 D-4', daysLabel: '진행률 52%', tone: 'primary', tags: ['press'] },
      { id: 15, orderCode: 'ORD-0316 D2', title: '용접 고정 플레이트', line: '납기 D-3', daysLabel: '진행률 41%', tone: 'danger', tags: ['urgent', 'welding'] },
      { id: 16, orderCode: 'ORD-0319 D6', title: '프레스 캡 어셈블리', line: '납기 D-8', daysLabel: '진행률 22%', tone: 'primary', tags: ['press'] },
      { id: 17, orderCode: 'ORD-0322 D4', title: '체결용 로드 세트', line: '납기 D-5', daysLabel: '진행률 78%', tone: 'primary', tags: ['machining'] },
    ],
  },
  {
    key: 'done',
    label: '완료',
    items: [
      { id: 18, orderCode: 'ORD-0298 D3', title: '플랜지 / 완료', line: '완료 보고', daysLabel: '검수 완료', tone: 'success', tags: ['machining'] },
      { id: 19, orderCode: 'ORD-0299 D2', title: '프레스 / 완료', line: '완료 보고', daysLabel: '검수 완료', tone: 'success', tags: ['press'] },
      { id: 20, orderCode: 'ORD-0300 D4', title: '용접 브래킷 / 완료', line: '완료 보고', daysLabel: '검수 완료', tone: 'success', tags: ['welding'] },
      { id: 21, orderCode: 'ORD-0291 D1', title: '금형 플레이트 / 완료', line: '완료 보고', daysLabel: '출하 완료', tone: 'success', tags: ['press'] },
    ],
  },
]

export const scmUrgentOrders = [
  { id: 1, deadlineLabel: 'D-2 긴급', title: '항공 부품 정밀 가공 - Ti-6Al-4V', progress: '35%', progressWidth: '35%', assignee: '손창우 (MCH-01 진행중)', helper: '', tone: 'danger', tags: ['urgent', 'machining'] },
  { id: 2, deadlineLabel: 'D-5 주의', title: '자동차 샤프트 배치 가공 (x40)', progress: '60%', progressWidth: '60%', assignee: '김신우 (MCH-02 진행중)', helper: '', tone: 'warning', tags: ['machining'] },
  { id: 3, deadlineLabel: 'D-6 주의', title: '정밀 기어박스 제작', progress: '배정 대기', progressWidth: '15%', assignee: '배정 필요', helper: '미배정 - 즉시 작업 매칭 필요', tone: 'warning', tags: ['urgent', 'machining'] },
]

export const scmLineSummaries = [
  { id: 1, title: '정밀가공1라인', percent: '94.2%', count: '주문 8건', tone: 'mint', icon: '김' },
  { id: 2, title: '정밀가공2라인', percent: '87.1%', count: '주문 6건', tone: 'primary', icon: '황' },
  { id: 3, title: '프레스라인', percent: '71.3%', count: '주문 5건', tone: 'warning', icon: '박' },
  { id: 4, title: '용접라인', percent: '45.2%', count: '주문 3건', tone: 'danger', icon: '이' },
]
