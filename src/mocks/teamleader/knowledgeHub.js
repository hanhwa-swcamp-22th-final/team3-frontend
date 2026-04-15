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

export const knowledgeWriteModalOptions = {
  categories: ['정밀가공', '설비점검', '품질관리', '안전관리'],
  equipments: ['MCH-01', 'MCH-02', 'PRS-03', 'WLD-02', 'QMS-01'],
}
